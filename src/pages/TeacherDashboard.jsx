import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ListChecks,
  LogOut,
  Plus,
  Save,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  fetchMeta,
  fetchStudents,
  createStudent,
  fetchResultEntry,
  saveResult,
  fetchClassSubjects,
  saveClassSubjects,
  createSubject,
  getStoredTeacher,
  getToken,
  logout,
  verifySession,
} from "../lib/api";

function TeacherDashboard() {
  const navigate = useNavigate();
  const teacher = getStoredTeacher();

  const [meta, setMeta] = useState({ sessions: [], terms: [], classes: [], subjects: [] });
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");
  const [classId, setClassId] = useState("");

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");

  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentAdmissionNo, setNewStudentAdmissionNo] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);

  const [entryRows, setEntryRows] = useState([]); // [{subject_id, subject_name, ca_score, exam_score}]
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSubjectEditor, setShowSubjectEditor] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState(new Set());
  const [subjectsCustomized, setSubjectsCustomized] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [savingSubjects, setSavingSubjects] = useState(false);

  // Guard the page + load dropdown data
  useEffect(() => {
    if (!getToken()) {
      navigate("/teacher-login");
      return;
    }
    verifySession().catch(() => {
      logout();
      navigate("/teacher-login");
    });
    fetchMeta().then(setMeta).catch((err) => setError(err.message));
  }, [navigate]);

  // Reload the class's student list whenever the class changes
  useEffect(() => {
    if (!classId) {
      setStudents([]);
      setStudentId("");
      return;
    }
    fetchStudents({ classId })
      .then((rows) => setStudents(rows))
      .catch((err) => setError(err.message));
    setShowSubjectEditor(false);
  }, [classId]);

  // Reload the entry form (with existing scores, if any) whenever the
  // student/session/term/class selection is complete
  useEffect(() => {
    if (!studentId || !sessionId || !termId) {
      setEntryRows([]);
      return;
    }
    fetchResultEntry({ studentId, sessionId, termId, classId })
      .then((rows) =>
        setEntryRows(
          rows.map((r) => ({
            subject_id: r.subject_id,
            subject_name: r.subject_name,
            ca_score: r.ca_score ?? "",
            exam_score: r.exam_score ?? "",
          }))
        )
      )
      .catch((err) => setError(err.message));
  }, [studentId, sessionId, termId, classId]);

  const openSubjectEditor = () => {
    setError("");
    fetchClassSubjects(classId)
      .then(({ subject_ids, customized }) => {
        setSelectedSubjectIds(new Set(subject_ids));
        setSubjectsCustomized(customized);
        setShowSubjectEditor(true);
      })
      .catch((err) => setError(err.message));
  };

  const toggleSubject = (subjectId) => {
    setSelectedSubjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });
  };

  const handleAddNewSubject = async (e) => {
    e.preventDefault();
    setError("");
    if (!newSubjectName.trim()) return;
    try {
      const created = await createSubject(newSubjectName.trim());
      const freshMeta = await fetchMeta();
      setMeta(freshMeta);
      setSelectedSubjectIds((prev) => new Set(prev).add(created.id));
      setNewSubjectName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveClassSubjects = async () => {
    setError("");
    setStatus("");
    setSavingSubjects(true);
    try {
      await saveClassSubjects(classId, Array.from(selectedSubjectIds));
      setStatus("Updated the subject list for this class.");
      setShowSubjectEditor(false);
      // Re-pull the entry form so it reflects the new subject list
      if (studentId && sessionId && termId) {
        const rows = await fetchResultEntry({ studentId, sessionId, termId, classId });
        setEntryRows(
          rows.map((r) => ({
            subject_id: r.subject_id,
            subject_name: r.subject_name,
            ca_score: r.ca_score ?? "",
            exam_score: r.exam_score ?? "",
          }))
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSubjects(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError("");
    if (!newStudentName || !classId) {
      setError("Pick a class and enter the student's name first.");
      return;
    }
    try {
      const created = await createStudent({
        full_name: newStudentName,
        admission_no: newStudentAdmissionNo || undefined,
        class_id: classId,
      });
      const rows = await fetchStudents({ classId });
      setStudents(rows);
      setStudentId(String(created.id));
      setNewStudentName("");
      setNewStudentAdmissionNo("");
      setShowAddStudent(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateRow = (subjectId, field, value) => {
    setEntryRows((rows) =>
      rows.map((r) => (r.subject_id === subjectId ? { ...r, [field]: value } : r))
    );
  };

  const handleSaveRow = async (row) => {
    setError("");
    setStatus("");
    if (row.ca_score === "" || row.exam_score === "") {
      setError(`Enter both CA and Exam scores for ${row.subject_name} before saving.`);
      return;
    }
    try {
      await saveResult({
        student_id: Number(studentId),
        subject_id: row.subject_id,
        class_id: Number(classId),
        session_id: Number(sessionId),
        term_id: Number(termId),
        ca_score: Number(row.ca_score),
        exam_score: Number(row.exam_score),
      });
      setStatus(`Saved ${row.subject_name}.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveAll = async () => {
    setError("");
    setStatus("");
    const ready = entryRows.filter((r) => r.ca_score !== "" && r.exam_score !== "");
    if (ready.length === 0) {
      setError("Enter at least one subject's scores first.");
      return;
    }
    setLoading(true);
    try {
      for (const row of ready) {
        await saveResult({
          student_id: Number(studentId),
          subject_id: row.subject_id,
          class_id: Number(classId),
          session_id: Number(sessionId),
          term_id: Number(termId),
          ca_score: Number(row.ca_score),
          exam_score: Number(row.exam_score),
        });
      }
      setStatus(`Saved ${ready.length} subject(s).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/teacher-login");
  };

  return (
    <main className="student-page">
      <section className="student-hero">
        <div className="student-hero-circle circle-one"></div>
        <div className="student-hero-circle circle-two"></div>

        <div className="container student-hero-content teacher-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="student-label">Teacher Dashboard</span>
            <h1>
              Enter Student
              <br />
              <strong>Results.</strong>
            </h1>
            {teacher && <p>Logged in as {teacher.full_name}</p>}
          </motion.div>

          <button className="reset-button teacher-logout-button" onClick={handleLogout}>
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </section>

      {teacher?.role === "admin" && (
        <div className="container admin-link-row">
          <button className="reset-button" onClick={() => navigate("/teacher-admin")}>
            <ShieldCheck size={16} />
            Manage Teacher Accounts
          </button>
        </div>
      )}

      <section className="student-checker section">
        <div className="container">
          {/* SELECTORS */}
          <div className="student-form teacher-selectors">
            <div className="student-field">
              <label>
                <CalendarDays size={16} />
                Session
              </label>
              <select value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
                <option value="">Select session</option>
                {meta.sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="student-field">
              <label>
                <CalendarDays size={16} />
                Term
              </label>
              <select value={termId} onChange={(e) => setTermId(e.target.value)}>
                <option value="">Select term</option>
                {meta.terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="student-field">
              <label>
                <BookOpen size={16} />
                Class
              </label>
              <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setStudentId("");
                }}
              >
                <option value="">Select class</option>
                {meta.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="student-field">
              <label>
                <Users size={16} />
                Student
              </label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)} disabled={!classId}>
                <option value="">{classId ? "Select student" : "Select a class first"}</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {classId && (
            <div className="teacher-add-student">
              <button type="button" className="reset-button" onClick={() => setShowAddStudent((v) => !v)}>
                <UserPlus size={16} />
                {showAddStudent ? "Cancel" : "Add New Student to This Class"}
              </button>

              <button
                type="button"
                className="reset-button teacher-edit-subjects-button"
                onClick={() => (showSubjectEditor ? setShowSubjectEditor(false) : openSubjectEditor())}
              >
                <ListChecks size={16} />
                {showSubjectEditor ? "Cancel" : "Edit Subjects for This Class"}
              </button>

              {showAddStudent && (
                <form className="student-form teacher-add-student-form" onSubmit={handleAddStudent}>
                  <div className="student-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Student's full name"
                    />
                  </div>
                  <div className="student-field">
                    <label>Admission No. (optional)</label>
                    <input
                      type="text"
                      value={newStudentAdmissionNo}
                      onChange={(e) => setNewStudentAdmissionNo(e.target.value)}
                      placeholder="e.g. ASQ0123"
                    />
                  </div>
                  <div className="student-form-actions">
                    <button type="submit" className="check-result-button">
                      <UserPlus size={16} />
                      Add Student
                    </button>
                  </div>
                </form>
              )}

              {showSubjectEditor && (
                <div className="teacher-subject-editor">
                  <p className="teacher-subject-editor-hint">
                    {subjectsCustomized
                      ? "Only checked subjects will show up for this class when entering results."
                      : "This class hasn't been customized yet, so every subject is shown by default. Uncheck any that don't apply."}
                  </p>

                  <div className="teacher-subject-checklist">
                    {meta.subjects.map((s) => (
                      <label key={s.id} className="teacher-subject-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedSubjectIds.has(s.id)}
                          onChange={() => toggleSubject(s.id)}
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>

                  <form className="teacher-add-subject-form" onSubmit={handleAddNewSubject}>
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="New subject name (e.g. Further Mathematics)"
                    />
                    <button type="submit" className="teacher-save-row-button">
                      <Plus size={14} />
                      Add Subject
                    </button>
                  </form>

                  <div className="student-form-actions">
                    <button
                      type="button"
                      className="check-result-button"
                      onClick={handleSaveClassSubjects}
                      disabled={savingSubjects}
                    >
                      <Save size={18} />
                      {savingSubjects ? "Saving..." : "Save Subject List"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ENTRY TABLE */}
          {studentId && sessionId && termId && (
            <motion.div
              className="result-table-wrapper teacher-entry-table"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>CA (0-40)</th>
                    <th>Exam (0-60)</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entryRows.map((row) => {
                    const ca = row.ca_score === "" ? 0 : Number(row.ca_score);
                    const exam = row.exam_score === "" ? 0 : Number(row.exam_score);
                    return (
                      <tr key={row.subject_id}>
                        <td>{row.subject_name}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="40"
                            className="teacher-score-input"
                            value={row.ca_score}
                            onChange={(e) => updateRow(row.subject_id, "ca_score", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            className="teacher-score-input"
                            value={row.exam_score}
                            onChange={(e) => updateRow(row.subject_id, "exam_score", e.target.value)}
                          />
                        </td>
                        <td>{row.ca_score !== "" && row.exam_score !== "" ? ca + exam : "-"}</td>
                        <td>
                          <button
                            type="button"
                            className="teacher-save-row-button"
                            onClick={() => handleSaveRow(row)}
                          >
                            <Save size={14} />
                            Save
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="student-form-actions teacher-save-all-row">
                <button type="button" className="check-result-button" onClick={handleSaveAll} disabled={loading}>
                  <Save size={18} />
                  {loading ? "Saving all..." : "Save All Entered Subjects"}
                </button>
              </div>
            </motion.div>
          )}

          {status && <p className="teacher-status-message">{status}</p>}
          {error && <p className="student-form-error">{error}</p>}
        </div>
      </section>
    </main>
  );
}

export default TeacherDashboard;
