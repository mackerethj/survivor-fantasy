import { useState, useCallback } from "react";

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
  { id: 1, name: "Miloa",  members: "Team Miller",    color: "#c8922a" },
  { id: 2, name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8" },
  { id: 3, name: "Ojalu",  members: "Team Lestan",    color: "#6db86d" },
  { id: 4, name: "Weloki", members: "Team Wells",     color: "#c46ab0" },
];

const SEASONS = [
  { id: 50, label: "Season 50", totalCastaways: 24, picksPerTeam: 5, undrafted: 4, current: true },
  { id: 46, label: "Season 46", totalCastaways: 18, picksPerTeam: 4, undrafted: 2, current: false },
  { id: 45, label: "Season 45", totalCastaways: 18, picksPerTeam: 4, undrafted: 2, current: false },
];

// Tribe colors for S50
const TRIBE_COLORS = {
  Vatu: "#a855c8",  // purple
  Kalo: "#2ab8a0",  // teal
  Cila: "#e8782a",  // orange
};

// Real S50 cast — photos sourced from entertainmentnow.com (CBS official press photos)
const S50_CASTAWAYS = [
  { name: "Angelina Keeley",         tribe: "Vatu", bio: "3rd place, S37 David vs. Goliath",                                odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-angelina-keeley.jpg" },
  { name: "Aubry Bracco",            tribe: "Vatu", bio: "Runner-up S32 Kaoh Rong · S34 Game Changers · S38 Edge of Extinction", odds: "-250", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-aubry-bracco.jpg" },
  { name: "Benjamin \"Coach\" Wade", tribe: "Kalo", bio: "Runner-up S23 South Pacific · S18 Tocantins · S20 Heroes vs. Villains", odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-benjamin-coach-wade.jpg" },
  { name: "Charlie Davis",           tribe: "Kalo", bio: "Runner-up S46",                                                   odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-charlie-davis.jpg" },
  { name: "Chrissy Hofbeck",         tribe: "Kalo", bio: "Runner-up S35 Heroes vs. Healers vs. Hustlers",                   odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-chrissy-hofbeck.jpg" },
  { name: "Christian Hubicki",       tribe: "Cila", bio: "7th place S37 David vs. Goliath",                                 odds: "+800",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-christian-hubicki.jpg" },
  { name: "Cirie Fields",            tribe: "Cila", bio: "5x player · S12 Panama · S16 Micronesia · S20 HvV · S34 Game Changers", odds: "+1200", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-cirie-fields.jpg" },
  { name: "Colby Donaldson",         tribe: "Vatu", bio: "Runner-up S2 Australian Outback · S8 All-Stars · S20 Heroes vs. Villains", odds: "+5000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-colby-donaldson.jpg" },
  { name: "Dee Valladares",          tribe: "Kalo", bio: "WINNER S45 ★",                                                    odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-dee-valladares.jpg" },
  { name: "Emily Flippen",           tribe: "Cila", bio: "7th place S45",                                                   odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-emily-flippen.jpg" },
  { name: "Genevieve Mushaluk",      tribe: "Vatu", bio: "5th place S47",                                                   odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-genevieve-mushaluk.jpg" },
  { name: "Jenna Lewis-Dougherty",   tribe: "Cila", bio: "S1 Borneo · Final 3 S8 All-Stars",                                odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jenna-lewis-dougherty.jpg" },
  { name: "Joe Hunter",              tribe: "Cila", bio: "3rd place S48",                                                    odds: "+700",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-joe-hunter.jpg" },
  { name: "Jonathan Young",          tribe: "Kalo", bio: "4th place S42",                                                    odds: "+900",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jonathan-young.jpg" },
  { name: "Kamilla Karthigesu",      tribe: "Kalo", bio: "4th place S48",                                                    odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kamilla-karthigesu.jpg" },
  { name: "Kyle Fraser",             tribe: "Vatu", bio: "WINNER S48 ★",                                                    odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kyle-fraser.jpg" },
  { name: "Mike White",              tribe: "Kalo", bio: "Runner-up S37 David vs. Goliath · Creator of The White Lotus",    odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-mike-white.jpg" },
  { name: "Ozzy Lusth",              tribe: "Cila", bio: "Runner-up S13 Cook Islands · 4x player total",                    odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-ozzy-lutsh.jpg" },
  { name: "Q Burdette",              tribe: "Vatu", bio: "8th place S46",                                                    odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-quintavius-q-burdette.jpg" },
  { name: "Rick Devens",             tribe: "Cila", bio: "4th place S38 Edge of Extinction",                                 odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rick-devens.jpg" },
  { name: "Rizo Velovic",            tribe: "Vatu", bio: "4th place S49",                                                    odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rizo-velovic.jpg" },
  { name: "Savannah Louie",          tribe: "Cila", bio: "WINNER S49 ★",                                                    odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-savannah-louie.jpg" },
  { name: "Stephenie LaGrossa",      tribe: "Vatu", bio: "Runner-up S11 Guatemala · S10 Palau · S20 Heroes vs. Villains",   odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-stephanie-lagrossa-kendrick.jpg" },
  { name: "Tiffany Ervin",           tribe: "Kalo", bio: "8th place S46",                                                    odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-tiffany-ervin.jpg" },
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
//
// Core idea: each castaway has a win probability (from odds). Better players are more
// likely to finish later (more pts). We model this by treating each elimination slot
// as a weighted random draw from remaining castaways — higher-odds players are more
// likely to survive each round. We run N simulations to get team win % in the
// fantasy league, and compute a deterministic projected score via expected finish.
//
// Step 1: normalize implied probs so they sum to 1 across the full cast.
function getNormalizedProbs(castaways) {
  const total = castaways.reduce((s, c) => s + oddsToImplied(c.odds || "+5000"), 0);
  return castaways.map(c => ({
    ...c,
    prob: total > 0 ? oddsToImplied(c.odds || "+5000") / total : 1 / castaways.length,
  }));
}

// Step 2: simulate one season. Returns map of castawayId -> eliminationOrder.
// Each round, we eliminate the player with the LOWEST survival weight (inverse of win prob).
// We use weighted random sampling without replacement: each round pick a random "loser"
// with probability proportional to (1 - their normalized remaining prob).
function simulateSeason(castawaysWithProbs, totalCastaways) {
  // Remaining pool. prob = their normalized chance of winning.
  let pool = castawaysWithProbs.map(c => ({ ...c }));
  const result = {}; // id -> eliminationOrder

  for (let elim = 1; elim <= totalCastaways; elim++) {
    // Probability of being eliminated this round ∝ (1 - relative win prob among remaining)
    const totalRemProb = pool.reduce((s, c) => s + c.prob, 0);
    // Survivor weights: lower win prob = more likely to be voted out
    const loserWeights = pool.map(c => {
      const relProb = totalRemProb > 0 ? c.prob / totalRemProb : 1 / pool.length;
      return Math.max(0.001, 1 - relProb); // floor to avoid zero
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

// Step 3: run N simulations and tally fantasy win counts per team.
// Also compute deterministic projected score via expected elimination order.
function runFantasySimulation(castaways, teamDraftMap, totalCastaways, N = 5000) {
  const withProbs = getNormalizedProbs(castaways);
  const teamIds = [...new Set(Object.values(teamDraftMap).filter(Boolean))];

  const winCounts = {};
  teamIds.forEach(tid => { winCounts[tid] = 0; });

  // Projected score: expected points = sum over all possible elim orders weighted by prob
  // We approximate by running N sims and averaging.
  const totalPts = {};
  teamIds.forEach(tid => { totalPts[tid] = 0; });

  for (let i = 0; i < N; i++) {
    const seasonResult = simulateSeason(withProbs, totalCastaways);
    // Score each team
    const teamScores = {};
    teamIds.forEach(tid => { teamScores[tid] = 0; });
    castaways.forEach(c => {
      if (!c.draftedBy) return;
      // Use actual elimination if already happened, else use simulated
      const elimOrder = c.eliminationOrder || seasonResult[c.id];
      if (elimOrder) teamScores[c.draftedBy] = (teamScores[c.draftedBy] || 0) + calcPoints(elimOrder, totalCastaways);
    });
    // Find winner(s)
    const maxScore = Math.max(...Object.values(teamScores));
    const winners = teamIds.filter(tid => teamScores[tid] === maxScore);
    winners.forEach(tid => { winCounts[tid] += 1 / winners.length; }); // split ties
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
  if (odds.startsWith("-")) return "#c8922a"; // heavy favorite
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

export default function App() {
  const [page, setPage] = useState("leaderboard");
  const [selectedSeason, setSelectedSeason] = useState(50);
  const [castawaysBySeason, setCastawaysBySeason] = useState({ 50: buildCastaways(50), 46: buildCastaways(46), 45: buildCastaways(45) });
  const [nextElimBySeason, setNextElimBySeason] = useState({ 50: 1, 46: 19, 45: 19 });
  // Draft state per season: randomOrder = order teams rolled, draftPositions = {teamId: positionIndex}
  const [draftStateBySeason, setDraftStateBySeason] = useState({ 50: { randomOrder: null, draftPositions: {} }, 46: { randomOrder: null, draftPositions: {} }, 45: { randomOrder: null, draftPositions: {} } });
  const [toast, setToast] = useState(null);

  const season = SEASONS.find(s => s.id === selectedSeason);
  const castaways = castawaysBySeason[selectedSeason];
  const nextElimOrder = nextElimBySeason[selectedSeason];
  const draftState = draftStateBySeason[selectedSeason];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const setCastaways = useCallback((updater) => {
    setCastawaysBySeason(prev => ({ ...prev, [selectedSeason]: typeof updater === "function" ? updater(prev[selectedSeason]) : updater }));
  }, [selectedSeason]);

  const setDraftState = useCallback((updater) => {
    setDraftStateBySeason(prev => ({ ...prev, [selectedSeason]: typeof updater === "function" ? updater(prev[selectedSeason]) : updater }));
  }, [selectedSeason]);

  const resetSeason = () => {
    setCastawaysBySeason(prev => ({ ...prev, [selectedSeason]: buildCastaways(selectedSeason) }));
    setNextElimBySeason(prev => ({ ...prev, [selectedSeason]: selectedSeason !== 50 ? 19 : 1 }));
    setDraftStateBySeason(prev => ({ ...prev, [selectedSeason]: { randomOrder: null, draftPositions: {} } }));
    showToast(`Season ${selectedSeason} has been reset.`);
  };

  const undoLastDraftPick = () => {
    const picked = castaways.filter(c => c.draftedBy !== null);
    if (picked.length === 0) { showToast("No picks to undo."); return; }
    // Find the most recently drafted castaway based on draft sequence position
    const draftOrder = buildDraftOrder();
    const totalPicks = TEAMS.length * season.picksPerTeam;
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

  // Build draft order from positions (position 1 = picks first in round 1)
  const buildDraftOrder = () => {
    const pos = draftState.draftPositions;
    if (Object.keys(pos).length < TEAMS.length) return TEAMS.map(t => t.id);
    return [...TEAMS].sort((a,b) => (pos[a.id]||99) - (pos[b.id]||99)).map(t => t.id);
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
              <button key={p} className={`nav-btn ${page===p?"active":""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </nav>
          <div className="header-commissioner">Commissioner</div>
        </header>
        <div className="container">
          <div className="season-bar">
            <span className="season-label">Season</span>
            {SEASONS.map(s => (
              <button key={s.id} className={`season-btn ${selectedSeason===s.id?"active":""}`} onClick={() => setSelectedSeason(s.id)}>
                {s.id}{s.current && <span className="live-pill">live</span>}
              </button>
            ))}
          </div>
          {page==="leaderboard" && <Leaderboard scores={scores} season={season} castaways={castaways} />}
          {page==="castaways"   && <Castaways castaways={castaways} season={season} />}
          {page==="draft"       && <Draft castaways={castaways} season={season} draftState={draftState} randomizeOrder={randomizeOrder} selectPosition={selectPosition} buildDraftOrder={buildDraftOrder} setCastaways={setCastaways} showToast={showToast} undoLastDraftPick={undoLastDraftPick} />}
          {page==="admin"       && <Admin castaways={castaways} nextElimOrder={nextElimOrder} season={season} eliminate={eliminate} restore={restore} resetSeason={resetSeason} />}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
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

function Leaderboard({ scores, season, castaways }) {
  const eliminated = castaways.filter(c => c.eliminationOrder).length;
  const hasDrafted = castaways.some(c => c.draftedBy);
  const hasOdds = season.id === 50;

  // Build teamDraftMap: castawayId -> teamId
  const teamDraftMap = {};
  castaways.forEach(c => { if (c.draftedBy) teamDraftMap[c.id] = c.draftedBy; });

  // Run simulation only if we have picks and odds
  const simResults = (hasDrafted && hasOdds)
    ? runFantasySimulation(castaways, teamDraftMap, season.totalCastaways, 5000)
    : null;

  return (
    <div>
      <div className="page-title">Leaderboard</div>
      <div className="page-subtitle">
        Season {season.id}: In the Hands of the Fans · {season.totalCastaways} Castaways · {eliminated} Eliminated · {season.totalCastaways - eliminated} Remaining
        {simResults && <span style={{color:"#999"}}> · odds via 5,000-season Monte Carlo sim</span>}
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
                {sim && (
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
                        : (c.odds ? ` · ${c.odds}` : "")}
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

function Castaways({ castaways, season }) {
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
      <div className="odds-key" style={{marginBottom:"1.5rem"}}>
        <span><span className="odds-dot" style={{background:"#c8922a"}} /> Heavy favorite (odds-)</span>
        <span><span className="odds-dot" style={{background:"#6db86d"}} /> Strong contender (+700–1000)</span>
        <span><span className="odds-dot" style={{background:"#6a9fd8"}} /> Solid shot (+1000–2500)</span>
        <span><span className="odds-dot" style={{background:"#aaa"}} /> Longshot (+2500+)</span>
      </div>
      {alive.length > 0 && (<><div className="section-title">Active — {alive.length}</div><div className="castaways-grid">{alive.map(c => <CastawayCard key={c.id} c={c} season={season} />)}</div></>)}
      {undrafted.length > 0 && (<><div className="section-title">Undrafted — {undrafted.length}</div><div className="castaways-grid">{undrafted.map(c => <CastawayCard key={c.id} c={c} season={season} />)}</div></>)}
      {eliminated.length > 0 && (<><div className="divider" /><div className="section-title">Eliminated — {eliminated.length}</div><div className="castaways-grid">{eliminated.map(c => <CastawayCard key={c.id} c={c} season={season} />)}</div></>)}
    </div>
  );
}

function CastawayCard({ c, season }) {
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
            }}>{c.tribe}</span>
          </div>
        )}
        <div className="c-row">
          <div className="c-tribe" style={{color: team ? team.color : "#888"}}>{team ? team.name : "Undrafted"}</div>
          {c.odds && <div className="c-odds" style={{color: oddsColor(c.odds)}}>{c.odds}</div>}
        </div>
        <div className={`c-status ${cls}`} style={{marginTop:"0.2rem"}}>{c.eliminationOrder ? `Elim. #${c.eliminationOrder}` : (c.draftedBy ? "Active" : "—")}</div>
        {pts !== null && <div className="c-pts">{pts} pts</div>}
      </div>
    </div>
  );
}

function Draft({ castaways, season, draftState, randomizeOrder, selectPosition, buildDraftOrder, setCastaways, showToast, undoLastDraftPick }) {
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

  // Which team is next to pick a position
  const nextPositionPicker = randomOrder ? randomOrder.find(tid => draftPositions[tid] === undefined) : null;
  const nextPositionTeam = nextPositionPicker ? TEAMS.find(t => t.id === nextPositionPicker) : null;

  return (
    <div>
      <div className="page-title">Draft Board</div>
      <div className="page-subtitle">Season {season.id} · Snake Draft · {season.picksPerTeam} Rounds · {totalPicks} Picks · {season.undrafted} Undrafted</div>

      {/* PHASE 1: Randomizer & Position Selection */}
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
                        <div className="rand-team" style={{color: team.color}}>{team.name} <span style={{color:"#999",fontWeight:400,fontSize:"0.62rem"}}>{team.members}</span></div>
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
                              <button key={pos} className={`pos-btn ${taken ? "taken" : "available"}`} onClick={() => !taken && selectPosition(tid, pos)} disabled={taken}>
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

      {/* PHASE 2: Draft */}
      {allPositionsPicked && (
        <>
          <div style={{fontSize:"0.72rem",color:"#aaa",marginBottom:"1rem",letterSpacing:"0.06em"}}>
            Draft order: {draftOrder.map(id => TEAMS.find(t=>t.id===id).name).join(" → ")} (snake)
          </div>
          {!draftComplete && currentTeam && (
            <div className="draft-status-bar">
              <div className="on-clock">On the clock: <strong style={{color:currentTeam.color}}>{currentTeam.name}</strong> <span style={{fontSize:"0.65rem",color:"#aaa",marginLeft:"0.5rem"}}>{currentTeam.members}</span></div>
              <div className="round-info">Round {currentPick.round} · Pick {pickedCount+1} of {totalPicks}</div>
            </div>
          )}
          {draftComplete && <div style={{textAlign:"center",padding:"1.5rem",color:"#999",fontSize:"0.78rem",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"1.5rem",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px"}}>✓ Draft Complete</div>}
          {pickedCount > 0 && (
            <button className="action-btn" style={{background:"rgba(200,60,60,0.08)",borderColor:"rgba(200,60,60,0.3)",color:"#cc6060",marginLeft:"0.5rem"}} onClick={undoLastDraftPick}>
              ↩ Undo Last Pick
            </button>
          )}
        </>
      )}

      <div className="draft-layout">
        <div>
          {preEliminated.length > 0 && (<>
            <div className="section-title">Pre-Draft Eliminated — Not Available ({preEliminated.length})</div>
            <div className="draft-available-grid" style={{marginBottom:"1.5rem"}}>
              {preEliminated.map(c => (
                <div key={c.id} className="draft-card pre-elim">
                  <Photo src={c.photo} alt={c.name} className="dc-photo" />
                  <div className="dc-info"><div className="dc-name">{c.name}</div><div className="dc-odds" style={{color:"#999"}}>out #{c.eliminationOrder}</div></div>
                </div>
              ))}
            </div>
          </>)}
          <div className="section-title">Available to Draft ({available.length})</div>
          <div className="draft-available-grid">
            {available.map(c => (
              <div key={c.id} className="draft-card" onClick={() => allPositionsPicked && !draftComplete && currentTeam && draftPick(c.id)}>
                <Photo src={c.photo} alt={c.name} className="dc-photo" />
                <div className="dc-info">
                  <div className="dc-name">{c.name}</div>
                  {c.odds && <div className="dc-odds" style={{color: oddsColor(c.odds)}}>{c.odds}</div>}
                </div>
                {allPositionsPicked && !draftComplete && currentTeam && <button className="dc-pick-btn" onClick={(e) => {e.stopPropagation(); draftPick(c.id);}}>Pick for {currentTeam.name}</button>}
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
                <div className="team-picks-label" style={{color:team.color}}>{team.name} · {team.members} · {teamPicks.length}/{season.picksPerTeam}</div>
                {Array.from({length: season.picksPerTeam}).map((_,i) => {
                  const pick = teamPicks[i];
                  return (
                    <div key={i} className="pick-row">
                      {pick ? (
                        <><Photo src={pick.photo} alt={pick.name} className="pick-photo-sm" /><span style={{flex:1}}>{pick.name}</span><span style={{fontSize:"0.58rem",color:oddsColor(pick.odds)}}>{pick.odds}</span></>
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

function Admin({ castaways, nextElimOrder, season, eliminate, restore, resetSeason }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const alive      = castaways.filter(c => !c.eliminationOrder);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a,b) => b.eliminationOrder - a.eliminationOrder);
  const seasonOver = nextElimOrder > season.totalCastaways;
  return (
    <div>
      <div className="page-title">Commissioner Panel</div>
      <div className="page-subtitle">Season {season.id} · {seasonOver ? "Season Complete" : `Next elimination #${nextElimOrder} · ${calcPoints(nextElimOrder, season.totalCastaways)} pts`}</div>
      <div style={{marginBottom:"1.5rem",display:"flex",gap:"0.75rem",alignItems:"center"}}>
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
      {!seasonOver && alive.length > 0 && (<>
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
      </>)}
      {eliminated.length > 0 && (<>
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
      </>)}
    </div>
  );
}
