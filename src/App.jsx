// src/App.jsx
import { useEffect, useMemo, useState } from "react";

/**
 * Survivor Fantasy (Manual Mode)
 * - No Supabase
 * - No realtime / live draft
 * - Draft + eliminations are manually edited in the UI
 * - State persists in browser localStorage
 */

// ------------------------
// Scoring
// ------------------------
function calcPoints(eliminationOrder, totalCastaways) {
  if (!eliminationOrder || eliminationOrder <= 2) return 0;

  const lastThreeStart = totalCastaways - 2; // final 3 starts at (N-2)
  if (eliminationOrder >= lastThreeStart) {
    const basePoints = lastThreeStart - 3 + 1; // points at start of last 3
    const stepsIntoFinalThree = eliminationOrder - (lastThreeStart - 1);
    return basePoints + stepsIntoFinalThree * 2;
  }

  return eliminationOrder - 2;
}

// ------------------------
// Constants
// ------------------------
const TEAMS = [
  { id: 1, name: "Miloa", members: "Team Miller", color: "#c8922a" },
  { id: 2, name: "Jinga", members: "Team Mackereth", color: "#6a9fd8" },
  { id: 3, name: "Ojalu", members: "Team Lestan", color: "#6db86d" },
  { id: 4, name: "Weloki", members: "Team Wells", color: "#c46ab0" },
];

const SEASONS = [
  { id: 50, label: "Season 50", totalCastaways: 24, picksPerTeam: 5, undrafted: 4, current: true },
];

// Tribe colors for S50
const TRIBE_COLORS = {
  Vatu: "#a855c8", // purple
  Kalo: "#2ab8a0", // teal
  Cila: "#e8782a", // orange
};

// Your S50 cast list (as provided)
const S50_CASTAWAYS = [
  { name: "Angelina Keeley", tribe: "Vatu", bio: "3rd place, S37 David vs. Goliath", odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-angelina-keeley.jpg" },
  { name: "Aubry Bracco", tribe: "Vatu", bio: "Runner-up S32 Kaoh Rong · S34 Game Changers · S38 Edge of Extinction", odds: "-250", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-aubry-bracco.jpg" },
  { name: 'Benjamin "Coach" Wade', tribe: "Kalo", bio: "Runner-up S23 South Pacific · S18 Tocantins · S20 Heroes vs. Villains", odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-benjamin-coach-wade.jpg" },
  { name: "Charlie Davis", tribe: "Kalo", bio: "Runner-up S46", odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-charlie-davis.jpg" },
  { name: "Chrissy Hofbeck", tribe: "Kalo", bio: "Runner-up S35 Heroes vs. Healers vs. Hustlers", odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-chrissy-hofbeck.jpg" },
  { name: "Christian Hubicki", tribe: "Cila", bio: "7th place S37 David vs. Goliath", odds: "+800", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-christian-hubicki.jpg" },
  { name: "Cirie Fields", tribe: "Cila", bio: "5x player · S12 Panama · S16 Micronesia · S20 HvV · S34 Game Changers", odds: "+1200", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-cirie-fields.jpg" },
  { name: "Colby Donaldson", tribe: "Vatu", bio: "Runner-up S2 Australian Outback · S8 All-Stars · S20 Heroes vs. Villains", odds: "+5000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-colby-donaldson.jpg" },
  { name: "Dee Valladares", tribe: "Kalo", bio: "WINNER S45 ★", odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-dee-valladares.jpg" },
  { name: "Emily Flippen", tribe: "Cila", bio: "7th place S45", odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-emily-flippen.jpg" },
  { name: "Genevieve Mushaluk", tribe: "Vatu", bio: "5th place S47", odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-genevieve-mushaluk.jpg" },
  { name: "Jenna Lewis-Dougherty", tribe: "Cila", bio: "S1 Borneo · Final 3 S8 All-Stars", odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jenna-lewis-dougherty.jpg" },
  { name: "Joe Hunter", tribe: "Cila", bio: "3rd place S48", odds: "+700", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-joe-hunter.jpg" },
  { name: "Jonathan Young", tribe: "Kalo", bio: "4th place S42", odds: "+900", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jonathan-young.jpg" },
  { name: "Kamilla Karthigesu", tribe: "Kalo", bio: "4th place S48", odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kamilla-karthigesu.jpg" },
  { name: "Kyle Fraser", tribe: "Vatu", bio: "WINNER S48 ★", odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kyle-fraser.jpg" },
  { name: "Mike White", tribe: "Kalo", bio: "Runner-up S37 David vs. Goliath · Creator of The White Lotus", odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-mike-white.jpg" },
  { name: "Ozzy Lusth", tribe: "Cila", bio: "Runner-up S13 Cook Islands · 4x player total", odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-ozzy-lutsh.jpg" },
  { name: "Q Burdette", tribe: "Vatu", bio: "8th place S46", odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-quintavius-q-burdette.jpg" },
  { name: "Rick Devens", tribe: "Cila", bio: "4th place S38 Edge of Extinction", odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rick-devens.jpg" },
  { name: "Rizo Velovic", tribe: "Vatu", bio: "4th place S49", odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rizo-velovic.jpg" },
  { name: "Savannah Louie", tribe: "Cila", bio: "WINNER S49 ★", odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-savannah-louie.jpg" },
  { name: "Stephenie LaGrossa", tribe: "Vatu", bio: "Runner-up S11 Guatemala · S10 Palau · S20 Heroes vs. Villains", odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-stephanie-lagrossa-kendrick.jpg" },
  { name: "Tiffany Ervin", tribe: "Kalo", bio: "8th place S46", odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-tiffany-ervin.jpg" },
];

function buildCastawaysForSeason(seasonId) {
  if (seasonId === 50) {
    return S50_CASTAWAYS.map((c, idx) => ({
      id: idx + 1,
      name: c.name,
      tribe: c.tribe || "",
      bio: c.bio || "",
      odds: c.odds || "",
      photo: c.photo || "",
      draftedBy: null, // team id
      eliminationOrder: null, // 1..N
    }));
  }
  return [];
}

// ------------------------
// Local storage helpers
// ------------------------
function storageKey(seasonId) {
  return `sf_manual_state_s${seasonId}`;
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

// ------------------------
// UI helpers
// ------------------------
function oddsColor(odds) {
  if (!odds) return "#555";
  if (odds.startsWith("-")) return "#c8922a";
  const num = parseInt(odds.replace("+", ""), 10);
  if (Number.isNaN(num)) return "#aaa";
  if (num <= 1000) return "#6db86d";
  if (num <= 2500) return "#6a9fd8";
  return "#aaa";
}

function proxyPhoto(url) {
  if (!url) return "";
  return "https://images.weserv.nl/?url=" + encodeURIComponent(url) + "&w=400&output=jpg";
}

function Photo({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className={className + "-placeholder"}><span>👤</span></div>;
  return <img src={proxyPhoto(src)} alt={alt} className={className} onError={() => setErr(true)} loading="lazy" />;
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ------------------------
// Styles
// ------------------------
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #f0ebe0; font-family: 'DM Mono', monospace; }
  .app { min-height: 100vh; background: #0a0a0a; background-image: radial-gradient(ellipse at 20% 20%, rgba(180,120,40,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(120,60,20,0.06) 0%, transparent 60%); }
  .header { border-bottom: 1px solid rgba(180,120,40,0.3); padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: rgba(10,10,10,0.95); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(8px); flex-wrap: wrap; }
  .logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: #c8922a; letter-spacing: 0.05em; white-space: nowrap; }
  .logo span { color: #f0ebe0; font-weight: 700; }
  .nav { display: flex; gap: 0.25rem; flex-wrap: wrap; }
  .nav-btn { background: none; border: 1px solid transparent; color: #888; padding: 0.4rem 0.75rem; font-family: 'DM Mono', monospace; font-size: 0.68rem; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.2s; border-radius: 2px; white-space: nowrap; }
  .nav-btn:hover { color: #f0ebe0; border-color: rgba(180,120,40,0.3); }
  .nav-btn.active { color: #c8922a; border-color: rgba(200,146,42,0.5); background: rgba(200,146,42,0.06); }
  .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
  .season-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .season-label { font-size: 0.62rem; color: #999; letter-spacing: 0.1em; text-transform: uppercase; margin-right: 0.5rem; }
  .season-btn { font-family: 'DM Mono', monospace; font-size: 0.65rem; padding: 0.35rem 0.75rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); background: none; color: #aaa; transition: all 0.15s; }
  .season-btn.active { background: rgba(200,146,42,0.1); border-color: rgba(200,146,42,0.4); color: #c8922a; }
  .season-btn:hover:not(.active) { color: #f0ebe0; border-color: rgba(255,255,255,0.2); }
  .live-pill { display: inline-block; font-size: 0.55rem; padding: 0.1rem 0.35rem; border-radius: 2px; background: rgba(200,146,42,0.15); color: #c8922a; border: 1px solid rgba(200,146,42,0.35); letter-spacing: 0.08em; text-transform: uppercase; vertical-align: middle; margin-left: 0.3rem; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #f0ebe0; margin-bottom: 0.3rem; }
  .page-subtitle { font-size: 0.68rem; color: #999; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem; }
  .section-title { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .leaderboard { display: flex; flex-direction: column; gap: 1rem; }
  .lb-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1.25rem 1.5rem; display: grid; grid-template-columns: 2.5rem 1fr auto; align-items: center; gap: 1.5rem; }
  .lb-card.first { border-color: rgba(200,146,42,0.4); background: rgba(200,146,42,0.06); }
  .lb-rank { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; color: #2a2a2a; }
  .lb-card.first .lb-rank { color: #c8922a; }
  .lb-tribe { font-size: 1rem; font-weight: 500; margin-bottom: 0.15rem; }
  .lb-members { font-size: 0.63rem; color: #999; margin-bottom: 0.5rem; }
  .lb-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .c-tag { font-size: 0.6rem; padding: 0.15rem 0.45rem; border-radius: 2px; letter-spacing: 0.05em; text-transform: uppercase; }
  .c-tag.alive { background: rgba(80,180,80,0.1); color: #6db86d; border: 1px solid rgba(80,180,80,0.2); }
  .c-tag.eliminated { background: rgba(255,255,255,0.03); color: #888; border: 1px solid rgba(255,255,255,0.07); text-decoration: line-through; }
  .lb-score { text-align: right; }
  .lb-pts { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; color: #c8922a; line-height: 1; }
  .lb-pts-label { font-size: 0.58rem; color: #888; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.1rem; }
  .castaways-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 0.75rem; margin-bottom: 2rem; }
  .castaway-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; position: relative; transition: border-color 0.2s; }
  .castaway-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .castaway-card.alive::after { background: #6db86d; }
  .castaway-card.eliminated { opacity: 0.45; }
  .castaway-card.undrafted::after { background: #2a2a2a; }
  .castaway-card:hover { border-color: rgba(200,146,42,0.3); }
  .c-photo { width: 100%; aspect-ratio: 3/4; object-fit: cover; object-position: top; display: block; background: #111; }
  .c-photo-placeholder { width: 100%; aspect-ratio: 3/4; background: #111; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #bbb; }
  .c-info { padding: 0.65rem 0.75rem; }
  .c-name { font-size: 0.75rem; font-weight: 500; margin-bottom: 0.15rem; line-height: 1.3; }
  .c-bio { font-size: 0.56rem; color: #aaa; margin-bottom: 0.35rem; line-height: 1.4; }
  .c-row { display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem; }
  .c-tribe { font-size: 0.58rem; }
  .c-odds { font-size: 0.62rem; font-weight: 500; }
  .c-status { font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .c-status.alive { color: #6db86d; }
  .c-status.eliminated { color: #999; }
  .c-status.undrafted { color: #888; }
  .c-pts { font-family: 'Playfair Display', serif; font-size: 1rem; color: #c8922a; font-weight: 900; margin-top: 0.15rem; }
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.5rem 0; }
  .action-btn { font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 0.5rem 1rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.15s; border: 1px solid; margin-bottom: 1rem; background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #aaa; }
  .action-btn.primary { background: rgba(200,146,42,0.15); border-color: rgba(200,146,42,0.4); color: #c8922a; }
  .action-btn.primary:hover { background: rgba(200,146,42,0.25); }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: #1a1a1a; border: 1px solid rgba(200,146,42,0.4); color: #f0ebe0; padding: 0.75rem 1.25rem; border-radius: 4px; font-size: 0.75rem; z-index: 999; animation: slideIn 0.2s ease; }
  @keyframes slideIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1rem 1.25rem; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .field { display:flex; flex-direction:column; gap:0.35rem; }
  .label { font-size:0.58rem; letter-spacing:0.1em; text-transform:uppercase; color:#999; }
  .select, .input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    color: #f0ebe0;
    border-radius: 3px;
    padding: 0.55rem 0.65rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    outline: none;
  }
  .row { display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; }
  .hint { font-size:0.65rem; color:#777; line-height:1.4; }
  @media (max-width: 700px) {
    .container { padding: 1rem; }
    .grid2 { grid-template-columns: 1fr; }
    .lb-card { padding: 0.9rem 1rem; grid-template-columns: 2rem 1fr auto; gap: 0.75rem; }
    .lb-rank { font-size: 1.1rem; }
    .lb-pts { font-size: 1.6rem; }
  }
`;

// ------------------------
// App
// ------------------------
export default function App() {
  const [page, setPage] = useState("leaderboard");
  const [selectedSeason, setSelectedSeason] = useState(50);
  const [toast, setToast] = useState(null);

  // Manual features toggles
  const [showOdds, setShowOdds] = useState(false);

  // Core state (manual)
  const [castawaysBySeason, setCastawaysBySeason] = useState(() => ({
    50: buildCastawaysForSeason(50),
  }));
  const [draftOrderBySeason, setDraftOrderBySeason] = useState(() => ({
    50: TEAMS.map(t => t.id), // default
  }));

  const season = useMemo(() => SEASONS.find(s => s.id === selectedSeason), [selectedSeason]);
  const castaways = castawaysBySeason[selectedSeason] || [];
  const draftOrder = draftOrderBySeason[selectedSeason] || TEAMS.map(t => t.id);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // Load from localStorage when season changes (or first mount)
  useEffect(() => {
    const raw = localStorage.getItem(storageKey(selectedSeason));
    const saved = raw ? safeJsonParse(raw) : null;

    if (saved?.castaways && Array.isArray(saved.castaways)) {
      setCastawaysBySeason(prev => ({ ...prev, [selectedSeason]: saved.castaways }));
    } else {
      // initialize if nothing saved
      setCastawaysBySeason(prev => ({ ...prev, [selectedSeason]: buildCastawaysForSeason(selectedSeason) }));
    }

    if (saved?.draftOrder && Array.isArray(saved.draftOrder) && saved.draftOrder.length) {
      setDraftOrderBySeason(prev => ({ ...prev, [selectedSeason]: saved.draftOrder }));
    } else {
      setDraftOrderBySeason(prev => ({ ...prev, [selectedSeason]: TEAMS.map(t => t.id) }));
    }

    if (typeof saved?.showOdds === "boolean") setShowOdds(saved.showOdds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason]);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const payload = {
      castaways: castawaysBySeason[selectedSeason],
      draftOrder: draftOrderBySeason[selectedSeason],
      showOdds,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey(selectedSeason), JSON.stringify(payload));
  }, [castawaysBySeason, draftOrderBySeason, selectedSeason, showOdds]);

  // Derived: team scores
  const scores = useMemo(() => {
    if (!season) return [];
    const rows = TEAMS.map(team => {
      const picks = castaways.filter(c => c.draftedBy === team.id);
      const total = picks.reduce((sum, c) => sum + (c.eliminationOrder ? calcPoints(c.eliminationOrder, season.totalCastaways) : 0), 0);
      return { ...team, picks, total };
    });
    return rows.sort((a, b) => b.total - a.total);
  }, [castaways, season]);

  const resetSeason = () => {
    setCastawaysBySeason(prev => ({ ...prev, [selectedSeason]: buildCastawaysForSeason(selectedSeason) }));
    setDraftOrderBySeason(prev => ({ ...prev, [selectedSeason]: TEAMS.map(t => t.id) }));
    setShowOdds(false);
    showToast(`Season ${selectedSeason} reset.`);
  };

  if (!season) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#c8922a" }}>
        Season not found
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        <header className="header">
          <div className="logo">SURVIVOR<span>FANTASY</span></div>
          <nav className="nav">
            {["leaderboard", "castaways", "draft", "points", "admin"].map(p => (
              <button
                key={p}
                className={`nav-btn ${page === p ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </nav>
        </header>

        <div className="container">
          <div className="season-bar">
            <span className="season-label">Season</span>
            {SEASONS.map(s => (
              <button
                key={s.id}
                className={`season-btn ${selectedSeason === s.id ? "active" : ""}`}
                onClick={() => setSelectedSeason(s.id)}
              >
                {s.id}{s.current && <span className="live-pill">manual</span>}
              </button>
            ))}
          </div>

          {page === "leaderboard" && (
            <Leaderboard
              season={season}
              scores={scores}
              castaways={castaways}
              showOdds={showOdds}
            />
          )}

          {page === "castaways" && (
            <Castaways
              season={season}
              castaways={castaways}
              showOdds={showOdds}
            />
          )}

          {page === "draft" && (
            <DraftManual
              season={season}
              castaways={castaways}
              draftOrder={draftOrder}
              setDraftOrder={(order) => setDraftOrderBySeason(prev => ({ ...prev, [selectedSeason]: order }))}
              setCastaways={(updater) =>
                setCastawaysBySeason(prev => ({
                  ...prev,
                  [selectedSeason]: typeof updater === "function" ? updater(prev[selectedSeason] || []) : updater,
                }))
              }
              showToast={showToast}
              showOdds={showOdds}
            />
          )}

          {page === "points" && (
            <Points season={season} castaways={castaways} />
          )}

          {page === "admin" && (
            <AdminManual
              season={season}
              castaways={castaways}
              draftOrder={draftOrder}
              showOdds={showOdds}
              setShowOdds={setShowOdds}
              resetSeason={resetSeason}
              setDraftOrder={(order) => setDraftOrderBySeason(prev => ({ ...prev, [selectedSeason]: order }))}
              setCastaways={(updater) =>
                setCastawaysBySeason(prev => ({
                  ...prev,
                  [selectedSeason]: typeof updater === "function" ? updater(prev[selectedSeason] || []) : updater,
                }))
              }
              showToast={showToast}
            />
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// ------------------------
// Views
// ------------------------
function Leaderboard({ season, scores, castaways, showOdds }) {
  const eliminated = castaways.filter(c => c.eliminationOrder).length;
  const remaining = season.totalCastaways - eliminated;

  return (
    <div>
      <div className="page-title">Leaderboard</div>
      <div className="page-subtitle">
        Season {season.id} · {season.totalCastaways} Castaways · {eliminated} Eliminated · {remaining} Remaining · manual mode
      </div>

      <div className="leaderboard">
        {scores.map((team, i) => (
          <div key={team.id} className={`lb-card ${i === 0 ? "first" : ""}`}>
            <div className="lb-rank">{i + 1}</div>

            <div style={{ flex: 1 }}>
              <div className="lb-tribe" style={{ color: team.color }}>
                {team.name} <span style={{ fontSize: "0.63rem", color: "#999", fontWeight: 400 }}>{team.members}</span>
              </div>

              <div className="lb-tags">
                {team.picks.map(c => (
                  <span key={c.id} className={`c-tag ${c.eliminationOrder ? "eliminated" : "alive"}`}>
                    {c.name}
                    {c.eliminationOrder
                      ? ` · ${calcPoints(c.eliminationOrder, season.totalCastaways)}pt`
                      : (showOdds && c.odds ? ` · ${c.odds}` : "")}
                  </span>
                ))}
                {team.picks.length === 0 && (
                  <span style={{ fontSize: "0.65rem", color: "#aaa" }}>No picks yet — assign on Draft page</span>
                )}
              </div>
            </div>

            <div className="lb-score">
              <div className="lb-pts" style={{ color: i === 0 ? "#c8922a" : team.color }}>{team.total}</div>
              <div className="lb-pts-label">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Castaways({ season, castaways, showOdds }) {
  const alive = castaways.filter(c => !c.eliminationOrder && c.draftedBy);
  const undrafted = castaways.filter(c => !c.eliminationOrder && !c.draftedBy);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a, b) => b.eliminationOrder - a.eliminationOrder);

  return (
    <div>
      <div className="page-title">Castaways</div>
      <div className="page-subtitle">
        Season {season.id} · {alive.length} Active · {undrafted.length} Undrafted · {eliminated.length} Eliminated
      </div>

      <div className="section-title">Tribes</div>
      <div className="row" style={{ marginBottom: "1.25rem" }}>
        <span className="hint"><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: TRIBE_COLORS.Vatu, marginRight: 6 }} /> Vatu</span>
        <span className="hint"><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: TRIBE_COLORS.Kalo, marginRight: 6 }} /> Kalo</span>
        <span className="hint"><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 99, background: TRIBE_COLORS.Cila, marginRight: 6 }} /> Cila</span>
      </div>

      {alive.length > 0 && (
        <>
          <div className="section-title">Active — {alive.length}</div>
          <div className="castaways-grid">
            {alive.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}
          </div>
        </>
      )}

      {undrafted.length > 0 && (
        <>
          <div className="section-title">Undrafted — {undrafted.length}</div>
          <div className="castaways-grid">
            {undrafted.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}
          </div>
        </>
      )}

      {eliminated.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title">Eliminated — {eliminated.length}</div>
          <div className="castaways-grid">
            {eliminated.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}
          </div>
        </>
      )}
    </div>
  );
}

function CastawayCard({ c, season, showOdds }) {
  const team = TEAMS.find(t => t.id === c.draftedBy);
  const pts = c.eliminationOrder ? calcPoints(c.eliminationOrder, season.totalCastaways) : null;
  const cls = c.eliminationOrder ? "eliminated" : (c.draftedBy ? "alive" : "undrafted");

  return (
    <div className={`castaway-card ${cls}`}>
      <Photo src={c.photo} alt={c.name} className="c-photo" />
      <div className="c-info">
        <div className="c-name">{c.name}</div>
        {c.bio && <div className="c-bio">{c.bio}</div>}

        {c.tribe && (
          <div style={{ marginBottom: "0.25rem" }}>
            <span style={{
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.1rem 0.4rem",
              borderRadius: "2px",
              background: `${(TRIBE_COLORS[c.tribe] || "#aaa")}22`,
              color: TRIBE_COLORS[c.tribe] || "#aaa",
              border: `1px solid ${(TRIBE_COLORS[c.tribe] || "#aaa")}55`,
            }}>
              {c.tribe}
            </span>
          </div>
        )}

        <div className="c-row">
          <div className="c-tribe" style={{ color: team ? team.color : "#888" }}>{team ? team.name : "Undrafted"}</div>
          {c.odds && showOdds && <div className="c-odds" style={{ color: oddsColor(c.odds) }}>{c.odds}</div>}
        </div>

        <div className={`c-status ${cls}`} style={{ marginTop: "0.2rem" }}>
          {c.eliminationOrder ? `Elim. #${c.eliminationOrder}` : (c.draftedBy ? "Active" : "—")}
        </div>

        {pts !== null && <div className="c-pts">{pts} pts</div>}
      </div>
    </div>
  );
}

function DraftManual({ season, castaways, draftOrder, setDraftOrder, setCastaways, showToast, showOdds }) {
  const teamById = useMemo(() => Object.fromEntries(TEAMS.map(t => [t.id, t])), []);
  const undrafted = castaways.filter(c => !c.draftedBy);

  const setPickTeam = (castawayId, teamIdStr) => {
    const teamId = teamIdStr ? parseInt(teamIdStr, 10) : null;
    setCastaways(prev => prev.map(c => (c.id === castawayId ? { ...c, draftedBy: teamId } : c)));
  };

  const clearAllPicks = () => {
    setCastaways(prev => prev.map(c => ({ ...c, draftedBy: null })));
    showToast("All draft picks cleared.");
  };

  const moveOrder = (teamId, dir) => {
    const idx = draftOrder.indexOf(teamId);
    if (idx < 0) return;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= draftOrder.length) return;
    const copy = [...draftOrder];
    [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
    setDraftOrder(copy);
  };

  return (
    <div>
      <div className="page-title">Draft</div>
      <div className="page-subtitle">
        Manual draft · Set draft order + assign picks (no snake automation)
      </div>

      <div className="grid2" style={{ marginBottom: "1.25rem" }}>
        <div className="panel">
          <div className="section-title">Draft Order</div>
          <div className="hint" style={{ marginBottom: "0.75rem" }}>
            This is just for display (and for your own tracking). You can reorder anytime.
          </div>

          {draftOrder.map((tid, i) => {
            const t = teamById[tid];
            return (
              <div key={tid} className="row" style={{ justifyContent: "space-between", padding: "0.45rem 0", borderBottom: i < draftOrder.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div className="row">
                  <div style={{ width: 26, color: "#999" }}>#{i + 1}</div>
                  <div style={{ color: t.color, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ color: "#777", fontSize: "0.68rem" }}>{t.members}</div>
                </div>
                <div className="row">
                  <button className="action-btn" style={{ marginBottom: 0 }} onClick={() => moveOrder(tid, -1)}>↑</button>
                  <button className="action-btn" style={{ marginBottom: 0 }} onClick={() => moveOrder(tid, +1)}>↓</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <div className="section-title">Quick Actions</div>
          <div className="row">
            <button className="action-btn" onClick={clearAllPicks}>Clear All Picks</button>
            <button className="action-btn primary" onClick={() => showToast("Draft saved (auto-saved in browser).")}>Save</button>
          </div>
          <div className="hint">
            Draft picks are saved automatically in your browser (localStorage). Redeploy is fine — just use the same browser/device.
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="section-title">Assign Picks</div>
        <div className="hint" style={{ marginBottom: "0.75rem" }}>
          For each castaway, choose the team that drafted them. Leave blank for undrafted.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
          {castaways.map(c => {
            const team = c.draftedBy ? teamById[c.draftedBy] : null;
            return (
              <div key={c.id} className="row" style={{ justifyContent: "space-between", padding: "0.6rem 0.75rem", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, background: "rgba(255,255,255,0.02)" }}>
                <div className="row" style={{ minWidth: 0 }}>
                  <div style={{ width: 34, color: "#777", fontSize: "0.7rem" }}>#{c.id}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", color: "#f0ebe0" }}>{c.name}</div>
                    <div className="row" style={{ gap: "0.5rem" }}>
                      {c.tribe && (
                        <span style={{ fontSize: "0.6rem", color: TRIBE_COLORS[c.tribe] || "#999" }}>{c.tribe}</span>
                      )}
                      {showOdds && c.odds && (
                        <span style={{ fontSize: "0.6rem", color: oddsColor(c.odds) }}>{c.odds}</span>
                      )}
                      {team && (
                        <span style={{ fontSize: "0.6rem", color: team.color }}>{team.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <select
                    className="select"
                    value={c.draftedBy ?? ""}
                    onChange={(e) => setPickTeam(c.id, e.target.value)}
                  >
                    <option value="">Undrafted</option>
                    {TEAMS.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hint" style={{ marginTop: "0.75rem" }}>
          Undrafted: {undrafted.length} · Drafted: {castaways.length - undrafted.length}
        </div>
      </div>
    </div>
  );
}

function AdminManual({ season, castaways, draftOrder, showOdds, setShowOdds, resetSeason, setDraftOrder, setCastaways, showToast }) {
  const [confirmReset, setConfirmReset] = useState(false);

  const nextElim = useMemo(() => {
    const used = new Set(castaways.filter(c => c.eliminationOrder).map(c => c.eliminationOrder));
    for (let i = 1; i <= season.totalCastaways; i++) {
      if (!used.has(i)) return i;
    }
    return season.totalCastaways + 1;
  }, [castaways, season.totalCastaways]);

  const teamById = useMemo(() => Object.fromEntries(TEAMS.map(t => [t.id, t])), []);

  const setElimOrder = (castawayId, valueStr) => {
    const v = valueStr.trim() === "" ? null : parseInt(valueStr, 10);
    const safe = Number.isFinite(v) ? v : null;

    setCastaways(prev => prev.map(c => (c.id === castawayId ? { ...c, eliminationOrder: safe } : c)));
  };

  const clearAllElims = () => {
    setCastaways(prev => prev.map(c => ({ ...c, eliminationOrder: null })));
    showToast("All eliminations cleared.");
  };

  const alive = castaways.filter(c => !c.eliminationOrder);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a, b) => a.eliminationOrder - b.eliminationOrder);

  const normalizeDraftOrder = () => {
    // Ensure draftOrder contains all teams exactly once
    const unique = [...new Set(draftOrder)].filter(id => TEAMS.some(t => t.id === id));
    const missing = TEAMS.map(t => t.id).filter(id => !unique.includes(id));
    setDraftOrder([...unique, ...missing]);
    showToast("Draft order normalized.");
  };

  return (
    <div>
      <div className="page-title">Admin</div>
      <div className="page-subtitle">
        Manual commissioner controls · next elimination #{nextElim <= season.totalCastaways ? nextElim : "—"}
      </div>

      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="section-title">Controls</div>

        <div className="row" style={{ marginBottom: "0.75rem" }}>
          <button
            className="action-btn"
            style={{
              marginBottom: 0,
              background: showOdds ? "rgba(200,146,42,0.12)" : "rgba(255,255,255,0.03)",
              borderColor: showOdds ? "rgba(200,146,42,0.5)" : "rgba(255,255,255,0.1)",
              color: showOdds ? "#c8922a" : "#aaa",
            }}
            onClick={() => setShowOdds(o => !o)}
          >
            {showOdds ? "👁 Odds Visible" : "🙈 Odds Hidden"}
          </button>

          <button className="action-btn" style={{ marginBottom: 0 }} onClick={normalizeDraftOrder}>
            Normalize Draft Order
          </button>

          <button className="action-btn" style={{ marginBottom: 0 }} onClick={clearAllElims}>
            Clear All Eliminations
          </button>

          {!confirmReset ? (
            <button
              className="action-btn"
              style={{ marginBottom: 0, background: "rgba(200,60,60,0.08)", borderColor: "rgba(200,60,60,0.3)", color: "#cc6060" }}
              onClick={() => setConfirmReset(true)}
            >
              ↺ Reset Season
            </button>
          ) : (
            <>
              <span className="hint" style={{ color: "#cc6060" }}>Confirm reset?</span>
              <button
                className="action-btn"
                style={{ marginBottom: 0, background: "rgba(200,60,60,0.2)", borderColor: "rgba(200,60,60,0.5)", color: "#ff8080" }}
                onClick={() => { resetSeason(); setConfirmReset(false); }}
              >
                Yes, Reset
              </button>
              <button className="action-btn" style={{ marginBottom: 0 }} onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </>
          )}
        </div>

        <div className="hint">
          Tip: You can type elimination order numbers directly. Keep them unique (1..{season.totalCastaways}). If you mess up, just change the number.
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="section-title">Elimination Entry</div>
          <div className="hint" style={{ marginBottom: "0.75rem" }}>
            For each castaway, set elimination order (blank = still alive).
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
            {castaways.map(c => {
              const team = c.draftedBy ? teamById[c.draftedBy] : null;
              return (
                <div key={c.id} className="row" style={{ justifyContent: "space-between", padding: "0.55rem 0.65rem", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem" }}>{c.name}</div>
                    <div className="row" style={{ gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.62rem", color: c.tribe ? (TRIBE_COLORS[c.tribe] || "#777") : "#777" }}>{c.tribe || "—"}</span>
                      <span style={{ fontSize: "0.62rem", color: team ? team.color : "#777" }}>{team ? team.name : "Undrafted"}</span>
                      {showOdds && c.odds && <span style={{ fontSize: "0.62rem", color: oddsColor(c.odds) }}>{c.odds}</span>}
                      {c.eliminationOrder && (
                        <span style={{ fontSize: "0.62rem", color: "#c8922a" }}>
                          {calcPoints(c.eliminationOrder, season.totalCastaways)} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <input
                      className="input"
                      style={{ width: 120 }}
                      placeholder="Elim #"
                      value={c.eliminationOrder ?? ""}
                      onChange={(e) => setElimOrder(c.id, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">Summary</div>

          <div className="row" style={{ justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="hint">Alive</span>
            <span style={{ color: "#6db86d" }}>{alive.length}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="hint">Eliminated</span>
            <span style={{ color: "#999" }}>{eliminated.length}</span>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <div className="section-title">Elimination List</div>
            {eliminated.length === 0 ? (
              <div className="hint">No eliminations entered yet.</div>
            ) : (
              <div style={{ display: "grid", gap: "0.35rem" }}>
                {eliminated.map(c => (
                  <div key={c.id} className="row" style={{ justifyContent: "space-between" }}>
                    <span className="hint">#{c.eliminationOrder} · {c.name}</span>
                    <span style={{ color: "#c8922a" }}>{calcPoints(c.eliminationOrder, season.totalCastaways)} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="divider" />

          <div className="section-title">Draft Order (Current)</div>
          <div className="hint">
            {draftOrder.map((tid, i) => {
              const t = teamById[tid];
              return (
                <span key={tid} style={{ color: t?.color || "#aaa" }}>
                  {i ? " → " : ""}{t?.name || tid}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Points({ season, castaways }) {
  const total = season.totalCastaways;

  const elimMap = {};
  castaways.forEach(c => {
    if (c.eliminationOrder !== null && c.eliminationOrder !== undefined) {
      elimMap[c.eliminationOrder] = c;
    }
  });

  const rows = Array.from({ length: total }, (_, i) => {
    const eliminationOrder = i + 1;
    const finishPlace = total - eliminationOrder + 1;
    const points = calcPoints(eliminationOrder, total);
    const castaway = elimMap[eliminationOrder];

    return { finishPlace, eliminationOrder, points, castaway };
  }).sort((a, b) => a.finishPlace - b.finishPlace);

  return (
    <div>
      <div className="page-title">Points</div>
      <div className="page-subtitle">
        Season {season.id} · Points by finish position
      </div>

      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "6rem 7rem 1fr",
          background: "rgba(255,255,255,0.04)",
          padding: "0.6rem 1rem",
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#999",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div>Finish</div>
          <div>Points</div>
          <div>Castaway</div>
        </div>

        {rows.map((r, idx) => (
          <div key={r.finishPlace} style={{
            display: "grid",
            gridTemplateColumns: "6rem 7rem 1fr",
            padding: "0.55rem 1rem",
            fontSize: "0.72rem",
            borderBottom: idx < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
            alignItems: "center",
          }}>
            <div style={{ color: "#f0ebe0", fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
              {ordinal(r.finishPlace)}
            </div>

            <div style={{ color: "#c8922a", fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
              {r.points}
            </div>

            <div style={{ color: r.castaway ? "#f0ebe0" : "#777", fontSize: "0.68rem" }}>
              {r.castaway ? r.castaway.name : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
