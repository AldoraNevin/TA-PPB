import React, { useEffect, useMemo, useState } from "react";
import supabase from "../services/supabaseClient";
import TraitsPanel from "../components/TraitsPanel";
import "../styles/Builder.css";

import { saveBuild } from "../services/builderService";
import { postBuilderToMetaRead } from "../services/metareadService";
import { getGuestId } from "../services/guestId";

export default function Builder() {
  const USER_ID = getGuestId();

  const rows = 4;
  const cols = 7;

  const [championDB, setChampionDB] = useState([]);
  const [placed, setPlaced] = useState({});
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [showNames, setShowNames] = useState(true);
  const [search, setSearch] = useState("");

  // Load saved build (from profile)
  useEffect(() => {
    const loaded = localStorage.getItem("loadedBuild");
    if (loaded) {
      setPlaced(JSON.parse(loaded));
      localStorage.removeItem("loadedBuild");
    }
  }, []);

  // Import champion images
  const modules = import.meta.glob("../assets/champions/*_mobile.png", {
    eager: true,
    import: "default",
  });

  // Load champion DB
  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase.from("champions").select("*");
      if (!error && active) setChampionDB(data || []);
    }

    load();
    return () => (active = false);
  }, []);

  // Merge DB + images
  const champions = useMemo(() => {
    return Object.entries(modules)
      .map(([path, url]) => {
        const file = path.split("/").pop();
        const base = file.replace("_mobile.png", "");
        const id = base.replace(/^tft10_/, "");

        const entry = championDB.find(
          (c) => c.name?.toLowerCase() === id.toLowerCase()
        );

        return {
          id,
          name: entry?.name || id,
          cost: entry?.cost ?? 1,
          traits: entry?.traits || [],
          url,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [championDB]);

  const filteredChampions = useMemo(() => {
    if (!search.trim()) return champions;
    return champions.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, champions]);

  // Trait counts
  const activeTraits = useMemo(() => {
    const counts = {};
    Object.values(placed).forEach((ch) => {
      ch.traits.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }, [placed]);

  // Save build to profile
  const handleSave = async () => {
    const name = prompt("Name your build:");
    if (!name) return;

    const ok = await saveBuild(name, placed);
    alert(ok ? "Build saved!" : "Failed to save");
  };

  // Post to MetaRead
  const handlePostMetaRead = async () => {
    const title = prompt("Title for MetaRead:");
    if (!title) return;

    const ok = await postBuilderToMetaRead(
      title,
      placed,
      USER_ID,
      `/builder/${USER_ID}`
    );

    alert(ok ? "Posted to MetaRead!" : "Failed to post");
  };

  // Dragging logic
  const onDragStartFromList = (e, champ) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type: "list", champ })
    );
  };

  const onDragStartFromCell = (e, idx) => {
    if (!placed[idx]) return;
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type: "cell", idx, champ: placed[idx] })
    );
  };

  const onDropToCell = (e, idx) => {
    e.preventDefault();
    setDragOverIdx(null);

    const payload = JSON.parse(e.dataTransfer.getData("application/json"));
    if (!payload) return;

    setPlaced((prev) => {
      const next = { ...prev };

      if (payload.type === "list") next[idx] = payload.champ;

      if (payload.type === "cell") {
        const from = payload.idx;
        if (from !== idx) {
          delete next[from];
          next[idx] = payload.champ;
        }
      }

      return next;
    });
  };

  return (
    <div className="builder-page">

      {/* TOP CONTROLS */}
      <div className="builder-top-controls">
        <div className="center-controls">
          <button className="btn small" onClick={() => setShowNames(!showNames)}>
            Names
            <span className={`toggle-dot ${showNames ? "on" : "off"}`}>
              <span className="knob" />
            </span>
          </button>

          <button className="btn small" onClick={() => setPlaced({})}>
            Clear
          </button>
        </div>

        <div className="right-controls">
          <button className="icon-btn" onClick={handleSave}>💾</button>
          <button className="icon-btn" onClick={handlePostMetaRead}>📤</button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="builder-main">

        <TraitsPanel activeTraits={activeTraits} placed={placed} />

        <div className="board-panel">
          <div className="board-wrapper">
            {Array.from({ length: rows }).map((_, r) => (
              <div
                key={r}
                className="board-row"
                style={{
                  marginLeft: r % 2 ? 48 : 0,
                  marginTop: r === 0 ? 0 : -22,
                }}
              >
                {Array.from({ length: cols }).map((_, c) => {
                  const idx = r * cols + c;
                  const champ = placed[idx];

                  return (
                    <div
                      key={idx}
                      className={`hex ${dragOverIdx === idx ? "hex-dragover" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIdx(idx);
                      }}
                      onDragLeave={() => setDragOverIdx(null)}
                      onDrop={(e) => onDropToCell(e, idx)}
                    >
                      <div className="hex-inner">
                        {champ ? (
                          <div
                            draggable
                            onDragStart={(e) => onDragStartFromCell(e, idx)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setPlaced((p) => {
                                const n = { ...p };
                                delete n[idx];
                                return n;
                              });
                            }}
                            className="placed-champ"
                          >
                            <img src={champ.url} alt={champ.name} />
                            {showNames && (
                              <div className="champ-name-label">{champ.name}</div>
                            )}
                          </div>
                        ) : (
                          <div className="hex-empty" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="panel-block">
            <div className="panel-title">Components</div>
            <div className="panel-empty">No components</div>
          </div>
        </div>
      </div>

      {/* CHAMP LIST */}
      <div className="champ-selector">
        <div className="selector-row">
          <input
            className="search-input"
            placeholder="Search All"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="champ-grid">
          {filteredChampions.map((ch) => (
            <div
              key={ch.id}
              className="champ-item"
              draggable
              onDragStart={(e) => onDragStartFromList(e, ch)}
            >
              <div className="thumb">
                <img src={ch.url} alt={ch.name} />
              </div>
              <div className="champ-label">{ch.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
