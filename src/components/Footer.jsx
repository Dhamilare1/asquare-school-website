import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ABOUT */}
        <div className="footer-about">

          <h2>ASQUARE EDUCATIONAL SERVICES</h2>

          <p>
            Excellence is Our Ultimate Goal
          </p>

          <div className="socials">

            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="Instagram">
              ◎
            </a>

            <a href="#" aria-label="Twitter">
              𝕏
            </a>

          </div>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/academics">
            Academics
          </Link>

          <Link to="/admission">
            Admission
          </Link>

          <Link to="/contact">
            Contact Us
          </Link>

          <Link to="/portal">
            Student Portal
          </Link>

        </div>


        {/* CONTACT */}
        <div className="footer-contact">

          <h3>Contact Us</h3>

          <p>
            📍 137, Isuti Road, Moonlight Bus-stop, Egan-Igando, Lagos State, Nigeria.
          </p>

          <p>
            ☎️ +234 8053013052
            ☎️ +234 8067701796
          </p>

          <p>
            ✉️asquareeducationalservices@gmail.com
          </p>

        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="footer-bottom">

        <p>
          © Asquare Educational Services. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;