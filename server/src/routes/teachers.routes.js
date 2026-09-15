const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Every route here needs a logged-in ADMIN (not just any teacher).
router.use(requireAuth, requireAdmin);

// GET /api/teachers — list every teacher account (never sends password_hash)
router.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT id, full_name, email, role, created_at FROM teachers ORDER BY full_name ASC")
    .all();
  res.json(rows);
});

// POST /api/teachers  { full_name, email, password, role }
router.post("/", (req, res) => {
  const { full_name, email, password, role } = req.body || {};

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "full_name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const finalRole = role === "admin" ? "admin" : "teacher";
  const normalizedEmail = String(email).trim().toLowerCase();
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const info = db
      .prepare("INSERT INTO teachers (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)")
      .run(full_name.trim(), normalizedEmail, passwordHash, finalRole);

    res.status(201).json({ id: info.lastInsertRowid, full_name: full_name.trim(), email: normalizedEmail, role: finalRole });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "A teacher with that email already exists." });
    }
    res.status(500).json({ error: "Could not create teacher account." });
  }
});

// PUT /api/teachers/:id  { full_name?, email?, role?, password? }
// password is optional — only send it when you want to reset it.
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM teachers WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Teacher not found." });

  const full_name = req.body?.full_name?.trim() || existing.full_name;
  const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : existing.email;
  const role = req.body?.role === "admin" || req.body?.role === "teacher" ? req.body.role : existing.role;

  // Never allow the last admin account to be demoted — that would lock
  // everyone out of this page for good.
  if (existing.role === "admin" && role !== "admin") {
    const { count } = db.prepare("SELECT COUNT(*) AS count FROM teachers WHERE role = 'admin'").get();
    if (count <= 1) {
      return res.status(400).json({
        error: "There must always be at least one admin account. Make another account an admin first.",
      });
    }
  }

  const passwordHash =
    req.body?.password && req.body.password.length > 0
      ? bcrypt.hashSync(req.body.password, 10)
      : existing.password_hash;

  if (req.body?.password && req.body.password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    db.prepare("UPDATE teachers SET full_name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?").run(
      full_name,
      email,
      role,
      passwordHash,
      id
    );
    res.json({ id, full_name, email, role });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "Another teacher already uses that email." });
    }
    res.status(500).json({ error: "Could not update teacher account." });
  }
});

// DELETE /api/teachers/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (id === req.teacher.id) {
    return res.status(400).json({ error: "You can't delete the account you're currently logged in as." });
  }

  const existing = db.prepare("SELECT * FROM teachers WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Teacher not found." });

  if (existing.role === "admin") {
    const { count } = db.prepare("SELECT COUNT(*) AS count FROM teachers WHERE role = 'admin'").get();
    if (count <= 1) {
      return res.status(400).json({ error: "There must always be at least one admin account." });
    }
  }

  db.prepare("DELETE FROM teachers WHERE id = ?").run(id);
  res.status(204).end();
});

module.exports = router;
