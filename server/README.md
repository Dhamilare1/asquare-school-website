# A-Square Results API (backend)

A small Node.js + Express + SQLite API that powers two things on the main
website:

1. The **public Result Checker** on `/portal` — a parent/student types a
   name, class, term and session and gets back the result (and can
   download it as a PDF report card).
2. The **Teacher Dashboard** (`/teacher-login`, `/teacher-dashboard`) —
   logged-in teachers enter CA and Exam scores per subject, per student,
   per term, per session.

The database is **SQLite** — a single file on disk. There is no separate
database server to install or run.

---

## 1. Prerequisites

- Node.js 18 or newer (check with `node -v`)
- npm (comes with Node)

## 2. Install

```bash
cd server
npm install
cp .env.example .env
```

Open the new `.env` file and set `JWT_SECRET` to any long random string
(this is what signs teacher login sessions — don't leave it as the
placeholder value in production).

## 3. Start the server

```bash
npm start
```

You should see:

```
A-Square results API running on http://localhost:5000
```

The **first time** it runs, it automatically:
- creates the file `server/data/school.db`
- creates every table (see `src/schema.sql`)
- seeds default sessions (2023/2024 … 2026/2027), the 3 terms, all the
  Primary/Secondary classes, and a default subject list

Every time after that, it just opens the existing file — nothing is
ever wiped.

## 4. Create a teacher login

Nobody can log in until a teacher account exists. Create one with:

```bash
npm run seed:teacher -- "Mrs Adebayo" teacher@asquare.edu.ng SomeStrongPassword123
```

(or just run `npm run seed:teacher` with no arguments and answer the
prompts). Run this command again any time you want to add another
teacher or reset someone's password.

## 5. Point the frontend at it

In the project root (not in `server/`), copy `.env.example` to `.env`.
By default it already points at `http://localhost:5000/api`, which
matches the port above.

---

## Setting up the database manually

You don't *have* to do anything manual — step 3 above creates
`server/data/school.db` automatically. But if you want to see it,
edit it directly, or set it up by hand (e.g. on a server where you
want the database file to live somewhere specific), here's how:

### Option A — DB Browser for SQLite (GUI, easiest)

1. Download **DB Browser for SQLite** (free): https://sqlitebrowser.org
2. Open it, click **New Database**, save it as `server/data/school.db`
   (create the `data` folder first if it doesn't exist).
3. Go to the **Execute SQL** tab, paste in the contents of
   `server/src/schema.sql`, and click the "run" (▶) button. This
   creates all the tables.
4. You can now browse/edit tables directly under **Browse Data**.
5. In `server/.env`, make sure `DATABASE_PATH=./data/school.db` — that
   tells the backend to open this exact file instead of creating a new
   one.

### Option B — sqlite3 command line

1. Install the SQLite CLI:
   - macOS: `brew install sqlite3`
   - Ubuntu/Debian: `sudo apt install sqlite3`
   - Windows: download precompiled binaries from
     https://www.sqlite.org/download.html
2. From the `server` folder:
   ```bash
   mkdir -p data
   sqlite3 data/school.db
   ```
3. Inside the `sqlite3` prompt that opens, load the schema:
   ```sql
   .read src/schema.sql
   ```
4. Confirm the tables exist:
   ```sql
   .tables
   ```
   You should see `teachers`, `students`, `results`, `classes`,
   `subjects`, `sessions`, `terms`.
5. Exit with `.quit`. The file `data/school.db` now exists with an
   empty schema, ready for the app.
6. Make sure `server/.env` has `DATABASE_PATH=./data/school.db` so the
   backend connects to this exact file.

### How the backend "connects" to it

There's no username/password/host like MySQL or Postgres — SQLite is
just a file. The connection is one line, in `src/db.js`:

```js
const db = new Database(process.env.DATABASE_PATH);
```

Whatever path you put in `DATABASE_PATH` (in `.env`) is the file the
server reads and writes. If that file doesn't exist yet, it's created
automatically the moment the server starts, and the schema is applied
to it — so in practice you rarely need Option A/B above, they're just
there for when you want to inspect or prepare the file yourself first.

### Backing it up

Since it's one file, backing up the whole database is just copying
`server/data/school.db` somewhere safe (ideally on a schedule). To
restore, stop the server, replace the file, start the server again.

---

## API reference (short version)

| Method | Path                     | Auth     | Purpose                                   |
|--------|--------------------------|----------|--------------------------------------------|
| GET    | /api/health              | none     | Health check                               |
| POST   | /api/auth/login          | none     | Teacher login → returns a token             |
| GET    | /api/auth/me             | teacher  | Verify a stored token is still valid        |
| GET    | /api/meta                | none     | Sessions, terms, classes, subjects lists    |
| POST   | /api/meta/sessions       | teacher  | Add a new session (e.g. "2027/2028")        |
| POST   | /api/meta/classes        | teacher  | Add a new class                             |
| POST   | /api/meta/subjects       | teacher  | Add a new subject                           |
| GET    | /api/students            | teacher  | List students (filter by ?class_id=)        |
| POST   | /api/students            | teacher  | Create a student                            |
| PUT    | /api/students/:id        | teacher  | Update a student (e.g. move to new class)   |
| GET    | /api/results/check       | none     | Public result lookup (used by /portal)      |
| GET    | /api/results/check/pdf   | none     | Same lookup, streamed back as a PDF         |
| GET    | /api/results/entry       | teacher  | Prefill a student's scores for editing      |
| POST   | /api/results             | teacher  | Save (insert or update) one subject's score |

`teacher` routes need an `Authorization: Bearer <token>` header, using
the token returned from `/api/auth/login`.

## Changing the grading scale

Edit `src/utils/grading.js` — it's one small function that turns a
total (CA + Exam, out of 100) into a letter grade.

## Changing CA/Exam maximums

Currently CA is out of 40 and Exam is out of 60 (a common Nigerian
school split). To change this, edit the `CHECK` constraints in
`src/schema.sql` and the matching validation in
`src/routes/results.routes.js` (`POST /api/results`).
