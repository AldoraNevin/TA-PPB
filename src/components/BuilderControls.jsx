"use client"

import "./BuilderBoard.css"

export default function BuilderControls({ onUndo, onRedo, onClear, canUndo, canRedo }) {
  return (
    <div className="builder-controls">
      <div className="controls-left">
        <select className="set-selector">
          <option>Set 15</option>
        </select>
      </div>

      <div className="controls-center">
        <button className="control-btn enemy-btn">
          <span>Enemy</span>
          <span className="toggle-dot"></span>
        </button>
        <button className="control-btn names-btn">
          <span>Names</span>
          <span className="toggle-dot active"></span>
        </button>
        <button className="control-btn" onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
        <button className="control-btn" onClick={onRedo} disabled={!canRedo}>
          Redo
        </button>
        <button className="control-btn" onClick={onClear}>
          Clear
        </button>
        <button className="control-btn info-btn">ℹ</button>
      </div>

      <div className="controls-right">
        <button className="action-btn download">⬇</button>
        <button className="action-btn share">🔗</button>
        <button className="action-btn copy">📋</button>
      </div>
    </div>
  )
}
