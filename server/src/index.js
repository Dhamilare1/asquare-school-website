require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error(
    "\nMissing JWT_SECRET.\n" +
      "Copy server/.env.example to server/.env and set JWT_SECRET before starting the server.\n"
  );
  process.exit(1);
}

const express = require("express");
const cors = require("cors");

// Importing this makes sure the database file + tables exist before
// the server starts accepting requests.
require("./db");

const authRoutes = require("./routes/auth.routes");
const metaRoutes = require("./routes/meta.routes");
const studentRoutes = require("./routes/students.routes");
const resultRoutes = require("./routes/results.routes");
const teacherRoutes = require("./routes/teachers.routes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/teachers", teacherRoutes);

// Fallback error handler so unexpected errors return JSON, not an HTML crash page.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`A-Square results API running on http://localhost:${PORT}`);
});
