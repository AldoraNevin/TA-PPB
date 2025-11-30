import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import "../styles/metaread.css";

export default function MetaRead() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
  const { data, error } = await supabase
    .from("metaread_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) setPosts(data);
}

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="metaread-page">

      {/* SEARCH BAR */}
      <div className="meta-search-wrapper">
        <input
          className="meta-search"
          placeholder="Cari build, tierlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER BUTTON */}
        <button
          className="meta-filter-btn"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <span>Filter & Sort</span>
          <i className="ri-arrow-down-s-line"></i>
        </button>

        {filterOpen && (
          <div className="meta-filter-dropdown">
            <button>Builder Only</button>
            <button>Tierlist Only</button>
            <button>Newest</button>
            <button>Oldest</button>
          </div>
        )}
      </div>

      {/* TITLE */}
      <h1 className="meta-title">Jelajahi Build & Tierlist</h1>
      <p className="meta-subtitle">
        Lihat build dan tierlist terbaru yang dibuat oleh pemain lain.
      </p>

      {/* GRID */}
      <div className="meta-grid">
        {filtered.map((post) => (
          <div className="meta-card" key={post.id}>

            {/* IMAGE */}
            <div className="meta-card-img">
              <img src={post.thumbnail} alt={post.title} />

              {/* LIKE & SHARE */}
              <div className="meta-actions">
                <button className="meta-icon-btn">❤️</button>
                <button className="meta-icon-btn">↗</button>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="meta-tag">
              {post.type === "builder" ? "Builder" : "Tierlist"}
            </div>

            {/* TITLE */}
            <div className="meta-card-title">{post.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
