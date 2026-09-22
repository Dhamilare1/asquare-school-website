const db = require("../db");
const { gradeFor } = require("../utils/grading");

// Looks up one student's results for one term + session.
// Returns null if the student isn't found, or if nothing has been
// entered yet for that term/session (both are treated the same way
// by the routes that call this: "no result to show").
function getStudentResult(db_, { studentName, studentClass, term, session }) {
  const database = db_ || db;

  const student = database
    .prepare(
      `SELECT s.id, s.full_name, c.name AS class_name
       FROM students s
       JOIN classes c ON c.id = s.class_id
       WHERE LOWER(TRIM(s.full_name)) = LOWER(TRIM(?))
         AND LOWER(TRIM(c.name)) = LOWER(TRIM(?))`
    )
    .get(studentName, studentClass);

  if (!student) return null;

  const rows = database
    .prepare(
      `SELECT sub.name AS subject, r.ca_score AS ca, r.exam_score AS exam
       FROM results r
       JOIN subjects sub ON sub.id = r.subject_id
       JOIN sessions ses ON ses.id = r.session_id
       JOIN terms t ON t.id = r.term_id
       WHERE r.student_id = ?
         AND ses.name = ?
         AND t.name = ?
       ORDER BY sub.name ASC`
    )
    .all(student.id, session, term);

  if (rows.length === 0) return null;

  const results = rows.map((row) => {
    const total = row.ca + row.exam;
    return { subject: row.subject, ca: row.ca, exam: row.exam, total, grade: gradeFor(total) };
  });

  const totalScore = results.reduce((sum, r) => sum + r.total, 0);
  const average = Math.round((totalScore / results.length) * 100) / 100;

  const termSettingsRow = database
    .prepare(
      `SELECT ts.times_school_opened
       FROM term_settings ts
       JOIN sessions ses ON ses.id = ts.session_id
       JOIN terms t ON t.id = ts.term_id
       WHERE ses.name = ? AND t.name = ?`
    )
    .get(session, term);

  const studentTermRow = database
    .prepare(
      `SELECT tr.teacher_remark, tr.principal_remark, tr.times_present,
              tr.promotion_status, pc.name AS promoted_to_class
       FROM term_records tr
       JOIN sessions ses ON ses.id = tr.session_id
       JOIN terms t ON t.id = tr.term_id
       LEFT JOIN classes pc ON pc.id = tr.promoted_to_class_id
       WHERE tr.student_id = ? AND ses.name = ? AND t.name = ?`
    )
    .get(student.id, session, term);

  const timesSchoolOpened = termSettingsRow?.times_school_opened ?? null;
  const timesPresent = studentTermRow?.times_present ?? null;
  const timesAbsent =
    timesSchoolOpened != null && timesPresent != null ? timesSchoolOpened - timesPresent : null;

  const termRecord =
    termSettingsRow || studentTermRow
      ? {
          teacherRemark: studentTermRow?.teacher_remark ?? null,
          principalRemark: studentTermRow?.principal_remark ?? null,
          timesSchoolOpened,
          timesPresent,
          timesAbsent,
          promotionStatus: studentTermRow?.promotion_status ?? null,
          promotedToClass: studentTermRow?.promoted_to_class ?? null,
        }
      : null;

  return {
    studentName: student.full_name,
    studentClass: student.class_name,
    term,
    session,
    results,
    average,
    termRecord,
  };
}

module.exports = { getStudentResult };
