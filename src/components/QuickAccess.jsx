import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Monitor,
  Phone,
  ArrowUpRight,
  Contact,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import Academics from "../pages/Academics";
import Admission from "../pages/Admission";
import Portal from "../pages/Portal";

function QuickAccess() {
  const items = [
    {
      number: "01",
      title: "Admissions",
      text: "Start your journey with us and discover everything you need to know about joining our school.",
      link: "/admission",
      icon: GraduationCap,
      map: Admission
    },
    {
      number: "02",
      title: "Academics",
      text: "Explore our academic divisions, programmes and learning opportunities for every stage.",
      link: "/academics",
      icon: BookOpen,
      map: Academics
    },
    {
      number: "03",
      title: "Student Portal",
      text: "Access student services, academic information and other important school resources.",
      link: "/portal",
      icon: Monitor,
      map: Portal
    },
    {
      number: "04",
      title: "Contact Us",
      text: "Have questions or need more information? Get in touch with our school administration.",
      link: "/contact",
      icon: Phone,
      map: Contact
    },
  ];

  return (
    <section className="section quick-access">
      <div className="container">

        <SectionTitle
          subtitle="Quick Access"
          title="Everything You Need, In One Place"
          description="Find your way around our school website and quickly access the information you need."
        />

        <div className="quick-grid">

          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.a
                href={item.link}
                className="quick-card"
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -10,
                }}
              >

                {/* Top */}
                <div className="quick-top">

                  <span className="quick-number">
                    {item.number}
                  </span>

                  <div className="quick-icon">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                </div>

                {/* Content */}
                <div className="quick-content">

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                  <span className="quick-link">
                    Explore
                    <ArrowUpRight
                      size={17}
                      strokeWidth={2}
                    />
                  </span>

                </div>

                {/* Decorative circle */}
                <div className="quick-decoration"></div>

              </motion.a>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default QuickAccess;