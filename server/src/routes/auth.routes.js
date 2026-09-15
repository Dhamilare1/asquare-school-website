const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// POST /api/auth/login  { email, password }
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const teacher = db
    .prepare("SELECT * FROM teachers WHERE email = ?")
    .get(String(email).trim().toLowerCase());

  if (!teacher) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordOk = bcrypt.compareSync(password, teacher.password_hash);
  if (!passwordOk) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const payload = {
    id: teacher.id,
    email: teacher.email,
    full_name: teacher.full_name,
    role: teacher.role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "12h",
  });

  res.json({ token, teacher: payload });
});

// GET /api/auth/me — lets the frontend verify a stored token is still valid
const requireAuth = require("../middleware/requireAuth");
router.get("/me", requireAuth, (req, res) => {
  res.json({ teacher: req.teacher });
});

module.exports = router;
