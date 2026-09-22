import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarPlus, KeyRound, Mail, ShieldCheck, Trash2, User, UserPlus } from "lucide-react";
import {
  fetchTeachers,
  createTeacherAccount,
  updateTeacherAccount,
  deleteTeacherAccount,
  fetchMeta,
  createSession,
  getStoredTeacher,
  getToken,
  verifySession,
} from "../lib/api";

function TeacherAdmin() {
  const navigate = useNavigate();
  const me = getStoredTeacher();

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [creating, setCreating] = useState(false);

  const [resetPasswords, setResetPasswords] = useState({}); // { [id]: value }

  const [sessions, setSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/teacher-login");
      return;
    }
    verifySession()
      .then(({ teacher }) => {
        if (teacher.role !== "admin") {
          navigate("/teacher-dashboard");
        }
      })
      .catch((err) => {
        // Same rule as the Teacher Dashboard: only a real 401 (token
        // actually rejected) sends them back to login. A network blip
        // shouldn't.
        if (err.status === 401) navigate("/teacher-login");
      });

    loadTeachers();
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  function loadTeachers() {
    fetchTeachers()
      .then(setTeachers)
      .catch((err) => setError(err.message));
  }

  function loadSessions() {
    fetchMeta()
      .then((meta) => setSessions(meta.sessions))
      .catch((err) => setError(err.message));
  }

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!newSessionName.trim()) return;

    setCreatingSession(true);
    try {
      await createSession(newSessionName.trim());
      setStatus(`Added session ${newSessionName.trim()}.`);
      setNewSessionName("");
      loadSessions();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!fullName || !email || !password) {
      setError("Full name, email and password are all required.");
      return;
    }

    setCreating(true);
    try {
      await createTeacherAccount({ full_name: fullName, email, password, role });
      setStatus(`Created account for ${fullName}.`);
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("teacher");
      loadTeachers();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (teacher, newRole) => {
    setError("");
    setStatus("");
    try {
      await updateTeacherAccount(teacher.id, { role: newRole });
      setStatus(`Updated ${teacher.full_name}'s role.`);
      loadTeachers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (teacher) => {
    const newPassword = resetPasswords[teacher.id];
    setError("");
    setStatus("");
    if (!newPassword || newPassword.length < 6) {
      setError("Enter a new password of at least 6 characters first.");
      return;
    }
    try {
      await updateTeacherAccount(teacher.id, { password: newPassword });
      setStatus(`Password reset for ${teacher.full_name}.`);
      setResetPasswords((prev) => ({ ...prev, [teacher.id]: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (teacher) => {
    setError("");
    setStatus("");
    if (!window.confirm(`Remove ${teacher.full_name}'s account? They will no longer be able to log in.`)) {
      return;
    }
    try {
      await deleteTeacherAccount(teacher.id);
      setStatus(`Removed ${teacher.full_name}.`);
      loadTeachers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="student-page">
      <section className="student-hero">
        <div className="student-hero-circle circle-one"></div>
        <div className="student-hero-circle circle-two"></div>

        <div className="container student-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="student-label">Admin</span>
            <h1>
              Manage Teacher
              <br />
              <strong>Accounts.</strong>
            </h1>
            <p>Create logins for teachers, reset passwords, or remove access.</p>
          </motion.div>
        </div>
      </section>

      <section className="student-checker section">
        <div className="container">
          <Link to="/teacher-dashboard" className="reset-button admin-back-link">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          {/* ADD TEACHER */}
          <motion.form
            className="student-form"
            onSubmit={handleCreate}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="student-field">
              <label>
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Mrs Adebayo"
              />
            </div>

            <div className="student-field">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@asquare.edu.ng"
              />
            </div>

            <div className="student-field">
              <label>
                <KeyRound size={16} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="student-field">
              <label>
                <ShieldCheck size={16} />
                Role
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="teacher">Teacher (enters results only)</option>
                <option value="admin">Admin (can also manage accounts)</option>
              </select>
            </div>

            <div className="student-form-actions">
              <button type="submit" className="check-result-button" disabled={creating}>
                <UserPlus size={18} />
                {creating ? "Creating..." : "Create Account"}
              </button>
            </div>
          </motion.form>

          {status && <p className="teacher-status-message">{status}</p>}
          {error && <p className="student-form-error">{error}</p>}

          {/* TEACHER LIST */}
          <motion.div
            className="result-table-wrapper admin-teacher-table"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <table className="result-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Reset Password</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {t.full_name}
                      {me && me.id === t.id && " (you)"}
                    </td>
                    <td>{t.email}</td>
                    <td>
                      <select value={t.role} onChange={(e) => handleRoleChange(t, e.target.value)}>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <div className="admin-reset-cell">
                        <input
                          type="password"
                          placeholder="New password"
                          className="teacher-score-input admin-reset-input"
                          value={resetPasswords[t.id] || ""}
                          onChange={(e) =>
                            setResetPasswords((prev) => ({ ...prev, [t.id]: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          className="teacher-save-row-button"
                          onClick={() => handleResetPassword(t)}
                        >
                          Reset
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() => handleDelete(t)}
                        title="Remove this account"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* MANAGE SESSIONS */}
          <motion.div
            className="admin-session-panel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="admin-session-heading">Academic Sessions</h3>
            <p className="admin-session-hint">
              Add a new session here at the start of each school year (e.g. "2027/2028") so it
              appears as an option on the Teacher Dashboard and the public result checker.
            </p>

            <div className="admin-session-list">
              {sessions.map((s) => (
                <span key={s.id} className="admin-session-chip">
                  {s.name}
                </span>
              ))}
            </div>

            <form className="teacher-add-subject-form admin-add-session-form" onSubmit={handleCreateSession}>
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder='e.g. 2027/2028'
              />
              <button type="submit" className="teacher-save-row-button" disabled={creatingSession}>
                <CalendarPlus size={14} />
                {creatingSession ? "Adding..." : "Add Session"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default TeacherAdmin;
