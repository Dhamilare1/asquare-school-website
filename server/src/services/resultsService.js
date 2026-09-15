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

  return {
    studentName: student.full_name,
    studentClass: student.class_name,
    term,
    session,
    results,
    average,
  };
}

module.exports = { getStudentResult };
