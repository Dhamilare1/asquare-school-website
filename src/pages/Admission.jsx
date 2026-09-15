import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  FileDown,
  GraduationCap,
  Mail,
  Phone,
  Send,
} from "lucide-react";


function Admission() {
  const admissionSteps = [
    {
      number: "01",
      title: "Make an Inquiry",
      text: "Contact the school or complete the online inquiry form to learn more about admission.",
    },
    {
      number: "02",
      title: "Get the Application Form",
      text: "Download or obtain the appropriate entrance application form for your child's level.",
    },
    {
      number: "03",
      title: "Complete & Submit",
      text: "Complete the application carefully and submit it together with the required documents.",
    },
    {
      number: "04",
      title: "Entrance Assessment",
      text: "Eligible applicants will be invited for the appropriate entrance assessment or interview.",
    },
    {
      number: "05",
      title: "Admission Offer",
      text: "Successful applicants will receive admission information and instructions for the next steps.",
    },
  ];

  const requirements = [
    "Completed admission application form",
    "Recent passport photographs",
    "Previous school report or academic record",
    "Birth certificate or age declaration",
    "Relevant identification documents",
    "Entrance assessment where applicable",
  ];

  return (
    <main className="admission-page">

      {/* =========================================
          ADMISSION HERO
      ========================================= */}

      <section className="admission-hero">
        <div className="admission-hero-circle admission-hero-circle-one"></div>
        <div className="admission-hero-circle admission-hero-circle-two"></div>

        <div className="container admission-hero-container">

          <motion.div
            className="admission-hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="admission-label">
              Admissions
            </span>

            <h1>
              Begin Your Child's
              <br />
              <span>Journey With Us.</span>
            </h1>

            <p>
              Give your child an inspiring environment where learning,
              character and confidence grow together. Discover our admission
              process and take the first step towards joining our school
              community.
            </p>

            <div className="admission-hero-buttons">
              <a href="#application" className="admission-primary-btn">
                Apply Now
                <ArrowRight size={18} />
              </a>

              <a href="#process" className="admission-secondary-btn">
                View Admission Process
                <ArrowDown size={17} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="admission-hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="admission-visual-ring"></div>

            <div className="admission-visual-main">
              <div className="admission-visual-number">
                01
              </div>

              <GraduationCap size={75} strokeWidth={1.2} />

              <span>
                Admissions
              </span>
            </div>

            <div className="admission-floating admission-floating-one">
              <CheckCircle2 size={20} />
              <span>Quality Education</span>
            </div>

            <div className="admission-floating admission-floating-two">
              <GraduationCap size={20} />
              <span>Future Ready</span>
            </div>
          </motion.div>

        </div>
      </section>


      {/* =========================================
          ADMISSION PROCESS
      ========================================= */}

      <section className="admission-process section" id="process">

        <div className="container">

          <motion.div
            className="admission-section-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span>How It Works</span>

            <h2>
              Our Admission
              <strong> Process</strong>
            </h2>

            <p>
              We have made the admission process simple and straightforward
              for parents and guardians.
            </p>
          </motion.div>


          <div className="admission-timeline">

            {admissionSteps.map((step, index) => (
              <motion.div
                className="admission-step"
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
              >

                <div className="step-number">
                  {step.number}
                </div>

                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>

                {index !== admissionSteps.length - 1 && (
                  <div className="step-line"></div>
                )}

              </motion.div>
            ))}

          </div>

        </div>

      </section>


      {/* =========================================
          APPLICATION FORM DOWNLOAD
      ========================================= */}

      <section className="admission-forms section">

        <div className="container">

          <div className="admission-form-banner">

            <div className="form-banner-decoration"></div>

            <motion.div
              className="form-banner-icon"
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <FileDown size={35} />
            </motion.div>

            <div className="form-banner-content">
              <span>Application Forms</span>

              <h2>
                Ready to Start the
                <br />
                Application?
              </h2>

              <p>
                Download the entrance application form, complete the required
                information and prepare it for submission.
              </p>
            </div>

            <a
              href="/entrance-form.pdf"
              download
              className="download-form-btn"
            >
              Download Form
              <FileDown size={18} />
            </a>

          </div>

        </div>

      </section>


      {/* =========================================
          REQUIREMENTS + TUITION
      ========================================= */}

      <section className="admission-details section">

        <div className="container">

          <div className="admission-details-grid">

            {/* REQUIREMENTS */}

            <motion.div
              className="admission-requirements"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >

              <span className="details-label">
                Before You Apply
              </span>

              <h2>
                Admission
                <br />
                Requirements
              </h2>

              <p>
                Please prepare the following documents and information before
                completing the admission process.
              </p>

              <div className="requirements-list">

                {requirements.map((requirement) => (
                  <div
                    className="requirement-item"
                    key={requirement}
                  >
                    <CheckCircle2 size={19} />
                    <span>{requirement}</span>
                  </div>
                ))}

              </div>

            </motion.div>


            {/* TUITION */}

            <motion.div
              className="tuition-section"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >

              <span className="details-label">
                School Fees
              </span>

              <h2>
                Tuition &
                <br />
                Fee Details
              </h2>

              <p>
                Tuition and other school charges vary according to the
                student's academic division and class.
              </p>

              <div className="tuition-list">

                <div className="tuition-row">
                  <span>Early Years</span>
                  <strong>Contact School</strong>
                </div>

                <div className="tuition-row">
                  <span>Primary School</span>
                  <strong>Contact School</strong>
                </div>

                <div className="tuition-row">
                  <span>Junior Secondary</span>
                  <strong>Contact School</strong>
                </div>

                <div className="tuition-row">
                  <span>Senior Secondary</span>
                  <strong>Contact School</strong>
                </div>

              </div>

              <div className="tuition-note">
                <span>*</span>
                <p>
                  Contact the school administration for the current fee
                  structure and other applicable charges.
                </p>
              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =========================================
          ONLINE APPLICATION / INQUIRY
      ========================================= */}

      <section
        className="admission-application section"
        id="application"
      >

        <div className="container">

          <div className="application-heading">

            <span>
              Online Application
            </span>

            <h2>
              Have Questions About
              <br />
              <strong>Admission?</strong>
            </h2>

            <p>
              Send us an inquiry and our admissions team will provide the
              information you need.
            </p>

          </div>


          <div className="application-layout">

            {/* CONTACT INFO */}

            <motion.div
              className="application-contact"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >

              <div className="application-contact-line"></div>

              <h3>
                Let's help you
                <br />
                get started.
              </h3>

              <p>
                Our admissions team is available to answer questions about
                entry requirements, school fees, entrance assessments and
                the application process.
              </p>

              <div className="contact-detail">
                <div>
                  <Phone size={19} />
                </div>

                <span>
                  Call the Admissions Office: 08053013052, 08067701796
                </span>
              </div>

              <div className="contact-detail">
                <div>
                  <Mail size={19} />
                </div>

                <span>
                  Send an Admission Inquiry: asquareeducationalservices@gmail.com
                </span>
              </div>

            </motion.div>


            {/* FORM */}

            <motion.form
              className="application-form"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              onSubmit={(e) => e.preventDefault()}
            >

              <div className="form-row">

                <div className="form-field">
                  <label>Parent / Guardian Name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>

              </div>


              <div className="form-row">

                <div className="form-field">
                  <label>Email Address</label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-field">
                  <label>Student's Class</label>

                  <select defaultValue="">
                    <option value="" disabled>
                      Select class
                    </option>

                    <option>KG 1</option>
                    <option>KG 2</option>
                    <option>Primary 1</option>
                    <option>Primary 2</option>
                    <option>Primary 3</option>
                    <option>Primary 4</option>
                    <option>Primary 5</option>
                    <option>Jss 1</option>
                    <option>Jss 2</option>
                    <option>Jss 3</option>
                    <option>SSS 1</option>
                    <option>SSS 2</option>
                    <option>SSS 3</option>
                  </select>
                </div>

              </div>


              <div className="form-field">
                <label>Message / Inquiry</label>

                <textarea
                  rows="5"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>


              <button
                type="submit"
                className="application-submit"
              >
                Send Inquiry
                <Send size={18} />
              </button>

            </motion.form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Admission;