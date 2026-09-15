# A-Square Educational Services — Website + Result Portal

A React (Vite) marketing website for A-Square Educational Services,
including a **Result Portal**:

- **`/portal`** — public page where a parent/student enters the
  student's name, class, term and session to view the result, and can
  download it as a PDF report card.
- **`/teacher-login`** and **`/teacher-dashboard`** — teachers log in
  and enter CA/Exam scores per subject, per student, per term, per
  session.

The result data is served by a small backend in **`/server`**
(Node.js + Express + SQLite). See **`server/README.md`** for the full
backend setup guide, including how the SQLite database is created and
how to set it up by hand if you want to.

## Quick start

**1. Backend** (in one terminal):

```bash
cd server
npm install
cp .env.example .env      # then edit JWT_SECRET
npm start
```

Create a teacher login (needed once):

```bash
npm run seed:teacher -- "Mrs Adebayo" teacher@asquare.edu.ng SomeStrongPassword123
```

**2. Frontend** (in a second terminal, from the project root):

```bash
npm install
cp .env.example .env      # default already points at the backend above
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

- Visit `/portal` to check/download a result.
- Visit `/teacher-login` to log in as the teacher you created above,
  then enter results from `/teacher-dashboard`.

Note: right after installing, there won't be any students or results
yet — the teacher dashboard lets you add a student to a class and
enter their scores, and the result then becomes visible on `/portal`
for that same name/class/term/session.

## Project structure

```
/                     ← React frontend (Vite)
  src/pages/Portal.jsx           public result checker + PDF download
  src/pages/TeacherLogin.jsx     teacher login
  src/pages/TeacherDashboard.jsx result entry
  src/lib/api.js                talks to the backend
/server               ← backend API + SQLite database
  src/schema.sql       table definitions
  src/db.js            opens the database, creates tables, seeds defaults
  src/routes/          API endpoints
  data/school.db        the actual database file (created on first run)
```

---

Original Vite template notes are below for reference.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
