import React from "react";
import "../styles/tierlist.css";
import "../styles/tierlist-champ.css";
import { getChampionImage } from "../utils/getChampionImage";

const tierData = [
  {
    tier: "S",
    color: "#ff3055",
    teams: [
      {
        champs: [
          { name: "akali", variant: "truedamage", cost: 4 },
          { name: "akali", variant: "kda", cost: 4 },
          { name: "caitlyn", cost: 4 },
          { name: "vi", cost: 2 },
          { name: "ahri", cost: 4 },
          { name: "jhin", cost: 5 },
          { name: "jinx", cost: 1 },
        ],
      },
    ],
  },
  {
    tier: "A",
    color: "#ff9b21",
    teams: [
      {
        champs: [
          { name: "sett", cost: 3 },
          { name: "ezreal", cost: 4 },
          { name: "lux", cost: 3 },
          { name: "evelynn", cost: 1 },
          { name: "yone", cost: 3 },
          { name: "viego", cost: 4 },
          { name: "katarina", cost: 2 },
        ],
      },
    ],
  },
  {
    tier: "B",
    color: "#ffe83b",
    teams: [
      {
        champs: [
          { name: "neeko", cost: 3 },
          { name: "kaisa", cost: 2 },
          { name: "aphelios", cost: 3 },
          { name: "ziggs", cost: 5 },
          { name: "bard", cost: 2 },
          { name: "urgot", cost: 3 },
          { name: "illaoi", cost: 5 },
        ],
      },
    ],
  },
  {
    tier: "C",
    color: "#7fff3a",
    teams: [
      {
        champs: [
          { name: "annie", cost: 1 },
          { name: "poppy", cost: 4 },
          { name: "gragas", cost: 2 },
          { name: "vex", cost: 3 },
          { name: "ekko", cost: 3 },
          { name: "thresh", cost: 4 },
          { name: "lucian", cost: 5 },
          { name: "olaf", cost: 1 },
          { name: "qiyana", cost: 5 },
          { name: "riven", cost: 3 },
        ],
      },
    ],
  },
];

export default function Tierlists() {
  return (
    <div className="tl-tierlist-container">

      {/* TITLE */}
      <h1 className="tl-page-title">
        <img
          src="/teamfight-tactics-logo-png_seeklogo-487286.png"
          alt="Logo"
        />
        <span className="tl-yellow"> TIERLIST</span>
      </h1>

      {/* TABS */}
      <div className="tl-tab-row">
        <div className="tl-tab active">Comps</div>
        <div className="tl-tab">Items</div>
        <div className="tl-tab">Augments</div>
      </div>

      {/* FILTER BAR */}
      <div className="tl-filter-bar">
        <input type="text" placeholder="Search" className="tl-search-box" />

        <select className="tl-filter-dropdown">
          <option>Comp Style</option>
          <option>Fast 9</option>
          <option>Reroll</option>
          <option>Standard</option>
        </select>

        <select className="tl-filter-dropdown">
          <option>Set 10</option>
        </select>
      </div>

      {/* TIER LIST */}
      {tierData.map((row) => (
        <div key={row.tier} className="tl-tier-row">

          {/* Tier Label */}
          <div className="tl-tier-label" style={{ backgroundColor: row.color }}>
            <div className="tl-tier-letter">{row.tier}</div>
            <div className="tl-tier-text">{row.tier} TIER</div>
          </div>

          {/* Champion list */}
          <div className="tl-comp-box" style={{ borderColor: row.color }}>
            {row.teams[0].champs.map((champ, idx) => (
              <div className="tl-champ-wrapper" key={idx}>

                {/* Tooltip */}
                <div className="tl-tooltip">
                  {champ.tooltip || champ.name.toUpperCase()}
                </div>

                <img
                  className="tl-champ-icon"
                  src={getChampionImage(champ.name, champ.variant)}
                  alt={champ.name}
                />

                <div className="tl-champ-cost">{champ.cost}</div>

              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
