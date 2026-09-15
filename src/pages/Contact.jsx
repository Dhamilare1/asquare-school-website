import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowUpRight,
  Navigation,
} from "lucide-react";

function Contact() {
  return (
    <main className="contact-page">

      {/* =========================================
          CONTACT HERO
      ========================================= */}

      <section className="contact-hero">
        <div className="contact-hero-circle contact-circle-one"></div>
        <div className="contact-hero-circle contact-circle-two"></div>

        <div className="container contact-hero-container">

          <motion.div
            className="contact-hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="contact-label">
              Contact Us
            </span>

            <h1>
              Let's Start a
              <br />
              <span>Conversation.</span>
            </h1>

            <p>
              Whether you have a question about admission, academics,
              school activities or anything else, our team is here to
              help.
            </p>

            <a
              href="#contact-details"
              className="contact-hero-link"
            >
              Find Us
              <ArrowUpRight size={18} />
            </a>
          </motion.div>


          {/* HERO LOCATION VISUAL */}

          <motion.div
            className="contact-location-visual"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >

            <div className="location-ring location-ring-one"></div>
            <div className="location-ring location-ring-two"></div>

            <div className="location-pin-large">
              <MapPin size={65} strokeWidth={1.4} />
            </div>

            <motion.div
              className="location-floating location-floating-one"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <MapPin size={17} />
              <span>Our Location</span>
            </motion.div>

            <motion.div
              className="location-floating location-floating-two"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Navigation size={16} />
              <span>Get Directions</span>
            </motion.div>

          </motion.div>

        </div>
      </section>


      {/* =========================================
          CONTACT DETAILS
      ========================================= */}

      <section
        className="contact-details section"
        id="contact-details"
      >

        <div className="container">

          <motion.div
            className="contact-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span>Reach Out</span>

            <h2>
              We're Here
              <strong> To Help.</strong>
            </h2>

            <p>
              Get in touch with the school through any of the channels
              below.
            </p>
          </motion.div>


          <div className="contact-information">

            {/* PHONE */}

            <motion.a
              href="tel:+2340000000000"
              className="contact-info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -7 }}
            >
              <div className="contact-info-icon">
                <Phone size={23} />
              </div>

              <div>
                <span>Call Us</span>
                <h3>08053013052, 08067701796</h3>
                <p>Speak with the school administration</p>
              </div>

              <ArrowUpRight className="contact-info-arrow" size={20} />
            </motion.a>


            {/* EMAIL */}

            <motion.a
              href="mailto:info@school.com"
              className="contact-info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -7 }}
            >
              <div className="contact-info-icon gold">
                <Mail size={23} />
              </div>

              <div>
                <span>Email Us</span>
                <h3>asquareeducationalservices@gmail.com</h3>
                <p>Send us your questions or enquiries</p>
              </div>

              <ArrowUpRight className="contact-info-arrow" size={20} />
            </motion.a>


            {/* MESSAGE */}

            <motion.a
              href="#message"
              className="contact-info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -7 }}
            >
              <div className="contact-info-icon">
                <MessageCircle size={23} />
              </div>

              <div>
                <span>Direct Message</span>
                <h3>Send an Inquiry</h3>
                <p>Send us a message directly through the website</p>
              </div>

              <ArrowUpRight className="contact-info-arrow" size={20} />
            </motion.a>

          </div>

        </div>
      </section>


      {/* =========================================
          MAP + MESSAGE
      ========================================= */}

      <section className="contact-map-section section">

        <div className="container">

          <div className="contact-map-layout">

            {/* MAP */}

            <motion.div
              className="contact-map"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >

              <div className="map-placeholder">

                <div className="map-grid"></div>

                <div className="map-road road-one"></div>
                <div className="map-road road-two"></div>
                <div className="map-road road-three"></div>

                <motion.div
                  className="map-location-pin"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MapPin size={35} />
                </motion.div>

                <div className="map-location-label">
                  <strong>Our School</strong>
                  <span> 137, Isuti Road, Moonlight Junction, Egan-Igando, Lagos State, Nigeria.</span>
                </div>

                <a
                  href="https://www.google.com/maps/@6.5787822,3.2081002,15z?authuser=0&entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-directions"
                >
                  Open in Google Maps
                  <ArrowUpRight size={17} />
                </a>

              </div>

            </motion.div>


            {/* ADDRESS */}

            <motion.div
              className="contact-address"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >

              <span className="address-label">
                Visit Us
              </span>

              <h2>
                Find Your Way
                <br />
                <strong>To Us.</strong>
              </h2>

              <div className="address-line"></div>

              <div className="address-content">

                <MapPin size={25} />

                <p>
                  School Address
                  <br />
                  <strong>
                    137, Isuti Road, Moonlight Junction, Egan-Igando, Lagos State, Nigeria.
                  </strong>
                </p>

              </div>

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
              >
                Get Directions
                <Navigation size={17} />
              </a>

            </motion.div>

          </div>

        </div>
      </section>


      {/* =========================================
          DIRECT MESSAGE
      ========================================= */}

      <section
        className="contact-message section"
        id="message"
      >

        <div className="container">

          <div className="message-wrapper">

            <motion.div
              className="message-intro"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >

              <span>
                Send a Message
              </span>

              <h2>
                Have Something
                <br />
                <strong>To Ask?</strong>
              </h2>

              <p>
                Fill out the form and our team will get back to you
                as soon as possible.
              </p>

            </motion.div>


            <motion.form
              className="contact-form"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              onSubmit={(e) => e.preventDefault()}
            >

              <div className="contact-form-row">

                <div className="contact-field">
                  <label>Your Name</label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="contact-field">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>

              </div>


              <div className="contact-field">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>


              <div className="contact-field">
                <label>Your Message</label>

                <textarea
                  rows="5"
                  placeholder="How can we help you?"
                ></textarea>
              </div>


              <button
                type="submit"
                className="contact-submit"
              >
                Send Message
                <MessageCircle size={18} />
              </button>

            </motion.form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Contact;