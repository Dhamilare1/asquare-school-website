const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// GET /api/meta — public. Powers every dropdown on the site
// (school level, class, term, session) with no need to log in.
router.get("/", (_req, res) => {
  const sessions = db.prepare("SELECT id, name FROM sessions ORDER BY name DESC").all();
  const terms = db.prepare("SELECT id, name FROM terms ORDER BY id ASC").all();
  const classes = db.prepare("SELECT id, name, level FROM classes ORDER BY id ASC").all();
  const subjects = db.prepare("SELECT id, name FROM subjects ORDER BY name ASC").all();

  res.json({ sessions, terms, classes, subjects });
});

// The endpoints below let a logged-in teacher grow the lists above
// (e.g. add a new session at the start of a school year) without
// touching the database by hand.

// POST /api/meta/sessions  { name: "2027/2028" }
router.post("/sessions", requireAuth, (req, res) => {
  const name = (req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "Session name is required." });
  try {
    const info = db.prepare("INSERT INTO sessions (name) VALUES (?)").run(name);
    res.status(201).json({ id: info.lastInsertRowid, name });
  } catch (err) {
    res.status(409).json({ error: "That session already exists." });
  }
});

// POST /api/meta/classes  { name: "SSS 4", level: "Secondary" }
router.post("/classes", requireAuth, (req, res) => {
  const name = (req.body?.name || "").trim();
  const level = req.body?.level;
  if (!name || !["Primary", "Secondary"].includes(level)) {
    return res.status(400).json({ error: "name and level ('Primary' or 'Secondary') are required." });
  }
  try {
    const info = db.prepare("INSERT INTO classes (name, level) VALUES (?, ?)").run(name, level);
    res.status(201).json({ id: info.lastInsertRowid, name, level });
  } catch (err) {
    res.status(409).json({ error: "That class already exists." });
  }
});

// POST /api/meta/subjects  { name: "Further Mathematics" }
router.post("/subjects", requireAuth, (req, res) => {
  const name = (req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "Subject name is required." });
  try {
    const info = db.prepare("INSERT INTO subjects (name) VALUES (?)").run(name);
    res.status(201).json({ id: info.lastInsertRowid, name });
  } catch (err) {
    res.status(409).json({ error: "That subject already exists." });
  }
});

// -----------------------------------------------------------------------
// Per-class subject lists — which subjects a given class actually takes.
// -----------------------------------------------------------------------

// GET /api/meta/classes/:classId/subjects
// Returns which subjects apply to this class, and whether the class has
// been customized yet (if not, the app is showing every subject as a
// sensible default, and the frontend should pre-check them all).
router.get("/classes/:classId/subjects", requireAuth, (req, res) => {
  const classId = req.params.classId;

  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM class_subjects WHERE class_id = ?")
    .get(classId);

  if (count === 0) {
    const all = db.prepare("SELECT id FROM subjects").all();
    return res.json({ customized: false, subject_ids: all.map((s) => s.id) });
  }

  const rows = db
    .prepare("SELECT subject_id FROM class_subjects WHERE class_id = ?")
    .all(classId);

  res.json({ customized: true, subject_ids: rows.map((r) => r.subject_id) });
});

// PUT /api/meta/classes/:classId/subjects  { subject_ids: [1,2,3] }
// Replaces the whole subject list for this class in one go.
router.put("/classes/:classId/subjects", requireAuth, (req, res) => {
  const classId = req.params.classId;
  const subjectIds = Array.isArray(req.body?.subject_ids) ? req.body.subject_ids : null;

  if (!subjectIds) {
    return res.status(400).json({ error: "subject_ids must be an array of subject IDs." });
  }

  const classExists = db.prepare("SELECT id FROM classes WHERE id = ?").get(classId);
  if (!classExists) return res.status(404).json({ error: "Class not found." });

  const replace = db.transaction((ids) => {
    db.prepare("DELETE FROM class_subjects WHERE class_id = ?").run(classId);
    const insert = db.prepare("INSERT INTO class_subjects (class_id, subject_id) VALUES (?, ?)");
    for (const subjectId of ids) insert.run(classId, subjectId);
  });

  try {
    replace(subjectIds);
    res.json({ classId: Number(classId), subject_ids: subjectIds });
  } catch (err) {
    res.status(400).json({ error: "Could not save subjects — check the subject IDs are valid." });
  }
});

module.exports = router;
