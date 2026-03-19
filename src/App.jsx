// src/App.jsx
import { useEffect, useMemo, useState } from "react";

// Bump this each time you commit/publish to force the splash page to reappear for everyone
const SPLASH_VERSION = "ep4_v1";

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
            objectFit: "contain", objectPosition: "center",
            opacity: 0.12, pointerEvents: "none", userSelect: "none",
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
