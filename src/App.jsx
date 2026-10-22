// src/App.jsx  —  Fantasy Survivor · Season 51 Edition
import { useEffect, useState } from "react";

const SPLASH_VERSION = "s51_week5_results_v1";

// ─── Scoring ──────────────────────────────────────────────────────────────────
// Same placement values as the History page (Season 50): first two out score
// zero; thereafter each successive placement adds one point until the final
// three, which increase by two points each. Active players are provisional.
const CURRENT_WEEK = 5;
const ELIMINATIONS = { "Aaliyah Puglia": 1, "Ana Sani": 2, "Rob Antonson": 3, "Patt Cannaday": 4, "Jenna Doore": 5, "Alexis Levine": 6, "Linnea Capobianco": 7 };
const ELIMINATION_WEEKS = { "Aaliyah Puglia": 1, "Ana Sani": 2, "Rob Antonson": 3, "Patt Cannaday": 3, "Jenna Doore": 4, "Alexis Levine": 5, "Linnea Capobianco": 5 };
const COMPLETED_ELIMINATIONS = Object.keys(ELIMINATIONS).length;
function placementPoints(eliminationOrder, totalCastaways) {
  if (eliminationOrder <= 2) return 0;
  const finalThreeStart = totalCastaways - 2;
  if (eliminationOrder >= finalThreeStart) {
    const fourthPlacePoints = finalThreeStart - 3;
    return fourthPlacePoints + (eliminationOrder - finalThreeStart + 1) * 2;
  }
  return eliminationOrder - 2;
}
function calcPoints(c) {
  const total = SEASONS.find(season => season.current).totalCastaways;
  return placementPoints(c.eliminationOrder ?? COMPLETED_ELIMINATIONS + 1, total);
}

// ─── Teams ────────────────────────────────────────────────────────────────────
const TEAMS = [
  { id: 1, name: "Miloa",   members: "Team Miller",    color: "#c8922a" },
  { id: 2, name: "Jinga",   members: "Team Mackereth", color: "#6a9fd8" },
  { id: 3, name: "Ojalu",   members: "Team Lestan",    color: "#6db86d" },
  { id: 4, name: "Weloki",  members: "Team Wells",     color: "#c46ab0" },
];

// Five rounds, four teams. Round 5 continues the existing snake order.
const DRAFT_ORDER = [4, 3, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1, 1, 2, 3, 4, 4, 3, 2, 1];
const DRAFT_KEY = "sf_s51_draft_v1";
// Confirmed completed draft. Published picks override older browser drafts.
const CONFIRMED_DRAFT = [
  "Kristin Flickinger", "Danny 'Kilby' Kilby", "Ana Sani", "Sharonda Cox",
  "Patt Cannaday", "Carter Krull", "Michael Pinsky", "Devin Way",
  "Jenna Doore", "Maggie Nestor", "Angelica 'Jelly' Loblack", "Rob Antonson",
  "Alexis Levine", "Eric Macksoud", "Cristian Chavez", "Ori Jean-Charles",
  "Lewis Kelly", "Linnea Capobianco", "Thien An Nguyen", "Brady Booker",
];
function loadDraft() {
  return [...CONFIRMED_DRAFT];
}

// ─── Season config ────────────────────────────────────────────────────────────
const SEASONS = [
  { id: 51, label: "Season 51", totalCastaways: 21, current: true },
  { id: 50, label: "Season 50", totalCastaways: 24 },
  { id: 49, label: "Season 49", totalCastaways: 18 },
  { id: 48, label: "Season 48", totalCastaways: 18 },
  { id: 47, label: "Season 47", totalCastaways: 18 },
  { id: 46, label: "Season 46", totalCastaways: 18 },
  { id: 45, label: "Season 45", totalCastaways: 18 },
  { id: 44, label: "Season 44", totalCastaways: 18 },
  { id: 43, label: "Season 43", totalCastaways: 18 },
];

// Season 51 cast. Results through Week 3 are applied below. Draft assignments use the confirmed published picks.
const S51_CASTAWAYS = [
  {
    name: "Aaliyah Puglia",
    age: 25,
    hometown: "Providence, RI",
    occupation: "Chef",
    bio: "Professional chef with culinary nutrition training from Johnson & Wales. Reportedly worked with the New England Patriots and specializes in plant-based cuisine.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/aaliyaj-12%C2%A71.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Alexis Levine",
    age: 28,
    hometown: "Atlanta, GA",
    occupation: "Attorney",
    bio: "Criminal defense attorney and Emory Law graduate. Public-interest/legal-reform profile makes her a strong talker and potential social strategist.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/alex-asdasd.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Angelica 'Jelly' Loblack",
    age: 29,
    hometown: "Bloomington, IN",
    occupation: "Sociology Professor",
    bio: "Indiana University sociology professor whose research focuses on racialization, identity, embodiment, and political engagement.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/jelly-q44.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Ana Sani",
    age: 34,
    hometown: "Toronto, ON",
