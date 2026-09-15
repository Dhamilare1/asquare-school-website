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

module.exports = router;
