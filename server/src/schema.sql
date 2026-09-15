-- A-Square School Result Portal — database schema
-- This file is executed automatically every time the server starts.
-- Every statement is "IF NOT EXISTS", so running it again never wipes data.

PRAGMA foreign_keys = ON;

-- Teacher accounts that are allowed to log in.
-- role: 'admin' can manage other teacher accounts, 'teacher' can only enter results.
CREATE TABLE IF NOT EXISTS teachers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Academic sessions, e.g. "2025/2026"
CREATE TABLE IF NOT EXISTS sessions (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Terms, e.g. "First Term", "Second Term", "Third Term"
CREATE TABLE IF NOT EXISTS terms (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Classes, e.g. "JSS 1", "Primary 4"
CREATE TABLE IF NOT EXISTS classes (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL CHECK (level IN ('Primary', 'Secondary'))
);

-- Subjects, e.g. "Mathematics"
CREATE TABLE IF NOT EXISTS subjects (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Students. class_id is the student's CURRENT class; each result row also
-- stores its own class_id so a student's history stays correct even after
-- they are promoted to a new class in a later session.
CREATE TABLE IF NOT EXISTS students (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name     TEXT NOT NULL,
  admission_no  TEXT UNIQUE,
  class_id      INTEGER NOT NULL REFERENCES classes(id),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One row = one subject score for one student, in one term, in one session.
-- The UNIQUE constraint means "entering a result" for the same
-- student+subject+term+session again UPDATES it instead of duplicating it.
CREATE TABLE IF NOT EXISTS results (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id  INTEGER NOT NULL REFERENCES subjects(id),
  class_id    INTEGER NOT NULL REFERENCES classes(id),
  session_id  INTEGER NOT NULL REFERENCES sessions(id),
  term_id     INTEGER NOT NULL REFERENCES terms(id),
  ca_score    INTEGER NOT NULL CHECK (ca_score BETWEEN 0 AND 40),
  exam_score  INTEGER NOT NULL CHECK (exam_score BETWEEN 0 AND 60),
  teacher_id  INTEGER REFERENCES teachers(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (student_id, subject_id, session_id, term_id)
);

CREATE INDEX IF NOT EXISTS idx_results_lookup ON results(session_id, term_id, class_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);

-- Which subjects apply to which class (e.g. "Further Mathematics" only
-- for SSS classes). If a class has NO rows here, the app treats that as
-- "not customized yet" and falls back to showing every subject — so
-- nothing changes for a class until a teacher deliberately edits it.
CREATE TABLE IF NOT EXISTS class_subjects (
  class_id   INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, subject_id)
);
