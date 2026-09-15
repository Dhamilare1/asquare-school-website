const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// All student management requires a logged-in teacher.
router.use(requireAuth);

// GET /api/students?class_id=3&q=john
router.get("/", (req, res) => {
  const { class_id, q } = req.query;

  let sql = `
    SELECT s.id, s.full_name, s.admission_no, s.class_id, c.name AS class_name
    FROM students s
    JOIN classes c ON c.id = s.class_id
    WHERE 1 = 1
  `;
  const params = [];

  if (class_id) {
    sql += " AND s.class_id = ?";
    params.push(class_id);
  }
  if (q) {
    sql += " AND s.full_name LIKE ?";
    params.push(`%${q}%`);
  }
  sql += " ORDER BY s.full_name ASC";

  res.json(db.prepare(sql).all(...params));
});

// POST /api/students  { full_name, admission_no, class_id }
router.post("/", (req, res) => {
  const { full_name, admission_no, class_id } = req.body || {};

  if (!full_name || !class_id) {
    return res.status(400).json({ error: "full_name and class_id are required." });
  }

  try {
    const info = db
      .prepare("INSERT INTO students (full_name, admission_no, class_id) VALUES (?, ?, ?)")
      .run(full_name.trim(), admission_no ? admission_no.trim() : null, class_id);

    res.status(201).json({ id: info.lastInsertRowid, full_name, admission_no, class_id });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "A student with that admission number already exists." });
    }
    res.status(500).json({ error: "Could not create student." });
  }
});

// PUT /api/students/:id  { full_name?, admission_no?, class_id? }
// Used, for example, to move a student to their new class for a new session.
router.put("/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Student not found." });

  const full_name = req.body?.full_name?.trim() || existing.full_name;
  const admission_no =
    req.body?.admission_no !== undefined ? req.body.admission_no?.trim() || null : existing.admission_no;
  const class_id = req.body?.class_id || existing.class_id;

  db.prepare("UPDATE students SET full_name = ?, admission_no = ?, class_id = ? WHERE id = ?").run(
    full_name,
    admission_no,
    class_id,
    req.params.id
  );

  res.json({ id: Number(req.params.id), full_name, admission_no, class_id });
});

// DELETE /api/students/:id
router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Student not found." });
  res.status(204).end();
});

module.exports = router;
