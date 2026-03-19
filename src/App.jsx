// src/App.jsx
import { useEffect, useMemo, useState } from "react";

// Bump this each time you commit/publish to force the splash page to reappear for everyone
const SPLASH_VERSION = "ep4_v1_5";

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
  "Jenna Lewis-Dougherty": 1,  // Episode 1 boot
  "Kyle Fraser": 2,            // Episode 1 medevac
  "Savannah Louie": 3,         // Episode 2 boot
  "Q Burdette": 4,             // Episode 3 boot
  "Mike White": 5,             // Episode 4 boot
};

function buildCastawaysForSeason50() {
  return S50_CASTAWAYS.map((c, idx) => ({
    id: idx + 1, name: c.name, tribe: c.tribe || "", origTribe: c.origTribe || "", bio: c.bio || "",
    odds: c.odds || "", photo: c.photo || "",
    draftedBy: c.draftedBy ?? null,
    eliminationOrder: EP1_ELIMINATIONS[c.name] ?? null,
  }));
}

// Re-apply locked draft assignments + enforce known eliminations on top of saved state
function applyLockedDraft(castaways) {
  return castaways.map(c => {
    const master = S50_CASTAWAYS.find(m => m.name === c.name);
    if (!master) return c;
    const lockedElim = EP1_ELIMINATIONS[c.name];
    return {
      ...c,
      draftedBy: master.draftedBy ?? null,
      // Always pull tribe + origTribe from master so stale localStorage never shows old values
      tribe: master.tribe || c.tribe,
      origTribe: master.origTribe || c.origTribe || "",
      // Enforce known eliminations so stale localStorage never shows wrong scores
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
  if (!src || err) return <div className={className + "-placeholder"}><span>👤</span></div>;
  return <img src={proxyPhoto(src)} alt={alt} className={className} onError={() => setErr(true)} loading="lazy" />;
}

function ordinal(n) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #f0ebe0; font-family: 'DM Mono', monospace; }
  .app { min-height: 100vh; background: #0a0a0a; background-image: radial-gradient(ellipse at 20% 20%, rgba(180,120,40,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(120,60,20,0.06) 0%, transparent 60%); }
  .header { border-bottom: 1px solid rgba(180,120,40,0.3); padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: rgba(10,10,10,0.95); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(8px); flex-wrap: wrap; }
  .logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: #c8922a; letter-spacing: 0.05em; white-space: nowrap; }
  .logo span { color: #f0ebe0; font-weight: 700; }
  .nav { display: flex; gap: 0.25rem; flex-wrap: wrap; }
  .nav-btn { background: none; border: 1px solid transparent; color: #bbb; padding: 0.4rem 0.75rem; font-family: 'DM Mono', monospace; font-size: 0.68rem; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.2s; border-radius: 2px; white-space: nowrap; }
  .nav-btn:hover { color: #f0ebe0; border-color: rgba(180,120,40,0.3); }
  .nav-btn.active { color: #c8922a; border-color: rgba(200,146,42,0.5); background: rgba(200,146,42,0.06); }
  .container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
  .season-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; }
  .season-label { font-size: 0.62rem; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-right: 0.5rem; }
  .season-btn { font-family: 'DM Mono', monospace; font-size: 0.65rem; padding: 0.35rem 0.75rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); background: none; color: #ccc; transition: all 0.15s; }
  .season-btn.active { background: rgba(200,146,42,0.1); border-color: rgba(200,146,42,0.4); color: #c8922a; }
  .season-btn:hover:not(.active) { color: #f0ebe0; border-color: rgba(255,255,255,0.2); }
  .page-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #f0ebe0; margin-bottom: 0.3rem; }
  .page-subtitle { font-size: 0.68rem; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem; }
  .section-title { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .leaderboard { display: flex; flex-direction: column; gap: 1rem; }
  .lb-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1.25rem 1.5rem; display: grid; grid-template-columns: 2.5rem 1fr auto; align-items: center; gap: 1.5rem; }
  .lb-card.first { border-color: rgba(200,146,42,0.4); background: rgba(200,146,42,0.06); }
  .lb-rank { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; color: #555; }
  .lb-card.first .lb-rank { color: #c8922a; }
  .lb-tribe { font-size: 1rem; font-weight: 500; margin-bottom: 0.15rem; }
  .lb-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .c-tag { font-size: 0.6rem; padding: 0.15rem 0.45rem; border-radius: 2px; letter-spacing: 0.05em; text-transform: uppercase; }
  .c-tag.alive { background: rgba(80,180,80,0.1); color: #6db86d; border: 1px solid rgba(80,180,80,0.2); }
  .c-tag.eliminated { background: rgba(255,255,255,0.03); color: #aaa; border: 1px solid rgba(255,255,255,0.07); text-decoration: line-through; }
  .lb-score { text-align: right; }
  .lb-pts { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; color: #c8922a; line-height: 1; }
  .lb-pts-label { font-size: 0.58rem; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.1rem; }
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
  .c-bio { font-size: 0.56rem; color: #ccc; margin-bottom: 0.35rem; line-height: 1.4; }
  .c-row { display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem; }
  .c-status { font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .c-status.alive { color: #6db86d; }
  .c-status.eliminated { color: #bbb; }
  .c-status.undrafted { color: #aaa; }
  .c-pts { font-family: 'Playfair Display', serif; font-size: 1rem; color: #c8922a; font-weight: 900; margin-top: 0.15rem; }
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1.5rem 0; }
  .action-btn { font-family: 'DM Mono', monospace; font-size: 0.68rem; padding: 0.5rem 1rem; border-radius: 2px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.15s; border: 1px solid; margin-bottom: 1rem; background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: #ccc; }
  .action-btn.primary { background: rgba(200,146,42,0.15); border-color: rgba(200,146,42,0.4); color: #c8922a; }
  .action-btn.primary:hover { background: rgba(200,146,42,0.25); }
  .action-btn.danger { background: rgba(200,60,60,0.08); border-color: rgba(200,60,60,0.3); color: #cc6060; }
  .toast { position: fixed; bottom: 2rem; right: 2rem; background: #1a1a1a; border: 1px solid rgba(200,146,42,0.4); color: #f0ebe0; padding: 0.75rem 1.25rem; border-radius: 4px; font-size: 0.75rem; z-index: 999; animation: fadeUp 0.2s ease; }
  @keyframes fadeUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1rem 1.25rem; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .select, .input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #f0ebe0; border-radius: 3px; padding: 0.55rem 0.65rem; font-family: 'DM Mono', monospace; font-size: 0.75rem; outline: none; }
  .row { display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; }
  .hint { font-size:0.65rem; color:#bbb; line-height:1.4; }
  .hist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .hist-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 1rem 1.25rem; }
  .hist-card.champ { border-color: rgba(200,146,42,0.4); background: rgba(200,146,42,0.06); }
  .hist-score { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; }
  .hist-table { width: 100%; border-collapse: collapse; font-size: 0.7rem; }
  .hist-table th { text-align: left; color: #bbb; font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.4rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.07); font-weight: 400; }
  .hist-table td { padding: 0.45rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .hist-table tr:last-child td { border-bottom: none; }
  .hist-table tr:hover td { background: rgba(255,255,255,0.02); }
  .elim-row { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; background: rgba(255,255,255,0.02); gap: 0.5rem; }
  .elim-row.done { opacity: 0.5; }
  @media (max-width: 700px) {
    .container { padding: 1rem; }
    .grid2 { grid-template-columns: 1fr; }
    .lb-card { padding: 0.9rem 1rem; grid-template-columns: 2rem 1fr auto; gap: 0.75rem; }
    .lb-rank { font-size: 1.1rem; }
    .lb-pts { font-size: 1.6rem; }
  }
`;

export default function App() {
  const [splashDismissed, setSplashDismissed] = useState(() => {
    try { return localStorage.getItem(`sf_splash_${SPLASH_VERSION}`) === "1"; } catch { return false; }
  });
  const [page, setPage] = useState("leaderboard");
  const [historySeason, setHistorySeason] = useState(49);
  const [toast, setToast] = useState(null);
  const [showOdds, setShowOdds] = useState(false);

  const [castaways, setCastawaysRaw] = useState(() => {
    const saved = loadState();
    if (saved?.castaways?.length) return applyLockedDraft(saved.castaways);
    return buildCastawaysForSeason50();
  });

  const [draftOrder, setDraftOrderRaw] = useState(() => {
    const saved = loadState();
    return saved?.draftOrder || TEAMS.map(t => t.id);
  });

  useEffect(() => { saveState({ castaways, draftOrder, showOdds }); }, [castaways, draftOrder, showOdds]);

  const setCastaways = (fn) => setCastawaysRaw(prev => typeof fn === "function" ? fn(prev) : fn);
  const setDraftOrder = (o) => setDraftOrderRaw(o);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const resetSeason = () => { setCastawaysRaw(buildCastawaysForSeason50()); setDraftOrderRaw(TEAMS.map(t => t.id)); setShowOdds(false); showToast("Season 50 reset."); };

  const season50 = SEASONS.find(s => s.id === 50);

  const scores = useMemo(() => {
    return TEAMS.map(team => {
      const picks = castaways.filter(c => c.draftedBy === team.id);
      const total = picks.reduce((sum, c) => sum + (c.eliminationOrder ? calcPoints(c.eliminationOrder, season50.totalCastaways) : 4), 0);
      return { ...team, picks, total };
    }).sort((a, b) => b.total - a.total);
  }, [castaways, season50]);

  const dismissSplash = () => {
    try { localStorage.setItem(`sf_splash_${SPLASH_VERSION}`, "1"); } catch {}
    setSplashDismissed(true);
  };

  if (!splashDismissed) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{
          minHeight: "100vh", background: "#0a0a0a", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "2rem", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <img src="data:image/jpeg;base64,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"
            alt="" aria-hidden="true" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            opacity: 0.15, pointerEvents: "none", userSelect: "none",
          }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>🏝️</div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: "1rem",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#c8922a", marginBottom: "0.5rem",
          }}>Fantasy Survivor · Season 50</div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: "clamp(1.6rem, 5vw, 2.4rem)", color: "#f0ebe0",
            lineHeight: 1.2, marginBottom: "1.25rem",
          }}>Scores have been updated<br/>for Episode 4</div>
          <div style={{ fontSize: "0.78rem", color: "#999", marginBottom: "2.5rem", maxWidth: 360, lineHeight: 1.6 }}>
            Watch Episode 4 before continuing to avoid spoilers.
          </div>
          <button onClick={dismissSplash} style={{
            background: "rgba(200,146,42,0.12)", border: "1px solid rgba(200,146,42,0.5)",
            color: "#c8922a", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
            letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.85rem 2.5rem",
            borderRadius: "2px", cursor: "pointer",
          }}
          onMouseEnter={e => e.target.style.background="rgba(200,146,42,0.22)"}
          onMouseLeave={e => e.target.style.background="rgba(200,146,42,0.12)"}
          >
            Click to Continue →
          </button>
          <img src="data:image/png;base64,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"
            alt="" aria-hidden="true" style={{
            position: "absolute", bottom: "3rem", left: "3rem",
            width: "120px", opacity: 0.18, pointerEvents: "none", userSelect: "none",
          }} />
          <img src="data:image/png;base64,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"
            alt="" aria-hidden="true" style={{
            position: "absolute", top: "3rem", right: "3rem",
            width: "120px", opacity: 0.18, pointerEvents: "none", userSelect: "none",
          }} />
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
            {["leaderboard","recap","points","castaways","draft","history","admin"].map(p => (
              <button key={p} className={`nav-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          </nav>
        </header>

        <div className="container">
          {page === "leaderboard" && <Leaderboard season={season50} scores={scores} castaways={castaways} showOdds={showOdds} />}
          {page === "castaways"   && <Castaways   season={season50} castaways={castaways} showOdds={showOdds} />}
          {page === "history"     && <History historySeason={historySeason} setHistorySeason={setHistorySeason} />}
          {page === "draft"       && <DraftManual season={season50} castaways={castaways} draftOrder={draftOrder} setDraftOrder={setDraftOrder} setCastaways={setCastaways} showToast={showToast} showOdds={showOdds} />}
          {page === "points"      && <Points season={season50} castaways={castaways} />}
          {page === "recap"       && <Recap />}
          {page === "admin"       && <AdminManual season={season50} castaways={castaways} draftOrder={draftOrder} showOdds={showOdds} setShowOdds={setShowOdds} resetSeason={resetSeason} setDraftOrder={setDraftOrder} setCastaways={setCastaways} showToast={showToast} />}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// Convert American odds string to implied win probability
function oddsToImplied(odds) {
  if (!odds) return 0;
  if (odds.startsWith("-")) { const n = Math.abs(parseInt(odds)); return n / (n + 100); }
  const n = parseInt(odds.replace("+",""));
  return 100 / (n + 100);
}

// Projected points = sum of (implied_prob * max_possible_pts) for each alive pick
function projectedPts(picks, totalCastaways) {
  const maxPts = calcPoints(totalCastaways, totalCastaways);
  return picks
    .filter(c => !c.eliminationOrder && c.odds)
    .reduce((sum, c) => sum + oddsToImplied(c.odds) * maxPts, 0)
    .toFixed(1);
}

function Leaderboard({ season, scores, castaways, showOdds }) {
  const eliminated = castaways.filter(c => c.eliminationOrder).length;
  const remaining = season.totalCastaways - eliminated;
  const champs = getChampionshipsThrough(49);

  // Sum implied win probability for each team's alive picks
  function teamOddsSummary(picks) {
    const alive = picks.filter(c => !c.eliminationOrder && c.odds);
    if (!alive.length) return null;
    const totalImplied = alive.reduce((s, c) => s + oddsToImplied(c.odds), 0);
    // Convert back to +/- American odds for display
    if (totalImplied >= 0.5) {
      return "-" + Math.round((totalImplied / (1 - totalImplied)) * 100);
    } else {
      return "+" + Math.round(((1 - totalImplied) / totalImplied) * 100);
    }
  }

  return (
    <div>
      <div className="page-title">Leaderboard</div>
      <div className="page-subtitle">Season {season.id} · {season.totalCastaways} Castaways · {eliminated} Eliminated · {remaining} Remaining</div>
      <div className="leaderboard">
        {scores.map((team, i) => {
          const oddsDisplay = teamOddsSummary(team.picks);
          const proj = projectedPts(team.picks, season.totalCastaways);
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
                        : (showOdds && c.odds ? ` · ${c.odds} · 4pt` : " · 4pt")}
                    </span>
                  ))}
                  {team.picks.length === 0 && <span style={{ fontSize: "0.65rem", color: "#aaa" }}>No picks — set on Draft page</span>}
                </div>
              </div>
              <div className="lb-score">
                <div className="lb-pts" style={{ color: rank === 1 ? "#c8922a" : team.color }}>{team.total}</div>
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

function DraftManual({ castaways, showOdds }) {
  // LOCKED — draft is complete. Read-only view only.
  const teamById = Object.fromEntries(TEAMS.map(t => [t.id, t]));

  return (
    <div>
      <div className="page-title">Draft</div>
      <div className="page-subtitle">Season 50 · Draft complete · Picks locked</div>

      <div className="panel" style={{ marginBottom:"1.25rem", borderColor:"rgba(200,146,42,0.3)", background:"rgba(200,146,42,0.04)" }}>
        <div style={{ fontSize:"0.72rem", color:"#c8922a" }}>🔒 The Season 50 draft is locked. Picks cannot be changed.</div>
      </div>

      <div className="grid2" style={{ marginBottom:"1.25rem" }}>
        {TEAMS.map(t => {
          const picks = castaways.filter(c => c.draftedBy === t.id);
          return (
            <div key={t.id} className="panel">
              <div className="section-title" style={{ color: t.color }}>{t.name} — {t.members}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
                {picks.map(c => (
                  <div key={c.id} className="row" style={{ justifyContent:"space-between", padding:"0.45rem 0.5rem", border:"1px solid rgba(255,255,255,0.06)", borderRadius:3, background:"rgba(255,255,255,0.02)" }}>
                    <div>
                      <div style={{ fontSize:"0.78rem" }}>{c.name}</div>
                      <div className="row" style={{ gap:"0.3rem", alignItems:"center" }}>
                        {c.origTribe && c.origTribe !== c.tribe && (
                          <span style={{ fontSize:"0.58rem", color:TRIBE_COLORS[c.origTribe]||"#999" }}>{c.origTribe}</span>
                        )}
                        {c.origTribe && c.origTribe !== c.tribe && (
                          <span style={{ fontSize:"0.5rem", color:"#555" }}>→</span>
                        )}
                        {c.tribe && <span style={{ fontSize:"0.58rem", color:TRIBE_COLORS[c.tribe]||"#999" }}>{c.tribe}</span>}
                        {showOdds && c.odds && <span style={{ fontSize:"0.58rem", color:oddsColor(c.odds) }}>{c.odds}</span>}
                      </div>
                    </div>
                    {c.eliminationOrder
                      ? <span style={{ fontSize:"0.62rem", color:"#888", textDecoration:"line-through" }}>Elim #{c.eliminationOrder}</span>
                      : <span style={{ fontSize:"0.62rem", color:"#6db86d" }}>Active</span>}
                  </div>
                ))}
                {picks.length === 0 && <div className="hint">No picks.</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <div className="section-title">Not Selected</div>
        <div className="row" style={{ flexWrap:"wrap", gap:"0.4rem" }}>
          {castaways.filter(c => !c.draftedBy).map(c => (
            <span key={c.id} style={{ fontSize:"0.65rem", color:"#666", padding:"0.2rem 0.5rem", border:"1px solid rgba(255,255,255,0.06)", borderRadius:3 }}>
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Points({ season, castaways }) {
  const total = season.totalCastaways;
  const elimMap = {};
  castaways.forEach(c => { if (c.eliminationOrder != null) elimMap[c.eliminationOrder] = c; });
  const rows = Array.from({ length: total }, (_, i) => {
    const eo = i + 1, fp = total - eo + 1, pts = calcPoints(eo, total);
    return { fp, eo, pts, castaway: elimMap[eo] };
  }).sort((a,b) => b.fp - a.fp);

  return (
    <div>
      <div className="page-title">Points</div>
      <div className="page-subtitle">Season {season.id} · Points by finish position</div>
      <div style={{ border:"1px solid rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden" }}>
        {rows.map((r, idx) => {
          const team = r.castaway ? TEAMS.find(t => t.id === r.castaway.draftedBy) : null;
          const hasCastaway = !!r.castaway;
          return (
            <div key={r.fp} style={{ padding:"0.65rem 1rem", borderBottom: idx < rows.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: idx%2===0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              {/* Top line: finish + points + castaway name */}
              <div style={{ display:"flex", alignItems:"baseline", gap:"0.6rem", flexWrap:"wrap" }}>
                <span style={{ color:"#f0ebe0", fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"0.85rem", minWidth:"3rem" }}>{ordinal(r.fp)}</span>
                <span style={{ color:"#c8922a", fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"0.85rem", minWidth:"2.5rem" }}>{r.pts} pts</span>
                <span style={{ color: hasCastaway ? "#f0ebe0" : "#444", fontSize:"0.78rem" }}>{hasCastaway ? r.castaway.name : "—"}</span>
              </div>
              {/* Bottom line: team (only if castaway exists) */}
              {hasCastaway && (
                <div style={{ marginTop:"0.2rem", paddingLeft:"0.1rem", display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"0.62rem", color: team ? team.color : "#555" }}>{team ? team.name : "Undrafted"}</span>
                  {r.castaway.tribe && (
                    <span style={{ fontSize:"0.58rem", color:"#555" }}>·</span>
                  )}
                  {r.castaway.origTribe && r.castaway.origTribe !== r.castaway.tribe && (
                    <span style={{ fontSize:"0.58rem", color: TRIBE_COLORS[r.castaway.origTribe]||"#777" }}>{r.castaway.origTribe}</span>
                  )}
                  {r.castaway.origTribe && r.castaway.origTribe !== r.castaway.tribe && (
                    <span style={{ fontSize:"0.5rem", color:"#555" }}>→</span>
                  )}
                  {r.castaway.tribe && (
                    <span style={{ fontSize:"0.58rem", color: TRIBE_COLORS[r.castaway.tribe]||"#777" }}>{r.castaway.tribe}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const S50_EPISODES = [
  {
    number: 4,
    title: "Episode 4",
    airDate: "March 18, 2026",
    eliminated: "Mike White",
    advantages: [
      { holder: "Rizo Velovic", kind: "advantage", type: "Idol", status: "active", note: "Genevieve found her second Billie Eilish Boomerang Idol while shadowing Aubry on an idol hunt. The Boomerang Idol required her to send it to someone on another tribe, so she chose Rizo — calculating that he trusts her enough that she can eventually blindside him to boomerang it back. Rizo received it hidden in his bag and was immediately stoked, flashing back to the idol antics that defined his Season 49 game." },
      { holder: "Aubry Bracco", kind: "advantage", type: "Idol", status: "active", note: "Aubry's Boomerang Idol remains active heading into Episode 5. Its existence is widely known across the new Vatu tribe." },
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Ozzy's Boomerang Idol (originally sent by Genevieve) remains active." },
      { holder: "Ozzy Lusth", kind: "advantage", type: "Extra Vote", status: "active", note: "Ozzy's Extra Vote, won at Exile Island in Episode 1, remains unplayed." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote (given by Ozzy in Episode 2) remains secret and unused." },
      { holder: "Colby Donaldson", kind: "disadvantage", type: "Lost Vote", status: "active", note: "Colby's lost vote from the Episode 1 Journey has still not been triggered — Kalo won immunity in Episode 4 and did not go to Tribal Council." },
    ],
    recap: "Cila held a camp talent show won by Rizo's Mickey Mouse impression. On Kalo, Genevieve found a third Boomerang Idol while shadowing Aubry and sent it to Rizo, planning to blindside him later and get it back. The combined reward/immunity challenge had tribes raise a submerged boat, then solve a letter-cube arch puzzle spelling CELEBRATION — Kalo won first, earning a Sanctuary visit with country star Zac Brown (spearfishing and a private concert), while Vatu lost and went to Tribal. At Vatu, Mike wanted Emily gone as an unpredictable threat; Christian wanted Mike out so he could work with Emily. Ozzy wanted Angelina gone to get closer to Mike. Christian told Emily she was the target and they'd blindside Mike, but if Ozzy found out he might blow up the vote. She immediately told Ozzy that Mike wanted to vote her out but stopped short of revealing the full plan. This confirmed to Christian that Emily can't keep a secret. He went ahead anyway: Stephenie and Emily joined him to vote Mike out 3-2-1. Ozzy was kept in the dark and somehow more devastated than Mike.",
  },
  {
    number: 3,
    title: "Episode 3",
    airDate: "March 11, 2026",
    eliminated: "Q Burdette",
    advantages: [
      { holder: "Aubry Bracco", kind: "advantage", type: "Idol", status: "active", note: "Aubry's Boomerang Idol is now widely known — Christian told Emily before the swap, Emily immediately told Q and Ozzy, then told Angelina. Essentially the whole new Vatu tribe knows." },
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Ozzy's Boomerang Idol (from Genevieve) remains active. Q revealed its origins to Ozzy in Episode 3 as a trust-building move, confirming Genevieve originally found and sent it." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Cirie's Extra Vote remains secret and unused. She is now on the new Cila tribe, outnumbered by four original Kalo members." },
      { holder: "Colby Donaldson", kind: "disadvantage", type: "Lost Vote", status: "active", note: "Colby's lost vote from the Episode 1 Journey has not yet been triggered. He is now on the new Kalo tribe and will lose his vote at their next Tribal Council." },
    ],
    recap: "Jeff Probst rapped the tribe swap announcement. Three new tribes of seven reshuffled the game: Cirie was outnumbered 4-1 by original Kalo on new Cila; Coach told Chrissy she talked too much (she cried); Genevieve pushed distrust of Aubry on new Kalo. On new Vatu, the DvG trio of Christian, Mike, and Angelina reunited. Christian told Emily about Aubry's idol pre-swap — Emily immediately told everyone, then Q bluffed to Mike that he had an extra vote. Mike called it, and the tribe voted Q out 5-1 (only Stephenie voted Angelina). Q wore the same outfit as his Season 46 boot.",
  },
  {
    number: 2,
    title: "Episode 2",
    airDate: "March 4, 2026",
    eliminated: "Savannah Louie",
    advantages: [
      { holder: "Aubry Bracco", kind: "advantage", type: "Idol", status: "active", note: "Christian found Cila's Boomerang Idol and gave it to Aubry, bringing her to tears. Like Ozzy's, it returns to the finder if the recipient is voted out with it." },
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
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Genevieve (Vatu) found the first Boomerang Idol — a fully-powered idol good through Final Five — and sent it to Ozzy. If Ozzy is voted out holding it, the idol returns to Genevieve." },
      { holder: "Ozzy Lusth", kind: "advantage", type: "Extra Vote", status: "active", note: "Acquired at Exile Island — Coach stole the supplies key, leaving Q desperate for camp supplies. Q offered his vote to Ozzy in exchange, giving Ozzy the Extra Vote. In Episode 3, Q falsely told Mike White he had an extra vote (he does not)." },
      { holder: "Colby Donaldson", kind: "disadvantage", type: "Lost Vote", status: "active", note: "Lost the Journey stacking challenge to Savannah, forfeiting his vote at the next Tribal Council." },
      { holder: "Q Burdette", kind: "disadvantage", type: "Lost Vote", status: "applied", note: "Sent to Exile Island with Coach after the supplies challenge. Coach took the supplies key, leaving Q to trade away his vote to Ozzy in exchange for camp supplies. Q confirmed to Ozzy in Episode 3 that he had lost his vote, using it as a trust-building gesture." },
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

      {/* Advantages & Disadvantages — mobile-friendly cards */}
      <div className="section-title">Advantages &amp; Disadvantages</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
        {(() => {
          // Flatten oldest-first so the originating episode label is kept during dedup
          const all = [...S50_EPISODES].reverse().flatMap(ep =>
            ep.advantages.map((adv, i) => ({ ...adv, epTitle: ep.title, epNum: ep.number, i }))
          );
          const seen = new Set();
          const deduped = all.filter(adv => {
            const key = adv.holder + '|' + adv.type;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          // Sort: active first, inactive (voted-out / applied / used) at bottom
          const sorted = [
            ...deduped.filter(a => a.status === "active").reverse(),
            ...deduped.filter(a => a.status !== "active").reverse(),
          ];
          return sorted;
        })().map((adv, idx) => {
          const statusLabel = adv.status === "active" ? "Active"
            : adv.status === "voted-out" ? "Voted Out"
            : adv.status === "applied" ? "Applied Episode 3"
            : "Used";
          const statusBg    = adv.status === "active" ? "rgba(109,184,109,0.1)" : "rgba(200,146,42,0.08)";
          const statusBdr   = adv.status === "active" ? "1px solid rgba(109,184,109,0.25)" : "1px solid rgba(200,146,42,0.2)";
          const statusColor = adv.status === "active" ? "#6db86d" : "#a07830";
          return (
          <div key={`${adv.epNum}-${adv.i}`} style={{ display: "flex", flexDirection: "column", gap: "0.35rem", padding: "0.75rem 1rem", background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
            {/* Top row: status + episode + type */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "0.55rem", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "0.2rem 0.5rem", borderRadius: 2, whiteSpace: "nowrap",
                background: statusBg, border: statusBdr, color: statusColor,
              }}>
                {statusLabel}
              </span>
              <span style={{ fontSize: "0.6rem", color: "#a78bda" }}>{adv.epTitle}</span>
              <span style={{ fontSize: "0.6rem", color: adv.kind === "disadvantage" ? "#c8922a" : "#6ab4d8" }}>
                {adv.kind === "disadvantage" ? "⬇ " : "⬆ "}{adv.type}
              </span>
            </div>
            {/* Castaway name */}
            <div style={{ fontSize: "0.75rem", color: "#f0ebe0", fontWeight: 500 }}>{adv.holder}</div>
            {/* Description */}
            <div style={{ fontSize: "0.65rem", color: "#bbb", lineHeight: 1.5 }}>{adv.note}</div>
          </div>
          );
        })}
      </div>

      {/* Episode recaps */}
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

function AdminManual({ season, castaways, draftOrder, showOdds, setShowOdds, resetSeason, setDraftOrder, setCastaways, showToast }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const teamById = Object.fromEntries(TEAMS.map(t => [t.id, t]));

  if (!authed) {
    return (
      <div>
        <div className="page-title">Admin</div>
        <div className="page-subtitle">Commissioner access only</div>
        <div className="panel" style={{ maxWidth: 360 }}>
          <div className="section-title">Password Required</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <input
              className="input"
              type="password"
              placeholder="Enter admin password"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (pwInput === ADMIN_PASSWORD) { setAuthed(true); setPwInput(""); }
                  else { setPwError(true); setPwInput(""); }
                }
              }}
              style={{ borderColor: pwError ? "rgba(200,60,60,0.5)" : undefined }}
            />
            {pwError && <div style={{ fontSize:"0.65rem", color:"#cc6060" }}>Incorrect password. Try again.</div>}
            <button
              className="action-btn primary"
              style={{ marginBottom:0 }}
              onClick={() => {
                if (pwInput === ADMIN_PASSWORD) { setAuthed(true); setPwInput(""); }
                else { setPwError(true); setPwInput(""); }
              }}
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  const usedOrders = new Set(castaways.filter(c => c.eliminationOrder).map(c => c.eliminationOrder));
  const nextElim = (() => { for (let i=1; i<=season.totalCastaways; i++) if (!usedOrders.has(i)) return i; return season.totalCastaways+1; })();

  const setElimOrder = (id, val) => {
    const v = val.trim() === "" ? null : parseInt(val, 10);
    setCastaways(prev => prev.map(c => c.id === id ? { ...c, eliminationOrder: Number.isFinite(v) ? v : null } : c));
  };

  const quickElim = (id) => {
    if (nextElim > season.totalCastaways) { showToast("All castaways already eliminated!"); return; }
    setCastaways(prev => prev.map(c => c.id === id ? { ...c, eliminationOrder: nextElim } : c));
    showToast(`Eliminated! #${nextElim}`);
  };

  const restore = (id) => {
    setCastaways(prev => prev.map(c => c.id === id ? { ...c, eliminationOrder: null } : c));
    showToast("Castaway restored.");
  };

  const clearElims = () => { setCastaways(prev => prev.map(c => ({ ...c, eliminationOrder: null }))); showToast("All eliminations cleared."); };

  const alive     = castaways.filter(c => !c.eliminationOrder);
  const eliminated = castaways.filter(c => c.eliminationOrder).sort((a,b) => b.eliminationOrder - a.eliminationOrder);

  return (
    <div>
      <div className="page-title">Admin</div>
      <div className="page-subtitle">Commissioner controls · Next elimination #{nextElim <= season.totalCastaways ? nextElim : "done"}</div>

      <div className="panel" style={{ marginBottom:"1.25rem" }}>
        <div className="section-title">Controls</div>
        <div className="row" style={{ marginBottom:"0.75rem" }}>
          <button className="action-btn" style={{ marginBottom:0, background:showOdds?"rgba(200,146,42,0.12)":"rgba(255,255,255,0.03)", borderColor:showOdds?"rgba(200,146,42,0.5)":"rgba(255,255,255,0.1)", color:showOdds?"#c8922a":"#aaa" }} onClick={() => setShowOdds(o=>!o)}>
            {showOdds ? "👁 Odds Visible" : "🙈 Odds Hidden"}
          </button>
          <button className="action-btn" style={{ marginBottom:0 }} onClick={clearElims}>Clear All Eliminations</button>
          {!confirmReset
            ? <button className="action-btn danger" style={{ marginBottom:0 }} onClick={() => setConfirmReset(true)}>↺ Reset Season</button>
            : <>
                <span className="hint" style={{ color:"#cc6060" }}>This will erase all picks + eliminations. Sure?</span>
                <button className="action-btn danger" style={{ marginBottom:0, background:"rgba(200,60,60,0.2)", borderColor:"rgba(200,60,60,0.5)", color:"#ff8080" }} onClick={() => { resetSeason(); setConfirmReset(false); }}>Yes, Reset</button>
                <button className="action-btn" style={{ marginBottom:0 }} onClick={() => setConfirmReset(false)}>Cancel</button>
              </>
          }
        </div>
        <div className="hint">Use "Elim #N" button to mark the next castaway out instantly, or type a number manually. Use "Restore" to undo any elimination.</div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="section-title">Still In — {alive.length}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
            {alive.map(c => {
              const team = c.draftedBy ? teamById[c.draftedBy] : null;
              return (
                <div key={c.id} className="elim-row">
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:"0.78rem" }}>{c.name}</div>
                    <div className="row" style={{ gap:"0.4rem" }}>
                      {c.tribe && <span style={{ fontSize:"0.6rem", color:TRIBE_COLORS[c.tribe]||"#777" }}>{c.tribe}</span>}
                      <span style={{ fontSize:"0.6rem", color: team ? team.color : "#777" }}>{team ? team.name : "Undrafted"}</span>
                    </div>
                  </div>
                  <div className="row" style={{ gap:"0.35rem" }}>
                    <input className="input" style={{ width:64 }} placeholder="#" value={c.eliminationOrder ?? ""} onChange={e => setElimOrder(c.id, e.target.value)} />
                    <button className="action-btn primary" style={{ marginBottom:0, padding:"0.35rem 0.65rem", fontSize:"0.62rem", whiteSpace:"nowrap" }} onClick={() => quickElim(c.id)}>
                      Elim #{nextElim}
                    </button>
                  </div>
                </div>
              );
            })}
            {alive.length === 0 && <div className="hint">Everyone has been eliminated!</div>}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">Eliminated — {eliminated.length} (most recent first)</div>
          {eliminated.length === 0
            ? <div className="hint">No eliminations yet.</div>
            : (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                {eliminated.map(c => {
                  const team = c.draftedBy ? teamById[c.draftedBy] : null;
                  const pts = calcPoints(c.eliminationOrder, season.totalCastaways);
                  return (
                    <div key={c.id} className="elim-row done">
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:"0.75rem", color:"#999" }}>#{c.eliminationOrder} · {c.name}</div>
                        <div className="row" style={{ gap:"0.4rem" }}>
                          <span style={{ fontSize:"0.6rem", color: team ? team.color : "#777" }}>{team ? team.name : "—"}</span>
                          <span style={{ fontSize:"0.6rem", color:"#c8922a" }}>{pts} pts</span>
                        </div>
                      </div>
                      <button className="action-btn" style={{ marginBottom:0, padding:"0.3rem 0.6rem", fontSize:"0.6rem" }} onClick={() => restore(c.id)}>Restore</button>
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
