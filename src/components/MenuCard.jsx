import React from "react";
import "../styles/MenuCard.css";

export default function MenuCard({ title, image, onClick }) {
  return (
    <div className="menu-card" onClick={onClick}>
      <img src={image} alt={title} className="menu-card-img" />

      <div className="menu-card-overlay"></div>

      <div className="menu-card-title">
        {title}
      </div>
    </div>
  );
}
