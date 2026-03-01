import { useState, useCallback, useEffect } from "react";

function calcPoints(eliminationOrder, totalCastaways) {
  if (eliminationOrder <= 2) return 0;
  const lastThreeStart = totalCastaways - 2;
  if (eliminationOrder >= lastThreeStart) {
    const basePoints = lastThreeStart - 3 + 1;
    const stepsIntoFinalThree = eliminationOrder - (lastThreeStart - 1);
    return basePoints + stepsIntoFinalThree * 2;
  }
  return eliminationOrder - 2;
}

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

// Real S50 cast — photos sourced from entertainmentnow.com (CBS official press photos)
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

const S46_CASTAWAYS = ["Alba","Benicio","Cora","Dex","Elara","Fox","Gia","Holt","Ivy","Jase","Kira","Leo","Mara","Nox","Oslo","Petra","Quin","Reef"].map(n=>({name:n,bio:"",odds:"",photo:""}));
const S45_CASTAWAYS = ["Ash","Blaze","Cleo","Drake","Eve","Finn","Gale","Hawk","Iris","Jett","Koda","Luna","Moss","Nova","Oak","Pax","Rio","Sage"].map(n=>({name:n,bio:"",odds:"",photo:""}));

const SEASON_PICKS = {
  50: { 1:[], 2:[], 3:[], 4:[] }, // No pre-assigned picks — draft is fresh
  46: { 1:[1,5,9,13], 2:[2,6,10,14], 3:[3,7,11,15], 4:[4,8,12,16] },
  45: { 1:[1,5,9,13], 2:[2,6,10,14], 3:[3,7,11,15], 4:[4,8,12,16] },
};

const CASTAWAY_DATA = { 50: S50_CASTAWAYS, 46: S46_CASTAWAYS, 45: S45_CASTAWAYS };

function buildCastaways(seasonId) {
  const picks = SEASON_PICKS[seasonId];
  const isPast = seasonId !== 50;
  return CASTAWAY_DATA[seasonId].map((c, i) => {
    const id = i + 1;
    let draftedBy = null;
    for (const [tid, tp] of Object.entries(picks)) {
      if (tp.includes(id)) { draftedBy = parseInt(tid); break; }
    }
    return { id, name: c.name, bio: c.bio||"", odds: c.odds||"", photo: c.photo||"", tribe: c.tribe||"", eliminationOrder: isPast ? id : null, draftedBy };
  });
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// Convert American odds to implied probability (0–1)
function oddsToImplied(odds) {
  if (!odds) return 0;
  if (odds.startsWith("-")) {
    const n = Math.abs(parseInt(odds));
    return n / (n + 100);
  }
  const n = parseInt(odds.replace("+", ""));
  return 100 / (n + 100);
}

// ---- FANTASY ODDS ENGINE ----
function getNormalizedProbs(castaways) {
  const total = castaways.reduce((s, c) => s + oddsToImplied(c.odds || "+5000"), 0);
  return castaways.map(c => ({
    ...c,
    prob: total > 0 ? oddsToImplied(c.odds || "+5000") / total : 1 / castaways.length,
  }));
}

function simulateSeason(castawaysWithProbs, totalCastaways) {
  let pool = castawaysWithProbs.map(c => ({ ...c }));
  const result = {}; // id -> eliminationOrder

  for (let elim = 1; elim <= totalCastaways; elim++) {
    const totalRemProb = pool.reduce((s, c) => s + c.prob, 0);
    const loserWeights = pool.map(c => {
      const relProb = totalRemProb > 0 ? c.prob / totalRemProb : 1 / pool.length;
      return Math.max(0.001, 1 - relProb);
    });
    const totalLoserWeight = loserWeights.reduce((s, w) => s + w, 0);
    let r = Math.random() * totalLoserWeight;
    let chosen = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= loserWeights[i];
      if (r <= 0) { chosen = i; break; }
    }
    result[pool[chosen].id] = elim;
    pool.splice(chosen, 1);
  }
  return result;
}

function runFantasySimulation(castaways, teamDraftMap, totalCastaways, N = 5000) {
  const withProbs = getNormalizedProbs(castaways);
  const teamIds = [...new Set(Object.values(teamDraftMap).filter(Boolean))];

  const winCounts = {};
  teamIds.forEach(tid => { winCounts[tid] = 0; });

  const totalPts = {};
  teamIds.forEach(tid => { totalPts[tid] = 0; });

  for (let i = 0; i < N; i++) {
    const seasonResult = simulateSeason(withProbs, totalCastaways);
    const teamScores = {};
    teamIds.forEach(tid => { teamScores[tid] = 0; });

    castaways.forEach(c => {
      if (!c.draftedBy) return;
      const elimOrder = c.eliminationOrder || seasonResult[c.id];
      if (elimOrder) teamScores[c.draftedBy] = (teamScores[c.draftedBy] || 0) + calcPoints(elimOrder, totalCastaways);
    });

    const maxScore = Math.max(...Object.values(teamScores));
    const winners = teamIds.filter(tid => teamScores[tid] === maxScore);
    winners.forEach(tid => { winCounts[tid] += 1 / winners.length; });
    teamIds.forEach(tid => { totalPts[tid] += teamScores[tid]; });
  }

  const result = {};
  teamIds.forEach(tid => {
    result[tid] = {
      winPct: Math.round((winCounts[tid] / N) * 100),
      projectedScore: Math.round(totalPts[tid] / N),
    };
  });
  return result;
}

function oddsColor(odds) {
  if (!odds) return "#555";
  if (odds.startsWith("-")) return "#c8922a";
  const num = parseInt(odds.replace("+",""));
  if (num <= 1000) return "#6db86d";
  if (num <= 2500) return "#6a9fd8";
  return "#aaa";
}

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
  .header-commissioner { font-size: 0.65rem; color: #999; letter-spacing: 0.06em; white-space: nowrap; }
  .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
  @media (max-width: 600px) {
    .header { padding: 0.75rem 1rem; flex-direction: column; align-items: flex-start; gap: 0.6rem; }
    .logo { font-size: 1.1rem; }
    .nav { width: 100%; justify-content: flex-start; }
    .nav-btn { padding: 0.35rem 0.6rem; font-size: 0.62rem; letter-spacing: 0.05em; }
    .header-commissioner { display: none; }
    .container { padding: 1rem; }
    .page-title { font-size: 1.5rem; }
    .page-subtitle { font-size: 0.6rem; margin-bottom: 1.25rem; }
    .season-bar { margin-bottom: 1.25rem; padding-bottom: 1rem; gap: 0.35rem; }
    .lb-card { padding: 0.9rem 1rem; grid-template-columns: 2rem 1fr auto; gap: 0.75rem; }
    .lb-rank { font-size: 1.1rem; }
    .lb-pts { font-size: 1.6rem; }
    .lb-pts-label { font-size: 0.52rem; }
    .lb-tribe { font-size: 0.85rem; }
    .castaways-grid { grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap: 0.5rem; }
    .draft-board { grid-template-columns: 1fr; }
    .draft-layout { grid-template-columns: 1fr; }
    .draft-available-grid { grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); }
    .admin-grid { grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); }
    .pos-selector { flex-direction: column; gap: 0.4rem; }
    .rand-row { flex-wrap: wrap; gap: 0.5rem; }
    .draft-status-bar { flex-direction: column; align-items: flex-start; gap: 0.4rem; }
  }
  .season-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .season-label { font-size: 0.62rem; color: #999; letter-spacing: 0.1em; text-transform: uppercase; margin-right: 0.5rem; }
  .season-btn { font-family: 'DM Mono', monospace; font-size: 0.65rem; padding: 0.35rem 0.75rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); background: none; color: #aaa; transition: all 0.15s; }
  .season-btn.active { background: rgba(200,146,42,0.1); border-color: rgba(200,146,42,0.4); color: #c8922a; }
  .season-btn:hover:not(.active) { color: #f0ebe0; border-color: rgba(255,255,255,0.2); }
  .live-pill { display: inline-block; font-size: 0.55rem; padding: 0.1rem 0.35rem; border-radius: 2px; background: rgba(200,146,42,0.15); color: #c8922a; border: 1px solid rgba(200,146,42,0.35); letter-spacing: 0.08em; text-transform: uppercase; vertical-align: middle; margin-left: 0.3rem; }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #f0ebe0; margin-bottom: 0.3rem; }
  .page-subtitle { font-size: 0.68rem; color: #999; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem; }
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
  .section-title { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
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

  /* DRAFT POSITION SELECTOR */
  .draft-phase { background: rgba(200,146,42,0.06); border: 1px solid rgba(200,146,42,0.25); border-radius: 6px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .draft-phase-title { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #c8922a; margin-bottom: 1rem; }
  .randomizer-result { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .rand-row { display: flex; align-items: center; gap: 1rem; padding: 0.6rem 0.75rem; border-radius: 3px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
  .rand-pos { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 900; color: #c8922a; width: 1.5rem; }
  .rand-team { font-size: 0.8rem; font-weight: 500; }
  .rand-sub { font-size: 0.62rem; color: #aaa; }
  .pos-selector { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
  .pos-btn { font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 0.4rem 0.85rem; border-radius: 3px; cursor: pointer; letter-spacing: 0.06em; border: 1px solid; transition: all 0.15s; }
  .pos-btn.available { background: rgba(200,146,42,0.1); border-color: rgba(200,146,42,0.35); color: #c8922a; }
  .pos-btn.available:hover { background: rgba(200,146,42,0.2); }
  .pos-btn.taken { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); color: #888; cursor: not-allowed; }

  /* DRAFT */
  .draft-status-bar { background: rgba(200,146,42,0.07); border: 1px solid rgba(200,146,42,0.2); border-radius: 4px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
  .on-clock { font-size: 0.85rem; }
  .round-info { font-size: 0.65rem; color: #aaa; letter-spacing: 0.08em; text-transform: uppercase; }
  .draft-layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
  .draft-available-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.5rem; }
  .draft-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; transition: all 0.15s; cursor: pointer; }
  .draft-card:hover { border-color: rgba(200,146,42,0.4); background: rgba(200,146,42,0.05); }
  .draft-card.pre-elim { opacity: 0.3; cursor: not-allowed; }
  .draft-card.pre-elim:hover { border-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); }
  .dc-photo { width: 100%; aspect-ratio: 1; object-fit: cover; object-position: top; background: #111; display: block; }
  .dc-photo-ph { width: 100%; aspect-ratio: 1; background: #111; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #bbb; }
  .dc-info { padding: 0.5rem 0.6rem; }
  .dc-name { font-size: 0.68rem; font-weight: 500; margin-bottom: 0.15rem; line-height: 1.3; }
  .dc-odds { font-size: 0.58rem; }
  .dc-pick-btn { display: block; width: 100%; font-family: 'DM Mono', monospace; font-size: 0.6rem; padding: 0.35rem; background: rgba(200,146,42,0.15); border: none; border-top: 1px solid rgba(200,146,42,0.25); color: #c8922a; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.15s; }
  .dc-pick-btn:hover { background: rgba(200,146,42,0.25); }
  .team-picks-block { margin-bottom: 1.25rem; }
  .team-picks-label { font-size: 0.68rem; letter-spacing: 0.06em; margin-bottom: 0.5rem; font-weight: 500; }
  .pick-row { display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.7rem; gap: 0.5rem; }
  .pick-photo-sm { width: 28px; height: 28px; border-radius: 2px; object-fit: cover; object-position: top; flex-shrink: 0; }
  .empty-pick { color: #bbb; font-style: italic; font-size: 0.67rem; }
  .action-btn { font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 0.5rem 1rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.15s; border: 1px solid; margin-bottom: 1rem; }
  .action-btn.primary { background: rgba(200,146,42,0.15); border-color: rgba(200,146,42,0.4); color: #c8922a; }
  .action-btn.primary:hover { background: rgba(200,146,42,0.25); }

  /* ADMIN */
  .admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 0.65rem; }
  .admin-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; }
  .admin-card-photo { width: 100%; aspect-ratio: 4/3; object-fit: cover; object-position: top; display: block; background: #111; }
  .admin-card-body { padding: 0.75rem; }
  .admin-card-name { font-size: 0.78rem; font-weight: 500; margin-bottom: 0.1rem; }
  .admin-card-bio { font-size: 0.56rem; color: #999; margin-bottom: 0.35rem; line-height: 1.4; }
  .admin-card-tribe { font-size: 0.6rem; margin-bottom: 0.6rem; }
  .elim-controls { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
  .elim-btn { font-family: 'DM Mono', monospace; font-size: 0.63rem; padding: 0.28rem 0.55rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.05em; transition: all 0.15s; border: 1px solid; }
  .elim-btn.eliminate { background: rgba(200,60,60,0.08); border-color: rgba(200,60,60,0.3); color: #cc6060; }
  .elim-btn.eliminate:hover { background: rgba(200,60,60,0.18); }
  .elim-btn.restore { background: rgba(80,180,80,0.08); border-color: rgba(80,180,80,0.3); color: #6db86d; }
  .elim-btn.restore:hover { background: rgba(80,180,80,0.18); }
  .elim-info { font-size: 0.62rem; color: #999; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: #1a1a1a; border: 1px solid rgba(200,146,42,0.4); color: #f0ebe0; padding: 0.75rem 1.25rem; border-radius: 4px; font-size: 0.75rem; z-index: 999; animation: slideIn 0.2s ease; }
  @keyframes slideIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .odds-key { display: flex; gap: 1rem; font-size: 0.62rem; color: #999; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .odds-key span { display: flex; align-items: center; gap: 0.3rem; }
  .odds-dot { width: 8px; height: 8px; border-radius: 50%; }
`;

// ------------------------
// App
// ------------------------
export default function App() {
  const [page, setPage] = useState("leaderboard");
  const [selectedSeason, setSelectedSeason] = useState(50);
  const [castawaysBySeason, setCastawaysBySeason] = useState({ 50: buildCastaways(50), 46: buildCastaways(46), 45: buildCastaways(45) });
  const [nextElimBySeason, setNextElimBySeason] = useState({ 50: 1, 46: 19, 45: 19 });
  const [draftStateBySeason, setDraftStateBySeason] = useState({ 50: { randomOrder: null, draftPositions: {} }, 46: { randomOrder: null, draftPositions: {} }, 45: { randomOrder: null, draftPositions: {} } });
  const [toast, setToast] = useState(null);
  const [showOdds, setShowOdds] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [historySeason, setHistorySeason] = useState(null);
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    try {
      console.log("ORIGIN:", window.location.origin);

      const castawaysRaw = localStorage.getItem("castaways-state");
      const elimRaw = localStorage.getItem("elim-state");
      const draftRaw = localStorage.getItem("draft-state");
      const oddsRaw = localStorage.getItem("show-odds");

      console.log("LS has keys?", {
        "castaways-state": !!castawaysRaw,
        "elim-state": !!elimRaw,
        "draft-state": !!draftRaw,
        "show-odds": !!oddsRaw,
      });

      if (castawaysRaw) setCastawaysBySeason(JSON.parse(castawaysRaw));
      if (elimRaw) setNextElimBySeason(JSON.parse(elimRaw));
      if (draftRaw) setDraftStateBySeason(JSON.parse(draftRaw));
      if (oddsRaw) setShowOdds(JSON.parse(oddsRaw));
    } catch (e) {
      console.warn("Load from localStorage failed:", e);
    }
    setStorageLoaded(true);
  }, []);

  // Persist whenever draft/castaway state changes (after initial load)
  useEffect(() => {
    if (!storageLoaded) return;
    try {
      localStorage.setItem("draft-state", JSON.stringify(draftStateBySeason));
      localStorage.setItem("castaways-state", JSON.stringify(castawaysBySeason));
    } catch (e) {
      console.warn("Save failed (draft/castaways):", e);
    }
  }, [draftStateBySeason, castawaysBySeason, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    try {
      localStorage.setItem("elim-state", JSON.stringify(nextElimBySeason));
    } catch (e) {
      console.warn("Save failed (elim):", e);
    }
  }, [nextElimBySeason, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    try {
      localStorage.setItem("show-odds", JSON.stringify(showOdds));
    } catch (e) {
      console.warn("Save failed (show-odds):", e);
    }
  }, [showOdds, storageLoaded]);

  const season = SEASONS.find(s => s.id === selectedSeason);
  const castaways = castawaysBySeason[selectedSeason];
  const nextElimOrder = nextElimBySeason[selectedSeason];
  const draftState = draftStateBySeason[selectedSeason];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const setCastaways = useCallback((updater) => {
    setCastawaysBySeason(prev => ({
      ...prev,
      [selectedSeason]: typeof updater === "function" ? updater(prev[selectedSeason]) : updater
    }));
  }, [selectedSeason]);

  const setDraftState = useCallback((updater) => {
    setDraftStateBySeason(prev => ({
      ...prev,
      [selectedSeason]: typeof updater === "function" ? updater(prev[selectedSeason]) : updater
    }));
  }, [selectedSeason]);

  if (!storageLoaded) return (
    <div style={{
      minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#0a0a0a",color:"#c8922a",fontFamily:"'DM Mono',monospace",fontSize:"0.75rem",
      letterSpacing:"0.2em",textTransform:"uppercase"
    }}>
      Loading…
    </div>
  );

  const resetSeason = () => {
    setCastawaysBySeason(prev => ({ ...prev, [selectedSeason]: buildCastaways(selectedSeason) }));
    setNextElimBySeason(prev => ({ ...prev, [selectedSeason]: selectedSeason !== 50 ? 19 : 1 }));
    setDraftStateBySeason(prev => ({ ...prev, [selectedSeason]: { randomOrder: null, draftPositions: {} } }));
    showToast(`Season ${selectedSeason} has been reset.`);
  };

  const buildDraftOrder = () => {
    const pos = draftState.draftPositions;
    if (Object.keys(pos).length < TEAMS.length) return TEAMS.map(t => t.id);
    return [...TEAMS].sort((a,b) => (pos[a.id]||99) - (pos[b.id]||99)).map(t => t.id);
  };

  const undoLastDraftPick = () => {
    const picked = castaways.filter(c => c.draftedBy !== null);
    if (picked.length === 0) { showToast("No picks to undo."); return; }

    const draftOrder = buildDraftOrder();
    const sequence = [];
    for (let round = 1; round <= season.picksPerTeam; round++) {
      const ro = round % 2 === 0 ? [...draftOrder].reverse() : draftOrder;
      ro.forEach(tid => sequence.push({ teamId: tid, round }));
    }

    const pickedCount = picked.length;
    const lastPickTeamId = pickedCount > 0 ? sequence[pickedCount - 1]?.teamId : null;
    if (!lastPickTeamId) { showToast("Nothing to undo."); return; }

    const teamPicks = castaways.filter(c => c.draftedBy === lastPickTeamId);
    const lastPick = teamPicks[teamPicks.length - 1];
    if (!lastPick) { showToast("Nothing to undo."); return; }

    setCastaways(prev => prev.map(c => c.id === lastPick.id ? { ...c, draftedBy: null } : c));
    showToast(`Undid: ${lastPick.name} returned to draft pool.`);
  };

  const eliminate = (id) => {
    const c = castaways.find(c => c.id === id);
    const pts = calcPoints(nextElimOrder, season.totalCastaways);
    setCastaways(prev => prev.map(cc => cc.id === id ? { ...cc, eliminationOrder: nextElimOrder } : cc));
    setNextElimBySeason(prev => ({ ...prev, [selectedSeason]: prev[selectedSeason] + 1 }));
    showToast(`${c.name} eliminated (#${nextElimOrder}) — ${pts} pts`);
  };

  const restore = (id) => {
    const c = castaways.find(c => c.id === id);
    const order = c.eliminationOrder;
    setCastaways(prev => prev.map(cc => {
      if (cc.id === id) return { ...cc, eliminationOrder: null };
      if (cc.eliminationOrder !== null && cc.eliminationOrder > order) return { ...cc, eliminationOrder: cc.eliminationOrder - 1 };
      return cc;
    }));
    setNextElimBySeason(prev => ({ ...prev, [selectedSeason]: prev[selectedSeason] - 1 }));
    showToast(`${c.name} restored`);
  };

  const randomizeOrder = () => {
    const order = shuffleArray(TEAMS.map(t => t.id));
    setDraftState({ randomOrder: order, draftPositions: {} });
    showToast(`Randomizer rolled! ${TEAMS.find(t=>t.id===order[0]).name} picks their draft position first.`);
  };

  const selectPosition = (teamId, position) => {
    const taken = Object.values(draftState.draftPositions).includes(position);
    if (taken) return;
    setDraftState(prev => {
      const updated = { ...prev, draftPositions: { ...prev.draftPositions, [teamId]: position } };
      const allPicked = TEAMS.every(t => updated.draftPositions[t.id] !== undefined);
      if (allPicked) showToast("All teams have chosen their draft positions! Draft order locked.");
      return updated;
    });
    const team = TEAMS.find(t => t.id === teamId);
    showToast(`${team.name} takes pick position ${position}!`);
  };

  const scores = TEAMS.map(team => {
    const picks = castaways.filter(c => c.draftedBy === team.id);
    const total = picks.reduce((sum, c) => sum + (c.eliminationOrder ? calcPoints(c.eliminationOrder, season.totalCastaways) : 0), 0);
    return { ...team, picks, total };
  }).sort((a,b) => b.total - a.total);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">SURVIVOR<span>FANTASY</span></div>
          <nav className="nav">
            {["leaderboard","castaways","draft","admin"].map(p => (
              <button
                key={p}
                className={`nav-btn ${page===p?"active":""}`}
                onClick={() => { setPage(p); setHistorySeason(null); }}
              >
                {p}
              </button>
            ))}
          </nav>
          <div className="header-commissioner">Commissioner</div>
        </header>

        <div className="container">
          <div className="season-bar">
            <span className="season-label">Season</span>
            {SEASONS.map(s => (
              <button
                key={s.id}
                className={`season-btn ${selectedSeason===s.id && !historySeason?"active":""}`}
                onClick={() => { setSelectedSeason(s.id); setHistorySeason(null); }}
              >
                {s.id}{s.current && <span className="live-pill">live</span>}
              </button>
            ))}
            <button className={`season-btn ${historySeason===49?"active":""}`} onClick={() => { setHistorySeason(49); setPage("leaderboard"); }}>49</button>
            <button className={`season-btn ${historySeason===48?"active":""}`} onClick={() => { setHistorySeason(48); setPage("leaderboard"); }}>48</button>
            <button className={`season-btn ${historySeason===47?"active":""}`} onClick={() => { setHistorySeason(47); setPage("leaderboard"); }}>47</button>
            <button className={`season-btn ${historySeason===46?"active":""}`} onClick={() => { setHistorySeason(46); setPage("leaderboard"); }}>46</button>
            <button className={`season-btn ${historySeason===45?"active":""}`} onClick={() => { setHistorySeason(45); setPage("leaderboard"); }}>45</button>
            <button className={`season-btn ${historySeason===44?"active":""}`} onClick={() => { setHistorySeason(44); setPage("leaderboard"); }}>44</button>
            <button className={`season-btn ${historySeason===43?"active":""}`} onClick={() => { setHistorySeason(43); setPage("leaderboard"); }}>43</button>
          </div>

          {page==="leaderboard" && !historySeason && (
            <Leaderboard scores={scores} season={season} castaways={castaways} showOdds={showOdds} />
          )}
          {page==="leaderboard" && historySeason && (
            <SeasonHistory season={historySeason} onBack={() => setHistorySeason(null)} />
          )}
          {page==="castaways" && (
            <Castaways castaways={castaways} season={season} showOdds={showOdds} />
          )}
          {page==="draft" && (
            <Draft
              castaways={castaways}
              season={season}
              draftState={draftState}
              randomizeOrder={randomizeOrder}
              selectPosition={selectPosition}
              buildDraftOrder={buildDraftOrder}
              setCastaways={setCastaways}
              showToast={showToast}
              undoLastDraftPick={undoLastDraftPick}
              showOdds={showOdds}
              resetSeason={resetSeason}
            />
          )}

          {page==="admin" && !adminUnlocked && (
            <div style={{maxWidth:"340px",margin:"4rem auto",padding:"2rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"4px"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:900,marginBottom:"0.4rem"}}>Commissioner Access</div>
              <div style={{fontSize:"0.68rem",color:"#999",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"1.5rem"}}>Enter password to continue</div>
              <input
                type="password"
                value={adminPassword}
                onChange={e => { setAdminPassword(e.target.value); setAdminError(false); }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    if (adminPassword === "Ottffsse9") { setAdminUnlocked(true); setAdminPassword(""); setAdminError(false); }
                    else { setAdminError(true); setAdminPassword(""); }
                  }
                }}
                placeholder="Password"
                style={{
                  width:"100%",
                  background:"rgba(255,255,255,0.05)",
                  border:`1px solid ${adminError ? "#cc6060" : "rgba(255,255,255,0.1)"}`,
                  borderRadius:"3px",
                  padding:"0.6rem 0.75rem",
                  color:"#f0ebe0",
                  fontFamily:"'DM Mono',monospace",
                  fontSize:"16px",
                  marginBottom:"0.75rem",
                  outline:"none"
                }}
                autoFocus
              />
              {adminError && <div style={{fontSize:"0.65rem",color:"#cc6060",marginBottom:"0.75rem"}}>Incorrect password</div>}
              <button className="action-btn primary" style={{width:"100%",justifyContent:"center"}} onClick={() => {
                if (adminPassword === "Ottffsse9") { setAdminUnlocked(true); setAdminPassword(""); setAdminError(false); }
                else { setAdminError(true); setAdminPassword(""); }
              }}>Unlock</button>
              <button className="action-btn" style={{width:"100%",justifyContent:"center",marginTop:"0.5rem",marginBottom:0}} onClick={() => { setPage("leaderboard"); setAdminPassword(""); setAdminError(false); }}>Cancel</button>
            </div>
          )}

          {page==="admin" && adminUnlocked && (
            <Admin
              castaways={castaways}
              nextElimOrder={nextElimOrder}
              season={season}
              eliminate={eliminate}
              restore={restore}
              resetSeason={resetSeason}
              showOdds={showOdds}
              setShowOdds={setShowOdds}
            />
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ------------------------
// Photo helper
// ------------------------
function proxyPhoto(url) {
  if (!url) return "";
  return "https://images.weserv.nl/?url=" + encodeURIComponent(url) + "&w=400&output=jpg";
}

function Photo({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className={className + "-placeholder"}><span>👤</span></div>;
  return <img src={proxyPhoto(src)} alt={alt} className={className} onError={() => setErr(true)} loading="lazy" />;
}

// ------------------------
// Historical Results (FULL)
// ------------------------

// Season 45 historical results
const S45_RESULTS = {
  season: 45,
  teamScores: [
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 121, winner: true },
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 118 },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 51  },
  ],
  placements: [
    { place: 1,  points: 38, player: "Dee",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 28, player: "Austin",   team: "Miloa",  teamColor: "#c8922a" },
    { place: 3,  points: 19, player: "Drew",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 4,  points: 44, player: "Julie",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 5,  points: 20, player: "Katura",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 6,  points: 13, player: "Niki",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 7,  points: 11, player: "Emily",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 8,  points: 20, player: "Bruce",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 9,  points: 11, player: "Kellie",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 10, points: 12, player: "Kendra",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 33, player: "Jake",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 12, points: 32, player: "Kaleb",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 13, points: 10, player: "J.",       team: "NA",     teamColor: "#777" },
    { place: 14, points: 6,  player: "Brando",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 3,  player: "Sean",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 16, points: 0,  player: "Sabiyah",  team: "Ojalu",  teamColor: "#6db86d" },
    { place: 17, points: -1, player: "Brandon",  team: "NA",     teamColor: "#777" },
    { place: 18, points: 0,  player: "Hanna",    team: "NA",     teamColor: "#777" },
  ],
};

// Season 44 historical results
const S44_RESULTS = {
  season: 44,
  teamScores: [
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 56, winner: true },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 40 },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 24 },
  ],
  placements: [
    { place: 1,  points: 21, player: "Yam Yam",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 2,  points: 17, player: "Heidi",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 3,  points: 14, player: "Carolyn",  team: "Ojalu",  teamColor: "#6db86d" },
    { place: 4,  points: 12, player: "Carson",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 5,  points: 11, player: "Lauren",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 6,  points: 10, player: "Jaime",    team: "NA",     teamColor: "#777" },
    { place: 7,  points: 9,  player: "Danny",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 8,  points: 8,  player: "Frannie",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 9,  points: 7,  player: "Kane",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 10, points: 6,  player: "Brandon",  team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 5,  player: "MattB",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 12, points: 4,  player: "Josh",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 13, points: 3,  player: "MattG",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 2,  player: "Sarah",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 1,  player: "Claire",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 16, points: 0,  player: "Helen",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 17, points: 0,  player: "Maddy",    team: "NA",     teamColor: "#777" },
    { place: 18, points: 0,  player: "Bruce",    team: "NA",     teamColor: "#777" },
  ],
};

// Season 43 historical results
const S43_RESULTS = {
  season: 43,
  teamScores: [
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 56, winner: true },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 40 },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 35 },
  ],
  placements: [
    { place: 1,  points: 22, player: "Gabler",   team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 18, player: "Cassidy",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 3,  points: 15, player: "Owen",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 4,  points: 13, player: "Jesse",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 5,  points: 12, player: "Karla",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 6,  points: 11, player: "Cody",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 7,  points: 10, player: "Sami",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 8,  points: 9,  player: "Noelle",   team: "NA",     teamColor: "#777" },
    { place: 9,  points: 8,  player: "Ryan",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 10, points: 7,  player: "James",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 6,  player: "Jeanine",  team: "NA",     teamColor: "#777" },
    { place: 12, points: 5,  player: "Dwight",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 13, points: 4,  player: "Elie",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 14, points: 3,  player: "Geo",      team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 2,  player: "Lindsay",  team: "Ojalu",  teamColor: "#6db86d" },
    { place: 16, points: 1,  player: "Nneka",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 17, points: 0,  player: "Justine",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 18, points: 0,  player: "Morriah",  team: "NA",     teamColor: "#777" },
  ],
};

const S46_RESULTS = {
  season: 46,
  teamScores: [
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 76, winner: true },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 72 },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 53 },
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 29 },
  ],
  placements: [
    { place: 1,  points: 29, player: "Kenzie",  team: "Weloki", teamColor: "#c46ab0" },
    { place: 2,  points: 27, player: "Charlie", team: "Miloa",  teamColor: "#c8922a" },
    { place: 3,  points: 23, player: "Ben",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 4,  points: 19, player: "Liz",     team: "NA",     teamColor: "#777" },
    { place: 5,  points: 21, player: "Maria",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 6,  points: 24, player: "Q",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 7,  points: 21, player: "Venus",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 8,  points: 10, player: "Tiffany", team: "Miloa",  teamColor: "#c8922a" },
    { place: 9,  points: 20, player: "Hunter",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 10, points: 16, player: "Tevin",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 13, player: "Soda",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 12, points: 9,  player: "Tim",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 13, points: 5,  player: "Jem",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 0,  player: "Moriah",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 15, points: 3,  player: "Bhanu",   team: "Miloa",  teamColor: "#c8922a" },
    { place: 16, points: 5,  player: "Randen",  team: "Weloki", teamColor: "#c46ab0" },
    { place: 17, points: 4,  player: "Jess",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 18, points: 0,  player: "David",   team: "NA",     teamColor: "#777" },
  ],
};

const S47_RESULTS = {
  season: 47,
  teamScores: [
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 94, winner: true },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 62 },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 56 },
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 46 },
  ],
  placements: [
    { place: 1,  points: 46, player: "Rachel",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 2,  points: 38, player: "Sam",       team: "Miloa",  teamColor: "#c8922a" },
    { place: 3,  points: 27, player: "Sue",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 4,  points: 24, player: "Genevieve", team: "Weloki", teamColor: "#c46ab0" },
    { place: 5,  points: 21, player: "Kyle",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 6,  points: 20, player: "Andy",      team: "NA",     teamColor: "#777" },
    { place: 7,  points: 17, player: "Teeny",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 8,  points: 15, player: "Gabe",      team: "Ojalu",  teamColor: "#6db86d" },
    { place: 9,  points: 14, player: "Sierra",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 10, points: 12, player: "Sol",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 12, player: "Caroline",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 12, points: 10, player: "Rome",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 13, points: 10, player: "Tiyana",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 14, points: 8,  player: "Anika",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 15, points: 2,  player: "Kishan",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 16, points: 2,  player: "Aysha",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 17, points: 0,  player: "TK",        team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 18, points: 0,  player: "Jon",       team: "NA",     teamColor: "#777" },
  ],
};

const S48_RESULTS = {
  season: 48,
  teamScores: [
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 45, winner: true },
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 37 },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 36 },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 35 },
  ],
  placements: [
    { place: 1,  points: 20, player: "Kyle",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 18, player: "Genevieve", team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 3,  points: 14, player: "Kenzie",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 4,  points: 13, player: "Kamilla",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 5,  points: 12, player: "Eva",       team: "Weloki", teamColor: "#c46ab0" },
    { place: 6,  points: 11, player: "Tiff",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 7,  points: 10, player: "Joe",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 8,  points: 9,  player: "Saiounia",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 9,  points: 8,  player: "Shauhin",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 10, points: 7,  player: "David",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 6,  player: "Charity",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 12, points: 5,  player: "Cedrek",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 13, points: 4,  player: "Mary",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 3,  player: "Teeny",     team: "Weloki", teamColor: "#c46ab0" },
    { place: 15, points: 2,  player: "Kevin",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 16, points: 2,  player: "Bianca",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 17, points: 2,  player: "Chrissy",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 18, points: 0,  player: "Stephanie", team: "NA",     teamColor: "#777" },
  ],
};

const S49_RESULTS = {
  season: 49,
  teamScores: [
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 61, winner: true },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 40 },
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 38 },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 19 },
  ],
  placements: [
    { place: 1,  points: 20, player: "Savannah",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 2,  points: 18, player: "Sam",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 3,  points: 14, player: "Dee",       team: "Weloki", teamColor: "#c46ab0" },
    { place: 4,  points: 13, player: "Tiff",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 5,  points: 12, player: "Eva",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 6,  points: 11, player: "Kamilla",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 7,  points: 10, player: "Rachel",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 8,  points: 9,  player: "Kyle",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 9,  points: 8,  player: "Hunter",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 10, points: 7,  player: "Soda",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 11, points: 6,  player: "Kenzie",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 12, points: 5,  player: "Shauhin",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 13, points: 4,  player: "Venus",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 14, points: 3,  player: "Q",         team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 2,  player: "Teeny",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 16, points: 2,  player: "Maria",     team: "Weloki", teamColor: "#c46ab0" },
    { place: 17, points: 1,  player: "Randen",    team: "NA",     teamColor: "#777" },
    { place: 18, points: 0,  player: "Nicole",    team: "NA",     teamColor: "#777" },
  ],
};

const SEASON_WINNERS = [
  { season: 43, winner: "Jinga"  },
  { season: 44, winner: "Jinga"  },
  { season: 45, winner: "Miloa"  },
  { season: 46, winner: "Weloki" },
  { season: 47, winner: "Weloki" },
  { season: 48, winner: "Jinga"  },
  { season: 49, winner: "Jinga"  },
];

function getChampionshipsThrough(season) {
  const counts = {};
  for (const s of SEASON_WINNERS) {
    if (s.season <= season) counts[s.winner] = (counts[s.winner] || 0) + 1;
  }
  return counts;
}

// ------------------------
// Totems
// ------------------------
function TotemMiloa({ size = 28 }) {
  const s = size, h = Math.round(size * 1.23);
  return (
    <svg width={s} height={h} viewBox="0 0 130 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="5" x2="75" y2="40" stroke="#c8922a" strokeWidth="3" strokeLinecap="round"/>
      <line x1="100" y1="5" x2="55" y2="40" stroke="#c8922a" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="30,5 24,12 36,10" fill="#c8922a"/>
      <polygon points="100,5 106,12 94,10" fill="#c8922a"/>
      <rect x="30" y="38" width="70" height="7" rx="2" fill="#c8922a" opacity="0.75"/>
      <path d="M22 44 L22 105 Q22 130 65 138 Q108 130 108 105 L108 44 Q90 40 65 40 Q40 40 22 44Z" fill="#1a1208" stroke="#c8922a" strokeWidth="2.5"/>
      <path d="M28 55 L102 55 L98 66 L32 66Z" fill="#c8922a" opacity="0.9"/>
      <path d="M55 55 L65 48 L75 55 L75 66 L55 66Z" fill="#1a1208"/>
      <path d="M30 76 L50 70 L68 76 L50 82Z" fill="#c8922a" opacity="0.95"/>
      <path d="M62 76 L82 70 L100 76 L82 82Z" fill="#c8922a" opacity="0.95"/>
      <rect x="44" y="73" width="12" height="7" rx="1" fill="#0a0802"/>
      <rect x="76" y="73" width="12" height="7" rx="1" fill="#0a0802"/>
      <path d="M54 88 L54 100 Q54 106 65 106 Q76 106 76 100 L76 88 Q70 92 65 92 Q60 92 54 88Z" fill="#c8922a" opacity="0.75"/>
      <ellipse cx="56" cy="102" rx="5" ry="3" fill="#0a0802"/>
      <ellipse cx="74" cy="102" rx="5" ry="3" fill="#0a0802"/>
      <path d="M36 115 Q28 122 30 132 Q35 128 42 118Z" fill="#c8922a" opacity="0.85"/>
      <path d="M94 115 Q102 122 100 132 Q95 128 88 118Z" fill="#c8922a" opacity="0.85"/>
      <path d="M36 112 Q42 106 52 113 Q60 107 65 111 Q70 107 78 113 Q88 106 94 112 Q88 126 65 128 Q42 126 36 112Z" fill="#c8922a" opacity="0.85"/>
      <rect x="46" y="112" width="9" height="10" rx="1" fill="#0a0802"/>
      <rect x="61" y="112" width="8" height="10" rx="1" fill="#0a0802"/>
      <rect x="76" y="112" width="9" height="10" rx="1" fill="#0a0802"/>
      <ellipse cx="18" cy="84" rx="6" ry="10" fill="#c8922a" opacity="0.7" stroke="#c8922a" strokeWidth="1"/>
      <ellipse cx="18" cy="84" rx="3" ry="5" fill="#1a1208" opacity="0.8"/>
      <ellipse cx="112" cy="84" rx="6" ry="10" fill="#c8922a" opacity="0.7" stroke="#c8922a" strokeWidth="1"/>
      <ellipse cx="112" cy="84" rx="3" ry="5" fill="#1a1208" opacity="0.8"/>
      <rect x="34" y="138" width="62" height="7" rx="2" fill="#c8922a" opacity="0.45"/>
      <rect x="26" y="145" width="78" height="5" rx="2" fill="#c8922a" opacity="0.25"/>
    </svg>
  );
}

function TotemJinga({ size = 28 }) {
  const s = size, h = Math.round(size * 1.23);
  return (
    <svg width={s} height={h} viewBox="0 0 130 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 8 Q55 20 58 32 Q48 18 42 30 Q36 14 28 26 Q24 38 34 44" stroke="#6a9fd8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M65 8 Q75 20 72 32 Q82 18 88 30 Q94 14 102 26 Q106 38 96 44" stroke="#6a9fd8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M65 8 Q65 22 65 38" stroke="#6a9fd8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="34" cy="44" r="3" fill="#6a9fd8" opacity="0.8"/>
      <circle cx="96" cy="44" r="3" fill="#6a9fd8" opacity="0.8"/>
      <circle cx="65" cy="38" r="2.5" fill="#6a9fd8" opacity="0.8"/>
      <path d="M30 44 Q48 38 65 42 Q82 38 100 44 Q90 52 65 50 Q40 52 30 44Z" fill="#6a9fd8" opacity="0.7"/>
      <path d="M40 50 Q36 72 36 100 Q36 130 65 140 Q94 130 94 100 Q94 72 90 50 Q78 46 65 46 Q52 46 40 50Z" fill="#080f18" stroke="#6a9fd8" strokeWidth="2.5"/>
      <path d="M40 60 Q52 54 65 56 Q78 54 90 60" stroke="#6a9fd8" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="52" cy="72" rx="10" ry="12" fill="#6a9fd8" opacity="0.9"/>
      <ellipse cx="78" cy="72" rx="10" ry="12" fill="#6a9fd8" opacity="0.9"/>
      <ellipse cx="52" cy="72" rx="3" ry="9" fill="#080f18"/>
      <ellipse cx="78" cy="72" rx="3" ry="9" fill="#080f18"/>
      <circle cx="54" cy="67" r="2" fill="#d0eeff" opacity="0.7"/>
      <circle cx="80" cy="67" r="2" fill="#d0eeff" opacity="0.7"/>
      <path d="M62 86 L62 104 Q62 108 65 108 Q68 108 68 104 L68 86 Q66 84 65 84 Q64 84 62 86Z" fill="#6a9fd8" opacity="0.6"/>
      <ellipse cx="61" cy="106" rx="3.5" ry="2" fill="#080f18"/>
      <ellipse cx="69" cy="106" rx="3.5" ry="2" fill="#080f18"/>
      <path d="M65 118 L65 135" stroke="#6a9fd8" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M65 135 L58 145" stroke="#6a9fd8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M65 135 L72 145" stroke="#6a9fd8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M44 114 Q54 108 65 112 Q76 108 86 114 Q78 122 65 122 Q52 122 44 114Z" fill="#6a9fd8" opacity="0.75"/>
      <rect x="55" y="114" width="20" height="6" rx="1" fill="#080f18"/>
      <path d="M36 70 Q20 75 22 90 Q24 100 34 96 Q30 85 36 78Z" fill="#6a9fd8" fillOpacity="0.6" stroke="#6a9fd8" strokeWidth="1"/>
      <path d="M94 70 Q110 75 108 90 Q106 100 96 96 Q100 85 94 78Z" fill="#6a9fd8" fillOpacity="0.6" stroke="#6a9fd8" strokeWidth="1"/>
      <rect x="36" y="140" width="58" height="7" rx="2" fill="#6a9fd8" opacity="0.4"/>
      <rect x="28" y="147" width="74" height="5" rx="2" fill="#6a9fd8" opacity="0.2"/>
    </svg>
  );
}

function TotemOjalu({ size = 28 }) {
  const s = size, h = Math.round(size * 1.23);
  return (
    <svg width={s} height={h} viewBox="0 0 130 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M45 42 Q38 30 32 18 Q28 10 24 6" stroke="#6db86d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M38 30 Q30 24 22 24" stroke="#6db86d" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M32 18 Q26 14 20 16" stroke="#6db86d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M85 42 Q92 30 98 18 Q102 10 106 6" stroke="#6db86d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M92 30 Q100 24 108 24" stroke="#6db86d" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M98 18 Q104 14 110 16" stroke="#6db86d" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M65 8 Q60 18 65 26 Q70 18 65 8Z" fill="#6db86d" opacity="0.8"/>
      <circle cx="24" cy="6" r="2.5" fill="#6db86d" opacity="0.8"/>
      <circle cx="106" cy="6" r="2.5" fill="#6db86d" opacity="0.8"/>
      <path d="M32 42 Q48 36 65 38 Q82 36 98 42 Q86 50 65 48 Q44 50 32 42Z" fill="#6db86d" opacity="0.65"/>
      <path d="M20 48 Q16 68 16 90 Q16 120 65 132 Q114 120 114 90 Q114 68 110 48 Q90 44 65 44 Q40 44 20 48Z" fill="#0d1f0d" stroke="#6db86d" strokeWidth="2.5"/>
      <rect x="22" y="60" width="86" height="6" rx="2" fill="#6db86d" opacity="0.75"/>
      <rect x="60" y="60" width="10" height="6" fill="#0d1f0d"/>
      <circle cx="44" cy="80" r="18" fill="#6db86d" opacity="0.15" stroke="#6db86d" strokeWidth="2.5"/>
      <circle cx="86" cy="80" r="18" fill="#6db86d" opacity="0.15" stroke="#6db86d" strokeWidth="2.5"/>
      <circle cx="44" cy="80" r="12" fill="#6db86d" opacity="0.3"/>
      <circle cx="86" cy="80" r="12" fill="#6db86d" opacity="0.3"/>
      <circle cx="44" cy="80" r="7" fill="#0d1f0d"/>
      <circle cx="86" cy="80" r="7" fill="#0d1f0d"/>
      <circle cx="44" cy="80" r="4.5" fill="#6db86d" opacity="0.7"/>
      <circle cx="86" cy="80" r="4.5" fill="#6db86d" opacity="0.7"/>
      <circle cx="44" cy="80" r="2" fill="#0d1f0d"/>
      <circle cx="86" cy="80" r="2" fill="#0d1f0d"/>
      <circle cx="47" cy="75" r="3" fill="#c0ffc0" opacity="0.55"/>
      <circle cx="89" cy="75" r="3" fill="#c0ffc0" opacity="0.55"/>
      <path d="M58 100 Q56 108 65 110 Q74 108 72 100 Q70 94 65 92 Q60 94 58 100Z" fill="#6db86d" opacity="0.65"/>
      <ellipse cx="59" cy="108" rx="4.5" ry="2.5" fill="#0d1f0d"/>
      <ellipse cx="71" cy="108" rx="4.5" ry="2.5" fill="#0d1f0d"/>
      <path d="M28 118 Q38 110 48 118 Q56 110 65 114 Q74 110 82 118 Q92 110 102 118 Q94 130 65 132 Q36 130 28 118Z" fill="#6db86d" opacity="0.75"/>
      <rect x="40" y="118" width="10" height="10" rx="2" fill="#0d1f0d"/>
      <rect x="57" y="118" width="16" height="10" rx="2" fill="#0d1f0d"/>
      <rect x="80" y="118" width="10" height="10" rx="2" fill="#0d1f0d"/>
      <path d="M16 72 Q4 80 6 96 Q8 108 18 104 Q12 92 18 82Z" fill="#6db86d" fillOpacity="0.6" stroke="#6db86d" strokeWidth="1.5"/>
      <path d="M114 72 Q126 80 124 96 Q122 108 112 104 Q118 92 112 82Z" fill="#6db86d" fillOpacity="0.6" stroke="#6db86d" strokeWidth="1.5"/>
      <rect x="36" y="132" width="58" height="7" rx="2" fill="#6db86d" opacity="0.4"/>
      <rect x="28" y="139" width="74" height="5" rx="2" fill="#6db86d" opacity="0.22"/>
    </svg>
  );
}

function TotemWeloki({ size = 28 }) {
  const s = size, h = Math.round(size * 1.23);
  return (
    <svg width={s} height={h} viewBox="0 0 130 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 6 Q44 8 36 22 Q30 36 40 46 Q50 32 65 30 Q80 32 90 46 Q100 36 94 22 Q86 8 65 6Z" fill="#c46ab0" fillOpacity="0.85"/>
      <path d="M65 10 Q48 12 42 24 Q38 34 46 42 Q52 30 65 28 Q78 30 84 42 Q92 34 88 24 Q82 12 65 10Z" fill="#18080f" opacity="0.6"/>
      <circle cx="65" cy="18" r="3" fill="#f0b0e8" opacity="0.8"/>
      <circle cx="50" cy="22" r="1.5" fill="#f0b0e8" opacity="0.5"/>
      <circle cx="80" cy="22" r="1.5" fill="#f0b0e8" opacity="0.5"/>
      <path d="M38 44 Q52 38 65 40 Q78 38 92 44 Q84 54 65 52 Q46 54 38 44Z" fill="#c46ab0" opacity="0.7"/>
      <path d="M42 52 Q38 72 38 98 Q38 128 65 138 Q92 128 92 98 Q92 72 88 52 Q78 48 65 48 Q52 48 42 52Z" fill="#18080f" stroke="#c46ab0" strokeWidth="2.5"/>
      <path d="M44 72 Q54 65 65 67 Q76 65 86 72" stroke="#c46ab0" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M42 84 Q54 74 66 84 Q54 92 42 84Z" fill="#c46ab0" opacity="0.9"/>
      <path d="M64 84 Q76 74 88 84 Q76 92 64 84Z" fill="#c46ab0" opacity="0.9"/>
      <circle cx="54" cy="83" r="6" fill="#18080f"/>
      <circle cx="76" cy="83" r="6" fill="#18080f"/>
      <circle cx="54" cy="83" r="4" fill="#c46ab0" opacity="0.65"/>
      <circle cx="76" cy="83" r="4" fill="#c46ab0" opacity="0.65"/>
      <circle cx="54" cy="83" r="2" fill="#18080f"/>
      <circle cx="76" cy="83" r="2" fill="#18080f"/>
      <circle cx="56" cy="80" r="2" fill="#f8d0f0" opacity="0.8"/>
      <circle cx="78" cy="80" r="2" fill="#f8d0f0" opacity="0.8"/>
      <path d="M63 96 L63 106 Q63 109 65 109 Q67 109 67 106 L67 96 Q66 94 65 94 Q64 94 63 96Z" fill="#c46ab0" opacity="0.55"/>
      <ellipse cx="61" cy="108" rx="3" ry="2" fill="#18080f"/>
      <ellipse cx="69" cy="108" rx="3" ry="2" fill="#18080f"/>
      <path d="M46 116 Q54 110 65 114 Q76 110 84 116 Q80 124 65 126 Q50 124 46 116Z" fill="#c46ab0" opacity="0.85"/>
      <circle cx="60" cy="128" r="1.8" fill="#c46ab0" opacity="0.5"/>
      <circle cx="65" cy="130" r="1.8" fill="#c46ab0" opacity="0.5"/>
      <circle cx="70" cy="128" r="1.8" fill="#c46ab0" opacity="0.5"/>
      <path d="M38 78 Q24 84 26 100 Q28 112 38 108 Q32 98 36 88Z" fill="#c46ab0" fillOpacity="0.55" stroke="#c46ab0" strokeWidth="1.5"/>
      <path d="M92 78 Q106 84 104 100 Q102 112 92 108 Q98 98 94 88Z" fill="#c46ab0" fillOpacity="0.55" stroke="#c46ab0" strokeWidth="1.5"/>
      <rect x="38" y="138" width="54" height="7" rx="3" fill="#c46ab0" opacity="0.4"/>
      <rect x="30" y="145" width="70" height="5" rx="2" fill="#c46ab0" opacity="0.22"/>
    </svg>
  );
}

const TOTEM_MAP = { Miloa: TotemMiloa, Jinga: TotemJinga, Ojalu: TotemOjalu, Weloki: TotemWeloki };

function TribeTotem({ team, size = 28 }) {
  const Component = TOTEM_MAP[team];
  if (!Component) return null;
  return <Component size={size} />;
}

// ------------------------
// Views
// ------------------------
function SeasonHistory({ season, onBack }) {
  const r =
    season === 43 ? S43_RESULTS :
    season === 44 ? S44_RESULTS :
    season === 45 ? S45_RESULTS :
    season === 46 ? S46_RESULTS :
    season === 47 ? S47_RESULTS :
    season === 48 ? S48_RESULTS :
    S49_RESULTS;

  const championships = getChampionshipsThrough(season);

  return (
    <div>
      <div className="page-title">Season {r.season} Results</div>
      <div className="page-subtitle" style={{marginBottom:"2rem"}}>Final standings · {r.placements.length} castaways</div>

      <div className="section-title">Final Team Scores</div>
      <div className="leaderboard" style={{marginBottom:"2.5rem"}}>
        {r.teamScores.map((t, i) => (
          <div key={t.name} className={`lb-card ${i===0?"first":""}`}>
            <div className="lb-rank" style={{color: i===0 ? t.color : ""}}>{i+1}</div>
            <div style={{flex:1}}>
              <div className="lb-tribe" style={{color:t.color}}>
                {t.name} <span style={{fontSize:"0.63rem",color:"#999",fontWeight:400}}>{t.members}</span>
              </div>
              {t.winner && <div style={{fontSize:"0.6rem",color:"#c8922a",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:"0.15rem"}}>★ Season Champion</div>}
              {championships[t.name] > 0 && (
                <div style={{display:"flex",alignItems:"center",gap:"2px",marginTop:"0.3rem",flexWrap:"wrap"}}>
                  {Array.from({length: championships[t.name]}).map((_, ci) => (
                    <TribeTotem key={ci} team={t.name} size={22} />
                  ))}
                  <span style={{fontSize:"0.52rem",color:"#666",marginLeft:"4px",letterSpacing:"0.08em"}}>
                    {championships[t.name]} TITLE{championships[t.name]>1?"S":""}
                  </span>
                </div>
              )}
            </div>
            <div className="lb-score">
              <div className="lb-pts" style={{color: t.color}}>{t.score}</div>
              <div className="lb-pts-label">points</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Castaway Placements</div>
      <div style={{border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px",overflow:"hidden",marginBottom:"2rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"3rem 3.5rem 1fr 5rem",background:"rgba(255,255,255,0.04)",padding:"0.6rem 1rem",fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <div>Place</div><div>Pts</div><div>Player</div><div>Team</div>
        </div>
        {r.placements.map((p, i) => (
          <div key={p.place} style={{display:"grid",gridTemplateColumns:"3rem 3.5rem 1fr 5rem",padding:"0.55rem 1rem",fontSize:"0.72rem",borderBottom: i < r.placements.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none",background: i%2===0 ? "rgba(255,255,255,0.01)" : "transparent",alignItems:"center"}}>
            <div style={{color:"#999",fontSize:"0.65rem"}}>#{p.place}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,color: p.points > 0 ? "#f0ebe0" : "#555"}}>{p.points}</div>
            <div style={{color:"#f0ebe0"}}>{p.player}</div>
            <div style={{color: p.teamColor, fontSize:"0.65rem"}}>{p.team}</div>
          </div>
        ))}
      </div>

      <button className="action-btn" onClick={onBack} style={{marginBottom:0}}>← Back</button>
    </div>
  );
}

function Leaderboard({ scores, season, castaways, showOdds }) {
  const eliminated = castaways.filter(c => c.eliminationOrder).length;
  const hasDrafted = castaways.some(c => c.draftedBy);
  const hasOdds = season.id === 50;

  const teamDraftMap = {};
  castaways.forEach(c => { if (c.draftedBy) teamDraftMap[c.id] = c.draftedBy; });

  const simResults = (hasDrafted && hasOdds)
    ? runFantasySimulation(castaways, teamDraftMap, season.totalCastaways, 5000)
    : null;

  return (
    <div>
      <div className="page-title">Leaderboard</div>
      <div className="page-subtitle">
        Season {season.id}: In the Hands of the Fans · {season.totalCastaways} Castaways · {eliminated} Eliminated · {season.totalCastaways - eliminated} Remaining
        {simResults && showOdds && <span style={{color:"#999"}}> · odds via 5,000-season Monte Carlo sim</span>}
      </div>

      <div className="leaderboard">
        {scores.map((team, i) => {
          const def = TEAMS.find(t => t.id === team.id);
          const sim = simResults ? simResults[team.id] : null;
          return (
            <div key={team.id} className={`lb-card ${i===0?"first":""}`}>
              <div className="lb-rank">{i+1}</div>
              <div style={{flex:1}}>
                <div className="lb-tribe" style={{color:def.color}}>
                  {team.name} <span style={{fontSize:"0.63rem",color:"#999",fontWeight:400}}>{team.members}</span>
                </div>

                {(() => {
                  const champs = getChampionshipsThrough(49);
                  const count = champs[def.name] || 0;
                  return count > 0 ? (
                    <div style={{display:"flex",alignItems:"center",gap:"2px",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                      {Array.from({length: count}).map((_, ci) => (
                        <TribeTotem key={ci} team={def.name} size={20} />
                      ))}
                      <span style={{fontSize:"0.5rem",color:"#555",marginLeft:"3px",letterSpacing:"0.08em"}}>
                        {count} TITLE{count>1?"S":""}
                      </span>
                    </div>
                  ) : null;
                })()}

                {sim && showOdds && (
                  <div style={{display:"flex",gap:"1.25rem",marginBottom:"0.5rem",marginTop:"0.2rem",flexWrap:"wrap"}}>
                    <div>
                      <span style={{fontSize:"0.58rem",color:"#999",letterSpacing:"0.08em",textTransform:"uppercase"}}>Win Probability </span>
                      <span style={{
                        fontSize:"0.85rem",
                        fontFamily:"'Playfair Display', serif",
                        fontWeight:900,
                        color: sim.winPct >= 35 ? "#c8922a" : sim.winPct >= 20 ? "#6db86d" : sim.winPct >= 12 ? "#6a9fd8" : "#aaa"
                      }}>
                        {sim.winPct}%
                      </span>
                    </div>
                    <div>
                      <span style={{fontSize:"0.58rem",color:"#999",letterSpacing:"0.08em",textTransform:"uppercase"}}>Projected Score </span>
                      <span style={{fontSize:"0.85rem",fontFamily:"'Playfair Display', serif",fontWeight:900,color:"#f0ebe0"}}>
                        {sim.projectedScore} pts
                      </span>
                    </div>
                  </div>
                )}

                <div className="lb-tags">
                  {team.picks.map(c => (
                    <span key={c.id} className={`c-tag ${c.eliminationOrder?"eliminated":"alive"}`}>
                      {c.name}{c.eliminationOrder
                        ? ` · ${calcPoints(c.eliminationOrder, season.totalCastaways)}pt`
                        : (showOdds && c.odds ? ` · ${c.odds}` : "")}
                    </span>
                  ))}
                  {team.picks.length === 0 && <span style={{fontSize:"0.65rem",color:"#aaa"}}>No picks yet — draft to see projected odds</span>}
                </div>
              </div>

              <div className="lb-score">
                <div className="lb-pts">{team.total}</div>
                <div className="lb-pts-label">actual pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {!hasDrafted && hasOdds && (
        <div style={{textAlign:"center",padding:"3rem",color:"#aaa",fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>
          Complete the draft to see projected scores and win probabilities
        </div>
      )}
    </div>
  );
}

function Castaways({ castaways, season, showOdds }) {
  const alive      = castaways.filter(c => !c.eliminationOrder && c.draftedBy);
  const undrafted  = castaways.filter(c => !c.eliminationOrder && !c.draftedBy);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a,b) => b.eliminationOrder - a.eliminationOrder);

  return (
    <div>
      <div className="page-title">Castaways</div>
      <div className="page-subtitle">Season {season.id} · {alive.length} Active · {undrafted.length} Undrafted · {eliminated.length} Eliminated</div>

      <div className="odds-key">
        <span><span className="odds-dot" style={{background:"#a855c8"}} /> Vatu (purple)</span>
        <span><span className="odds-dot" style={{background:"#2ab8a0"}} /> Kalo (teal)</span>
        <span><span className="odds-dot" style={{background:"#e8782a"}} /> Cila (orange)</span>
      </div>

      {showOdds && (
        <div className="odds-key" style={{marginBottom:"1.5rem"}}>
          <span><span className="odds-dot" style={{background:"#c8922a"}} /> Heavy favorite (odds-)</span>
          <span><span className="odds-dot" style={{background:"#6db86d"}} /> Strong contender (+700–1000)</span>
          <span><span className="odds-dot" style={{background:"#6a9fd8"}} /> Solid shot (+1000–2500)</span>
          <span><span className="odds-dot" style={{background:"#aaa"}} /> Longshot (+2500+)</span>
        </div>
      )}

      {alive.length > 0 && (
        <>
          <div className="section-title">Active — {alive.length}</div>
          <div className="castaways-grid">{alive.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}</div>
        </>
      )}

      {undrafted.length > 0 && (
        <>
          <div className="section-title">Undrafted — {undrafted.length}</div>
          <div className="castaways-grid">{undrafted.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}</div>
        </>
      )}

      {eliminated.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title">Eliminated — {eliminated.length}</div>
          <div className="castaways-grid">{eliminated.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}</div>
        </>
      )}
    </div>
  );
}

function CastawayCard({ c, season, showOdds }) {
  const team = TEAMS.find(t => t.id === c.draftedBy);
  const pts  = c.eliminationOrder ? calcPoints(c.eliminationOrder, season.totalCastaways) : null;
  const cls  = c.eliminationOrder ? "eliminated" : (c.draftedBy ? "alive" : "undrafted");

  return (
    <div className={`castaway-card ${cls}`}>
      <Photo src={c.photo} alt={c.name} className="c-photo" />
      <div className="c-info">
        <div className="c-name">{c.name}</div>
        {c.bio && <div className="c-bio">{c.bio}</div>}

        {c.tribe && (
          <div style={{marginBottom:"0.25rem"}}>
            <span style={{
              fontSize:"0.55rem", fontFamily:"'DM Mono', monospace", letterSpacing:"0.1em",
              textTransform:"uppercase", padding:"0.1rem 0.4rem", borderRadius:"2px",
              background: `${TRIBE_COLORS[c.tribe]}22`,
              color: TRIBE_COLORS[c.tribe] || "#aaa",
              border: `1px solid ${TRIBE_COLORS[c.tribe] || "#aaa"}55`,
            }}>
              {c.tribe}
            </span>
          </div>
        )}

        <div className="c-row">
          <div className="c-tribe" style={{color: team ? team.color : "#888"}}>{team ? team.name : "Undrafted"}</div>
          {c.odds && showOdds && <div className="c-odds" style={{color: oddsColor(c.odds)}}>{c.odds}</div>}
        </div>

        <div className={`c-status ${cls}`} style={{marginTop:"0.2rem"}}>
          {c.eliminationOrder ? `Elim. #${c.eliminationOrder}` : (c.draftedBy ? "Active" : "—")}
        </div>

        {pts !== null && <div className="c-pts">{pts} pts</div>}
      </div>
    </div>
  );
}

function Draft({ castaways, season, draftState, randomizeOrder, selectPosition, buildDraftOrder, setCastaways, showToast, undoLastDraftPick, showOdds, resetSeason }) {
  const { randomOrder, draftPositions } = draftState;
  const positionsFilled = Object.keys(draftPositions).length;
  const allPositionsPicked = positionsFilled >= TEAMS.length;
  const draftOrder = buildDraftOrder();
  const totalPicks = TEAMS.length * season.picksPerTeam;
  const pickedCount = castaways.filter(c => c.draftedBy).length;
  const draftComplete = pickedCount >= totalPicks;
  const preEliminated = castaways.filter(c => c.eliminationOrder && !c.draftedBy);
  const available = castaways.filter(c => !c.draftedBy && !c.eliminationOrder);

  const sequence = [];
  for (let round = 1; round <= season.picksPerTeam; round++) {
    const ro = round % 2 === 0 ? [...draftOrder].reverse() : draftOrder;
    ro.forEach(tid => sequence.push({ teamId: tid, round }));
  }

  const currentPick = !draftComplete && pickedCount < sequence.length ? sequence[pickedCount] : null;
  const currentTeam = currentPick ? TEAMS.find(t => t.id === currentPick.teamId) : null;

  const draftPick = (castawayId) => {
    if (!currentTeam || !allPositionsPicked) return;
    const c = castaways.find(c => c.id === castawayId);
    setCastaways(prev => prev.map(cc => cc.id === castawayId ? { ...cc, draftedBy: currentTeam.id } : cc));
    showToast(`${currentTeam.name} drafts ${c.name}!`);
  };

  const nextPositionPicker = randomOrder ? randomOrder.find(tid => draftPositions[tid] === undefined) : null;
  const nextPositionTeam = nextPositionPicker ? TEAMS.find(t => t.id === nextPositionPicker) : null;

  return (
    <div>
      <div className="page-title">Draft Board</div>
      <div className="page-subtitle">Season {season.id} · Snake Draft · {season.picksPerTeam} Rounds · {totalPicks} Picks · {season.undrafted} Undrafted</div>

      {preEliminated.length > 0 && (
        <div style={{marginBottom:"1.5rem",padding:"1rem 1.25rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px"}}>
          <div style={{fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase",color:"#999",marginBottom:"0.75rem"}}>
            ⚠ Eliminated Before Draft — Not Available ({preEliminated.length})
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
            {preEliminated.map(c => (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:"0.4rem",padding:"0.25rem 0.6rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"3px"}}>
                <span style={{fontSize:"0.65rem",color:"#888",textDecoration:"line-through"}}>{c.name}</span>
                <span style={{fontSize:"0.55rem",color:"#666"}}>#{c.eliminationOrder}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!allPositionsPicked && (
        <div className="draft-phase">
          <div className="draft-phase-title">Step 1 — Roll for Draft Position Order</div>

          {!randomOrder ? (
            <button className="action-btn primary" onClick={randomizeOrder}>🎲 Roll Randomizer</button>
          ) : (
            <>
              <div style={{fontSize:"0.72rem",color:"#aaa",marginBottom:"1rem"}}>
                Teams pick their draft position in this order. Each team chooses any available slot (1–4).
              </div>

              <div className="randomizer-result">
                {randomOrder.map((tid, i) => {
                  const team = TEAMS.find(t => t.id === tid);
                  const chosenPos = draftPositions[tid];
                  const isNext = tid === nextPositionPicker;

                  return (
                    <div key={tid} className="rand-row" style={{borderColor: isNext ? `${team.color}44` : "", background: isNext ? `${team.color}08` : ""}}>
                      <div className="rand-pos">{i+1}</div>
                      <div style={{flex:1}}>
                        <div className="rand-team" style={{color: team.color}}>
                          {team.name} <span style={{color:"#999",fontWeight:400,fontSize:"0.62rem"}}>{team.members}</span>
                        </div>
                        {chosenPos !== undefined ? (
                          <div style={{fontSize:"0.65rem",color:"#6db86d",marginTop:"0.15rem"}}>✓ Chose pick position {chosenPos}</div>
                        ) : isNext ? (
                          <div style={{fontSize:"0.65rem",color:"#c8922a",marginTop:"0.15rem"}}>← Choosing now...</div>
                        ) : (
                          <div style={{fontSize:"0.65rem",color:"#aaa",marginTop:"0.15rem"}}>Waiting...</div>
                        )}
                      </div>

                      {isNext && chosenPos === undefined && (
                        <div className="pos-selector">
                          {[1,2,3,4].map(pos => {
                            const taken = Object.values(draftPositions).includes(pos);
                            return (
                              <button
                                key={pos}
                                className={`pos-btn ${taken ? "taken" : "available"}`}
                                onClick={() => !taken && selectPosition(tid, pos)}
                                disabled={taken}
                              >
                                Position {pos}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button className="action-btn primary" style={{marginTop:"0.5rem"}} onClick={randomizeOrder}>↺ Re-roll Randomizer</button>
            </>
          )}
        </div>
      )}

      {allPositionsPicked && (
        <>
          <div style={{fontSize:"0.72rem",color:"#aaa",marginBottom:"1rem",letterSpacing:"0.06em"}}>
            Draft order: {draftOrder.map(id => TEAMS.find(t=>t.id===id).name).join(" → ")} (snake)
          </div>

          {!draftComplete && currentTeam && (
            <div className="draft-status-bar">
              <div className="on-clock">
                On the clock: <strong style={{color:currentTeam.color}}>{currentTeam.name}</strong>
                <span style={{fontSize:"0.65rem",color:"#aaa",marginLeft:"0.5rem"}}>{currentTeam.members}</span>
              </div>
              <div className="round-info">Round {currentPick.round} · Pick {pickedCount+1} of {totalPicks}</div>
            </div>
          )}

          {draftComplete && (
            <div style={{textAlign:"center",padding:"1.5rem",color:"#999",fontSize:"0.78rem",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"1.5rem",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px"}}>
              ✓ Draft Complete
            </div>
          )}

          {pickedCount > 0 && (
            <button className="action-btn" style={{background:"rgba(200,60,60,0.08)",borderColor:"rgba(200,60,60,0.3)",color:"#cc6060",marginLeft:"0.5rem"}} onClick={undoLastDraftPick}>
              ↩ Undo Last Pick
            </button>
          )}
        </>
      )}

      <div className="draft-layout">
        <div>
          {preEliminated.length > 0 && (
            <>
              <div className="section-title">Pre-Draft Eliminated — Not Available ({preEliminated.length})</div>
              <div className="draft-available-grid" style={{marginBottom:"1.5rem"}}>
                {preEliminated.map(c => (
                  <div key={c.id} className="draft-card pre-elim">
                    <Photo src={c.photo} alt={c.name} className="dc-photo" />
                    <div className="dc-info">
                      <div className="dc-name">{c.name}</div>
                      <div className="dc-odds" style={{color:"#999"}}>out #{c.eliminationOrder}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="section-title">Available to Draft ({available.length})</div>
          <div className="draft-available-grid">
            {available.map(c => (
              <div
                key={c.id}
                className="draft-card"
                onClick={() => allPositionsPicked && !draftComplete && currentTeam && draftPick(c.id)}
              >
                <Photo src={c.photo} alt={c.name} className="dc-photo" />
                <div className="dc-info">
                  <div className="dc-name">{c.name}</div>
                  {showOdds && c.odds && <div className="dc-odds" style={{color: oddsColor(c.odds)}}>{c.odds}</div>}
                </div>

                {allPositionsPicked && !draftComplete && currentTeam && (
                  <button className="dc-pick-btn" onClick={(e) => {e.stopPropagation(); draftPick(c.id);}}>
                    Pick for {currentTeam.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">Picks by Team</div>
          {(allPositionsPicked ? draftOrder : TEAMS.map(t=>t.id)).map(teamId => {
            const team = TEAMS.find(t => t.id === teamId);
            const teamPicks = castaways.filter(c => c.draftedBy === teamId);
            return (
              <div key={teamId} className="team-picks-block">
                <div className="team-picks-label" style={{color:team.color}}>
                  {team.name} · {team.members} · {teamPicks.length}/{season.picksPerTeam}
                </div>

                {Array.from({length: season.picksPerTeam}).map((_,i) => {
                  const pick = teamPicks[i];
                  return (
                    <div key={i} className="pick-row">
                      {pick ? (
                        <>
                          <Photo src={pick.photo} alt={pick.name} className="pick-photo-sm" />
                          <span style={{flex:1}}>{pick.name}</span>
                          {showOdds && <span style={{fontSize:"0.58rem",color:oddsColor(pick.odds)}}>{pick.odds}</span>}
                        </>
                      ) : (
                        <span className="empty-pick">Round {i+1} — pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Admin({ castaways, nextElimOrder, season, eliminate, restore, resetSeason, showOdds, setShowOdds }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const alive      = castaways.filter(c => !c.eliminationOrder);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a,b) => b.eliminationOrder - a.eliminationOrder);
  const seasonOver = nextElimOrder > season.totalCastaways;

  return (
    <div>
      <div className="page-title">Commissioner Panel</div>
      <div className="page-subtitle">
        Season {season.id} · {seasonOver ? "Season Complete" : `Next elimination #${nextElimOrder} · ${calcPoints(nextElimOrder, season.totalCastaways)} pts`}
      </div>

      <div style={{marginBottom:"1.5rem",display:"flex",gap:"0.75rem",alignItems:"center",flexWrap:"wrap"}}>
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

        {!confirmReset ? (
          <button className="action-btn" style={{background:"rgba(200,60,60,0.08)",borderColor:"rgba(200,60,60,0.3)",color:"#cc6060",marginBottom:0}} onClick={() => setConfirmReset(true)}>
            ↺ Reset Season
          </button>
        ) : (
          <>
            <span style={{fontSize:"0.72rem",color:"#cc6060"}}>Are you sure? This clears all picks and eliminations.</span>
            <button className="action-btn" style={{background:"rgba(200,60,60,0.2)",borderColor:"rgba(200,60,60,0.5)",color:"#ff8080",marginBottom:0}} onClick={() => { resetSeason(); setConfirmReset(false); }}>
              Yes, Reset
            </button>
            <button className="action-btn" style={{background:"none",borderColor:"rgba(255,255,255,0.1)",color:"#aaa",marginBottom:0}} onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </>
        )}
      </div>

      {!seasonOver && alive.length > 0 && (
        <>
          <div className="section-title" style={{marginBottom:"1rem"}}>Still Active — Mark as Eliminated</div>
          <div className="admin-grid" style={{marginBottom:"2rem"}}>
            {alive.map(c => {
              const team = TEAMS.find(t => t.id === c.draftedBy);
              return (
                <div key={c.id} className="admin-card">
                  <Photo src={c.photo} alt={c.name} className="admin-card-photo" />
                  <div className="admin-card-body">
                    <div className="admin-card-name">{c.name}</div>
                    {c.bio && <div className="admin-card-bio">{c.bio}</div>}
                    <div className="admin-card-tribe" style={{color: team ? team.color : "#aaa"}}>{team ? team.name : "Undrafted"}</div>
                    <div className="elim-controls">
                      <button className="elim-btn eliminate" onClick={() => eliminate(c.id)}>Elim. #{nextElimOrder}</button>
                      <span className="elim-info">{calcPoints(nextElimOrder, season.totalCastaways)} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {eliminated.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title" style={{marginBottom:"1rem"}}>Eliminated — Restore if Mistake</div>
          <div className="admin-grid">
            {eliminated.map(c => {
              const team = TEAMS.find(t => t.id === c.draftedBy);
              return (
                <div key={c.id} className="admin-card" style={{opacity:0.6}}>
                  <Photo src={c.photo} alt={c.name} className="admin-card-photo" />
                  <div className="admin-card-body">
                    <div className="admin-card-name">{c.name}</div>
                    {c.bio && <div className="admin-card-bio">{c.bio}</div>}
                    <div className="admin-card-tribe" style={{color: team ? team.color : "#aaa"}}>{team ? team.name : "Undrafted"}</div>
                    <div className="elim-controls">
                      <button className="elim-btn restore" onClick={() => restore(c.id)}>Restore</button>
                      <span className="elim-info">#{c.eliminationOrder} · {calcPoints(c.eliminationOrder, season.totalCastaways)}pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
