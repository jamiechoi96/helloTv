import React, { useEffect, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Header.css";
import WeatherWidget from "./WeatherWidget.jsx";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuClick = (menu) => {
    if (menu === "영화") navigate("/movies");
    if (menu === "예능") navigate("/entertainment");
    if (menu === "드라마") navigate("/dramas");
    if (menu === "키즈/애니") navigate("/kids");
  };

  return (
    <header
      className={`header ${isHome ? "header-home" : ""} ${
        isScrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/images/LG_logo.png" alt="LG Logo" className="logo-image" />
        <span className="logo-text">
          <span className="Hello">Hello</span>TV
        </span>
      </div>
      <nav className="Nav">
        <ul>
          {["영화", "예능", "드라마", "키즈/애니"].map((menu) => (
            <li key={menu} onClick={() => handleMenuClick(menu)}>
              {menu}
            </li>
          ))}
        </ul>
      </nav>
      <div className="icons">
        {location.pathname !== "/search" && (
          <FiSearch className="icon" onClick={() => navigate("/search")} />
        )}
        <Link
          to={`/mypage?userHash=a97ed1db84bc3dc8586b46572d253e86d4771b902b5ee38c64150e13968ff3ad`}
        >
          <FiUser
            className={`icon ${
              location.pathname === "/mypage" ? "active" : ""
            }`}
          />
        </Link>
        <WeatherWidget />
      </div>
      {!isScrolled && <div className="gradient-banner"></div>}
    </header>
  );
};

export default Header;
