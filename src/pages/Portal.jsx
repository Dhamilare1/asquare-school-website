import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  GraduationCap,
  CalendarDays,
  BookOpen,
  User,
  RotateCcw,
  Loader2,
  Download,
} from "lucide-react";
import { checkResult, getReportCardPdfUrl, fetchMeta } from "../lib/api";
import schoolLogo from "../assets/images/myImage.png";

const SCHOOL_NAME = '"A"SQUARE EDUCATIONAL SERVICES';
const SCHOOL_MOTTO = "Excellence is Our Ultimate Goal";
const SCHOOL_ADDRESS = "137, Isuti Road, Moonlight Bus-stop, Egan-Igando, Lagos State, Nigeria.";

function Portal() {
  const [studentName, setStudentName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [term, setTerm] = useState("");
  const [session, setSession] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState(null);

  // Classes, terms and sessions all come from the database, not a
  // hardcoded list — so a new session (e.g. "2027/2028") added by an
  // admin shows up here automatically, with no code changes needed.
  const [classesByLevel, setClassesByLevel] = useState({ Primary: [], Secondary: [] });
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchMeta()
      .then((meta) => {
        setClassesByLevel({
          Primary: meta.classes.filter((c) => c.level === "Primary").map((c) => c.name),
          Secondary: meta.classes.filter((c) => c.level === "Secondary").map((c) => c.name),
        });
        setTerms(meta.terms.map((t) => t.name));
        setSessions(meta.sessions.map((s) => s.name));
      })
      .catch(() => {
        // If this fails (e.g. backend briefly unreachable), the dropdowns
        // just stay empty rather than crashing the page.
      });
  }, []);

 
  const handleCheckResult = async (e) => {
    e.preventDefault();

    if (
      !studentName ||
      !schoolLevel ||
      !studentClass ||
      !term ||
      !session
    ) {
      alert("Please complete all the required fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await checkResult({
        studentName,
        studentClass,
        term,
        session,
      });
      setResultData(data);
      setShowResult(true);

      setTimeout(() => {
        document
          .getElementById("student-result")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch (err) {
      setResultData(null);
      setShowResult(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudentName("");
    setSchoolLevel("");
    setStudentClass("");
    setTerm("");
    setSession("");
    setShowResult(false);
    setResultData(null);
    setError("");
  };

  return (
    <main className="student-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="student-hero">

        <div className="student-hero-circle circle-one"></div>

        <div className="student-hero-circle circle-two"></div>

        <div className="container student-hero-content">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <span className="student-label">
              Student Portal
            </span>

            <h1>
              Check Your
              <br />
              <strong>Academic Result.</strong>
            </h1>

            <p>
              Enter your student details below to access
              your academic result and performance
              information.
            </p>

          </motion.div>

          <motion.div
            className="student-hero-icon"
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >

            <div className="student-icon-ring"></div>

            <div className="student-icon-circle">

              <GraduationCap
                size={65}
                strokeWidth={1.4}
              />

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================
          RESULT CHECKER
      ===================================== */}

      <section className="student-checker section">

        <div className="container">

          <motion.div
            className="student-checker-heading"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <span>
              Result Checker
            </span>

            <h2>
              Enter Student
              <strong> Details</strong>
            </h2>

            <p>
              Select the appropriate academic information
              to continue.
            </p>

          </motion.div>


          {/* =====================================
              FORM
          ===================================== */}

          <motion.form
            className="student-form"
            onSubmit={handleCheckResult}
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            {/* STUDENT NAME */}

            <div className="student-field full-field">

              <label>
                <User size={16} />
                Student Name
              </label>

              <input
                type="text"
                placeholder="Enter full name"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
              />

            </div>


            {/* SCHOOL LEVEL */}

            <div className="student-field">

              <label>
                <GraduationCap size={16} />
                School Level
              </label>

              <div className="level-options">

                <label
                  className={`level-option ${
                    schoolLevel === "Primary"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="schoolLevel"
                    value="Primary"
                    checked={
                      schoolLevel === "Primary"
                    }
                    onChange={(e) => {
                      setSchoolLevel(e.target.value);
                      setStudentClass("");
                    }}
                  />

                  <span>
                    Primary
                  </span>

                </label>


                <label
                  className={`level-option ${
                    schoolLevel === "Secondary"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="schoolLevel"
                    value="Secondary"
                    checked={
                      schoolLevel === "Secondary"
                    }
                    onChange={(e) => {
                      setSchoolLevel(e.target.value);
                      setStudentClass("");
                    }}
                  />

                  <span>
                    Secondary
                  </span>

                </label>

              </div>

            </div>


            {/* CLASS */}

            <div className="student-field">

              <label>
                <BookOpen size={16} />
                Class
              </label>

              <select
                value={studentClass}
                onChange={(e) =>
                  setStudentClass(e.target.value)
                }
                disabled={!schoolLevel}
              >

                <option value="">
                  {schoolLevel
                    ? "Select class"
                    : "Select school level first"}
                </option>

                {schoolLevel &&
                  classesByLevel[schoolLevel].map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

              </select>

            </div>


            {/* TERM */}

            <div className="student-field">

              <label>
                <CalendarDays size={16} />
                Term
              </label>

              <select
                value={term}
                onChange={(e) =>
                  setTerm(e.target.value)
                }
              >

                <option value="">
                  Select term
                </option>

                {terms.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>


            {/* SESSION */}

            <div className="student-field">

              <label>
                <CalendarDays size={16} />
                Academic Session
              </label>

              <select
                value={session}
                onChange={(e) =>
                  setSession(e.target.value)
                }
              >

                <option value="">
                  Select session
                </option>

                {sessions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>


            {/* BUTTONS */}

            <div className="student-form-actions">

              <button
                type="submit"
                className="check-result-button"
                disabled={loading}
              >

                {loading ? "Checking..." : "Check Result"}

                {loading ? (
                  <Loader2 size={18} className="spin-icon" />
                ) : (
                  <Search size={18} />
                )}

              </button>


              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >

                <RotateCcw size={16} />

                Reset

              </button>

            </div>

            {error && (
              <p className="student-form-error">
                {error}
              </p>
            )}

          </motion.form>

        </div>

      </section>


      {/* =====================================
          RESULT SECTION
      ===================================== */}

      {showResult && resultData && (

        <section
          className="student-result section"
          id="student-result"
        >

          <div className="container">

            {/* REPORT CARD LETTERHEAD */}

            <div className="report-letterhead">
              <img src={schoolLogo} alt="School logo" className="report-letterhead-logo" />
              <div>
                <h3>{SCHOOL_NAME}</h3>
                <p className="report-letterhead-motto">{SCHOOL_MOTTO}</p>
                <p className="report-letterhead-address">{SCHOOL_ADDRESS}</p>
              </div>
            </div>

            {/* RESULT HEADER */}

            <motion.div
              className="result-header"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >

              <div>

                <span>
                  Academic Performance
                </span>

                <h2>
                  Student Result
                </h2>

              </div>

              <div className="result-session">
                {resultData.session}
              </div>

            </motion.div>


            {/* STUDENT INFORMATION */}

            <motion.div
              className="result-student-info"
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
              }}
            >

              <div className="result-avatar">
                <User size={30} />
              </div>


              <div>

                <span>
                  Student Name
                </span>

                <h3>
                  {resultData.studentName}
                </h3>

              </div>


              <div>

                <span>
                  Class
                </span>

                <h3>
                  {resultData.studentClass}
                </h3>

              </div>


              <div>

                <span>
                  Term
                </span>

                <h3>
                  {resultData.term}
                </h3>

              </div>

            </motion.div>


            {/* RESULT TABLE */}

            <motion.div
              className="result-table-wrapper"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >

              <table className="result-table">

                <thead>

                  <tr>
                    <th>Subject</th>
                    <th>CA</th>
                    <th>Exam</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>

                </thead>


                <tbody>

                  {resultData.results.map(
                    (result) => (

                      <tr key={result.subject}>

                        <td>
                          {result.subject}
                        </td>

                        <td>
                          {result.ca}
                        </td>

                        <td>
                          {result.exam}
                        </td>

                        <td>
                          {result.total}
                        </td>

                        <td>

                          <span
                            className={`grade grade-${result.grade}`}
                          >
                            {result.grade}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </motion.div>

            {/* SCORE SUMMARY */}

            <motion.div
              className="report-score-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <span>Total Score</span>
                <h3>{resultData.totalScore}</h3>
              </div>
              <div>
                <span>Average Score</span>
                <h3>{resultData.averageScore}</h3>
              </div>
              <div>
                <span>Percentage</span>
                <h3>{resultData.percentage}%</h3>
              </div>
            </motion.div>

            {/* ATTENDANCE, REMARKS & PROMOTION */}

            {resultData.termRecord && (
              <motion.div
                className="report-extra-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {(resultData.termRecord.timesSchoolOpened != null ||
                  resultData.termRecord.timesPresent != null) && (
                  <div className="report-info-block">
                    <h4>Attendance</h4>
                    <p>
                      School opened: {resultData.termRecord.timesSchoolOpened ?? "-"}
                      {"  |  "}
                      Times present: {resultData.termRecord.timesPresent ?? "-"}
                      {"  |  "}
                      Times absent: {resultData.termRecord.timesAbsent ?? "-"}
                    </p>
                  </div>
                )}

                {resultData.termRecord.teacherRemark && (
                  <div className="report-info-block">
                    <h4>Teacher's Remark</h4>
                    <p>{resultData.termRecord.teacherRemark}</p>
                  </div>
                )}

                {resultData.termRecord.principalRemark && (
                  <div className="report-info-block">
                    <h4>Principal's Remark</h4>
                    <p>{resultData.termRecord.principalRemark}</p>
                  </div>
                )}

                {resultData.termRecord.promotionStatus && (
                  <div className="report-info-block report-promotion-block">
                    <h4>Promotion</h4>
                    <p>
                      {resultData.termRecord.promotionStatus === "Promoted" &&
                        `Promoted to ${resultData.termRecord.promotedToClass || "the next class"}.`}
                      {resultData.termRecord.promotionStatus === "Repeated" &&
                        `To repeat ${resultData.studentClass} next session.`}
                      {resultData.termRecord.promotionStatus === "Graduated" && "Graduated."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* DOWNLOAD REPORT CARD */}

            <div className="result-download-row">

              <a
                className="check-result-button download-report-button"
                href={getReportCardPdfUrl({
                  studentName: resultData.studentName,
                  studentClass: resultData.studentClass,
                  term: resultData.term,
                  session: resultData.session,
                })}
              >
                <Download size={18} />
                Download Report Card (PDF)
              </a>

            </div>

          </div>

        </section>

      )}

    </main>
  );
}

export default Portal;