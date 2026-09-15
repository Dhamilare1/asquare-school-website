import { motion } from "framer-motion";

import aWall from "../assets/images/aWall.jpeg";
import { Link } from "react-router-dom";
import Academics from "../pages/Academics";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-overlay"></div>

      <div className="hero-image-wrapper">
        <img
        src={aWall}
        alt="School Students"
        className="hero-image"
      />
      </div>

      <div className="container hero-container">

        <motion.div
          className="hero-text"

          initial={{ opacity: 0, y: 70 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 1 }}
        >

          <span className="hero-tag">
            Your Success Starts Here.........
          </span>

          <h1>
            Inspiring Minds.
            <br />
            Building Future Leaders.
          </h1>

          <p>
            We provide excellent education that
            nurtures creativity, discipline,
            confidence and academic success.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Apply Now
            </button>

            <button className="secondary-btn">
              Explore Academics
            </button>

          </div>

        </motion.div>

      </div>

      {/* Floating Decorations */}

      <motion.div
        className="circle circle-one"

        animate={{
          y: [0, -20, 0]
        }}

        transition={{
          duration: 4,
          repeat: Infinity
        }}
      />

      <motion.div
        className="circle circle-two"

        animate={{
          y: [0, 20, 0]
        }}

        transition={{
          duration: 5,
          repeat: Infinity
        }}
      />

    </section>
  );
}

export default Hero;