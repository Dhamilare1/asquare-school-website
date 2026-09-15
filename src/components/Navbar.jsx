import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,

} from "lucide-react";
import myImage from "../assets/images/myImage.png";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <div className="logo-icon">
            <img src={myImage} size={27} />
          </div>

          <div className="logo-text">
            <h2>"A"SQUARE EDUCATIONAL SERVICES</h2>
            <span>
              Excellence is Our Ultimate Goal
            </span>
          </div>
        </Link>


        {/* NAVIGATION */}
        <nav
          className={`nav-menu ${
            menuOpen ? "nav-open" : ""
          }`}
        >

          <NavLink
            to="/"
            className="nav-link"
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/academics"
            className="nav-link"
            onClick={closeMenu}
          >
            Academics
          </NavLink>

          <NavLink
            to="/admission"
            className="nav-link"
            onClick={closeMenu}
          >
            Admission
          </NavLink>

          <NavLink
            to="/contact"
            className="nav-link"
            onClick={closeMenu}
          >
            Contact Us
          </NavLink>

          <Link
            to="/portal"
            className="portal-button"
            onClick={closeMenu}
          >
            Student Portal
          </Link>

          <NavLink
            to="/teacher-login"
            className="nav-link teacher-nav-link"
            onClick={closeMenu}
          >
            Teacher Login
          </NavLink>

        </nav>


        {/* MOBILE MENU BUTTON */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>

      </div>
    </header>
  );
}

export default Navbar;