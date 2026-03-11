// src/App.jsx
import { useEffect, useMemo, useState } from "react";

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
  { name: "Angelina Keeley",         tribe: "Vatu", bio: "3rd place, S37 David vs. Goliath",                                    odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-angelina-keeley.jpg",         draftedBy: 5    },
  { name: "Aubry Bracco",            tribe: "Vatu", bio: "Runner-up S32 Kaoh Rong · S34 Game Changers · S38 Edge of Extinction", odds: "-250",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-aubry-bracco.jpg",            draftedBy: 4    },
  { name: 'Benjamin "Coach" Wade',   tribe: "Kalo", bio: "Runner-up S23 South Pacific · S18 Tocantins · S20 Heroes vs. Villains",odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-benjamin-coach-wade.jpg",   draftedBy: 1    },
  { name: "Charlie Davis",           tribe: "Kalo", bio: "Runner-up S46",                                                        odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-charlie-davis.jpg",           draftedBy: 4    },
  { name: "Chrissy Hofbeck",         tribe: "Kalo", bio: "Runner-up S35 Heroes vs. Healers vs. Hustlers",                        odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-chrissy-hofbeck.jpg",         draftedBy: 5    },
  { name: "Christian Hubicki",       tribe: "Cila", bio: "7th place S37 David vs. Goliath",                                      odds: "+800",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-christian-hubicki.jpg",       draftedBy: 1    },
  { name: "Cirie Fields",            tribe: "Cila", bio: "5x player · S12 Panama · S16 Micronesia · S20 HvV · S34 Game Changers",odds: "+1200", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-cirie-fields.jpg",            draftedBy: 4    },
  { name: "Colby Donaldson",         tribe: "Vatu", bio: "Runner-up S2 Australian Outback · S8 All-Stars · S20 Heroes vs. Villains",odds:"+5000",photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-colby-donaldson.jpg",         draftedBy: 2    },
  { name: "Dee Valladares",          tribe: "Kalo", bio: "WINNER S45 ★",                                                         odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-dee-valladares.jpg",          draftedBy: 3    },
  { name: "Emily Flippen",           tribe: "Cila", bio: "7th place S45",                                                        odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-emily-flippen.jpg",           draftedBy: 1    },
  { name: "Genevieve Mushaluk",      tribe: "Vatu", bio: "5th place S47",                                                        odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-genevieve-mushaluk.jpg",      draftedBy: 4    },
  { name: "Jenna Lewis-Dougherty",   tribe: "Cila", bio: "S1 Borneo · Final 3 S8 All-Stars",                                     odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jenna-lewis-dougherty.jpg",   draftedBy: 5    },
  { name: "Joe Hunter",              tribe: "Cila", bio: "3rd place S48",                                                        odds: "+700",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-joe-hunter.jpg",              draftedBy: 3    },
  { name: "Jonathan Young",          tribe: "Kalo", bio: "4th place S42",                                                        odds: "+900",  photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-jonathan-young.jpg",          draftedBy: 2    },
  { name: "Kamilla Karthigesu",      tribe: "Kalo", bio: "4th place S48",                                                        odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kamilla-karthigesu.jpg",      draftedBy: 3    },
  { name: "Kyle Fraser",             tribe: "Vatu", bio: "WINNER S48 ★",                                                         odds: "+2000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-kyle-fraser.jpg",             draftedBy: 5    },
  { name: "Mike White",              tribe: "Kalo", bio: "Runner-up S37 David vs. Goliath · Creator of The White Lotus",         odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-mike-white.jpg",              draftedBy: 1    },
  { name: "Ozzy Lusth",              tribe: "Cila", bio: "Runner-up S13 Cook Islands · 4x player total",                         odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-ozzy-lutsh.jpg",              draftedBy: 2    },
  { name: "Q Burdette",              tribe: "Vatu", bio: "8th place S46",                                                        odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-quintavius-q-burdette.jpg",   draftedBy: 3    },
  { name: "Rick Devens",             tribe: "Cila", bio: "4th place S38 Edge of Extinction",                                     odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rick-devens.jpg",             draftedBy: 4    },
  { name: "Rizo Velovic",            tribe: "Vatu", bio: "4th place S49",                                                        odds: "+3000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-rizo-velovic.jpg",            draftedBy: 2    },
  { name: "Savannah Louie",          tribe: "Cila", bio: "WINNER S49 ★",                                                         odds: "+2500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-savannah-louie.jpg",          draftedBy: 1    },
  { name: "Stephenie LaGrossa",      tribe: "Vatu", bio: "Runner-up S11 Guatemala · S10 Palau · S20 Heroes vs. Villains",        odds: "+4000", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-stephanie-lagrossa-kendrick.jpg", draftedBy: 3 },
  { name: "Tiffany Ervin",           tribe: "Kalo", bio: "8th place S46",                                                        odds: "+3500", photo: "https://entertainmentnow.com/wp-content/uploads/2026/01/survivor-season-50-cast-spoilers-first-photos-tiffany-ervin.jpg",           draftedBy: 2    },
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
};

function buildCastawaysForSeason50() {
  return S50_CASTAWAYS.map((c, idx) => ({
    id: idx + 1, name: c.name, tribe: c.tribe || "", bio: c.bio || "",
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
    try { return localStorage.getItem("sf_splash_ep2_v2") === "1"; } catch { return false; }
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
      const total = picks.reduce((sum, c) => sum + (c.eliminationOrder ? calcPoints(c.eliminationOrder, season50.totalCastaways) : 2), 0);
      return { ...team, picks, total };
    }).sort((a, b) => b.total - a.total);
  }, [castaways, season50]);

  const dismissSplash = () => {
    try { localStorage.setItem("sf_splash_ep2_v2", "1"); } catch {}
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
          <img src="data:image/jpeg;base64,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" alt="" aria-hidden="true" style={{
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
          }}>Scores have been updated<br/>for Episode 2</div>
          <div style={{ fontSize: "0.78rem", color: "#999", marginBottom: "2.5rem", maxWidth: 360, lineHeight: 1.6 }}>
            Watch Episode 2 before continuing to avoid spoilers.
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
                        : (showOdds && c.odds ? ` · ${c.odds} · 2pt` : " · 2pt")}
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
          <div style={{ marginBottom:"0.25rem" }}>
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
                      <div className="row" style={{ gap:"0.4rem" }}>
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
                <div style={{ marginTop:"0.2rem", paddingLeft:"0.1rem" }}>
                  <span style={{ fontSize:"0.62rem", color: team ? team.color : "#555" }}>{team ? team.name : "Undrafted"}</span>
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
    number: 2,
    title: "Episode 2",
    airDate: "March 4, 2026",
    eliminated: "Savannah Louie",
    advantages: [
      { holder: "Aubry Bracco", kind: "advantage", type: "Idol", status: "active", note: "Christian found Cila's Boomerang Idol and gave it to Aubry, bringing her to tears. Like Ozzy's, it returns to the finder if the recipient is voted out with it." },
      { holder: "Cirie Fields", kind: "advantage", type: "Extra Vote", status: "active", note: "Ozzy gave Cirie his Extra Vote — the first advantage of Cirie's entire Survivor career — after she campaigned to protect him from the vote." },
    ],
    recap: "Episode 2 kept the chaos at Cila front and center as the tribe returned to Tribal Council for the second straight week. Season 49 winner Savannah Louie was on thin ice from the start — her tribemates never bought her story about returning from the Journey empty-handed in the premiere, and her Block-a-Vote was an open secret. A feud between Rick Devens and Joe Hunter over honesty and strategy briefly put Joe's name in the mix, but Cirie masterfully steered the vote toward Savannah, framing it as a chance to flush her advantage and remove a proven winner in one move. Savannah was voted out 6-1 in a unanimous decision, making her the second person voted out and third eliminated overall. Elsewhere, Christian Hubicki found Cila's Billie Eilish Boomerang Idol and gifted it to Aubry Bracco, and in a touching moment of alliance-building, Ozzy handed Cirie his Extra Vote — the first advantage in her long Survivor career. The episode ended on a brilliantly chaotic note courtesy of Rick Devens, who hatched a scheme to plant a fake idol at Tribal Council using the packaging from Christian's Boomerang Idol. To pull it off, Christian provided the distraction — intentionally face-planting on his way out of Tribal, crumpling to the ground over absolutely nothing before somehow getting \"lost\" leaving the set, while Rick snuck the fake idol behind a rock near the fire. The plan nearly unraveled when Rick immediately turned to Jeff Probst with a barely-concealed grin, all but announcing what he'd just done.",
  },
  {
    number: 1,
    title: "Episode 1",
    airDate: "February 25, 2026",
    eliminated: "Jenna Lewis-Dougherty, Kyle Fraser (medevac)",
    advantages: [
      { holder: "Ozzy Lusth", kind: "advantage", type: "Idol", status: "active", note: "Genevieve (Vatu) found the first Boomerang Idol — a fully-powered idol good through Final Five — and sent it to Ozzy. If Ozzy is voted out holding it, the idol returns to Genevieve." },
      { holder: "Ozzy Lusth", kind: "advantage", type: "Extra Vote", status: "active", note: "Won on Exile Island after Coach stole the supplies key, forcing Ozzy into a negotiation where he traded his extra vote offer to Q — but Ozzy actually got the Extra Vote from Q in the deal." },
      { holder: "Colby Donaldson", kind: "disadvantage", type: "Lost Vote", status: "active", note: "Lost the Journey stacking challenge to Savannah, forfeiting his vote at the next Tribal Council." },
      { holder: "Q Burdette", kind: "disadvantage", type: "Lost Vote", status: "active", note: "Sent to Exile Island with Coach after the supplies challenge. Coach took the supplies key, leaving Q to trade away his vote to Ozzy in exchange for camp supplies." },
      { holder: "Savannah Louie", kind: "advantage", type: "Block-a-Vote", status: "voted-out", note: "Won the Journey stacking challenge against Colby but never successfully deployed — her tribemates suspected she had it, and she was voted out in Episode 2 before she could use it." },
    ],
    recap: "The three-hour Season 50 premiere wasted no time living up to its 'Epic Party' title, kicking off with 24 returning legends hitting the beach with old rivalries instantly reigniting and new ones forming by sunset. The fan-voted 'dynamic advantages' flooded the game with trinkets immediately: Genevieve found the celebrity-endorsed Billie Eilish Boomerang Idol and sent it straight to Ozzy, banking on history repeating itself after he was previously voted out with an idol. On Exile Island, Coach's decision to steal the supplies key reignited his long-running beef with Ozzy, and a negotiation ended with Ozzy landing an Extra Vote while Q returned to camp voteless. A Journey saw Savannah beat Colby in a stacking challenge, earning a Block-a-Vote while Colby lost his vote. At Cila's Tribal Council, Jenna Lewis-Dougherty came in too hot — openly campaigning against Cirie on Day 1 — and her own tribemates turned the target back on her, voting her out 7-1. The episode closed on a somber note when Kyle Fraser was medically evacuated with a ruptured Achilles tendon, becoming the first Survivor winner ever to be medevac'd.",
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
        {S50_EPISODES.flatMap(ep =>
          ep.advantages.map((adv, i) => ({ ...adv, epTitle: ep.title, epNum: ep.number, i }))
        ).map((adv, idx) => (
          <div key={`${adv.epNum}-${adv.i}`} style={{ display: "flex", flexDirection: "column", gap: "0.35rem", padding: "0.75rem 1rem", background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
            {/* Top row: status + episode + type */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "0.55rem", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "0.2rem 0.5rem", borderRadius: 2, whiteSpace: "nowrap",
                background: adv.status === "active" ? "rgba(109,184,109,0.1)" : adv.status === "voted-out" ? "rgba(200,60,60,0.08)" : "rgba(255,255,255,0.04)",
                border: adv.status === "active" ? "1px solid rgba(109,184,109,0.25)" : adv.status === "voted-out" ? "1px solid rgba(200,60,60,0.25)" : "1px solid rgba(255,255,255,0.08)",
                color: adv.status === "active" ? "#6db86d" : adv.status === "voted-out" ? "#cc6060" : "#777",
              }}>
                {adv.status === "active" ? "Active" : adv.status === "voted-out" ? "Voted Out" : "Used"}
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
        ))}
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
