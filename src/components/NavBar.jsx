import React from "react";
import "../styles/navbar.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/tierlists", label: "Tierlists" },
    { to: "/guides", label: "Guides" },
    { to: "/profile", label: "Profile" },
    { to: "/tierlist-maker", label: "Tierlist Maker" },
    { to: "/builder", label: "Builder" },
  ];

  const mobileNavItems = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/tierlists", label: "Tierlists", icon: "📊" },
    { to: "/guides", label: "Guides", icon: "📖" },
    { to: "/profile", label: "Profile", icon: "👤" },
    { to: "/tierlist-maker", label: "Tierlist Maker", icon: "✏️" },
    { to: "/builder", label: "Builder", icon: "🔨" },
  ];

  return (
    <nav className="navbar">
      {/* Desktop nav with text labels */}
      <div className="nav-desktop">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile nav with icons only */}
      <div className="nav-mobile">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item-mobile ${isActive ? "nav-item-active" : ""}`}
            title={item.label}
          >
            <span>{item.icon}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
