import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

import baba from "../assets/images/baba.jpeg";

function Testimonial() {
  const testimonials = [
    {
      image: baba,
      name: "High Chief Adediji Amos",
      role: "Proprietor",
      text: "Education is not only about academic success; it is about building character, confidence and a strong foundation for a successful future. Our commitment is to help every child discover their potential and become their best.",
    },
    {
      image: baba,
      name: "Daniel Williams",
      role: "Student",
      text: "I enjoy coming to school because learning is made interesting and we are encouraged to discover our talents. The teachers always support us to do our best.",
    },
    {
      image: baba,
      name: "Mr. Samuel Okafor",
      role: "Parent",
      text: "The combination of academic excellence, discipline and character development makes this school stand out. We have seen tremendous growth in our child.",
    },
  ];

  return (
    <section className="testimonial-section">
      <div className="testimonial-orbit testimonial-orbit-one"></div>
      <div className="testimonial-orbit testimonial-orbit-two"></div>

      <div className="container">

        {/* HEADING */}
        <motion.div
          className="testimonial-header"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="testimonial-label">
            Voices of Our Community
          </span>

          <h2>
            Experiences That
            <br />
            <span>Speak For Us.</span>
          </h2>

          <p>
            Discover what parents and students have to say about their
            experience, growth and journey with our school.
          </p>
        </motion.div>

        {/* MAIN TESTIMONIAL */}
        <div className="testimonial-editorial">

          {/* LARGE NUMBER */}
          <div className="testimonial-number">
            01
          </div>

          {/* IMAGE COMPOSITION */}
          <motion.div
            className="testimonial-visual"
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="testimonial-main-photo">
              <img
                src={testimonials[0].image}
                alt={testimonials[0].name}
              />
            </div>

            <div className="testimonial-photo photo-two">
              <img
                src={testimonials[1].image}
                alt={testimonials[1].name}
              />
            </div>

            <div className="testimonial-photo photo-three">
              <img
                src={testimonials[2].image}
                alt={testimonials[2].name}
              />
            </div>

            <motion.div
              className="testimonial-floating-star"
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -7, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Star size={18} fill="currentColor" />
            </motion.div>

            <div className="testimonial-circle-line"></div>
          </motion.div>

          {/* TEXT */}
          <motion.div
            className="testimonial-text"
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <div className="testimonial-quote">
              <Quote size={70} strokeWidth={1.2} />
            </div>

            <div className="testimonial-rating">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>

            <blockquote>
              “{testimonials[0].text}”
            </blockquote>

            <div className="testimonial-author">
              <span className="author-line"></span>

              <div>
                <h3>{testimonials[0].name}</h3>
                <p>{testimonials[0].role}</p>
              </div>
            </div>

            {/* INDICATORS */}
            <div className="testimonial-indicators">
              <span className="indicator active"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM STATEMENT */}
        <motion.div
          className="testimonial-bottom"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <span></span>

          <p>
            Excellence is Our Ultimate Goal.
          </p>

          <span></span>
        </motion.div>

      </div>
    </section>
  );
}

export default Testimonial;