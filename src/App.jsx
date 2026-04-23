// src/App.jsx
import { useEffect, useMemo, useState } from "react";

// Bump this each time you commit/publish to force the splash page to reappear for everyone
const SPLASH_VERSION = "ep9_v1.2";
const SPLASH_IMAGE = "";

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

// Returns the point value for a given finish position (1 = winner)
function calcPointsByFinish(finishPos, totalCastaways) {
  // finishPos 1 = winner, finishPos = totalCastaways = first boot
  const eliminationOrder = totalCastaways - finishPos + 1;
  return calcPoints(eliminationOrder, totalCastaways);
}

const TEAMS = [
  { id: 1, name: "Miloa",   members: "Team Miller",    color: "#c8922a" },
  { id: 2, name: "Jinga",   members: "Team Mackereth", color: "#6a9fd8" },
  { id: 3, name: "Ojalu",   members: "Team Lestan",    color: "#6db86d" },
  { id: 4, name: "Weloki",  members: "Team Wells",     color: "#c46ab0" },
  { id: 5, name: "Nochoso", members: "The Unchosen",   color: "#888888" },
];

const SEASONS = [
  { id: 50, label: "Season 50", totalCastaways: 24, current: true },
  { id: 49, label: "Season 49", totalCastaways: 18 },
  { id: 48, label: "Season 48", totalCastaways: 18 },
  { id: 47, label: "Season 47", totalCastaways: 18 },
  { id: 46, label: "Season 46", totalCastaways: 18 },
  { id: 45, label: "Season 45", totalCastaways: 18 },
  { id: 44, label: "Season 44", totalCastaways: 18 },
  { id: 43, label: "Season 43", totalCastaways: 18 },
];

const TRIBE_COLORS = { Vatu: "#a855c8", Kalo: "#2ab8a0", Cila: "#e8782a" };

// draftedBy: 1=Miloa, 2=Jinga, 3=Ojalu, 4=Weloki, null=undrafted
// Draft locked — do not modify picks here
const S50_CASTAWAYS = [
  { name: "Angelina Keeley",         tribe: "Vatu", origTribe: "Kalo", bio: "3rd place, S37 David vs. Goliath",                                    odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-angelina-keeley.jpg",         draftedBy: 5    },
  { name: "Aubry Bracco",            tribe: "Kalo", origTribe: "Vatu", bio: "Runner-up S32 Kaoh Rong · S34 Game Changers · S38 Edge of Extinction", odds: "-250",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-aubry-bracco.jpg",            draftedBy: 4    },
  { name: 'Benjamin "Coach" Wade',   tribe: "Kalo", origTribe: "Kalo", bio: "Runner-up S23 South Pacific · S18 Tocantins · S20 Heroes vs. Villains",odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-benjamin-coach-wade.jpg",   draftedBy: 1    },
  { name: "Charlie Davis",           tribe: "Cila", origTribe: "Kalo", bio: "Runner-up S46",                                                        odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-charlie-davis.jpg",           draftedBy: 4    },
  { name: "Chrissy Hofbeck",         tribe: "Kalo", origTribe: "Kalo", bio: "Runner-up S35 Heroes vs. Healers vs. Hustlers",                        odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-chrissy-hofbeck.jpg",         draftedBy: 5    },
  { name: "Christian Hubicki",       tribe: "Vatu", origTribe: "Cila", bio: "7th place S37 David vs. Goliath",                                      odds: "+800",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-christian-hubicki.jpg",       draftedBy: 1    },
  { name: "Cirie Fields",            tribe: "Cila", origTribe: "Cila", bio: "5x player · S12 Panama · S16 Micronesia · S20 HvV · S34 Game Changers",odds: "+1200", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-cirie-fields.jpg",            draftedBy: 4    },
  { name: "Colby Donaldson",         tribe: "Kalo", origTribe: "Vatu", bio: "Runner-up S2 Australian Outback · S8 All-Stars · S20 Heroes vs. Villains",odds:"+5000",photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-colby-donaldson.jpg",         draftedBy: 2    },
  { name: "Dee Valladares",          tribe: "Cila", origTribe: "Kalo", bio: "WINNER S45 ★",                                                         odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-dee-valladares.jpg",          draftedBy: 3    },
  { name: "Emily Flippen",           tribe: "Vatu", origTribe: "Cila", bio: "7th place S45",                                                        odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-emily-flippen.jpg",           draftedBy: 1    },
  { name: "Genevieve Mushaluk",      tribe: "Kalo", origTribe: "Vatu", bio: "5th place S47",                                                        odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-genevieve-mushaluk.jpg",      draftedBy: 4    },
  { name: "Jenna Lewis-Dougherty",   tribe: "Cila", origTribe: "Cila", bio: "S1 Borneo · Final 3 S8 All-Stars",                                     odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jenna-lewis-dougherty.jpg",   draftedBy: 5    },
  { name: "Joe Hunter",              tribe: "Kalo", origTribe: "Cila", bio: "3rd place S48",                                                        odds: "+700",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-joe-hunter.jpg",              draftedBy: 3    },
  { name: "Jonathan Young",          tribe: "Cila", origTribe: "Kalo", bio: "4th place S42",                                                        odds: "+900",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jonathan-young.jpg",          draftedBy: 2    },
  { name: "Kamilla Karthigesu",      tribe: "Cila", origTribe: "Kalo", bio: "4th place S48",                                                        odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kamilla-karthigesu.jpg",      draftedBy: 3    },
  { name: "Kyle Fraser",             tribe: "Vatu", origTribe: "Vatu", bio: "WINNER S48 ★",                                                         odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kyle-fraser.jpg",             draftedBy: 5    },
  { name: "Mike White",              tribe: "Vatu", origTribe: "Kalo", bio: "Runner-up S37 David vs. Goliath · Creator of The White Lotus",         odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-mike-white.jpg",              draftedBy: 1    },
  { name: "Ozzy Lusth",              tribe: "Vatu", origTribe: "Cila", bio: "Runner-up S13 Cook Islands · 4x player total",                         odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-ozzy-lutsh.jpg",              draftedBy: 2    },
  { name: "Q Burdette",              tribe: "Vatu", origTribe: "Vatu", bio: "8th place S46",                                                        odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-quintavius-q-burdette.jpg",   draftedBy: 3    },
  { name: "Rick Devens",             tribe: "Cila", origTribe: "Cila", bio: "4th place S38 Edge of Extinction",                                     odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rick-devens.jpg",             draftedBy: 4    },
  { name: "Rizo Velovic",            tribe: "Cila", origTribe: "Vatu", bio: "4th place S49",                                                        odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rizo-velovic.jpg",            draftedBy: 2    },
  { name: "Savannah Louie",          tribe: "Cila", origTribe: "Cila", bio: "WINNER S49 ★",                                                         odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-savannah-louie.jpg",          draftedBy: 1    },
  { name: "Stephenie LaGrossa",      tribe: "Vatu", origTribe: "Vatu", bio: "Runner-up S11 Guatemala · S10 Palau · S20 Heroes vs. Villains",        odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-stephanie-lagrossa-kendrick.jpg", draftedBy: 3 },
  { name: "Tiffany Ervin",           tribe: "Kalo", origTribe: "Vatu", bio: "8th place S46",                                                        odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-tiffany-ervin.jpg",           draftedBy: 2    },
];

const ADMIN_PASSWORD = "Ottffsse9";

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

const HISTORICAL = { 43: S43_RESULTS, 44: S44_RESULTS, 45: S45_RESULTS, 46: S46_RESULTS, 47: S47_RESULTS, 48: S48_RESULTS, 49: S49_RESULTS };

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

const EP1_ELIMINATIONS = {
  "Jenna Lewis-Dougherty": 1,
  "Kyle Fraser": 2,
  "Savannah Louie": 3,
  "Q Burdette": 4,
  "Mike White": 5,
  "Angelina Keeley": 6,
  "Charlie Davis": 7,
  "Kamilla Karthigesu": 8,
  "Genevieve Mushaluk": 9,
  "Colby Donaldson": 10,
  "Dee Valladares": 11,
  // Episode 8
  "Chrissy Hofbeck": 12,
  'Benjamin "Coach" Wade': 13,
  // Episode 9
  "Christian Hubicki": 14,
};

function buildCastawaysForSeason50() {
  return S50_CASTAWAYS.map((c, idx) => ({
    id: idx + 1, name: c.name, tribe: c.tribe || "", origTribe: c.origTribe || "", bio: c.bio || "",
    odds: c.odds || "", photo: c.photo || "",
    draftedBy: c.draftedBy ?? null,
    eliminationOrder: EP1_ELIMINATIONS[c.name] ?? null,
  }));
}

function applyLockedDraft(castaways) {
  return castaways.map(c => {
    const master = S50_CASTAWAYS.find(m => m.name === c.name);
    if (!master) return c;
    const lockedElim = EP1_ELIMINATIONS[c.name];
    return {
      ...c,
      draftedBy: master.draftedBy ?? null,
      tribe: master.tribe || c.tribe,
      origTribe: master.origTribe || c.origTribe || "",
      eliminationOrder: lockedElim ?? c.eliminationOrder,
    };
  });
}

const STORAGE_KEY = "sf_v2_state";
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function oddsColor(odds) {
  if (!odds) return "#555";
  if (odds.startsWith("-")) return "#c8922a";
  const n = parseInt(odds.replace("+", ""), 10);
  if (isNaN(n)) return "#aaa";
  if (n <= 1000) return "#6db86d";
  if (n <= 2500) return "#6a9fd8";
  return "#aaa";
}

function proxyPhoto(url) {
  if (!url) return "";
  return "https://images.weserv.nl/?url=" + encodeURIComponent(url) + "&w=400&output=jpg";
}

function Photo({ src, alt, className }) {
  const [err, setErr] = useState(false);
  if (!src || err) return
<div style={{
              fontFamily: "'Playfair Display', serif", fontSize: "1rem",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color: "#c8922a", marginBottom: "0.5rem",
            }}>Fantasy Survivor · Season 50</div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 900,
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)", color: "#f0ebe0",
              lineHeight: 1.2, marginBottom: "1.25rem",
            }}>Scores have been updated<br/>for Episode 9</div>
            <div style={{
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "#a8d88a",
              marginBottom: "1rem",
              maxWidth: 420,
              lineHeight: 1.7,
            }}>
              "A puzzle falls into the sea —<br />
              The professor meets his fate."
            </div>
            <div style={{ fontSize: "0.78rem", color: "#999", marginBottom: "2.5rem", maxWidth: 380, lineHeight: 1.6 }}>
              Watch episode 9 before continuing to avoid spoilers.
            </div>
            <button
              onClick={dismissSplash}
              style={{
                background: "rgba(100,180,80,0.1)", border: "1px solid rgba(100,180,80,0.4)",
                color: "#8fcc72", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
                letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.85rem 2.5rem",
                borderRadius: "2px", cursor: "pointer",
              }}
              onMouseEnter={e => e.target.style.background="rgba(100,180,80,0.2)"}
              onMouseLeave={e => e.target.style.background="rgba(100,180,80,0.1)"}
            >
              Click to Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="logo">SURVIVOR<span>FANTASY</span></div>
          <nav className="nav">
            {["leaderboard","recap","points","castaways","history"].map(p => (
              <button key={p} className={`nav-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          </nav>
        </header>

        <div className="container">
          {page === "leaderboard" && <Leaderboard season={season50} scores={scores} castaways={castaways} showOdds={showOdds} activePoints={ACTIVE_POINTS} />}
          {page === "castaways"   && <Castaways   season={season50} castaways={castaways} showOdds={showOdds} />}
          {page === "history"     && <History historySeason={historySeason} setHistorySeason={setHistorySeason} />}
          {page === "points"      && <Points season={season50} castaways={castaways} activePoints={ACTIVE_POINTS} />}
          {page === "recap"       && <Recap />}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

function oddsToImplied(odds) {
  if (!odds) return 0;
  if (odds.startsWith("-")) { const n = Math.abs(parseInt(odds)); return n / (n + 100); }
  const n = parseInt(odds.replace("+",""));
  return 100 / (n + 100);
}

function projectedPts(picks, totalCastaways, activePoints) {
  const maxPts = calcPoints(totalCastaways, totalCastaways);
  return picks
    .filter(c => !c.eliminationOrder && c.odds)
    .reduce((sum, c) => sum + oddsToImplied(c.odds) * maxPts, 0)
    .toFixed(1);
}

function Leaderboard({ season, scores, castaways, showOdds, activePoints }) {
  const eliminated = castaways.filter(c => c.eliminationOrder).length;
  const remaining = season.totalCastaways - eliminated;
  const champs = getChampionshipsThrough(49);

  function teamOddsSummary(picks) {
    const alive = picks.filter(c => !c.eliminationOrder && c.odds);
    if (!alive.length) return null;
    const totalImplied = alive.reduce((s, c) => s + oddsToImplied(c.odds), 0);
    if (totalImplied >= 0.5) {
      return "-" + Math.round((totalImplied / (1 - totalImplied)) * 100);
    } else {
      return "+" + Math.round(((1 - totalImplied) / totalImplied) * 100);
    }
  }

  return (
    <div>
      <div className="page-title">Leaderboard</div>
      <div className="page-subtitle">Season {season.id} · {season.totalCastaways} Castaways · {eliminated} Eliminated · {remaining} Remaining · Jury phase underway</div>
      <div className="leaderboard">
        {scores.map((team, i) => {
          const oddsDisplay = teamOddsSummary(team.picks);
          const proj = projectedPts(team.picks, season.totalCastaways, activePoints);
          const rank = i === 0 ? 1 : (scores[i].total < scores[i-1].total ? i + 1 : scores.findIndex(s => s.total === team.total) + 1);
          return (
            <div key={team.id} className={`lb-card ${rank === 1 ? "first" : ""}`}>
              <div className="lb-rank">{rank}</div>
              <div style={{ flex: 1 }}>
                <div className="lb-tribe" style={{ color: team.color }}>
                  {team.name}
                  <span style={{ fontSize: "0.63rem", color: "#999", fontWeight: 400, marginLeft: "0.4rem" }}>{team.members}</span>
                  {(champs[team.name] || 0) > 0 && (
                    <span style={{ fontSize: "0.58rem", color: "#c8922a", marginLeft: "0.5rem", opacity: 0.75 }}>{"★".repeat(champs[team.name])}</span>
                  )}
                  {showOdds && oddsDisplay && (
                    <span style={{ fontSize: "0.6rem", marginLeft: "0.6rem", color: oddsColor(oddsDisplay), fontWeight: 400 }}>
                      {oddsDisplay} odds
                    </span>
                  )}
                </div>
                <div className="lb-tags">
                  {team.picks.map(c => (
                    <span key={c.id} className={`c-tag ${c.eliminationOrder ? "eliminated" : "alive"}`}>
                      {c.name}{c.eliminationOrder
                        ? ` · ${calcPoints(c.eliminationOrder, season.totalCastaways)}pt`
                        : (showOdds && c.odds ? ` · ${c.odds} · ${activePoints}pt` : ` · ${activePoints}pt`)}
                    </span>
                  ))}
                  {team.picks.length === 0 && <span style={{ fontSize: "0.65rem", color: "#aaa" }}>No picks</span>}
                </div>
              </div>
              <div className="lb-score">
                <div className="lb-pts" style={{ color: team.color }}>{team.total}</div>
                <div className="lb-pts-label">points</div>
                {showOdds && (
                  <div style={{ fontSize: "0.58rem", color: "#777", marginTop: "0.25rem" }}>
                    ~{proj} proj.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Castaways({ season, castaways, showOdds }) {
  const alive     = castaways.filter(c => !c.eliminationOrder && c.draftedBy);
  const undrafted = castaways.filter(c => !c.eliminationOrder && !c.draftedBy);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a,b) => b.eliminationOrder - a.eliminationOrder);
  return (
    <div>
      <div className="page-title">Castaways</div>
      <div className="page-subtitle">Season {season.id} · {alive.length} Active · {undrafted.length} Undrafted · {eliminated.length} Eliminated</div>
      <div className="section-title">Tribes</div>
      <div className="row" style={{ marginBottom: "1.25rem" }}>
        {Object.entries(TRIBE_COLORS).map(([t,c]) => (
          <span key={t} className="hint">
            <span style={{ display:"inline-block", width:10, height:10, borderRadius:99, background:c, marginRight:6 }} />{t}
          </span>
        ))}
      </div>
      {alive.length > 0 && <><div className="section-title">Active — {alive.length}</div><div className="castaways-grid">{alive.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}</div></>}
      {undrafted.length > 0 && <><div className="section-title">Undrafted — {undrafted.length}</div><div className="castaways-grid">{undrafted.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}</div></>}
      {eliminated.length > 0 && <><div className="divider" /><div className="section-title">Eliminated — {eliminated.length}</div><div className="castaways-grid">{eliminated.map(c => <CastawayCard key={c.id} c={c} season={season} showOdds={showOdds} />)}</div></>}
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
          <div style={{ marginBottom:"0.25rem", display:"flex", alignItems:"center", gap:"0.25rem", flexWrap:"wrap" }}>
            {c.origTribe && c.origTribe !== c.tribe && (
              <span style={{ fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.1rem 0.4rem", borderRadius:"2px", background:`${(TRIBE_COLORS[c.origTribe]||"#aaa")}22`, color:TRIBE_COLORS[c.origTribe]||"#aaa", border:`1px solid ${(TRIBE_COLORS[c.origTribe]||"#aaa")}55` }}>
                {c.origTribe}
              </span>
            )}
            {c.origTribe && c.origTribe !== c.tribe && (
              <span style={{ fontSize:"0.5rem", color:"#555" }}>→</span>
            )}
            <span style={{ fontSize:"0.55rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.1rem 0.4rem", borderRadius:"2px", background:`${(TRIBE_COLORS[c.tribe]||"#aaa")}22`, color:TRIBE_COLORS[c.tribe]||"#aaa", border:`1px solid ${(TRIBE_COLORS[c.tribe]||"#aaa")}55` }}>
              {c.tribe}
            </span>
          </div>
        )}
        <div className="c-row">
          <div style={{ fontSize:"0.58rem", color: team ? team.color : "#888" }}>{team ? team.name : "Undrafted"}</div>
          {c.odds && showOdds && <div style={{ fontSize:"0.62rem", fontWeight:500, color:oddsColor(c.odds) }}>{c.odds}</div>}
        </div>
        <div className={`c-status ${cls}`} style={{ marginTop:"0.2rem" }}>{c.eliminationOrder ? `Elim. #${c.eliminationOrder}` : (c.draftedBy ? "Active" : "—")}</div>
        {pts !== null && <div className="c-pts">{pts} pts</div>}
      </div>
    </div>
  );
}

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
        {[49,48,47,46,45,44,43].map(id => (
          <button key={id} className={`season-btn ${historySeason === id ? "active" : ""}`} onClick={() => setHistorySeason(id)}>{id}</button>
        ))}
      </div>

      {data ? (
        <>
          <div className="section-title">Season {historySeason} — Team Scores</div>
          <div className="hist-grid">
            {sorted.map((t, i) => (
              <div key={t.name} className={`hist-card ${t.winner ? "champ" : ""}`}>
                <div style={{ fontSize:"0.62rem", color: t.winner ? "#c8922a" : "#777", marginBottom:"0.25rem" }}>
                  {t.winner ? "🏆 Champion" : ordinal(i+1) + " Place"}
                </div>
                <div className="hist-score" style={{ color: t.na ? "#444" : t.color }}>{t.na ? "—" : t.score}{!t.na && <span style={{ fontSize:"0.7rem", color:"#777", marginLeft:"0.35rem" }}>pts</span>}</div>
                <div style={{ fontSize:"0.82rem", color:t.color, marginTop:"0.25rem", fontWeight:500 }}>{t.name}</div>
                <div style={{ fontSize:"0.62rem", color:"#777" }}>{t.members}</div>
                {(champs[t.name]||0) > 0 && <div style={{ fontSize:"0.6rem", color:"#c8922a", marginTop:"0.3rem" }}>{"★".repeat(champs[t.name])} {champs[t.name]} title{champs[t.name]>1?"s":""}</div>}
                {t.na && <div style={{ fontSize:"0.6rem", color:"#555", marginTop:"0.25rem" }}>Did not participate</div>}
              </div>
            ))}
          </div>

          <div className="section-title">Placement Results — Season {historySeason}</div>
          <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
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
                    <td style={{ color:"#c8922a", textAlign:"right", fontFamily:"'Playfair Display',serif", fontWeight:900 }}>{p.points}</td>
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

const DRAFT_ORDER = [
  "Christian Hubicki",
  "Genevieve Mushaluk",
  "Jonathan Young",
  "Stephenie LaGrossa",
  "Joe Hunter",
  "Rizo Velovic",
  "Rick Devens",
  "Mike White",
  'Benjamin "Coach" Wade',
  "Aubry Bracco",
  "Ozzy Lusth",
  "Kamilla Karthigesu",
  "Dee Valladares",
  "Tiffany Ervin",
  "Cirie Fields",
  "Emily Flippen",
  "Savannah Louie",
  "Charlie Davis",
  "Colby Donaldson",
  "Q Burdette",
  "Chrissy Hofbeck",
  "Angelina Keeley",
  "Kyle Fraser",
  "Jenna Lewis-Dougherty",
];

function Points({ season, castaways, activePoints }) {
  const [sortCol, setSortCol] = useState("default");
  const [sortDir, setSortDir] = useState("asc");

  const rows = castaways.map((c) => {
    const team = c.draftedBy ? TEAMS.find(t => t.id === c.draftedBy) : null;
    const pts = c.eliminationOrder ? calcPoints(c.eliminationOrder, season.totalCastaways) : null;
    const finishPlace = c.eliminationOrder ? season.totalCastaways - c.eliminationOrder + 1 : null;
    const draftPick = DRAFT_ORDER.indexOf(c.name) + 1 || null;

    return {
      name: c.name,
      team,
      teamName: team ? team.name : "—",
      teamColor: team ? team.color : "#555",
      eliminationOrder: c.eliminationOrder,
      finishPlace,
      pts,
      draftPick,
      isActive: c.eliminationOrder === null,
    };
  });

  const sorted = [...rows].sort((a, b) => {
    if (sortCol === "default") {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      if (a.isActive && b.isActive) return (a.draftPick ?? 999) - (b.draftPick ?? 999);
      return (a.finishPlace ?? 999) - (b.finishPlace ?? 999);
    }

    let av;
    let bv;

    if (sortCol === "place") {
      av = a.finishPlace ?? 999;
      bv = b.finishPlace ?? 999;
    }
    if (sortCol === "name") {
      av = a.name;
      bv = b.name;
    }
    if (sortCol === "drafted") {
      av = a.draftPick ?? 999;
      bv = b.draftPick ?? 999;
    }
    if (sortCol === "team") {
      av = a.teamName;
      bv = b.teamName;
    }
    if (sortCol === "pts") {
      av = a.pts ?? -1;
      bv = b.pts ?? -1;
    }

    if (typeof av === "string") {
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }

    return sortDir === "asc" ? av - bv : bv - av;
  });

  const toggleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const arrow = (col) => {
    if (sortCol !== col) return <span style={{ color: "#444", marginLeft: "0.3rem" }}>↕</span>;
    return <span style={{ color: "#c8922a", marginLeft: "0.3rem" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const thStyle = (col) => ({
    padding: "0.6rem 0.85rem",
    textAlign: (col === "pts" || col === "drafted" || col === "place") ? "center" : "left",
    fontSize: "0.6rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: sortCol === col ? "#c8922a" : "#888",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    background: "rgba(255,255,255,0.02)",
    fontWeight: 400,
    fontFamily: "'DM Mono', monospace",
  });

  const eliminated = castaways.filter(c => c.eliminationOrder).length;
  const remaining = season.totalCastaways - eliminated;

  // Build full scoring reference: all 24 finish positions
  const scoringRef = Array.from({ length: season.totalCastaways }, (_, i) => {
    const finishPos = i + 1; // 1 = winner, 24 = first boot
    const elimOrder = season.totalCastaways - finishPos + 1;
    const pts = calcPoints(elimOrder, season.totalCastaways);
    return { finishPos, elimOrder, pts };
  });

  return (
    <div>
      <div className="page-title">Points</div>
      <div className="page-subtitle">
        Season {season.id} · {eliminated} Eliminated · {remaining} Remaining · Active players worth {activePoints} pts
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <button
          className="action-btn"
          onClick={() => {
            setSortCol("default");
            setSortDir("asc");
          }}
          style={{
            marginBottom: 0,
            color: sortCol === "default" ? "#c8922a" : "#ccc",
            borderColor: sortCol === "default" ? "rgba(200,146,42,0.4)" : "rgba(255,255,255,0.1)",
            background: sortCol === "default" ? "rgba(200,146,42,0.08)" : "rgba(255,255,255,0.03)",
          }}
        >
          Default Order
        </button>
      </div>

      <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle("place"), minWidth: "4.5rem" }} onClick={() => toggleSort("place")}>
                Place {arrow("place")}
              </th>
              <th style={thStyle("name")} onClick={() => toggleSort("name")}>
                Castaway {arrow("name")}
              </th>
              <th style={{ ...thStyle("drafted"), minWidth: "4.5rem" }} onClick={() => toggleSort("drafted")}>
                Drafted {arrow("drafted")}
              </th>
              <th style={thStyle("team")} onClick={() => toggleSort("team")}>
                Team {arrow("team")}
              </th>
              <th style={{ ...thStyle("pts"), minWidth: "4.5rem" }} onClick={() => toggleSort("pts")}>
                Points {arrow("pts")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const isElim = row.eliminationOrder !== null;
              return (
                <tr
                  key={row.name}
                  style={{
                    background: idx % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                    opacity: isElim ? 0.65 : 1,
                  }}
                >
                  <td style={{ padding: "0.6rem 0.85rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.finishPlace !== null
                      ? <span style={{ fontSize: "0.75rem", color: "#d0cab8" }}>{ordinal(row.finishPlace)}</span>
                      : <span style={{ fontSize: "0.72rem", color: "#6db86d" }}>Active</span>}
                  </td>

                  <td style={{ padding: "0.6rem 0.85rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: "0.8rem", color: isElim ? "#888" : "#f0ebe0", textDecoration: isElim ? "line-through" : "none", fontWeight: 500 }}>
                      {row.name}
                    </div>
                  </td>

                  <td style={{ padding: "0.6rem 0.85rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.draftPick
                      ? <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.85rem", color: "#555" }}>{row.draftPick}</span>
                      : <span style={{ fontSize: "0.65rem", color: "#555" }}>—</span>}
                  </td>

                  <td style={{ padding: "0.6rem 0.85rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: "0.72rem", color: row.teamColor, fontWeight: 500 }}>
                      {row.teamName}
                    </span>
                  </td>

                  <td style={{ padding: "0.6rem 0.85rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {row.pts !== null
                      ? <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.9rem", color: "#c8922a" }}>{row.pts}</span>
                      : <span style={{ fontSize: "0.72rem", color: "#6db86d" }}>{activePoints}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
        {TEAMS.map(t => {
          const teamRows = rows.filter(r => r.teamName === t.name);
          const scored = teamRows.reduce((sum, r) => sum + (r.pts !== null ? r.pts : activePoints), 0);
          const alive = teamRows.filter(r => r.eliminationOrder === null).length;
          return (
            <div key={t.id} className="panel" style={{ borderColor: `${t.color}33` }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 500, color: t.color, marginBottom: "0.35rem" }}>{t.name}</div>
              <div style={{ fontSize: "0.6rem", color: "#888", marginBottom: "0.5rem" }}>{t.members}</div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.5rem", color: t.color, lineHeight: 1 }}>{scored}</div>
                  <div style={{ fontSize: "0.55rem", color: "#777", letterSpacing: "0.08em", textTransform: "uppercase" }}>pts</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.5rem", color: alive > 0 ? "#6db86d" : "#555", lineHeight: 1 }}>{alive}</div>
                  <div style={{ fontSize: "0.55rem", color: "#777", letterSpacing: "0.08em", textTransform: "uppercase" }}>alive</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scoring Reference Table */}
      <div style={{ marginTop: "2.5rem" }}>
        <div className="section-title">Scoring Reference — All {season.totalCastaways} Positions</div>
        <div style={{
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden",
          opacity: 0.85,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: 0,
          }}>
            {/* Header */}
            <div style={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              {/* intentionally empty — labels inline below */}
            </div>

            {scoringRef.map(({ finishPos, pts }, i) => {
              const isWinner = finishPos === 1;
              const isRunnerup = finishPos === 2 || finishPos === 3;
              const isFirstBoot = finishPos === season.totalCastaways;
              const isSecondBoot = finishPos === season.totalCastaways - 1;
              const highlight = isWinner
                ? { bg: "rgba(200,146,42,0.12)", border: "rgba(200,146,42,0.3)", color: "#c8922a" }
                : isRunnerup
                ? { bg: "rgba(200,146,42,0.06)", border: "rgba(200,146,42,0.15)", color: "#a07830" }
                : pts === 0
                ? { bg: "rgba(255,255,255,0.01)", border: "rgba(255,255,255,0.04)", color: "#555" }
                : { bg: "transparent", border: "rgba(255,255,255,0.04)", color: "#888" };

              return (
                <div
                  key={finishPos}
                  style={{
                    padding: "0.5rem 0.6rem",
                    background: highlight.bg,
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.15rem",
                  }}
                >
                  <div style={{
                    fontSize: "0.55rem",
                    color: highlight.color,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    opacity: 0.8,
                  }}>
                    {ordinal(finishPos)}
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: pts >= 10 ? "1.05rem" : "0.95rem",
                    color: pts === 0 ? "#444" : highlight.color !== "#888" ? highlight.color : "#c8922a",
                    lineHeight: 1,
                  }}>
                    {pts}
                  </div>
                  <div style={{ fontSize: "0.48rem", color: "#555", letterSpacing: "0.05em" }}>pts</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ fontSize: "0.6rem", color: "#555", marginTop: "0.5rem", letterSpacing: "0.06em" }}>
          Final 3 positions score double increments. 1st &amp; 2nd place score 0 pts (voted out at FTC).
        </div>
      </div>
    </div>
  );
}

const S50_EPISODES = [
  {
    number: 9,
    title: "Episode 9",
    airDate: "April 22, 2026",
    eliminated: "Christian Hubicki",
    advantages: [
      {
        holder: "Christian Hubicki",
        kind: "disadvantage",
        type: "Jimmy Fallon One in the Urn",
        status: "applied",
        note: 'Christian failed the Journey puzzle and was forced to vote for himself at Tribal Council — a Survivor first. He had some choice words for Jimmy Fallon: "This idea you had is terrible. No more ideas for you. I look forward to your apology."',
      },
      {
        holder: "Rick Devens",
        kind: "advantage",
        type: "Fake Idol",
        status: "active",
        note: "Rick's fake idol (made from Christian's packaging) somehow kept him safe again despite putting a massive target on his back after last episode's stunt.",
      },
      {
        holder: "Cirie Fields",
        kind: "advantage",
        type: "Extra Vote",
        status: "active",
        note: "Cirie's Extra Vote remains secret and unused. She brilliantly played along when both Christian and Emily pitched an Ozzy blindside — then worked behind the scenes to do the exact opposite.",
      },
      {
        holder: "Stephenie LaGrossa",
        kind: "advantage",
        type: "Steal-a-Vote",
        status: "active",
        note: "Stephenie's Steal-a-Vote remains active and unused.",
      },
      {
        holder: "Rizo Velovic",
        kind: "advantage",
        type: "Idol",
        status: "active",
        note: "Rizo's Boomerang Idol remains active. He was seen doing the robot while casting his vote against Christian.",
      },
      {
        holder: "Ozzy Lusth",
        kind: "advantage",
        type: "Idol",
        status: "active",
        note: "Ozzy's Boomerang Idol remains active.",
      },
    ],
    recap: `Episode 9 opened with the fallout from Rick Devens' fake idol stunt at the previous Tribal Council. Nearly everyone in the game — allies and adversaries alike — was furious. Jonathan mocked Devens' ego, Joe started imitating his idol retrieval antics, and Cirie's alliance marveled at how Rick had painted a bullseye on his own back. Even Emily, supposedly Rick's ally, was incensed: "He put our entire alliance in jeopardy with his antics." Meanwhile, Jeff Probst — citing a deal apparently struck with Jimmy Fallon during a Tonight Show appearance — announced a twist for the immunity challenge: the tribe could earn rice if four players could outlast the host himself in the challenge. After some negotiation (Jonathan bargained him down from five players to four), it was on. Probst lasted about seven and a half minutes, outlasting Emily, Rizo, Rick, and Cirie before bowing out — but all four side-bettors (Jonathan, Joe, Ozzy, and Tiffany) held on, winning the rice. Probst's takeaway: "I bow down. I'll never talk the same trash again. Until next season." Following the immunity win, Joe was given the power to send someone on a Journey. Rather than strategizing, he asked for volunteers and had them play rock-paper-scissors — a move criticized for allowing Christian, someone Joe's alliance didn't want gaining an advantage, to attend. On the Journey platform, Christian faced a Survivor-logo puzzle that had to be solved before anchors dragged it into the ocean — the "Jimmy Fallon One in the Urn" twist. A win would let him pre-load a vote against any player in the urn before Tribal. Christian failed the puzzle. The punishment: he had to vote for himself at Tribal Council — a Survivor first — and announce it to the whole tribe. His fate was likely sealed when he and Emily separately pitched an Ozzy blindside to Cirie, Ozzy's closest ally, who played along brilliantly before working to take out Christian instead. At Tribal, Christian lit into Fallon at every opportunity. His self-vote combined with the majority's resolve sent him home. His exit words: "I hope you enjoyed watching me play, because I enjoyed playing."`,
  },
  {
    number: 8,
    title: "Episode 8",
    airDate: "April 15, 2026",
    eliminated: 'Chrissy Hofbeck, Benjamin "Coach" Wade',
    advantages: [
      {
        holder: 'Benjamin "Coach" Wade',
        kind: "advantage",
        type: "Shot in the Dark",
        status: "applied",
        note: 'Coach played his Shot in the Dark for his 2-person team with Chrissy, but it returned "Not Safe."',
      },
    ],
    recap: `Episode 8, "Double the Fun, Double the Demise," built around a big pairs twist. The castaways had to divide themselves into duos, and that choice ended up mattering a lot because the episode's central shock was a double elimination: one vote at Tribal sent both members of a pair home. At the immunity challenge, Tiffany and Joe won and earned safety plus a food reward, which gave them extra time to talk strategy and strengthen connections. Meanwhile, Cirie had a major side mission on Exile Island, where she had to search through a huge pile of coconuts to protect her vote, and she returned ready to make a move. Back at camp and at Tribal, the power shifted. Cirie helped flip the game, and Rick Devens added chaos with a fake-idol stunt that rattled people and made the vote even more unpredictable. In the end, the twist and the strategy came together to take out Coach Wade and Chrissy Hofbeck, making them the two people eliminated in the same Tribal Council.`,
  },
  {
    number: 7,
    title: "Episode 7",
    airDate: "April 8, 2026",
    eliminated: "Dee Valladares",
    advantages: [
     
      { holder: "Rizo Velovic", kind: "advantage", type: "Idol", status: "active", note: "Rizo's Boomerang Idol remains active, but its secrecy is fully gone — Emily blabbed to Rizo that Dee had told her about it. Now essentially the whole tribe knows." },
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Ozzy's Boomerang Idol remains active. He won individual immunity this episode (his 8th career win), which kept him safe regardless." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote remains secret. She saw straight through Stephenie's lie about her journey advantage — but kept quiet." },
      { holder: "Stephenie LaGrossa", kind: "advantage", type: "Steal-a-Vote", status: "active", note: "Stephenie went on a journey and was challenged to keep her arm raised for a full hour.  She earned a Steal-a-Vote advantage. She tried to lie about earning it, but Cirie immediately saw through her." },
      { holder: "Aubry Bracco", kind: "advantage", type: "Idol", status: "applied", note: "Aubry played her Boomerang Idol on herself at Tribal Council as promised. It did not return to the finder (Devens) because Aubry played it herself rather than being voted out holding it. The idol is now spent." },
      { holder: "Dee Valladares", kind: "advantage", type: "Shot in the Dark", status: "applied", note: "Dee played her Shot in the Dark at Tribal — it came up 'Not Safe,' so all votes against her counted. She was eliminated 9-4-1 (4 votes for Tiffany, 1 for Coach). First jury member." },
    ],
    recap: "Episode 7, 'That's Not How I Play Survivor,' opened to a fractured camp processing the Blood Moon fallout. Tiffany was furious about Kamilla's blindside; Coach emerged from his hammock fully recharged as the Dragon Slayer, declaring war on liars and naming Dee chief among them. Emily — incapable of keeping a secret — told Rizo that Dee had shared his idol information, blowing up what little cover Rizo had left. Coach then recruited Rizo into his Four Horsemen alliance alongside Jonathan and Joe, positioning him as Colby's replacement. Aubry, heat on her back for 'forgetting' to play her idol at the Blood Moon, promised the tribe she'd play it tonight — a move that doubled as a shield and a target. Stephenie was randomly selected for a journey: hold your arm above your head for one hour to win an advantage, or give up and keep your vote. With a surgically repaired shoulder from her Heroes vs. Villains injury, she couldn't use her right arm, yet she held on for the full hour and won a Steal-a-Vote. She tried to lie about earning it; Cirie immediately saw through her. At the immunity challenge — a beam-balance endurance — the final three came down to Dee, Ozzy, and Joe. Dee fell first, then Joe, giving Ozzy his 8th career immunity win, closing in on Boston Rob's record of nine. At Tribal, 14 players packed in for the largest single Tribal Council in show history. Coach monologued about honor while Dee and Tiffany's eyes rolled. Dee tried to spark a live Tribal, warning that 'the people who feel safe tonight should be scared.' As promised, Aubry played her Boomerang Idol on herself. Dee played her Shot in the Dark — Not Safe. The votes came in 9-4-1: Dee eliminated, becoming the first jury member. All five previous winners are now out of the game.",
  },
  {
    number: 6,
    title: "Episode 6",
    airDate: "April 1, 2026",
    eliminated: "Kamilla Karthigesu, Genevieve Mushaluk, Colby Donaldson",
    advantages: [
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote remains secret. She survived the Blood Moon in the Teal group by steering the unanimous vote onto Colby." },
      { holder: "Genevieve Mushaluk", kind: "advantage", type: "Shot in the Dark", status: "applied", note: "Genevieve used her Shot in the Dark at the Purple group tribal — it came up 'not safe,' so all votes against her counted. She was eliminated 3-0." },
      { holder: "Colby Donaldson", kind: "disadvantage", type: "Lost Vote", status: "applied", note: "Colby's lost vote finally triggered at the Teal group's tribal. He had no vote and was eliminated unanimously." },
    ],
    recap: "Episode 6, 'The Blood Moon,' opened with the historic 17-player merge — the largest in the show's history. On the merged beach, information spread fast: Genevieve learned Aubry had an idol (said to have been sent by Devens), and Ozzy told Emily and Christian about his own. The next morning a hidden clue sent castaways scrambling; Ozzy found an Exile Island advantage that pulled him and a player of his choice out of the game for the night. He took Rizo, and the two solidified an alliance — Rizo revealing his own Boomerang Idol. Back at camp Jeff dropped the Blood Moon twist: three groups of five, three separate endurance immunity challenges, three tribal councils in one night, and anyone eliminated would not make the jury. Purple (Christian won immunity): Genevieve tried to build a counter-alliance with Christian and Joe but Aubry's camp was faster. Genevieve played her Shot in the Dark — not safe — and was voted out 3-0. Orange (Stephenie won immunity, plus Applebee's for her group after Chrissy stepped down): Jonathan flipped to Tiffany and the new-era players, sending Kamilla home 3-2 over Chrissy in a blindside that shocked both Tiffany and Kamilla herself. Teal (Dee won immunity): Colby, voteless and injured, tried to offer Dee his alliance's protection but Coach undermined him with a lie Dee immediately saw through. Cirie convinced Emily and Dee that Colby was the bigger long-term threat; the group voted him out unanimously, an emotional tribal that nearly brought Jeff to tears. The jury phase begins next episode.",
  },
  {
    number: 5,
    title: "Episode 5",
    airDate: "March 25, 2026",
    eliminated: "Angelina Keeley, Charlie Davis",
    advantages: [
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Ozzy's Boomerang Idol remains active." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote remains secret. She revealed it to Rizo when they committed to a final-two deal." },
    ],
    recap: "Episode 5, 'Open Wounds,' opened with Ozzy fuming over the Mike White blindside — a throwback to Cochran's betrayal in South Pacific. Christian took blame and handed Ozzy his Shot in the Dark as a gesture of trust, leaving himself vulnerable. Ozzy considered revenge but ultimately voted with the tribe: Angelina went out 4-1, giving her jacket to Christian on the way out — a full-circle callback to jacket-gate. At Cila, the episode's title fit Charlie perfectly: still wounded by Maria's Season 46 vote and now set off by Rizo admitting he also skipped his ally's win vote on S49. Jonathan and Devens pulled together an old-Kalo majority targeting Rizo, but Dee flipped the script — building a women's alliance with Rizo, who earned her trust by revealing his Billie Eilish Idol, and committed to a final-two with Cirie. Kamilla was the swing vote; Rizo got to her first with a Kyle Fraser name-drop (a lie) and the idol info. Charlie came second and felt too slow. Rizo delivered a Taylor Swift-coded speech at Tribal: 'This is no love story between us. Bad blood. RizGod-style getaway car.' Charlie was blindsided 4-3. The merge is next.",
  },
  {
    number: 4,
    title: "Episode 4",
    airDate: "March 18, 2026",
    eliminated: "Mike White",
    advantages: [
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Ozzy's Boomerang Idol (originally sent by Genevieve) remains active." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote (given by Ozzy in Episode 2) remains secret and unused." },
    ],
    recap: "Cila held a camp talent show won by Rizo's Mickey Mouse impression. On Kalo, Genevieve found a third Boomerang Idol while shadowing Aubry and sent it to Rizo, planning to blindside him later and get it back. The combined reward/immunity challenge had tribes raise a submerged boat, then solve a letter-cube arch puzzle spelling CELEBRATION — Kalo won first, earning a Sanctuary visit with country star Zac Brown, while Vatu lost and went to Tribal. At Vatu, Mike wanted Emily gone; Christian wanted Mike out. Ozzy wanted Angelina gone. Christian told Emily she was the target and they'd blindside Mike, but if Ozzy found out he might blow up the vote. She immediately told Ozzy that Mike wanted to vote her out but stopped short of revealing the full plan. This confirmed to Christian that Emily can't keep a secret. He went ahead anyway: Stephenie and Emily joined him to vote Mike out 3-2-1. Ozzy was kept in the dark and somehow more devastated than Mike.",
  },
  {
    number: 3,
    title: "Episode 3",
    airDate: "March 11, 2026",
    eliminated: "Q Burdette",
    advantages: [
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Ozzy's Boomerang Idol (from Genevieve) remains active." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote remains secret and unused. She is now on the new Cila tribe, outnumbered by four original Kalo members." },
    ],
    recap: "Jeff Probst rapped the tribe swap announcement. Three new tribes of seven reshuffled the game: Cirie was outnumbered 4-1 by original Kalo on new Cila; Coach told Chrissy she talked too much (she cried); Genevieve pushed distrust of Aubry on new Kalo. On new Vatu, the DvG trio of Christian, Mike, and Angelina reunited. Christian told Emily about Aubry's idol pre-swap — Emily immediately told everyone, then Q bluffed to Mike that he had an extra vote. Mike called it, and the tribe voted Q out 5-1 (only Stephenie voted Angelina). Q wore the same outfit as his Season 46 boot.",
  },
  {
    number: 2,
    title: "Episode 2",
    airDate: "March 4, 2026",
    eliminated: "Savannah Louie",
    advantages: [
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Ozzy gave Cirie his Extra Vote — the first advantage of Cirie's entire Survivor career — after she campaigned to protect him from the vote." },
    ],
    recap: "Cila went to Tribal again. Savannah was on the outs — no one believed her Journey story — and Cirie steered the vote her way to flush the Block-a-Vote and eliminate a winner in one shot. Savannah voted out 6-1. Christian found Cila's Boomerang Idol and gave it to Aubry; Ozzy gave Cirie his Extra Vote, her first-ever advantage. Rick Devens capped the episode by planting a fake idol at Tribal (made from Christian's packaging) while Christian created a distraction by face-planting on the way out of the set.",
  },
  {
    number: 1,
    title: "Episode 1",
    airDate: "February 25, 2026",
    eliminated: "Jenna Lewis-Dougherty, Kyle Fraser (medevac)",
    advantages: [
      { holder: "Q Burdette", kind: "disadvantage", type: "Lost Vote", status: "applied", note: "Sent to Exile Island with Coach after the supplies challenge. Coach took the supplies key, leaving Q to trade away his vote to Ozzy in exchange for camp supplies." },
      { holder: "Savannah Louie", kind: "advantage", type: "Block-a-Vote", status: "voted-out", note: "Won the Journey stacking challenge against Colby but never successfully deployed — her tribemates suspected she had it, and she was voted out in Episode 2 before she could use it." },
    ],
    recap: "24 returning legends, three tribes. Genevieve found the first Boomerang Idol and sent it to Ozzy. At Exile Island, Coach stole the supplies key — Q traded his vote to Ozzy for camp supplies. A Journey had Savannah beat Colby for a Block-a-Vote while Colby lost his vote. At Cila's Tribal, Jenna came in too hot targeting Cirie on Day 1 and was voted out 7-1. The premiere closed with Kyle Fraser medevac'd with a ruptured Achilles — the first Survivor winner ever evacuated.",
  },
];

function Recap() {
  return (
    <div>
      <div className="page-title">Recap</div>
      <div className="page-subtitle">Season 50 · Episode-by-episode breakdown · Most recent first</div>

      <div className="section-title">Advantages &amp; Disadvantages</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
        {(() => {
          const all = [...S50_EPISODES].reverse().flatMap(ep =>
            ep.advantages.map((adv, i) => ({ ...adv, epTitle: ep.title, epNum: ep.number, i }))
          );
          const seen = new Set();
          const deduped = all.filter(adv => {
            const key = adv.holder + "|" + adv.type;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          const sorted = [
            ...deduped.filter(a => a.status === "active").reverse(),
            ...deduped.filter(a => a.status !== "active").reverse(),
          ];
          return sorted;
        })().map((adv, idx) => {
          const statusLabel = adv.status === "active" ? "Active"
            : adv.status === "voted-out" ? "Voted Out"
            : adv.status === "applied" ? "Applied"
            : "Used";
          const statusBg    = adv.status === "active" ? "rgba(109,184,109,0.1)" : "rgba(200,146,42,0.08)";
          const statusBdr   = adv.status === "active" ? "1px solid rgba(109,184,109,0.25)" : "1px solid rgba(200,146,42,0.2)";
          const statusColor = adv.status === "active" ? "#6db86d" : "#a07830";
          return (
            <div key={`${adv.epNum}-${adv.i}`} style={{ display: "flex", flexDirection: "column", gap: "0.35rem", padding: "0.75rem 1rem", background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "0.55rem", letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "0.2rem 0.5rem", borderRadius: 2, whiteSpace: "nowrap",
                  background: statusBg, border: statusBdr, color: statusColor,
                }}>
                  {statusLabel}
                </span>
                <span style={{ fontSize: "0.6rem", color: "#a78bda" }}>{adv.title || adv.epTitle}</span>
                <span style={{ fontSize: "0.6rem", color: adv.kind === "disadvantage" ? "#c8922a" : "#6ab4d8" }}>
                  {adv.kind === "disadvantage" ? "⬇ " : "⬆ "}{adv.type}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#f0ebe0", fontWeight: 500 }}>{adv.holder}</div>
              <div style={{ fontSize: "0.65rem", color: "#bbb", lineHeight: 1.5 }}>{adv.note}</div>
            </div>
          );
        })}
      </div>

      <div className="section-title">Episodes</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {S50_EPISODES.map(ep => (
          <div key={ep.number} className="panel" style={{ borderColor: "rgba(255,255,255,0.09)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #c8922a, rgba(200,146,42,0.1))" }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 900, color: "#f0ebe0" }}>{ep.title}</span>
                <span style={{ fontSize: "0.58rem", color: "#bbb", letterSpacing: "0.1em", textTransform: "uppercase" }}>{ep.airDate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(200,60,60,0.08)", border: "1px solid rgba(200,60,60,0.2)", borderRadius: 3, padding: "0.3rem 0.65rem" }}>
                <span style={{ fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#cc6060" }}>Eliminated</span>
                <span style={{ fontSize: "0.68rem", color: "#f0ebe0" }}>{ep.eliminated}</span>
              </div>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#d0cab8", lineHeight: 1.75 }}>
              {ep.recap}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
