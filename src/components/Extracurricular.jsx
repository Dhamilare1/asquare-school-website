import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

import primarySchool from "../assets/images/primarySchool.jpeg";
import award from "../assets/images/award.jpeg";
import awarded from "../assets/images/awarded.jpeg";
import miRacle from "../assets/images/miRacle.jpeg";
import secSchool from "../assets/images/secSchool.jpeg";
import graduate from "../assets/images/graduate.jpeg";
import CodeeClass from "../assets/images/CodeeClass.jpeg";
import secondary from "../assets/images/secondary.jpeg";

function Extracurricular() {
  const activities = [
    {
      title: "School Parties & Events",
      text: "Celebrations, cultural events and special occasions that bring our school community together.",
      image: primarySchool,
      icon: "🎉",
    },
    {
      title: "Debates & Public Speaking",
      text: "Students develop confidence, communication skills and the ability to express their ideas effectively.",
      image: award,
      icon: "🎤",
    },
    {
      title: "Sports & Athletics",
      text: "Encouraging teamwork, discipline, fitness and healthy competition through sporting activities.",
      image: awarded,
      icon: "🏃",
    },
    {
      title: "Coding & Technology",
      text: "Introducing students to technology, coding, digital creativity and problem-solving.",
      image: miRacle,
      icon: "💻",
    },
    {
      title: "Arts & Creativity",
      text: "Giving students opportunities to explore their imagination through art, crafts and creative expression.",
      image: secSchool,
      icon: "🎨",
    },
    {
      title: "Music & Performing Arts",
      text: "Developing confidence and creativity through music, drama, dance and stage performances.",
      image: graduate,
      icon: "🎵",
    },
    {
      title: "Science & Innovation",
      text: "Encouraging curiosity, experimentation and innovative thinking beyond traditional classroom learning.",
      image: CodeeClass,
      icon: "🔬",
    },
    {
      title: "Clubs & Leadership",
      text: "Students participate in clubs and leadership activities that build responsibility and teamwork.",
      image: secondary,
      icon: "⭐",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  /*
  =========================================
  RESPONSIVE NUMBER OF VISIBLE CARDS
  =========================================
  */

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth <= 650) {
        setVisibleCards(1);
      } else if (window.innerWidth <= 1050) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();

    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  /*
  =========================================
  KEEP SLIDE INDEX VALID
  =========================================
  */

  const maxSlide = Math.max(0, activities.length - visibleCards);

  useEffect(() => {
    if (currentSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    }
  }, [visibleCards, currentSlide, maxSlide]);

  /*
  =========================================
  NEXT SLIDE
  =========================================
  */

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev >= maxSlide) {
        return 0;
      }

      return prev + 1;
    });
  };

  /*
  =========================================
  PREVIOUS SLIDE
  =========================================
  */

  const previousSlide = () => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return maxSlide;
      }

      return prev - 1;
    });
  };

  /*
  =========================================
  AUTOMATIC SLIDESHOW
  =========================================
  */

 useEffect(() => {
  if (isPaused) return;

  const sliderTimer = setInterval(() => {
    setCurrentSlide((prev) => {
      if (prev >= maxSlide) {
        return 0;
      }

      return prev + 1;
    });
  }, 3000); // Moves automatically every 3 seconds

  return () => clearInterval(sliderTimer);
}, [isPaused, maxSlide]);

  return (
    <section className="section extracurricular">

      <div className="container">

        <SectionTitle
          subtitle="Student Life"
          title="Beyond the Classroom"
          description="School life is about more than academics. Our students discover their talents, build friendships and develop the confidence to become well-rounded individuals."
        />

        {/* =========================================
            SLIDESHOW
        ========================================= */}

        <div
          className="activity-slider"
          
        >

          <div
            className="activity-grid"
            style={{
              transform: `translateX(calc(-${currentSlide} * var(--slide-distance)))`,
            }}
          >

            {activities.map((activity, index) => (
              <motion.div
                className="activity-card"
                key={activity.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.6,
                  delay: (index % visibleCards) * 0.08,
                }}
                whileHover={{ y: -8 }}
              >

                <div className="activity-image">

                  <img
                    src={activity.image}
                    alt={activity.title}
                  />

                  <div className="activity-overlay"></div>

                  <div className="activity-icon">
                    {activity.icon}
                  </div>

                </div>

                <div className="activity-content">

                  <h3>{activity.title}</h3>

                  <p>{activity.text}</p>

                  <span className="activity-arrow">
                    Discover More →
                  </span>

                </div>

              </motion.div>
            ))}

          </div>

          {/* =========================================
              PREVIOUS BUTTON
          ========================================= */}

          <button
            className="activity-slider-btn activity-prev"
            onClick={previousSlide}
            aria-label="Previous activities"
          >
            ←
          </button>

          {/* =========================================
              NEXT BUTTON
          ========================================= */}

          <button
            className="activity-slider-btn activity-next"
            onClick={nextSlide}
            aria-label="Next activities"
          >
            →
          </button>

        </div>

        {/* =========================================
            DOT INDICATORS
        ========================================= */}

        <div className="activity-dots">

          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button
              key={index}
              className={`activity-dot ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default Extracurricular;