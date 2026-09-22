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

// -----------------------------------------------------------------------
// TERM RECORD — remarks, attendance, and (Third Term) promotion.
// This is separate from subject scores: one row per student per
// term/session, not one per subject.
// -----------------------------------------------------------------------

// GET /api/results/term-record?student_id=1&session_id=3&term_id=1
router.get("/term-record", (req, res) => {
  const { student_id, session_id, term_id } = req.query;
  if (!student_id || !session_id || !term_id) {
    return res.status(400).json({ error: "student_id, session_id and term_id are required." });
  }

  const record = db
    .prepare(
      `SELECT * FROM term_records WHERE student_id = ? AND session_id = ? AND term_id = ?`
    )
    .get(student_id, session_id, term_id);

  res.json(record || null);
});

// POST /api/results/term-record
// Body: { student_id, class_id, session_id, term_id, teacher_remark,
//         principal_remark, times_present, promotion_status,
//         promoted_to_class_id }
//
// principal_remark is only ever saved if the person submitting is an
// admin — a plain teacher account can send it, but it's silently
// ignored server-side rather than trusting the frontend alone to hide
// that field. This is a deliberate check here, not just in the UI.
router.post("/term-record", (req, res) => {
  const {
    student_id,
    class_id,
    session_id,
    term_id,
    teacher_remark,
    principal_remark,
    times_present,
    promotion_status,
    promoted_to_class_id,
  } = req.body || {};

  if (![student_id, class_id, session_id, term_id].every((v) => v !== undefined && v !== null)) {
    return res.status(400).json({ error: "student_id, class_id, session_id and term_id are all required." });
  }

  if (promotion_status && !["Promoted", "Repeated", "Graduated"].includes(promotion_status)) {
    return res.status(400).json({ error: "promotion_status must be Promoted, Repeated or Graduated." });
  }
  if (promotion_status === "Promoted" && !promoted_to_class_id) {
    return res.status(400).json({ error: "Pick which class the student is being promoted to." });
  }

  const existing = db
    .prepare(`SELECT * FROM term_records WHERE student_id = ? AND session_id = ? AND term_id = ?`)
    .get(student_id, session_id, term_id);

  const finalPrincipalRemark =
    req.teacher.role === "admin"
      ? principal_remark ?? null
      : existing?.principal_remark ?? null;

  const upsert = db.prepare(`
    INSERT INTO term_records (
      student_id, class_id, session_id, term_id,
      teacher_remark, principal_remark, times_present,
      promotion_status, promoted_to_class_id, teacher_id, updated_at
    )
    VALUES (
      @student_id, @class_id, @session_id, @term_id,
      @teacher_remark, @principal_remark, @times_present,
      @promotion_status, @promoted_to_class_id, @teacher_id, datetime('now')
    )
    ON CONFLICT(student_id, session_id, term_id)
    DO UPDATE SET
      class_id = excluded.class_id,
      teacher_remark = excluded.teacher_remark,
      principal_remark = excluded.principal_remark,
      times_present = excluded.times_present,
      promotion_status = excluded.promotion_status,
      promoted_to_class_id = excluded.promoted_to_class_id,
      teacher_id = excluded.teacher_id,
      updated_at = datetime('now')
  `);

  upsert.run({
    student_id,
    class_id,
    session_id,
    term_id,
    teacher_remark: teacher_remark ?? null,
    principal_remark: finalPrincipalRemark,
    times_present: times_present ?? null,
    promotion_status: promotion_status ?? null,
    promoted_to_class_id: promoted_to_class_id ?? null,
    teacher_id: req.teacher.id,
  });

  res.status(200).json({ ok: true });
});

// -----------------------------------------------------------------------
// TERM SETTINGS — "how many days did school open this term?" One value
// per session+term, shared by every student, instead of retyped per
// student. "Times absent" is calculated from this on the way out
// (school opened − times present) rather than stored anywhere.
// -----------------------------------------------------------------------

// GET /api/results/term-settings?session_id=1&term_id=3
router.get("/term-settings", (req, res) => {
  const { session_id, term_id } = req.query;
  if (!session_id || !term_id) {
    return res.status(400).json({ error: "session_id and term_id are required." });
  }
  const row = db
    .prepare(`SELECT times_school_opened FROM term_settings WHERE session_id = ? AND term_id = ?`)
    .get(session_id, term_id);
  res.json(row || null);
});

// POST /api/results/term-settings  { session_id, term_id, times_school_opened }
router.post("/term-settings", (req, res) => {
  const { session_id, term_id, times_school_opened } = req.body || {};
  if (!session_id || !term_id) {
    return res.status(400).json({ error: "session_id and term_id are required." });
  }

  db.prepare(
    `INSERT INTO term_settings (session_id, term_id, times_school_opened)
     VALUES (?, ?, ?)
     ON CONFLICT(session_id, term_id) DO UPDATE SET times_school_opened = excluded.times_school_opened`
  ).run(session_id, term_id, times_school_opened ?? null);

  res.status(200).json({ ok: true });
});

module.exports = router;
