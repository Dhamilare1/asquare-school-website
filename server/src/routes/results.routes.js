const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");
const { gradeFor } = require("../utils/grading");
const { getStudentResult } = require("../services/resultsService");
const { streamReportCardPdf } = require("../utils/reportCard");

const router = express.Router();

// -----------------------------------------------------------------------
// PUBLIC — used by the "Portal" result-checker page. No login required.
// GET /api/results/check?studentName=...&studentClass=...&term=...&session=...
// -----------------------------------------------------------------------
router.get("/check", (req, res) => {
  const { studentName, studentClass, term, session } = req.query;

  if (!studentName || !studentClass || !term || !session) {
    return res.status(400).json({ error: "studentName, studentClass, term and session are all required." });
  }

  const data = getStudentResult(db, { studentName, studentClass, term, session });

  if (!data) {
    return res.status(404).json({
      error: "No result found. Check the name, class, term and session, or the result may not be published yet.",
    });
  }

  res.json(data);
});

// -----------------------------------------------------------------------
// PUBLIC — downloadable PDF version of the exact same report, used by
// the "Download Report Card" button on the Portal page.
// GET /api/results/check/pdf?studentName=...&studentClass=...&term=...&session=...
// -----------------------------------------------------------------------
router.get("/check/pdf", (req, res) => {
  const { studentName, studentClass, term, session } = req.query;

  if (!studentName || !studentClass || !term || !session) {
    return res.status(400).json({ error: "studentName, studentClass, term and session are all required." });
  }

  const data = getStudentResult(db, { studentName, studentClass, term, session });

  if (!data) {
    return res.status(404).json({
      error: "No result found. Check the name, class, term and session, or the result may not be published yet.",
    });
  }

  streamReportCardPdf(res, data);
});

// Everything below requires a logged-in teacher.
router.use(requireAuth);

// GET /api/results/entry?student_id=1&session_id=3&term_id=1&class_id=2
// Returns every subject THIS CLASS TAKES (falling back to every subject
// if the class hasn't been customized yet — see class_subjects table),
// with whatever score (if any) is already saved, so the entry form can
// be pre-filled for editing.
router.get("/entry", (req, res) => {
  const { student_id, session_id, term_id, class_id } = req.query;
  if (!student_id || !session_id || !term_id) {
    return res.status(400).json({ error: "student_id, session_id and term_id are required." });
  }

  let subjectFilter = "";
  const filterParams = [];

  if (class_id) {
    const { count } = db
      .prepare("SELECT COUNT(*) AS count FROM class_subjects WHERE class_id = ?")
      .get(class_id);

    if (count > 0) {
      subjectFilter = "WHERE sub.id IN (SELECT subject_id FROM class_subjects WHERE class_id = ?)";
      filterParams.push(class_id);
    }
  }

  const rows = db
    .prepare(
      `SELECT sub.id AS subject_id, sub.name AS subject_name, r.id AS result_id,
              r.ca_score, r.exam_score
       FROM subjects sub
       LEFT JOIN results r
         ON r.subject_id = sub.id
        AND r.student_id = ?
        AND r.session_id = ?
        AND r.term_id = ?
       ${subjectFilter}
       ORDER BY sub.name ASC`
    )
    .all(student_id, session_id, term_id, ...filterParams);

  res.json(rows);
});

// POST /api/results
// Body: { student_id, subject_id, class_id, session_id, term_id, ca_score, exam_score }
// Inserts a new score, or updates it if that student already has a score
// for that exact subject + term + session (see UNIQUE constraint in schema.sql).
router.post("/", (req, res) => {
  const { student_id, subject_id, class_id, session_id, term_id, ca_score, exam_score } = req.body || {};

  if (![student_id, subject_id, class_id, session_id, term_id].every((v) => v !== undefined && v !== null)) {
    return res.status(400).json({ error: "student_id, subject_id, class_id, session_id and term_id are all required." });
  }

  const ca = Number(ca_score);
  const exam = Number(exam_score);

  if (!Number.isInteger(ca) || ca < 0 || ca > 40) {
    return res.status(400).json({ error: "ca_score must be a whole number between 0 and 40." });
  }
  if (!Number.isInteger(exam) || exam < 0 || exam > 60) {
    return res.status(400).json({ error: "exam_score must be a whole number between 0 and 60." });
  }

  const upsert = db.prepare(`
    INSERT INTO results (student_id, subject_id, class_id, session_id, term_id, ca_score, exam_score, teacher_id, updated_at)
    VALUES (@student_id, @subject_id, @class_id, @session_id, @term_id, @ca_score, @exam_score, @teacher_id, datetime('now'))
    ON CONFLICT(student_id, subject_id, session_id, term_id)
    DO UPDATE SET
      ca_score = excluded.ca_score,
      exam_score = excluded.exam_score,
      class_id = excluded.class_id,
      teacher_id = excluded.teacher_id,
      updated_at = datetime('now')
  `);

  upsert.run({
    student_id,
    subject_id,
    class_id,
    session_id,
    term_id,
    ca_score: ca,
    exam_score: exam,
    teacher_id: req.teacher.id,
  });

  const total = ca + exam;
  res.status(200).json({ ok: true, total, grade: gradeFor(total) });
});

module.exports = router;
