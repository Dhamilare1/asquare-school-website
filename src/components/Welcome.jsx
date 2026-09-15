import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import CodeeClass from "../assets/images/CodeeClass.jpeg";
import award from "../assets/images/award.jpeg";
import codClass from "../assets/images/codClass.jpeg";


function Welcome() {
  return (
    <section className="section welcome">

      <div className="container">

        <SectionTitle
          subtitle="Who We Are"
          title="Welcome to Asquare Educational Services"
          description="A place for Qualitative and Affordable Education"
        />

        {/* ABOUT SCHOOL */}

        <div className="about-school">

          {/* IMAGE SIDE */}

          <motion.div
            className="about-images"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >

            <div className="image-decoration"></div>

            <motion.img
              src={codClass}
              alt="Students learning"
              className="about-image image-one"
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.img
              src={CodeeClass}
              alt="School students"
              className="about-image image-two"
              animate={{
                y: [0, 12, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.img
                src={award}
              alt="School activity"
              className="about-image image-three"
              whileHover={{
                scale: 1.08
              }}
              transition={{
                duration: 0.5
              }}
            />

          </motion.div>


          {/* WRITE-UP SIDE */}

          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >

            <span className="about-label">
              ABOUT OUR SCHOOL
            </span>

            <h2>
              Building a Strong Foundation
              for a Brighter Future
            </h2>

            <p>
              At "A"square, we believe that education
              goes beyond the classroom. We are committed
              to providing an inspiring environment where
              students can discover their talents, develop
              confidence and build the knowledge they need
              to succeed.
            </p>

            <p>
              Our dedicated teachers work closely with
              students to encourage academic excellence,
              creativity, discipline and good character.
              We prepare young minds to become responsible
              leaders who can make a positive impact in
              their communities and the world.
            </p>

            <button className="about-button">
              Learn More
            </button>

          </motion.div>

        </div>


     {/* MISSION VISION VALUES */}

<div className="values-grid">

  {/* MISSION */}
  <motion.div
    className="value-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -10 }}
  >

    <div className="value-icon mission-icon">
      🎯
    </div>

    <span className="value-number">
      01
    </span>

    <h3>Our Mission</h3>

    <div className="value-line"></div>

    <p>
      To educate chidren and to raise high level matured educated Nigerian no matter how less privilege or how 
      wealthy they are.
    </p>

  </motion.div>


  {/* VISION */}
  <motion.div
    className="value-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.15 }}
    whileHover={{ y: -10 }}
  >

    <div className="value-icon vision-icon">
      👁️
    </div>

    <span className="value-number">
      02
    </span>

    <h3>Our Vision</h3>

    <div className="value-line"></div>

    <p>
      To give qualitative education at an affordable fee in a condusive environment with seasoned and skilled teaching and non-teaching staff. 
    </p>

  </motion.div>


  {/* CORE VALUES */}
  <motion.div
    className="value-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.3 }}
    whileHover={{ y: -10 }}
  >

    <div className="value-icon values-icon">
      💎
    </div>

    <span className="value-number">
      03
    </span>

    <h3>Our Core Values</h3>

    <div className="value-line"></div>

    <p>
      Integrity, discipline, respect, excellence,
      responsibility, creativity and leadership
      guide everything we do.
    </p>

  </motion.div>

</div>

      </div>

    </section>
  );
}

export default Welcome;