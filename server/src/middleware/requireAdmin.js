// Use AFTER requireAuth — relies on req.teacher already being set.
function requireAdmin(req, res, next) {
  if (!req.teacher || req.teacher.role !== "admin") {
    return res.status(403).json({ error: "Only an admin account can do this." });
  }
  next();
}

module.exports = requireAdmin;
