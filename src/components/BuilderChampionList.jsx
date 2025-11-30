"use client"

import { useState } from "react"
import "./BuilderBoard.css"

const MOCK_CHAMPIONS = [
  { id: 1, name: "Ahri", cost: 1, class: "Mystic" },
  { id: 2, name: "Ashe", cost: 1, class: "Ranger" },
  { id: 3, name: "Blitzcrank", cost: 1, class: "Protector" },
  { id: 4, name: "Brand", cost: 1, class: "Mage" },
  { id: 5, name: "Chogath", cost: 1, class: "Brawler" },
  { id: 6, name: "Darius", cost: 2, class: "Duelist" },
  { id: 7, name: "Elise", cost: 2, class: "Mage" },
  { id: 8, name: "Evelynn", cost: 2, class: "Mystic" },
  { id: 9, name: "Fiora", cost: 2, class: "Duelist" },
  { id: 10, name: "Fizz", cost: 2, class: "Mage" },
  { id: 11, name: "Galio", cost: 3, class: "Brawler" },
  { id: 12, name: "Garen", cost: 3, class: "Knight" },
  { id: 13, name: "Graves", cost: 3, class: "Gunner" },
  { id: 14, name: "Hecarim", cost: 3, class: "Knight" },
  { id: 15, name: "Illaoi", cost: 3, class: "Brawler" },
]

export default function BuilderChampionList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTab, setFilterTab] = useState("Cost")

  const filteredChampions = MOCK_CHAMPIONS.filter((champ) =>
    champ.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="champion-list-container">
      <div className="champion-list-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search All"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {["Cost", "Name", "Origin", "Class", "Craftables", "Radiants", "Artifacts", "Others"].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filterTab === tab ? "active" : ""}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="champions-grid">
        {filteredChampions.map((champ) => (
          <div key={champ.id} className="champion-card">
            <img
              src={`https://via.placeholder.com/80?text=${champ.name}`}
              alt={champ.name}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("championId", champ.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
