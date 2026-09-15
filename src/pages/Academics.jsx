import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import awarded from "../assets/images/awarded.jpeg";
import primarySchool from "../assets/images/primarySchool.jpeg";
import miRacle from "../assets/images/miRacle.jpeg";
import secSchool from "../assets/images/secSchool.jpeg";
import Extracurricular from "../components/Extracurricular";



function Academics() {

  const divisions = [
    {
      title: "Early Years",
      description:
        "A nurturing environment where young learners discover, explore and build strong foundations.",
      image: awarded
    },

    {
      title: "Primary School",
      description:
        "Developing confident learners through creativity, knowledge and practical experiences.",
      image: primarySchool
    },

    {
      title: "Junior Secondary",
      description:
        "Preparing students with strong academic skills, discipline and confidence.",
      image: miRacle
    },

    {
      title: "Senior Secondary",
      description:
        "Equipping students with the knowledge and skills needed for higher education and future careers.",
      image: secSchool
    }
  ];

  return (
    <section className="section academic-divisions">

      <div className="container">

        <SectionTitle
          subtitle="Our Academics"
          title="Learning At Every Stage"
          description="Our academic structure is designed to support students at every stage of their educational journey."
        />

        <div className="division-grid">

          {divisions.map((division, index) => (

            <motion.div
              className="division-card"
              key={division.title}

              initial={{
                opacity: 0,
                y: 60
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              transition={{
                duration: 0.7,
                delay: index * 0.12
              }}
            >

              <div className="division-image-wrapper">

                <img
                  src={division.image}
                  alt={division.title}
                  className="division-image"
                />

                <div className="division-overlay"></div>

                <span className="division-number">
                  0{index + 1}
                </span>

              </div>


              <div className="division-content">

                <h3>
                  {division.title}
                </h3>

                <p>
                  {division.description}
                </p>

                <Link
                  to="/academics"
                  className="division-link"
                >
                  Explore Programme

                  <span>
                    →
                  </span>
                </Link>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
          <Extracurricular />

    </section>

  );
}

export default Academics;