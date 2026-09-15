import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";
import { login } from "../lib/api";

function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/teacher-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="student-page">
      <section className="student-hero">
        <div className="student-hero-circle circle-one"></div>
        <div className="student-hero-circle circle-two"></div>

        <div className="container student-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="student-label">Staff Access</span>
            <h1>
              Teacher
              <br />
              <strong>Login.</strong>
            </h1>
            <p>Log in to enter or update student results.</p>
          </motion.div>
        </div>
      </section>

      <section className="student-checker section">
        <div className="container">
          <motion.form
            className="student-form teacher-login-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="student-field full-field">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                placeholder="you@asquare.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="student-field full-field">
              <label>
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="student-form-actions">
              <button type="submit" className="check-result-button" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
                <LogIn size={18} />
              </button>
            </div>

            {error && <p className="student-form-error">{error}</p>}
          </motion.form>
        </div>
      </section>
    </main>
  );
}

export default TeacherLogin;
