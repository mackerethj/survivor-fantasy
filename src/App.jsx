// src/App.jsx  —  Fantasy Survivor · Season 51 Edition
import { useEffect, useState } from "react";

const SPLASH_VERSION = "s51_preseason_v1.3";

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

// ─── Season 51 Rumored Cast ───────────────────────────────────────────────────
// Source: Inside Survivor / EntertainmentNow leaks (May-June 2026, unconfirmed)
// 21 rumored first-time players. CBS has not announced names yet. draftedBy null until draft.
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
    name: "Cristian Chavez",
    age: 25,
    hometown: "Salt Lake City, UT",
    occupation: "Human Resources Executive",
    bio: "Reported S47 alternate who finally made it on. Mr. USU Congeniality winner with an oddball gem-collector hook.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/cc_508.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Daniel Kilby",
    age: 28,
    hometown: "London, Ontario, Canada",
    occupation: "Game Studio Founder",
    bio: "Founder of Noodle Goose Games and co-host of The Winner's Edit Survivor podcast. Superfan/game-theory profile.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/dk_5w4.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Devin Way",
    age: 33,
    hometown: "Lufkin, TX → West Hollywood, CA",
    occupation: "Actor / Model",
    bio: "Actor/model with credits including Grey's Anatomy, Queer as Folk, and Sistas. Charisma archetype with a built-in threat-management question.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/devin_4242.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Eric Macksoud",
    age: 34,
    hometown: "Sunderland, MA",
    occupation: "Mental Health Therapist",
    bio: "Former Clark University swimmer and theater performer. Counselor background could help with emotional reads and tribe management.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/ericm-adsad.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Jenna Greenawalt",
    age: 31,
    hometown: "Maumee, OH → Arizona",
    occupation: "Wedding Videographer",
    bio: "Wedding photographer/videographer and dedicated Survivor fan. Creative storyteller type who may read people well.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/jenna-31313.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Kristin Flickinger",
    age: 49,
    hometown: "Santa Barbara, CA",
    occupation: "Former Pride Director",
    bio: "Oldest rumored castaway. JD from Willamette; reportedly raised $20M+ for HIV services and has applied for years.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/kristin_24424.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Lewis Kelly",
    age: 28,
    hometown: "Dublin, Ireland → Puerto Rico",
    occupation: "Influencer / Model",
    bio: "TikTok creator/model and reportedly the first Irish-born castaway. Became a U.S. citizen in 2025 after moving to Puerto Rico.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/lewis_asdad.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Linnea Capobianco",
    age: 26,
    hometown: "Kearny, NJ → New York City",
    occupation: "Sex Store Owner",
    bio: "Co-owner of Afterglow in NYC with her brother. Former soccer/lacrosse athlete; likely comfortable in direct conversations.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/linnea_dsafas.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Maggie Nestor",
    age: 40,
    hometown: "Charles Town, WV",
    occupation: "Camp Counselor / Farmer",
    bio: "Reportedly the first West Virginia castaway. Homeschools three kids while working as a camp counselor and farmer.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/mag.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Michael Pinsky",
    age: 32,
    hometown: "New York, NY",
    occupation: "Baseball Operations",
    bio: "Assistant Director of Baseball Operations for the New York Yankees. Princeton grad with a sports-analytics/front-office profile.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/mike-assa.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Ori Jean-Charles",
    age: 27,
    hometown: "Monsey, NY",
    occupation: "Personal Trainer / Youth Director",
    bio: "'Coach O' — Director of Youth Services at the MLK Center of Rockland and former University at Albany linebacker.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/ojads.jpg",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Patt Cannaday",
    age: 33,
    hometown: "Norfolk, VA",
    occupation: "U.S. Navy Attorney",
    bio: "Attorney for the U.S. Navy. JD from Washington University in St. Louis; runs a boxing club for at-risk youth.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/pattc_252.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Rob Antonson",
    age: 40,
    hometown: "Boston, MA",
    occupation: "Airport Operations",
    bio: "JetBlue/Logan Airport operations worker and aspiring comedian who hosts The Rob Show podcast.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/roba_2q131.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Sharonda Renee",
    age: 34,
    hometown: "Berea, KY",
    occupation: "OBGYN",
    bio: "OBGYN and avid traveler. Reported medical-background player with a polished professional presence.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/sharo-424.png",
    tribe: "TBD", draftedBy: null,
  },
  {
    name: "Thien An Nguyen",
    age: 25,
    hometown: "Fort Worth, TX",
    occupation: "Medical Student",
    bio: "TCU medical student and marathon runner. Young, high-achieving profile with endurance upside.",
    photoUrl: "https://inside-survivor.ams3.digitaloceanspaces.com/wp-content/uploads/2026/05/thien-asdas.png",
    tribe: "TBD", draftedBy: null,
  },
];

// ─── Historical results (unchanged) ──────────────────────────────────────────
const S50_RESULTS = {
  season: 50,
  teamScores: [
    { name: "Jinga",   members: "Team Mackereth", color: "#6a9fd8", score: 84, winner: true },
    { name: "Weloki",  members: "Team Wells",     color: "#c46ab0", score: 71 },
    { name: "Ojalu",   members: "Team Lestan",    color: "#6db86d", score: 52 },
    { name: "Miloa",   members: "Team Miller",    color: "#c8922a", score: 41 },
    { name: "Nochoso", members: "The Unchosen",   color: "#888888", score: 14 },
  ],
  placements: [
    { place: 24, points: 26, player: "Aubry Bracco",           team: "Weloki",  teamColor: "#c46ab0" },
    { place: 23, points: 24, player: "Jonathan Young",         team: "Jinga",   teamColor: "#6a9fd8" },
    { place: 22, points: 22, player: "Joe Hunter",             team: "Ojalu",   teamColor: "#6db86d" },
    { place: 21, points: 19, player: "Rizo Velovic",           team: "Jinga",   teamColor: "#6a9fd8" },
    { place: 20, points: 18, player: "Tiffany Ervin",          team: "Jinga",   teamColor: "#6a9fd8" },
    { place: 19, points: 17, player: "Cirie Fields",           team: "Weloki",  teamColor: "#c46ab0" },
    { place: 18, points: 16, player: "Rick Devens",            team: "Weloki",  teamColor: "#c46ab0" },
    { place: 17, points: 15, player: "Ozzy Lusth",             team: "Jinga",   teamColor: "#6a9fd8" },
    { place: 16, points: 14, player: "Emily Flippen",          team: "Miloa",   teamColor: "#c8922a" },
    { place: 15, points: 13, player: "Stephenie LaGrossa",     team: "Ojalu",   teamColor: "#6db86d" },
    { place: 14, points: 12, player: "Christian Hubicki",      team: "Miloa",   teamColor: "#c8922a" },
    { place: 13, points: 11, player: "Coach Wade",             team: "Miloa",   teamColor: "#c8922a" },
    { place: 12, points: 10, player: "Chrissy Hofbeck",        team: "Nochoso", teamColor: "#888888" },
    { place: 11, points: 9,  player: "Dee Valladares",         team: "Ojalu",   teamColor: "#6db86d" },
    { place: 10, points: 8,  player: "Colby Donaldson",        team: "Jinga",   teamColor: "#6a9fd8" },
    { place: 9,  points: 7,  player: "Genevieve Mushaluk",     team: "Weloki",  teamColor: "#c46ab0" },
    { place: 8,  points: 6,  player: "Kamilla Karthigesu",     team: "Ojalu",   teamColor: "#6db86d" },
    { place: 7,  points: 5,  player: "Charlie Davis",          team: "Weloki",  teamColor: "#c46ab0" },
    { place: 6,  points: 4,  player: "Angelina Keeley",        team: "Nochoso", teamColor: "#888888" },
    { place: 5,  points: 3,  player: "Mike White",             team: "Miloa",   teamColor: "#c8922a" },
    { place: 4,  points: 2,  player: "Q Burdette",             team: "Ojalu",   teamColor: "#6db86d" },
    { place: 3,  points: 1,  player: "Savannah Louie",         team: "Miloa",   teamColor: "#c8922a" },
    { place: 2,  points: 0,  player: "Kyle Fraser",            team: "Nochoso", teamColor: "#888888" },
    { place: 1,  points: 0,  player: "Jenna Lewis-Dougherty",  team: "Nochoso", teamColor: "#888888" },
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
    { place: 18, points: 20, player: "Savannah", team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 17, points: 18, player: "Sam",      team: "Ojalu",  teamColor: "#6db86d" },
    { place: 16, points: 14, player: "Dee",      team: "Weloki", teamColor: "#c46ab0" },
    { place: 15, points: 13, player: "Tiff",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 12, player: "Eva",      team: "Ojalu",  teamColor: "#6db86d" },
    { place: 13, points: 11, player: "Kamilla",  team: "Weloki", teamColor: "#c46ab0" },
    { place: 12, points: 10, player: "Rachel",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 11, points: 9,  player: "Kyle",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 10, points: 8,  player: "Hunter",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 9,  points: 7,  player: "Soda",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 8,  points: 6,  player: "Kenzie",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 7,  points: 5,  player: "Shauhin",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 6,  points: 4,  player: "Venus",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 5,  points: 3,  player: "Q",        team: "Ojalu",  teamColor: "#6db86d" },
    { place: 4,  points: 2,  player: "Teeny",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 3,  points: 2,  player: "Maria",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 2,  points: 1,  player: "Randen",   team: "NA",     teamColor: "#777" },
    { place: 1,  points: 0,  player: "Nicole",   team: "NA",     teamColor: "#777" },
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
    { place: 18, points: 20, player: "Kyle",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 17, points: 18, player: "Genevieve", team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 16, points: 14, player: "Kenzie",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 15, points: 13, player: "Kamilla",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 14, points: 12, player: "Eva",       team: "Weloki", teamColor: "#c46ab0" },
    { place: 13, points: 11, player: "Tiff",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 12, points: 10, player: "Joe",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 9,  player: "Saiounia",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 10, points: 8,  player: "Shauhin",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 9,  points: 7,  player: "David",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 8,  points: 6,  player: "Charity",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 7,  points: 5,  player: "Cedrek",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 6,  points: 4,  player: "Mary",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 5,  points: 3,  player: "Teeny",     team: "Weloki", teamColor: "#c46ab0" },
    { place: 4,  points: 2,  player: "Kevin",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 3,  points: 2,  player: "Bianca",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 2,  player: "Chrissy",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 1,  points: 0,  player: "Stephanie", team: "NA",     teamColor: "#777" },
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
    { place: 18, points: 46, player: "Rachel",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 17, points: 38, player: "Sam",       team: "Miloa",  teamColor: "#c8922a" },
    { place: 16, points: 27, player: "Sue",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 24, player: "Genevieve", team: "Weloki", teamColor: "#c46ab0" },
    { place: 14, points: 21, player: "Kyle",      team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 13, points: 20, player: "Andy",      team: "NA",     teamColor: "#777" },
    { place: 12, points: 17, player: "Teeny",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 11, points: 15, player: "Gabe",      team: "Ojalu",  teamColor: "#6db86d" },
    { place: 10, points: 14, player: "Sierra",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 9,  points: 12, player: "Sol",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 8,  points: 12, player: "Caroline",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 7,  points: 10, player: "Rome",      team: "Miloa",  teamColor: "#c8922a" },
    { place: 6,  points: 10, player: "Tiyana",    team: "Weloki", teamColor: "#c46ab0" },
    { place: 5,  points: 8,  player: "Anika",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 4,  points: 2,  player: "Kishan",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 3,  points: 2,  player: "Aysha",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 0,  player: "TK",        team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 1,  points: 0,  player: "Jon",       team: "NA",     teamColor: "#777" },
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
    { place: 18, points: 29, player: "Kenzie",  team: "Weloki", teamColor: "#c46ab0" },
    { place: 17, points: 27, player: "Charlie", team: "Miloa",  teamColor: "#c8922a" },
    { place: 16, points: 23, player: "Ben",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 19, player: "Liz",     team: "NA",     teamColor: "#777" },
    { place: 14, points: 21, player: "Maria",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 13, points: 24, player: "Q",       team: "Ojalu",  teamColor: "#6db86d" },
    { place: 12, points: 21, player: "Venus",   team: "Weloki", teamColor: "#c46ab0" },
    { place: 11, points: 10, player: "Tiffany", team: "Miloa",  teamColor: "#c8922a" },
    { place: 10, points: 20, player: "Hunter",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 9,  points: 16, player: "Tevin",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 8,  points: 13, player: "Soda",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 7,  points: 9,  player: "Tim",     team: "Ojalu",  teamColor: "#6db86d" },
    { place: 6,  points: 5,  player: "Jem",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 5,  points: 0,  player: "Moriah",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 4,  points: 3,  player: "Bhanu",   team: "Miloa",  teamColor: "#c8922a" },
    { place: 3,  points: 5,  player: "Randen",  team: "Weloki", teamColor: "#c46ab0" },
    { place: 2,  points: 4,  player: "Jess",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 1,  points: 0,  player: "David",   team: "NA",     teamColor: "#777" },
  ],
};
const S45_RESULTS = {
  season: 45,
  teamScores: [
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 121, winner: true },
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 118 },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 51  },
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 0,   na: true },
  ],
  placements: [
    { place: 18, points: 38, player: "Dee",     team: "Miloa",  teamColor: "#c8922a" },
    { place: 17, points: 28, player: "Austin",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 16, points: 19, player: "Drew",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 15, points: 44, player: "Julie",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 20, player: "Katura",  team: "Ojalu",  teamColor: "#6db86d" },
    { place: 13, points: 13, player: "Niki",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 12, points: 11, player: "Emily",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 11, points: 20, player: "Bruce",   team: "Miloa",  teamColor: "#c8922a" },
    { place: 10, points: 11, player: "Kellie",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 9,  points: 12, player: "Kendra",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 8,  points: 33, player: "Jake",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 7,  points: 32, player: "Kaleb",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 6,  points: 10, player: "J.",      team: "NA",     teamColor: "#777" },
    { place: 5,  points: 6,  player: "Brando",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 4,  points: 3,  player: "Sean",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 3,  points: 0,  player: "Sabiyah", team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 0,  player: "Brandon", team: "NA",     teamColor: "#777" },
    { place: 1,  points: 0,  player: "Hanna",   team: "NA",     teamColor: "#777" },
  ],
};
const S44_RESULTS = {
  season: 44,
  teamScores: [
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 56, winner: true },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 40 },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 24 },
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 0,  na: true },
  ],
  placements: [
    { place: 18, points: 21, player: "Yam Yam",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 17, points: 17, player: "Heidi",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 16, points: 14, player: "Carolyn",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 15, points: 12, player: "Carson",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 11, player: "Lauren",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 13, points: 10, player: "Jaime",    team: "NA",     teamColor: "#777" },
    { place: 12, points: 9,  player: "Danny",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 11, points: 8,  player: "Frannie",  team: "Ojalu",  teamColor: "#6db86d" },
    { place: 10, points: 7,  player: "Kane",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 9,  points: 6,  player: "Brandon",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 8,  points: 5,  player: "MattB",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 7,  points: 4,  player: "Josh",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 6,  points: 3,  player: "MattG",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 5,  points: 2,  player: "Sarah",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 4,  points: 1,  player: "Claire",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 3,  points: 0,  player: "Helen",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 2,  points: 0,  player: "Maddy",    team: "NA",     teamColor: "#777" },
    { place: 1,  points: 0,  player: "Bruce",    team: "NA",     teamColor: "#777" },
  ],
};
const S43_RESULTS = {
  season: 43,
  teamScores: [
    { name: "Jinga",  members: "Team Mackereth", color: "#6a9fd8", score: 56, winner: true },
    { name: "Miloa",  members: "Team Miller",    color: "#c8922a", score: 40 },
    { name: "Ojalu",  members: "Team Lestan",    color: "#6db86d", score: 35 },
    { name: "Weloki", members: "Team Wells",     color: "#c46ab0", score: 0,  na: true },
  ],
  placements: [
    { place: 18, points: 22, player: "Gabler",  team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 17, points: 18, player: "Cassidy", team: "Miloa",  teamColor: "#c8922a" },
    { place: 16, points: 15, player: "Owen",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 15, points: 13, player: "Jesse",   team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 14, points: 12, player: "Karla",   team: "Miloa",  teamColor: "#c8922a" },
    { place: 13, points: 11, player: "Cody",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 12, points: 10, player: "Sami",    team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 11, points: 9,  player: "Noelle",  team: "NA",     teamColor: "#777" },
    { place: 10, points: 8,  player: "Ryan",    team: "Miloa",  teamColor: "#c8922a" },
    { place: 9,  points: 7,  player: "James",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 8,  points: 6,  player: "Jeanine", team: "NA",     teamColor: "#777" },
    { place: 7,  points: 5,  player: "Dwight",  team: "Miloa",  teamColor: "#c8922a" },
    { place: 6,  points: 4,  player: "Elie",    team: "Ojalu",  teamColor: "#6db86d" },
    { place: 5,  points: 3,  player: "Geo",     team: "Jinga",  teamColor: "#6a9fd8" },
    { place: 4,  points: 2,  player: "Lindsay", team: "Miloa",  teamColor: "#c8922a" },
    { place: 3,  points: 1,  player: "Nneka",   team: "Ojalu",  teamColor: "#6db86d" },
    { place: 2,  points: 0,  player: "Justine", team: "Miloa",  teamColor: "#c8922a" },
    { place: 1,  points: 0,  player: "Morriah", team: "NA",     teamColor: "#777" },
  ],
};

const HISTORICAL = { 50: S50_RESULTS, 49: S49_RESULTS, 48: S48_RESULTS, 47: S47_RESULTS, 46: S46_RESULTS, 45: S45_RESULTS, 44: S44_RESULTS, 43: S43_RESULTS };

const SEASON_WINNERS = [
  { season: 43, winner: "Jinga"  },
  { season: 44, winner: "Jinga"  },
  { season: 45, winner: "Miloa"  },
  { season: 46, winner: "Weloki" },
  { season: 47, winner: "Weloki" },
  { season: 48, winner: "Jinga"  },
  { season: 49, winner: "Jinga"  },
  { season: 50, winner: "Jinga"  },
];

function getChampionshipsThrough(season) {
  const counts = {};
  for (const s of SEASON_WINNERS) {
    if (s.season <= season) counts[s.winner] = (counts[s.winner] || 0) + 1;
  }
  return counts;
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sf_s51_state";
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function hydrateCastaways(savedCastaways = []) {
  const savedByName = new Map(savedCastaways.map(c => [c.name, c]));
  return S51_CASTAWAYS.map((base, i) => {
    const saved = savedByName.get(base.name) || {};
    return {
      ...base,
      draftedBy: saved.draftedBy ?? base.draftedBy ?? null,
      eliminationOrder: saved.eliminationOrder ?? null,
      tribe: saved.tribe ?? base.tribe ?? "TBD",
      id: i + 1,
    };
  });
}

function initials(name = "") {
  return name
    .replace(/'[^']*'/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("") || "?";
}

function ordinal(n) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080c0a; color: #f0ebe0; font-family: 'DM Mono', monospace; }
  .app { min-height: 100vh; background: #080c0a; background-image: radial-gradient(ellipse at 15% 15%, rgba(60,140,80,0.06) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(40,100,60,0.05) 0%, transparent 55%); }
  .header { border-bottom: 1px solid rgba(80,160,100,0.25); padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: rgba(8,12,10,0.97); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(8px); flex-wrap: wrap; }
  .logo { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 900; color: #5aaa72; letter-spacing: 0.04em; white-space: nowrap; }
  .logo span { color: #f0ebe0; font-weight: 700; }
  .logo sub { font-size: 0.6rem; color: #6db86d; letter-spacing: 0.12em; text-transform: uppercase; margin-left: 0.4rem; font-family: 'DM Mono', monospace; vertical-align: middle; }
  .nav { display: flex; gap: 0.25rem; flex-wrap: wrap; }
  .nav-btn { background: none; border: 1px solid transparent; color: #bbb; padding: 0.4rem 0.75rem; font-family: 'DM Mono', monospace; font-size: 0.68rem; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.2s; border-radius: 2px; white-space: nowrap; }
  .nav-btn:hover { color: #f0ebe0; border-color: rgba(90,170,114,0.3); }
  .nav-btn.active { color: #5aaa72; border-color: rgba(90,170,114,0.5); background: rgba(90,170,114,0.07); }
  .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
  .season-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
  .season-label { font-size: 0.62rem; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-right: 0.5rem; }
  .season-btn { font-family: 'DM Mono', monospace; font-size: 0.65rem; padding: 0.35rem 0.75rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); background: none; color: #ccc; transition: all 0.15s; }
  .season-btn.active { background: rgba(90,170,114,0.1); border-color: rgba(90,170,114,0.4); color: #5aaa72; }
  .season-btn:hover:not(.active) { color: #f0ebe0; border-color: rgba(255,255,255,0.2); }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #f0ebe0; margin-bottom: 0.3rem; }
  .page-subtitle { font-size: 0.68rem; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem; }
  .section-title { font-size: 0.63rem; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .leaderboard { display: flex; flex-direction: column; gap: 1rem; }
  .lb-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1.25rem 1.5rem; display: grid; grid-template-columns: 2.5rem 1fr auto; align-items: center; gap: 1.5rem; }
  .lb-card.first { border-color: rgba(90,170,114,0.4); background: rgba(90,170,114,0.05); }
  .lb-rank { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; color: #444; }
  .lb-card.first .lb-rank { color: #5aaa72; }
  .lb-tribe { font-size: 1rem; font-weight: 500; margin-bottom: 0.15rem; }
  .lb-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .c-tag { font-size: 0.6rem; padding: 0.15rem 0.45rem; border-radius: 2px; letter-spacing: 0.05em; text-transform: uppercase; }
  .c-tag.alive { background: rgba(90,170,114,0.1); color: #6db86d; border: 1px solid rgba(90,170,114,0.2); }
  .c-tag.eliminated { background: rgba(255,255,255,0.02); color: #888; border: 1px solid rgba(255,255,255,0.06); text-decoration: line-through; }
  .lb-score { text-align: right; }
  .lb-pts { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; line-height: 1; }
  .lb-pts-label { font-size: 0.58rem; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.1rem; }
  .castaways-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px,1fr)); gap: 0.9rem; margin-bottom: 2rem; }
  .castaway-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; position: relative; transition: border-color 0.2s; }
  .castaway-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .castaway-card.alive::after { background: #5aaa72; }
  .castaway-card.eliminated::after { background: #555; }
  .castaway-card.rumored-player::after { background: #c8922a; }
  .castaway-card.unknown-player { opacity: 0.45; }
  .castaway-card:hover { border-color: rgba(90,170,114,0.3); }
  .c-photo-wrap { position: relative; width: 100%; aspect-ratio: 1 / 1; background: radial-gradient(circle at 50% 30%, rgba(90,170,114,0.16), rgba(255,255,255,0.03) 62%, rgba(0,0,0,0.18)); border-bottom: 1px solid rgba(255,255,255,0.06); overflow: hidden; }
  .c-photo { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(0.96) contrast(1.02); }
  .c-photo-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 900; color: rgba(240,235,224,0.72); letter-spacing: 0.04em; background: radial-gradient(circle at 50% 30%, rgba(90,170,114,0.18), rgba(255,255,255,0.04) 62%, rgba(0,0,0,0.18)); }
  .c-photo-fallback.with-photo { display: none; }
  .c-info { padding: 0.75rem 0.85rem 0.85rem; }
  .c-name { font-size: 0.75rem; font-weight: 500; margin-bottom: 0.15rem; line-height: 1.3; }
  .c-age { font-size: 0.6rem; color: #888; margin-bottom: 0.1rem; }
  .c-occ { font-size: 0.58rem; color: #5aaa72; margin-bottom: 0.2rem; font-weight: 500; line-height: 1.3; }
  .c-bio { font-size: 0.56rem; color: #ccc; margin-bottom: 0.35rem; line-height: 1.45; }
  .c-row { display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem; }
  .c-status { font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .c-status.predraft { color: #888; }
  .c-status.rumored { color: #c8922a; }
  .c-status.unknown { color: #555; }
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.5rem 0; }
  .action-btn { font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 0.5rem 1rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.15s; border: 1px solid; margin-bottom: 1rem; background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.1); color: #ccc; }
  .action-btn.primary { background: rgba(90,170,114,0.12); border-color: rgba(90,170,114,0.4); color: #5aaa72; }
  .action-btn.primary:hover { background: rgba(90,170,114,0.22); }
  @keyframes fadeUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .panel { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1rem 1.25rem; }
  .select, .input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #f0ebe0; border-radius: 3px; padding: 0.55rem 0.65rem; font-family: 'DM Mono', monospace; font-size: 0.75rem; outline: none; width: 100%; }
  .row { display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; }
  .hint { font-size:0.65rem; color:#bbb; line-height:1.5; }
  .hist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .hist-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1rem 1.25rem; }
  .hist-card.champ { border-color: rgba(90,170,114,0.4); background: rgba(90,170,114,0.06); }
  .hist-score { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; }
  .hist-table { width: 100%; border-collapse: collapse; font-size: 0.7rem; }
  .hist-table th { text-align: left; color: #bbb; font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.4rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.07); font-weight: 400; }
  .hist-table td { padding: 0.45rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .hist-table tr:last-child td { border-bottom: none; }
  .hist-table tr:hover td { background: rgba(255,255,255,0.02); }
  .rumor-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 1.1rem 1.25rem; margin-bottom: 0.75rem; position: relative; overflow: hidden; }
  .rumor-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; }
  .rumor-card.confirmed::before { background: #5aaa72; }
  .rumor-card.likely::before { background: #6a9fd8; }
  .rumor-card.rumored::before { background: #c8922a; }
  .rumor-card.speculation::before { background: #888; }
  .rumor-badge { font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 2px; display: inline-block; margin-bottom: 0.5rem; }
  .rumor-badge.confirmed { background: rgba(90,170,114,0.12); color: #5aaa72; border: 1px solid rgba(90,170,114,0.25); }
  .rumor-badge.likely { background: rgba(106,159,216,0.12); color: #6a9fd8; border: 1px solid rgba(106,159,216,0.25); }
  .rumor-badge.rumored { background: rgba(200,146,42,0.1); color: #c8922a; border: 1px solid rgba(200,146,42,0.25); }
  .rumor-badge.speculation { background: rgba(255,255,255,0.04); color: #999; border: 1px solid rgba(255,255,255,0.1); }
  .rumor-title { font-size: 0.82rem; font-weight: 500; color: #f0ebe0; margin-bottom: 0.35rem; line-height: 1.4; }
  .rumor-body { font-size: 0.68rem; color: #ccc; line-height: 1.65; }
  .rumor-source { font-size: 0.58rem; color: #666; margin-top: 0.4rem; letter-spacing: 0.06em; }
  .draft-table { width: 100%; border-collapse: collapse; font-size: 0.72rem; }
  .draft-table th { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: #888; padding: 0.5rem 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.07); text-align: left; font-weight: 400; }
  .draft-table td { padding: 0.55rem 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
  .draft-table tr:hover td { background: rgba(255,255,255,0.015); }
  @media (max-width: 700px) {
    .container { padding: 1rem; }
    .lb-card { padding: 0.9rem 1rem; grid-template-columns: 2rem 1fr auto; gap: 0.75rem; }
    .lb-rank { font-size: 1.1rem; }
    .lb-pts { font-size: 1.6rem; }
  }
`;

// ─── Splash ───────────────────────────────────────────────────────────────────
function Splash({ onDismiss }) {
  return (
    <div
      role="button" tabIndex={0}
      onClick={onDismiss}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onDismiss(); }}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #0a1a10 0%, #050a07 60%, #030605 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "clamp(1rem, 3vh, 2rem)", padding: "clamp(1rem, 3vw, 2rem)", textAlign: "center",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.78rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5aaa72", opacity: 0.8 }}>
        Fantasy Survivor League
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 8vw, 6rem)", fontWeight: 900, color: "#f0ebe0", lineHeight: 1, letterSpacing: "-0.01em" }}>
        Season 51
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 3vw, 1.75rem)", fontWeight: 700, color: "#5aaa72", letterSpacing: "0.05em" }}>
        The Open Era
      </div>
      <div style={{ maxWidth: 520, fontSize: "clamp(0.7rem, 1.4vw, 0.85rem)", color: "#bbb", lineHeight: 1.7, padding: "0 1rem" }}>
        Every advantage, every idol, every twist from 50 seasons — all in play at any time, in any order, without warning. All-new cast. Premieres fall 2026.
      </div>

      <button
        onClick={e => { e.stopPropagation(); onDismiss(); }}
        style={{
          marginTop: "0.5rem",
          background: "rgba(15,40,20,0.85)", border: "1px solid rgba(90,170,114,0.6)",
          color: "#a8e6b8", fontFamily: "'DM Mono', monospace",
          fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)", letterSpacing: "0.12em",
          textTransform: "uppercase", padding: "0.85rem 2.5rem", borderRadius: "3px",
          cursor: "pointer", backdropFilter: "blur(4px)",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(20,60,30,0.9)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(15,40,20,0.85)"}
      >
        Enter League Hub →
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [splashDismissed, setSplashDismissed] = useState(() => {
    try { return localStorage.getItem(`sf_splash_${SPLASH_VERSION}`) === "1"; } catch { return false; }
  });
  const [page, setPage] = useState("overview");
  const [historySeason, setHistorySeason] = useState(50);

  // Season 51 castaways. Hydrate from defaults so new fields, including remote photo URLs,
  // still appear even if an older localStorage draft already exists.
  const [castaways, setCastaways] = useState(() => {
    const saved = loadState();
    return hydrateCastaways(saved?.castaways);
  });

  useEffect(() => { saveState({ castaways }); }, [castaways]);

  const dismissSplash = () => {
    try { localStorage.setItem(`sf_splash_${SPLASH_VERSION}`, "1"); } catch {}
    setSplashDismissed(true);
  };

  if (!splashDismissed) return (<><style>{CSS}</style><Splash onDismiss={dismissSplash} /></>);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            SURVIVOR<span>FANTASY</span>
            <sub>S51</sub>
          </div>
          <nav className="nav">
            {[
              { key: "overview",  label: "Overview"  },
              { key: "rumors",    label: "Rumors"     },
              { key: "castaways", label: "Cast"       },
              { key: "history",   label: "History"    },
            ].map(p => (
              <button key={p.key} className={`nav-btn ${page === p.key ? "active" : ""}`} onClick={() => setPage(p.key)}>
                {p.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="container">
          {page === "overview"  && <Overview  />}
          {page === "rumors"    && <Rumors />}
          {page === "castaways" && <Castaways castaways={castaways} />}
          {page === "history"   && <History historySeason={historySeason} setHistorySeason={setHistorySeason} />}
        </div>
      </div>
    </>
  );
}

// ─── Overview page ────────────────────────────────────────────────────────────
function Overview() {
  return (
    <div>
      <div className="page-title">Season 51</div>
      <div className="page-subtitle">The Open Era · Fall 2026 on CBS/Paramount+ · Mamanuca Islands, Fiji · 26-day game</div>

      <div className="section-title">The Open Era</div>
      <div className="panel" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.78rem", color: "#d0cab8", lineHeight: 1.75, marginBottom: "0.75rem" }}>
          Survivor 51 is the first regular season under the Open Era framework. CBS/Paramount+ describes it as a first-time-player season, with all previous advantages, idols, and twists available.
        </p>
      </div>

      <div className="section-title">Key Details</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {[
          { label: "Premiere",       value: "Fall 2026",        sub: "exact date TBA" },
          { label: "Network",        value: "CBS",              sub: "Wednesdays 8/7c" },
          { label: "Streaming",      value: "Paramount+",       sub: "live/on demand by plan" },
          { label: "Episodes",       value: "90 min",           sub: "confirmed return" },
          { label: "Castaways",      value: "21 listed",        sub: "CBS names TBA" },
          { label: "Days",           value: "26",               sub: "reported format" },
          { label: "Location",       value: "Fiji",             sub: "Mamanuca Islands" },
          { label: "Tribe Format",   value: "TBD",              sub: "official setup pending" },
        ].map(f => (
          <div key={f.label} className="panel" style={{ padding: "0.85rem 1rem" }}>
            <div style={{ fontSize: "0.55rem", color: "#777", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{f.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 900, color: "#f0ebe0", lineHeight: 1, marginBottom: "0.1rem" }}>{f.value}</div>
            <div style={{ fontSize: "0.6rem", color: "#888" }}>{f.sub}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Preseason Notes</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {[
          { label: "Official Details", text: "Fall 2026 season, CBS/Paramount+, 90-minute Wednesday episodes, first-time players, and Open Era mechanics.", color: "#5aaa72" },
          { label: "Cast Tracking", text: "The app currently includes 21 preseason cast names so the league can start scouting before the official cast reveal.", color: "#6a9fd8" },
          { label: "Format Watch", text: "The final tribe setup and any opening twist should stay marked as pending until CBS confirms the season structure.", color: "#c8922a" },
        ].map(card => (
          <div key={card.label} className="panel" style={{ borderColor: card.color+"33", background: card.color+"0c" }}>
            <div style={{ fontSize: "0.58rem", color: card.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.45rem" }}>{card.label}</div>
            <p style={{ fontSize: "0.7rem", color: "#d0cab8", lineHeight: 1.65 }}>{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Castaways page ───────────────────────────────────────────────────────────
function Castaways({ castaways }) {
  const listed = castaways.filter(c => !c.unknown);
  const unknown = castaways.filter(c => c.unknown);

  return (
    <div>
      <div className="page-title">Season 51 Cast</div>
      <div className="page-subtitle">Preseason cast board · Updated June 2026</div>

      <div className="section-title">Castaways — {listed.length}</div>
      <div className="castaways-grid">
        {listed.map(c => <CastawayCard key={c.id} c={c} />)}
      </div>

      {unknown.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title">Unknown — {unknown.length} slots remaining</div>
          <div className="castaways-grid">
            {unknown.map(c => <CastawayCard key={c.id} c={c} />)}
          </div>
        </>
      )}
    </div>
  );
}

function CastawayCard({ c }) {
  const cls = c.unknown ? "unknown-player" : "alive";
  return (
    <div className={`castaway-card ${cls}`}>
      <div className="c-photo-wrap">
        {c.photoUrl && (
          <img
            className="c-photo"
            src={c.photoUrl}
            alt={`${c.name} profile`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={e => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        )}
        <div className={`c-photo-fallback ${c.photoUrl ? "with-photo" : ""}`}>{initials(c.name)}</div>
      </div>
      <div className="c-info">
        <div className="c-name">{c.name}</div>
        {c.age && <div className="c-age">Age {c.age}{c.hometown ? ` · ${c.hometown}` : ""}</div>}
        {c.occupation && <div className="c-occ">{c.occupation}</div>}
        {c.bio && <div className="c-bio">{c.bio}</div>}
      </div>
    </div>
  );
}

// ─── Rumors page ──────────────────────────────────────────────────────────────
const RUMORS_DATA = [
  {
    category: "Format & Structure",
    items: [
      {
        status: "confirmed",
        title: "Season 51 launches the Open Era",
        body: "CBS/Paramount+ says Survivor 51 is the start of the Open Era: any advantage, idol, or twist from Survivor history can appear at any time, in any order, without warning. This is the core identity of the season.",
        source: "CBS/Paramount+, May 2026",
      },
      {
        status: "confirmed",
        title: "All-new, first-time-player cast",
        body: "CBS/Paramount+ has confirmed the cast consists of first-time players.",
        source: "CBS/Paramount+, May 2026",
      },
      {
        status: "confirmed",
        title: "Fall 2026, CBS, Paramount+, 90-minute Wednesdays",
        body: "Survivor 51 is scheduled for the Fall 2026 CBS lineup, airing Wednesdays at 8/7c with 90-minute episodes and streaming on Paramount+.",
        source: "CBS/Paramount+ / People, May 2026",
      },
      {
        status: "likely",
        title: "26-day game in Fiji's Mamanuca Islands",
        body: "Inside Survivor reports the season filmed in Fiji's Mamanuca Islands and will again run 26 days, matching the New Era production model.",
        source: "Inside Survivor, May 2026",
      },
      {
        status: "rumored",
        title: "Two-tribe start",
        body: "Early chatter points to two tribes of 10.",
        source: "EntertainmentNow / fan speculation, May 2026",
      },

      {
        status: "rumored",
        title: "21 players instead of the expected 18 or 20",
        body: "The most interesting structural rumor is the 21-player cast.  Fans are speculating it's a Day 1 twist, limbo player, or unusual marooning format.",
        source: "Inside Survivor / community speculation, May-June 2026",
      },
    ],
  },
];

function Rumors() {
  const [filter, setFilter] = useState("all");

  const allStatuses = ["confirmed","likely","rumored","speculation"];
  const statusLabels = { confirmed: "Confirmed", likely: "Likely", rumored: "Rumored", speculation: "Speculation" };
  const statusColors = { confirmed: "#5aaa72", likely: "#6a9fd8", rumored: "#c8922a", speculation: "#888" };

  const filteredData = RUMORS_DATA.map(cat => ({
    ...cat,
    items: cat.items.filter(i => filter === "all" || i.status === filter),
  })).filter(cat => cat.items.length > 0);

  const allCount = RUMORS_DATA.flatMap(c => c.items).length;
  const counts = {};
  RUMORS_DATA.flatMap(c => c.items).forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });

  return (
    <div>
      <div className="page-title">Rumors</div>
      <div className="page-subtitle">Season 51 preseason intelligence · Updated June 2026</div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <button
          className={`action-btn ${filter === "all" ? "primary" : ""}`}
          style={{ marginBottom: 0 }}
          onClick={() => setFilter("all")}
        >
          All ({allCount})
        </button>
        {allStatuses.map(s => (
          <button
            key={s}
            className="action-btn"
            style={{
              marginBottom: 0,
              color: filter === s ? statusColors[s] : "#ccc",
              borderColor: filter === s ? statusColors[s]+"66" : "rgba(255,255,255,0.1)",
              background: filter === s ? statusColors[s]+"12" : "rgba(255,255,255,0.02)",
            }}
            onClick={() => setFilter(s)}
          >
            {statusLabels[s]} ({counts[s] || 0})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {allStatuses.map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: statusColors[s] }} />
            <span style={{ fontSize: "0.62rem", color: "#888" }}>{statusLabels[s]}</span>
          </div>
        ))}
      </div>

      {filteredData.map(cat => (
        <div key={cat.category} style={{ marginBottom: "2rem" }}>
          <div className="section-title">{cat.category}</div>
          {cat.items.map((item, i) => (
            <div key={i} className={`rumor-card ${item.status}`}>
              <span className={`rumor-badge ${item.status}`}>{statusLabels[item.status]}</span>
              <div className="rumor-title">{item.title}</div>
              <div className="rumor-body">{item.body}</div>
              <div className="rumor-source">Source: {item.source}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── History page ─────────────────────────────────────────────────────────────
function History({ historySeason, setHistorySeason }) {
  const data = HISTORICAL[historySeason];
  const champs = getChampionshipsThrough(historySeason);
  const sorted = data ? [...data.teamScores].sort((a,b) => (b.score||0)-(a.score||0)) : [];

  return (
    <div>
      <div className="page-title">History</div>
      <div className="page-subtitle">Past season results</div>
      <div className="season-bar">
        <span className="season-label">Season</span>
        {[50,49,48,47,46,45,44,43].map(id => (
          <button key={id} className={`season-btn ${historySeason === id ? "active" : ""}`} onClick={() => setHistorySeason(id)}>{id}</button>
        ))}
      </div>

      {data ? (
        <>
          <div className="section-title">Season {historySeason} — Team Scores</div>
          <div className="hist-grid">
            {sorted.map((t, i) => (
              <div key={t.name} className={`hist-card ${t.winner ? "champ" : ""}`}>
                <div style={{ fontSize: "0.62rem", color: t.winner ? "#5aaa72" : "#777", marginBottom: "0.25rem" }}>
                  {t.winner ? "🏆 Champion" : ordinal(i+1) + " Place"}
                </div>
                <div className="hist-score" style={{ color: t.na ? "#444" : t.color }}>{t.na ? "—" : t.score}{!t.na && <span style={{ fontSize: "0.7rem", color: "#777", marginLeft: "0.35rem" }}>pts</span>}</div>
                <div style={{ fontSize: "0.82rem", color: t.color, marginTop: "0.25rem", fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: "0.62rem", color: "#777" }}>{t.members}</div>
                {(champs[t.name]||0) > 0 && <div style={{ fontSize: "0.6rem", color: "#5aaa72", marginTop: "0.3rem", letterSpacing: "0.08em" }}>{"★".repeat(champs[t.name])}</div>}
                {t.na && <div style={{ fontSize: "0.6rem", color: "#555", marginTop: "0.25rem" }}>Did not participate</div>}
              </div>
            ))}
          </div>

          <div className="section-title">Placement Results — Season {historySeason}</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <table className="hist-table">
              <thead><tr><th>Finish</th><th>Castaway</th><th>Team</th><th style={{ textAlign:"right" }}>Pts</th></tr></thead>
              <tbody>
                {[...data.placements].sort((a,b) => b.place - a.place).map(p => {
                  const total = SEASONS.find(s => s.id === historySeason)?.totalCastaways || 18;
                  const finishPos = total - p.place + 1;
                  return (
                    <tr key={p.place}>
                      <td style={{ color:"#f0ebe0", fontFamily:"'Playfair Display',serif", fontWeight:900 }}>{ordinal(finishPos)}</td>
                      <td style={{ color:"#f0ebe0" }}>{p.player}</td>
                      <td style={{ color: p.team==="NA" ? "#555" : p.teamColor }}>{p.team==="NA" ? "—" : p.team}</td>
                      <td style={{ color:"#5aaa72", textAlign:"right", fontFamily:"'Playfair Display',serif", fontWeight:900 }}>{p.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="hint">No data for this season.</div>
      )}
    </div>
  );
}
