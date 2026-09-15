import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import aSqaure from "../assets/images/aSquare.jpeg";


// =========================================
// COUNTING ANIMATION
// =========================================

function Counter({ end, suffix = "", duration = 2000 }) {

  const [count, setCount] = useState(0);

  useEffect(() => {

    let startTime = null;

    const animateCount = (currentTime) => {

      if (!startTime) {
        startTime = currentTime;
      }

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth counting effect
      const currentNumber = Math.floor(
        progress * end
      );

      setCount(currentNumber);

      if (progress < 1) {

        requestAnimationFrame(
          animateCount
        );

      } else {

        // Make sure the final number is exact
        setCount(end);

      }

    };

    requestAnimationFrame(
      animateCount
    );

  }, [end, duration]);


  // Add commas to large numbers
  const formattedNumber =
    count.toLocaleString();


  return (
    <strong>
      {formattedNumber}
      {suffix}
    </strong>
  );
}


// =========================================
// WHY CHOOSE US
// =========================================

function WhyChooseUs() {

  const reasons = [
    {
      title: "Qualified & Caring Teachers",
      text: "Our teachers are committed to helping every student reach their full potential."
    },
    {
      title: "Excellent Learning Environment",
      text: "We provide a safe, welcoming and stimulating environment where students can thrive."
    },
    {
      title: "Strong Character Development",
      text: "We combine academic excellence with discipline, integrity, confidence and leadership."
    },
    {
      title: "Modern Learning Approach",
      text: "Our students are exposed to technology, creativity and practical learning experiences."
    }
  ];


  // =========================================
  // STATISTICS
  // =========================================

  const statistics = [
    {
      number: 26,
      suffix: "+",
      label: "Years of Excellence"
    },
    {
      number: 1000,
      suffix: "+",
      label: "Students"
    },
    {
      number: 50,
      suffix: "+",
      label: "Qualified Teachers"
    },
    {
      number: 20,
      suffix: "+",
      label: "Academic Programmes"
    }
  ];


  return (

    <section className="section why-section">

      <div className="container">

        <div className="why-container">


          {/* =========================================
              IMAGE
          ========================================= */}

          <motion.div
            className="why-image-container"

            initial={{
              opacity: 0,
              x: -70
            }}

            whileInView={{
              opacity: 1,
              x: 0
            }}

            viewport={{
              once: true
            }}

            transition={{
              duration: 0.8
            }}
          >

            <img
              src={aSqaure}
              alt="Students at school"
              className="why-image"
            />

            <div className="why-image-circle"></div>


            {/* EXPERIENCE BADGE */}

            <div className="why-badge">

              <strong>
                26+
              </strong>

              <span>
                Years of<br />
                Excellence
              </span>

            </div>

          </motion.div>



          {/* =========================================
              CONTENT
          ========================================= */}

          <motion.div
            className="why-content"

            initial={{
              opacity: 0,
              x: 70
            }}

            whileInView={{
              opacity: 1,
              x: 0
            }}

            viewport={{
              once: true
            }}

            transition={{
              duration: 0.8
            }}
          >


            <span className="why-label">
              WHY CHOOSE US
            </span>


            <h2>
              Empowering Students
              to Become Their Best
            </h2>


            <p className="why-intro">
              We are committed to providing an educational
              experience that develops the whole child —
              academically, socially, emotionally and creatively.
            </p>



            {/* =========================================
                REASONS
            ========================================= */}

            <div className="reason-list">

              {reasons.map((reason, index) => (

                <motion.div
                  className="reason-item"
                  key={reason.title}

                  initial={{
                    opacity: 0,
                    x: 30
                  }}

                  whileInView={{
                    opacity: 1,
                    x: 0
                  }}

                  viewport={{
                    once: true
                  }}

                  transition={{
                    duration: 0.5,
                    delay: index * 0.12
                  }}
                >

                  <CheckCircle
                    size={23}
                    className="reason-icon"
                  />


                  <div>

                    <h3>
                      {reason.title}
                    </h3>

                    <p>
                      {reason.text}
                    </p>

                  </div>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </div>



        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="school-statistics">

          {statistics.map((stat, index) => (

            <motion.div
              className="stat-item"
              key={stat.label}

              initial={{
                opacity: 0,
                y: 30
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
            >


              {/* ANIMATED NUMBER */}

              <Counter
                end={stat.number}
                suffix={stat.suffix}
                duration={2000}
              />


              <span>
                {stat.label}
              </span>

            </motion.div>

          ))}

        </div>

      </div>

    </section>

  );
}

export default WhyChooseUs;