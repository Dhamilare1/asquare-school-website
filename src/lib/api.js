// Small fetch wrapper for the results backend in /server.
// Set VITE_API_URL in a .env file at the project root, e.g.:
//   VITE_API_URL=http://localhost:5000/api

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "asquare_teacher_token";
const TEACHER_KEY = "asquare_teacher_info";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredTeacher() {
  const raw = localStorage.getItem(TEACHER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(token, teacher) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TEACHER_KEY, JSON.stringify(teacher));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TEACHER_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some responses (e.g. 204 No Content) have no body
  }

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }

  return data;
}

// ---- Public ----

export function fetchMeta() {
  return request("/meta");
}

export function checkResult({ studentName, studentClass, term, session }) {
  const params = new URLSearchParams({ studentName, studentClass, term, session });
  return request(`/results/check?${params.toString()}`);
}

// Direct link to the downloadable PDF report card for the same query.
// Used as a plain <a href> so the browser handles the download itself.
export function getReportCardPdfUrl({ studentName, studentClass, term, session }) {
  const params = new URLSearchParams({ studentName, studentClass, term, session });
  return `${BASE_URL}/results/check/pdf?${params.toString()}`;
}

// ---- Teacher auth ----

export async function login(email, password) {
  const data = await request("/auth/login", { method: "POST", body: { email, password } });
  setSession(data.token, data.teacher);
  return data.teacher;
}

export function verifySession() {
  return request("/auth/me", { auth: true });
}

// ---- Teacher: students ----

export function fetchStudents({ classId, q } = {}) {
  const params = new URLSearchParams();
  if (classId) params.set("class_id", classId);
  if (q) params.set("q", q);
  const qs = params.toString();
  return request(`/students${qs ? `?${qs}` : ""}`, { auth: true });
}

export function createStudent(student) {
  return request("/students", { method: "POST", body: student, auth: true });
}

// ---- Teacher: results ----

export function fetchResultEntry({ studentId, sessionId, termId, classId }) {
  const params = new URLSearchParams({
    student_id: studentId,
    session_id: sessionId,
    term_id: termId,
  });
  if (classId) params.set("class_id", classId);
  return request(`/results/entry?${params.toString()}`, { auth: true });
}

export function saveResult(entry) {
  return request("/results", { method: "POST", body: entry, auth: true });
}

// ---- Teacher: per-class subject list ----

export function fetchClassSubjects(classId) {
  return request(`/meta/classes/${classId}/subjects`, { auth: true });
}

export function saveClassSubjects(classId, subjectIds) {
  return request(`/meta/classes/${classId}/subjects`, {
    method: "PUT",
    body: { subject_ids: subjectIds },
    auth: true,
  });
}

export function createSubject(name) {
  return request("/meta/subjects", { method: "POST", body: { name }, auth: true });
}

// ---- Admin: manage teacher accounts ----

export function fetchTeachers() {
  return request("/teachers", { auth: true });
}

export function createTeacherAccount(teacher) {
  return request("/teachers", { method: "POST", body: teacher, auth: true });
}

export function updateTeacherAccount(id, updates) {
  return request(`/teachers/${id}`, { method: "PUT", body: updates, auth: true });
}

export function deleteTeacherAccount(id) {
  return request(`/teachers/${id}`, { method: "DELETE", auth: true });
}
