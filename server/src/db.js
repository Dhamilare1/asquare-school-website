const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DATABASE_PATH = process.env.DATABASE_PATH || "./data/school.db";

// Make sure the folder that will hold the .db file actually exists.
const dbDir = path.dirname(DATABASE_PATH);
if (dbDir && dbDir !== "." && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DATABASE_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Run the schema every time the server starts. Every statement in
// schema.sql is "CREATE TABLE IF NOT EXISTS", so this is always safe
// and never deletes existing data.
const schemaPath = path.join(__dirname, "schema.sql");
db.exec(fs.readFileSync(schemaPath, "utf8"));

// ---------------------------------------------------------------------
// MIGRATIONS for databases created before a schema change.
// Each check is safe to run every time the server starts.
// ---------------------------------------------------------------------

// Added: teachers.role (admin / teacher). Any database that predates
// this column had no admin/teacher distinction at all, so every
// existing account is promoted to 'admin' automatically — nobody who
// could already log in loses access.
const teacherColumns = db.prepare("PRAGMA table_info(teachers)").all();
const hasRoleColumn = teacherColumns.some((col) => col.name === "role");
if (!hasRoleColumn) {
  db.exec("ALTER TABLE teachers ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
}

// ---------------------------------------------------------------------
// One-time default data. These only insert rows the FIRST time the
// server runs against a brand new database (each check is "if empty").
// Teachers can add more sessions/classes/subjects later through the API.
// ---------------------------------------------------------------------

function seedIfEmpty(table, rows, insertSql) {
  const { count } = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get();
  if (count > 0) return;
  const insert = db.prepare(insertSql);
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
  });
  insertMany(rows);
}

seedIfEmpty(
  "sessions",
  ["2023/2024", "2024/2025", "2025/2026", "2026/2027"].map((name) => ({ name })),
  "INSERT INTO sessions (name) VALUES (@name)"
);

seedIfEmpty(
  "terms",
  ["First Term", "Second Term", "Third Term"].map((name) => ({ name })),
  "INSERT INTO terms (name) VALUES (@name)"
);

seedIfEmpty(
  "classes",
  [
    { name: "KG 1", level: "Primary" },
    { name: "KG 2", level: "Primary" },
    { name: "Nursery 1", level: "Primary" },
    { name: "Nursery 2", level: "Primary" },
    { name: "Primary 1", level: "Primary" },
    { name: "Primary 2", level: "Primary" },
    { name: "Primary 3", level: "Primary" },
    { name: "Primary 4", level: "Primary" },
    { name: "Primary 5", level: "Primary" },
    { name: "Primary 6", level: "Primary" },
    { name: "JSS 1", level: "Secondary" },
    { name: "JSS 2", level: "Secondary" },
    { name: "JSS 3", level: "Secondary" },
    { name: "SSS 1", level: "Secondary" },
    { name: "SSS 2", level: "Secondary" },
    { name: "SSS 3", level: "Secondary" },
  ],
  "INSERT INTO classes (name, level) VALUES (@name, @level)"
);

seedIfEmpty(
  "subjects",
  [
    "English Language",
    "Mathematics",
    "Basic Science",
    "Social Studies",
    "Civic Education",
    "Agricultural Science",
    "Physical and Health Education",
    "Computer Studies",
    "Creative and Cultural Arts",
    "Christian Religious Studies",
    "French",
  ].map((name) => ({ name })),
  "INSERT INTO subjects (name) VALUES (@name)"
);

module.exports = db;
