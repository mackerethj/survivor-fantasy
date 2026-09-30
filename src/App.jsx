// src/App.jsx  —  Fantasy Survivor · Season 51 Edition
import { useEffect, useState } from "react";

const SPLASH_VERSION = "s51_week1_v1";

// ─── Scoring ──────────────────────────────────────────────────────────────────
function calcPoints(eliminationOrder, totalCastaways) {
  if (!eliminationOrder || eliminationOrder <= 2) return 0;
  const lastThreeStart = totalCastaways - 2;
  if (eliminationOrder >= lastThreeStart) {
    const basePoints = lastThreeStart - 3 + 1;
    const stepsIntoFinalThree = eliminationOrder - (lastThreeStart - 1);
    return basePoints + stepsIntoFinalThree * 2;
  }
  return eliminationOrder - 2;
}

// ─── Teams ────────────────────────────────────────────────────────────────────
const TEAMS = [
  { id: 1, name: "Miloa",   members: "Team Miller",    color: "#c8922a" },
  { id: 2, name: "Jinga",   members: "Team Mackereth", color: "#6a9fd8" },
  { id: 3, name: "Ojalu",   members: "Team Lestan",    color: "#6db86d" },
  { id: 4, name: "Weloki",  members: "Team Wells",     color: "#c46ab0" },
  { id: 5, name: "Nochoso", members: "The Unchosen",   color: "#888888" },
];

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

// Season 51 cast. Week 1 results are applied below. Draft assignments remain local.
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
    occupation: "Actress / Voice Actor",
    bio: "Award-winning Canadian actor known for animation voice work including Strawberry Shortcake and My Little Pony, plus a live-action role on The Boys.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/ana2424.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Brady Booker",
    age: 26,
    hometown: "LaSalle, IL → Orlando, FL",
    occupation: "Pro Wrestler / Trainer",
    bio: "Former WWE/NXT performer Bodhi Hayward and former college football player. Likely one of the most obvious early physical-threat profiles.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/bradyb-113.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Carter Krull",
    age: 25,
    hometown: "Rock Rapids, IA",
    occupation: "Farmer / Cattle Rancher",
    bio: "Runs Moon Creek Farms. Former University of Sioux Falls football player with farm/ranch life experience that should translate well to camp.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/carter_1313.png",
    tribe: "TBD", draftedBy: null,
  },
  {
