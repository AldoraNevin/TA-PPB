"use client"

import { useState } from "react"
import "./BuilderBoard.css"

const HEX_ROWS = 4
const HEX_COLS = 7

export default function BuilderBoard() {
  const [champions, setChampions] = useState(Array(HEX_ROWS * HEX_COLS).fill(null))
  const [selectedHex, setSelectedHex] = useState(null)
  const [history, setHistory] = useState([champions])
  const [historyIndex, setHistoryIndex] = useState(0)

  const handleHexClick = (index) => {
    setSelectedHex(selectedHex === index ? null : index)
  }

  const handleChampionDrop = (index, championId) => {
    const newChampions = [...champions]
    newChampions[index] = championId
    updateHistory(newChampions)
  }

  const handleRemoveChampion = (index) => {
    const newChampions = [...champions]
    newChampions[index] = null
    updateHistory(newChampions)
  }

  const updateHistory = (newChampions) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newChampions])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setChampions(newChampions)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setChampions([...history[newIndex]])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setChampions([...history[newIndex]])
    }
  }

  const handleClear = () => {
    updateHistory(Array(HEX_ROWS * HEX_COLS).fill(null))
    setSelectedHex(null)
  }

  return (
    <div className="builder-board">
      <div className="hex-grid-container">
        <div className="hex-grid-label left">TFT Academy</div>
        <div className="hex-grid-label right">TFT Academy</div>
        <div className="hex-grid">
          {champions.map((champion, index) => (
            <div
              key={index}
              className={`hex-cell ${selectedHex === index ? "selected" : ""} ${champion ? "occupied" : ""}`}
              onClick={() => handleHexClick(index)}
              onContextMenu={(e) => {
                e.preventDefault()
                if (champion) {
                  handleRemoveChampion(index)
                }
              }}
            >
              <div className="hex-inner">
                {champion && (
                  <div className="hex-champion">
                    <img src={`https://via.placeholder.com/60?text=${champion}`} alt={champion} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
