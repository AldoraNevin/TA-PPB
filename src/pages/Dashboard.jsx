import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Dashboard() {
  const cards = [
    { title: 'Tierlists', to: '/tierlists', desc: 'Browse and create tierlists' },
    { title: 'Guides', to: '/guides', desc: 'Strategy guides and tips' },
    { title: 'Meta Read', to: '/metaread', desc: 'Community posts and meta' },
    { title: 'Study Hall', to: '/study-hall', desc: 'Learn and practice' },
    { title: 'Tierlist Maker', to: '/tierlist-maker', desc: 'Make your own tierlist' },
    { title: 'Builder', to: '/builder', desc: 'Drag & drop board builder' },
  ];

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <h1 className="text-4xl font-extrabold">TFT Academy</h1>
        <p className="text-slate-300 mt-2">Tools and resources for TFT fans — mobile & desktop friendly.</p>
      </header>

      <section className="menu-grid" aria-label="Main navigation">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card-clickable card-box">
            <div className="card-content">
              <div className="card-title">{c.title}</div>
              <div className="card-desc">{c.desc}</div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
