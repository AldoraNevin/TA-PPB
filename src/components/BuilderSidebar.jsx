import "./BuilderBoard.css"

export default function BuilderSidebar({ position = "left" }) {
  return (
    <div className={`builder-sidebar ${position}`}>
      {position === "left" ? (
        <>
          <div className="sidebar-stats">
            <div className="stat-row">
              <span className="stat-icon">◇</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-row">
              <span className="stat-icon">◆</span>
              <span className="stat-value">0</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Augments</h3>
            <div className="augments-container">
              <button className="augment-add-btn">+</button>
            </div>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Components</h3>
            <div className="components-container"></div>
          </div>
        </>
      )}
    </div>
  )
}
