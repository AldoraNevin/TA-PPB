import React from "react";
import "../../styles/builder.css";

export default function BoardGrid({ onCellClick }) {
  const rows = 4;
  const cols = 7;

  return (
    <div className="board-container">

      {/* Left label */}
      <div className="side-label left">TFT Academy</div>

      {/* GRID */}
      <div className="hex-grid">
        {[...Array(rows)].map((_, rowIndex) => (
          <div className="hex-row" key={rowIndex}>
            {[...Array(cols)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="hex-cell"
                onClick={() => onCellClick?.(rowIndex, colIndex)}
              >
                <div className="hex-shape" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Right label */}
      <div className="side-label right">TFT Academy</div>
    </div>
  );
}
