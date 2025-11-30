import React, { useEffect, useMemo, useState } from "react";
import supabase from "../services/supabaseClient";
import { Search, Filter } from 'lucide-react';
import "../styles/guides.css";

const IMAGES = import.meta.glob("../assets/champions/*", {
  eager: true,
  import: "default",
});

function resolveChampionImage(champ) {
  const base = champ.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const traits = champ.traits?.map((t) => t.toLowerCase()) || [];

  // PRIORITAS 1 — TRUE DAMAGE (NON-MOBILE)
  if (traits.some((t) => t.includes("true damage"))) {
    const tdDesktop = Object.keys(IMAGES).find((p) =>
      p.toLowerCase().includes(`tft10_${base}_truedamage.png`) &&
      !p.toLowerCase().includes("_mobile")
    );
    if (tdDesktop) return IMAGES[tdDesktop];

    const tdMobile = Object.keys(IMAGES).find((p) =>
      p.toLowerCase().includes(`tft10_${base}_truedamage_mobile.png`)
    );
    if (tdMobile) return IMAGES[tdMobile];
  }

  // PRIORITAS 2 — DEFAULT NON-MOBILE
  const desktop = Object.keys(IMAGES).find(
    (p) =>
      p.toLowerCase().includes(`tft10_${base}.png`) &&
      !p.toLowerCase().includes("mobile") &&
      !p.toLowerCase().includes("truedamage")
  );
  if (desktop) return IMAGES[desktop];

  // PRIORITAS 3 — fallback MOBILE
  const mobile = Object.keys(IMAGES).find((p) =>
    p.toLowerCase().includes(`tft10_${base}_mobile.png`)
  );
  if (mobile) return IMAGES[mobile];

  return null;
}

const costColors = {
  1: "cost-1",
  2: "cost-2",
  3: "cost-3",
  4: "cost-4",
  5: "cost-5",
};

// ========== KOMPONEN TAB AUGMENTS ==========
function AugmentsTab() {
  const [augments, setAugments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    fetchAugments();
  }, []);

  const fetchAugments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://raw.communitydragon.org/latest/cdragon/tft/en_us.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Filter hanya augments untuk Set 10
      const augmentsData = data.items.filter(item => {
        const apiName = item.apiName?.toLowerCase() || '';
        const name = item.name?.toLowerCase() || '';
        
        // Hanya ambil augments TFT10
        if (apiName.includes('tft10_augment') || 
            (apiName.includes('augment') && apiName.includes('tft10'))) {
          return item.name && item.desc;
        }
        
        return false;
      });
      
      setAugments(augmentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching augments:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getAugmentTier = (augment) => {
    const apiName = augment.apiName?.toLowerCase() || '';
    const name = augment.name?.toLowerCase() || '';
    
    // Deteksi tier dari nama atau tags
    if (apiName.includes('_3') || apiName.includes('iii') || name.includes('iii')) return 3;
    if (apiName.includes('_2') || apiName.includes('ii') || name.includes('ii')) return 2;
    if (apiName.includes('_1') || apiName.includes('i') || name.includes('i')) return 1;
    
    // Default tier 1
    return 1;
  };

  const filteredAugments = augments.filter(augment => {
    const matchesSearch = augment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         augment.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const tier = getAugmentTier(augment);
    const matchesTier = tierFilter === 'all' || tier === parseInt(tierFilter);
    
    return matchesSearch && matchesTier;
  });

  const tierColors = {
    1: 'augment-silver',
    2: 'augment-gold',
    3: 'augment-prismatic'
  };

  if (loading) {
    return (
      <div className="items-loading">
        <div className="spinner"></div>
        <p>Loading TFT Set 10 Augments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-error">
        <div className="error-icon">⚠️</div>
        <p>Error loading augments: {error}</p>
        <button onClick={fetchAugments} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="items-container">
      {/* Search and Filter */}
      <div className="guides-header-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search augments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tiers</option>
          <option value="1">Silver (Tier 1)</option>
          <option value="2">Gold (Tier 2)</option>
          <option value="3">Prismatic (Tier 3)</option>
        </select>

        <span className="item-count">{filteredAugments.length} augments</span>
      </div>

      {/* Augments Grid */}
      <div className="items-grid">
        {filteredAugments.map((augment, index) => {
          const tier = getAugmentTier(augment);
          const effects = augment.effects || {};
          
          return (
            <div key={index} className={`augment-card ${tierColors[tier]}`}>
              <div className="augment-header">
                <div className="augment-tier-badge">
                  <span className="tier-icon">
                    {tier === 3 ? '◆' : tier === 2 ? '●' : '○'}
                  </span>
                  <span className="tier-text">
                    {tier === 3 ? 'Prismatic' : tier === 2 ? 'Gold' : 'Silver'}
                  </span>
                </div>
              </div>
              
              <h3 className="augment-name">{augment.name}</h3>
              
              <p className="augment-desc">{augment.desc}</p>
              
              {Object.keys(effects).length > 0 && (
                <div className="augment-effects">
                  <p className="effects-label">Stats:</p>
                  <div className="effects-grid">
                    {Object.entries(effects).slice(0, 6).map(([key, value]) => {
                      if (value !== null && value !== undefined && !key.startsWith('{')) {
                        return (
                          <div key={key} className="effect-item">
                            <span className="effect-key">{key}:</span>
                            <span className="effect-value">
                              {typeof value === 'number' ? value.toFixed(2) : String(value)}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAugments.length === 0 && (
        <div className="no-results">
          <p>No augments found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

// ========== KOMPONEN UTAMA ==========
export default function Guides() {
  const [activeTab, setActiveTab] = useState('champions');
  const [allChamps, setAllChamps] = useState([]);
  const [query, setQuery] = useState("");
  const [costFilter, setCostFilter] = useState(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("champions")
        .select("*")
        .order("name");

      if (error) return;

      const mapped = data
        .map((c) => ({
          ...c,
          traits: Array.isArray(c.traits) ? c.traits : c.traits ? [c.traits] : [],
          img: resolveChampionImage(c),
        }))
        .filter((c) => c.img !== null);

      setAllChamps(mapped);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return allChamps.filter((c) => {
      const matchQuery =
        !query ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.traits.some((t) =>
          t.toLowerCase().includes(query.toLowerCase())
        );

      const matchCost = costFilter === null || c.cost === costFilter;

      return matchQuery && matchCost;
    });
  }, [allChamps, query, costFilter]);

  return (
    <div className="guides-wrapper">
      {/* TABS HEADER */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'champions' ? 'active' : ''}`}
          onClick={() => setActiveTab('champions')}
        >
          Champions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'augments' ? 'active' : ''}`}
          onClick={() => setActiveTab('augments')}
        >
          Augments
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'champions' ? (
        <>
          {/* HEADER FILTER */}
          <div className="guides-header-controls">
            <div className="search-box">
              <input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>

            {[1, 2, 3, 4, 5].map((cost) => (
              <button
                key={cost}
                className={`cost-btn ${costFilter === cost ? costColors[cost] : ""}`}
                onClick={() =>
                  setCostFilter(costFilter === cost ? null : cost)
                }
              >
                {cost}
              </button>
            ))}

            <button className="reset-btn" onClick={() => {setQuery(""); setCostFilter(null);}}>
              ↺
            </button>
          </div>

          {/* GRID */}
          <div className="champ-grid">
            {filtered.map((champ) => (
              <div
                key={champ.id}
                className={`champ-card border-${champ.cost}`}
              >
                <div className="champ-img-wrapper">
                  <img src={champ.img} alt={champ.name} className="champ-img" />

                  <div className="img-overlay" />

                  <div className="trait-list">
                    {champ.traits.map((t, i) => (
                      <div key={i} className="trait-item">
                        <span className="trait-icon">✦</span>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-bottom">
                  <span className="champ-name">{champ.name}</span>

                  <div className={`cost-tag cost-${champ.cost}`}>
                    <span className="dot">●</span> {champ.cost}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AugmentsTab />
      )}
    </div>
  );
}