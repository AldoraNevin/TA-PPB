import React from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="menu-grid">

        <MenuCard
          title="TIERLISTS"
          image="/legend_fullscreen_aurelionsol_2048.png"
          onClick={() => navigate("/tierlists")}
        />

        <MenuCard
          title="GUIDES"
          image="/legend_fullscreen_bard_2048.png"
          onClick={() => navigate("/guides")}
        />

        <MenuCard
          title="PROFILE"
          image="/legend_fullscreen_twistedfate_2048.png"
          onClick={() => navigate("/profile")}
        />

        <MenuCard
          title="TIERLIST MAKER"
          image="/legend_fullscreen_pengu_2048.png"
          onClick={() => navigate("/tierlist-maker")}
        />

        <MenuCard
          title="BUILDER"
          image="/legend_fullscreen_ornn_2048.png"
          onClick={() => navigate("/builder")}
        />

      </div>
    </div>
  );
}
