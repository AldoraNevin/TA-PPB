import React, { useState, useMemo } from "react";
import html2canvas from "html2canvas";
import supabase from "../services/supabaseClient";
import { postTierlistToMetaRead } from "../services/metareadService";
import { getGuestId } from "../services/guestId";
import "../styles/Tierlistmaker.css";

export default function TierlistMaker() {
  const modules = import.meta.glob("../assets/champions/*_mobile.png", {
    eager: true,
    import: "default",
  });

  const champions = Object.entries(modules).map(([path, url]) => {
    const file = path.split("/").pop();
    const base = file.replace("_mobile.png", "");
    const id = base.replace(/^tft10_/, "");
    return { id, name: id, url };
  });

  const [title, setTitle] = useState("Your Title");
  const [rows, setRows] = useState([
    { tier: "S", color: "#ff2a2a", items: [] },
    { tier: "A", color: "#ff9e2a", items: [] },
    { tier: "B", color: "#ffee2a", items: [] },
    { tier: "C", color: "#2aff5f", items: [] },
    { tier: "X", color: "#2a5fff", items: [] },
  ]);

  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return champions;
    return champions.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const onDragStart = (e, champ) => {
    e.dataTransfer.setData("from", "toolbox");
    e.dataTransfer.setData("champ", JSON.stringify(champ));
  };

  const onDragStartTier = (e, tier, idx, champ) => {
    e.dataTransfer.setData("from", "tier");
    e.dataTransfer.setData("tier", tier);
    e.dataTransfer.setData("index", idx);
    e.dataTransfer.setData("champ", JSON.stringify(champ));
  };

  const onDrop = (e, tier) => {
    const from = e.dataTransfer.getData("from");
    const data = e.dataTransfer.getData("champ");
    if (!data) return;

    const champ = JSON.parse(data);

    if (from === "toolbox") {
      setRows((prev) =>
        prev.map((r) =>
          r.tier === tier ? { ...r, items: [...r.items, champ] } : r
        )
      );
    }

    if (from === "tier") {
      const fromTier = e.dataTransfer.getData("tier");
      const index = parseInt(e.dataTransfer.getData("index"));

      if (fromTier !== tier) {
        setRows((prev) =>
          prev.map((r) =>
            r.tier === fromTier
              ? { ...r, items: r.items.filter((_, i) => i !== index) }
              : r
          )
        );

        setRows((prev) =>
          prev.map((r) =>
            r.tier === tier ? { ...r, items: [...r.items, champ] } : r
          )
        );
      }
    }
  };

  const removeChampion = (tier, idx) => {
    setRows((prev) =>
      prev.map((r) =>
        r.tier === tier ? { ...r, items: r.items.filter((_, i) => i !== idx) } : r
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, { tier: "NEW", color: "#ffc842", items: [] }]);
  };

  const clearAll = () => {
    if (!confirm("Clear ALL?")) return;
    setRows((prev) => prev.map((r) => ({ ...r, items: [] })));
  };

  const saveTierlist = async () => {
    const guest_id = getGuestId();

    const { error } = await supabase.from("tierlists").insert({
      guest_id,
      title,
      data: rows,
      created_at: new Date().toISOString(),
    });

    alert(error ? "Failed to save" : "Saved!");
  };

  const shareTierlist = async () => {
    const guest_id = getGuestId();
    const metaTitle = prompt("Title for MetaRead:");
    if (!metaTitle) return;

    const { data, error } = await supabase
      .from("tierlists")
      .insert({
        guest_id,
        title: metaTitle,
        data: rows,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) return alert("Failed!");

    const tierlist_id = data[0].id;
    const link = `/tierlist/${tierlist_id}`;

    const ok = await postTierlistToMetaRead(metaTitle, rows, guest_id, link);

    alert(ok ? "Shared!" : "Failed!");
  };

  const exportPNG = async () => {
    const node = document.querySelector(".tierlist-left");
    const canvas = await html2canvas(node, {
      backgroundColor: "#000",
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `${title}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const tierIcons = ["S", "A", "B", "C", "D", "X", "OP", "BAD"];
  const tierColors = [
    "#ff2a2a", "#ff9e2a", "#ffee2a", "#2aff5f", "#2a5fff",
    "#ffffff", "#999999", "#000000"
  ];

  const updateTierLabel = (label) => {
    setRows((prev) =>
      prev.map((r) =>
        r.tier === activeTier.tier ? { ...r, tier: label } : r
      )
    );
    setActiveTier({ ...activeTier, tier: label });
  };

  const updateTierColor = (color) => {
    setRows((prev) =>
      prev.map((r) =>
        r.tier === activeTier.tier ? { ...r, color } : r
      )
    );
    setActiveTier({ ...activeTier, color });
  };

  const deleteTier = () => {
    setRows((prev) => prev.filter((r) => r.tier !== activeTier.tier));
    setActiveTier(null);
  };

  const clearTier = () => {
    setRows((prev) =>
      prev.map((r) =>
        r.tier === activeTier.tier ? { ...r, items: [] } : r
      )
    );
  };

  return (
    <div className="tierlist-page">
      <div className="title-row">
        <span className="tierlist-label">TIERLIST</span>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="tierlist-container">
        <div className="tierlist-left">
          {rows.map((row) => (
            <div key={row.tier} className="tier-row">
              <button
                className="tier-label"
                style={{ background: row.color }}
                onClick={() => setActiveTier(row)}
              >
                {row.tier}
              </button>

              <div
                className="tier-box"
                style={{ borderColor: row.color }}
                onDrop={(e) => onDrop(e, row.tier)}
                onDragOver={(e) => e.preventDefault()}
              >
                {row.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.url}
                    className="tier-champ"
                    draggable
                    onDragStart={(e) =>
                      onDragStartTier(e, row.tier, idx, item)
                    }
                    onContextMenu={(e) => {
                      e.preventDefault();
                      removeChampion(row.tier, idx);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="toolbox">
          <div className="toolbox-top">
            <div className="toolbox-title">Toolbox</div>

            <button className="toolbox-btn" onClick={addRow}>Add Row</button>
            <button className="toolbox-btn" onClick={clearAll}>Clear All</button>
            <button className="toolbox-btn" onClick={shareTierlist}>Share Tierlist</button>
          </div>

          <div className="toolbox-tabs">
            <button className="tab active">Champions</button>
            <button className="tool-btn" onClick={exportPNG}>Export PNG</button>
            <button className="tool-btn" onClick={saveTierlist}>Save Tierlist</button>
          </div>

          <input
            className="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="champ-grid">
            {filtered.map((ch) => (
              <div
                key={ch.id}
                className="champ-item"
                draggable
                onDragStart={(e) => onDragStart(e, ch)}
              >
                <img src={ch.url} alt={ch.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeTier && (
        <div
          className="tier-settings-overlay"
          onClick={() => setActiveTier(null)}
        >
          <div className="tier-settings" onClick={(e) => e.stopPropagation()}>
            <h2>Tier Settings</h2>

            <div className="ts-section">
              <h3>Icon:</h3>
              <div className="ts-icons">
                {tierIcons.map((icon) => (
                  <button
                    key={icon}
                    className="ts-icon-btn"
                    onClick={() => updateTierLabel(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="ts-section">
              <h3>Color:</h3>
              <div className="ts-colors">
                {tierColors.map((c) => (
                  <button
                    key={c}
                    className="ts-color"
                    style={{ background: c }}
                    onClick={() => updateTierColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="ts-actions">
              <button className="delete-btn2" onClick={deleteTier}>DELETE</button>
              <button className="clear-btn2" onClick={clearTier}>CLEAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
