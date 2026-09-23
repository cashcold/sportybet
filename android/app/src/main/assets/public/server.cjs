var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_express7 = __toESM(require("express"), 1);

// src/server/app.ts
var import_express6 = __toESM(require("express"), 1);

// src/server/routes/authRoutes.ts
var import_express = require("express");

// src/data/mockData.ts
var INITIAL_MATCHES = [
  // --- LIVE MATCHES (Matches screenshot 1 & 2 & 3) ---
  {
    id: "live-alloa-hib",
    gameId: "19482",
    sport: "football",
    league: "Scotland - Challenge Cup",
    countryOrCategory: "Scotland",
    homeTeam: "Alloa Athletic FC",
    awayTeam: "Hibernian B",
    homeScore: 1,
    awayScore: 0,
    minute: "19:27",
    period: "H1",
    isLive: true,
    isHot: false,
    marketsCount: 41,
    markets: {
      "1X2": [
        { id: "lah-1", name: "1", value: 1.03, trend: "same" },
        { id: "lah-x", name: "X", value: 11.5, trend: "same" },
        { id: "lah-2", name: "2", value: 24, trend: "same" }
      ],
      "O/U": [
        { id: "lah-o1.5", name: "Over 1.5", value: 1.15, trend: "same" },
        { id: "lah-u1.5", name: "Under 1.5", value: 4.8, trend: "same" }
      ],
      "DC": [
        { id: "lah-1x", name: "1X", value: 1.01, trend: "same" },
        { id: "lah-12", name: "12", value: 1.04, trend: "same" },
        { id: "lah-x2", name: "X2", value: 9, trend: "same" }
      ],
      "1st Half O/U": [
        { id: "lah-h-o", name: "Over 1.5", value: 1.95, trend: "same" },
        { id: "lah-h-u", name: "Under 1.5", value: 1.75, trend: "same" }
      ],
      "Handicap": [
        { id: "lah-h1", name: "(-1.5) 1", value: 1.35, trend: "same" },
        { id: "lah-h2", name: "(+1.5) 2", value: 2.85, trend: "same" }
      ]
    }
  },
  {
    id: "live-1",
    gameId: "29811",
    sport: "football",
    league: "UEFA Women's Champions League",
    countryOrCategory: "International Clubs",
    homeTeam: "Bayern Munich W",
    awayTeam: "Manchester City W",
    homeScore: 2,
    awayScore: 0,
    minute: "34:12",
    period: "H1",
    isLive: true,
    isHot: true,
    marketsCount: 140,
    markets: {
      "1X2": [
        { id: "l1-1", name: "1", value: 1.05, trend: "same" },
        { id: "l1-x", name: "X", value: 9.25, trend: "down" },
        { id: "l1-2", name: "2", value: 23, trend: "down" }
      ],
      "O/U": [
        { id: "l1-o2.5", name: "Over 2.5", value: 1.38, trend: "same" },
        { id: "l1-u2.5", name: "Under 2.5", value: 2.85, trend: "up" }
      ],
      "DC": [
        { id: "l1-1x", name: "1X", value: 1.01, trend: "same" },
        { id: "l1-12", name: "12", value: 1.06, trend: "same" },
        { id: "l1-x2", name: "X2", value: 8.5, trend: "down" }
      ],
      "1st Half O/U": [
        { id: "l1-h-o", name: "Over 2.5", value: 2.1, trend: "up" },
        { id: "l1-h-u", name: "Under 2.5", value: 1.65, trend: "down" }
      ],
      "Handicap": [
        { id: "l1-h1", name: "(-1.5) 1", value: 1.48, trend: "same" },
        { id: "l1-h2", name: "(+1.5) 2", value: 2.55, trend: "up" }
      ]
    }
  },
  {
    id: "live-2",
    gameId: "38192",
    sport: "football",
    league: "UEFA Champions League Qualifiers",
    countryOrCategory: "International Clubs",
    homeTeam: "Inter Milano",
    awayTeam: "Hacken Gothenburg",
    homeScore: 1,
    awayScore: 0,
    minute: "29:18",
    period: "H1",
    isLive: true,
    isHot: true,
    marketsCount: 145,
    markets: {
      "1X2": [
        { id: "l2-1", name: "1", value: 1.37, trend: "same" },
        { id: "l2-x", name: "X", value: 4.15, trend: "same" },
        { id: "l2-2", name: "2", value: 7.75, trend: "up" }
      ],
      "O/U": [
        { id: "l2-o2.5", name: "Over 2.5", value: 1.62, trend: "same" },
        { id: "l2-u2.5", name: "Under 2.5", value: 2.2, trend: "same" }
      ],
      "DC": [
        { id: "l2-1x", name: "1X", value: 1.08, trend: "same" },
        { id: "l2-12", name: "12", value: 1.18, trend: "same" },
        { id: "l2-x2", name: "X2", value: 2.9, trend: "up" }
      ],
      "1st Half O/U": [
        { id: "l2-h-o", name: "Over 1.5", value: 2.25, trend: "up" },
        { id: "l2-h-u", name: "Under 1.5", value: 1.58, trend: "down" }
      ],
      "Handicap": [
        { id: "l2-h1", name: "(-1) 1", value: 1.95, trend: "same" },
        { id: "l2-h2", name: "(+1) 2", value: 1.82, trend: "same" }
      ]
    }
  },
  {
    id: "live-3",
    gameId: "19041",
    sport: "football",
    league: "U21 Professional Development League",
    countryOrCategory: "England Amateur",
    homeTeam: "Bristol City U21",
    awayTeam: "Hull City U21",
    homeScore: 0,
    awayScore: 0,
    minute: "14:19",
    period: "H1",
    isLive: true,
    isHot: false,
    marketsCount: 105,
    markets: {
      "1X2": [
        { id: "l3-1", name: "1", value: 1.36, trend: "same" },
        { id: "l3-x", name: "X", value: 5.25, trend: "up" },
        { id: "l3-2", name: "2", value: 6.5, trend: "down" }
      ],
      "O/U": [
        { id: "l3-o2.5", name: "Over 2.5", value: 1.45, trend: "same" },
        { id: "l3-u2.5", name: "Under 2.5", value: 2.6, trend: "same" }
      ],
      "DC": [
        { id: "l3-1x", name: "1X", value: 1.1, trend: "same" },
        { id: "l3-12", name: "12", value: 1.14, trend: "same" },
        { id: "l3-x2", name: "X2", value: 2.8, trend: "down" }
      ],
      "1st Half O/U": [
        { id: "l3-h-o", name: "Over 0.5", value: 1.4, trend: "same" },
        { id: "l3-h-u", name: "Under 0.5", value: 2.75, trend: "same" }
      ],
      "Handicap": [
        { id: "l3-h1", name: "(-1) 1", value: 1.9, trend: "same" },
        { id: "l3-h2", name: "(+1) 2", value: 1.85, trend: "same" }
      ]
    }
  },
  {
    id: "live-4",
    gameId: "22871",
    sport: "football",
    league: "Cup",
    countryOrCategory: "Estonia",
    homeTeam: "FC Tallinn",
    awayTeam: "Harju JK Laagri",
    homeScore: 0,
    awayScore: 0,
    minute: "14:17",
    period: "H1",
    isLive: true,
    isHot: false,
    marketsCount: 60,
    markets: {
      "1X2": [
        { id: "l4-1", name: "1", value: 1.25, trend: "same" },
        { id: "l4-x", name: "X", value: 6, trend: "same" },
        { id: "l4-2", name: "2", value: 8, trend: "up" }
      ],
      "O/U": [
        { id: "l4-o2.5", name: "Over 2.5", value: 1.35, trend: "same" },
        { id: "l4-u2.5", name: "Under 2.5", value: 2.95, trend: "same" }
      ],
      "DC": [
        { id: "l4-1x", name: "1X", value: 1.05, trend: "same" },
        { id: "l4-12", name: "12", value: 1.1, trend: "same" },
        { id: "l4-x2", name: "X2", value: 3.4, trend: "same" }
      ],
      "1st Half O/U": [
        { id: "l4-h-o", name: "Over 1.5", value: 2.05, trend: "same" },
        { id: "l4-h-u", name: "Under 1.5", value: 1.7, trend: "same" }
      ],
      "Handicap": [
        { id: "l4-h1", name: "(-1.5) 1", value: 1.75, trend: "same" },
        { id: "l4-h2", name: "(+1.5) 2", value: 2.05, trend: "same" }
      ]
    }
  },
  {
    id: "live-5",
    gameId: "16602",
    sport: "football",
    league: "Liga 2",
    countryOrCategory: "Romania",
    homeTeam: "Asa Targu Mures",
    awayTeam: "CS Dinamo Bucuresti",
    homeScore: 0,
    awayScore: 0,
    minute: "14:41",
    period: "H1",
    isLive: true,
    isHot: false,
    marketsCount: 106,
    markets: {
      "1X2": [
        { id: "l5-1", name: "1", value: 1.22, trend: "same" },
        { id: "l5-x", name: "X", value: 5.7, trend: "same" },
        { id: "l5-2", name: "2", value: 11.5, trend: "same" }
      ],
      "O/U": [
        { id: "l5-o2.5", name: "Over 2.5", value: 1.5, trend: "same" },
        { id: "l5-u2.5", name: "Under 2.5", value: 2.45, trend: "same" }
      ],
      "DC": [
        { id: "l5-1x", name: "1X", value: 1.04, trend: "same" },
        { id: "l5-12", name: "12", value: 1.12, trend: "same" },
        { id: "l5-x2", name: "X2", value: 3.9, trend: "same" }
      ],
      "1st Half O/U": [
        { id: "l5-h-o", name: "Over 0.5", value: 1.36, trend: "same" },
        { id: "l5-h-u", name: "Under 0.5", value: 2.9, trend: "same" }
      ],
      "Handicap": [
        { id: "l5-h1", name: "(-1) 1", value: 1.65, trend: "same" },
        { id: "l5-h2", name: "(+1) 2", value: 2.2, trend: "same" }
      ]
    }
  },
  // --- UPCOMING / TODAY / HIGHLIGHTS MATCHES (Screenshot 2) ---
  {
    id: "up-1",
    gameId: "41392",
    sport: "football",
    league: "EFL Trophy",
    countryOrCategory: "England",
    homeTeam: "Barnsley FC",
    awayTeam: "Leeds United U21",
    startTime: "18:00",
    isLive: false,
    isHot: true,
    marketsCount: 234,
    markets: {
      "1X2": [
        { id: "u1-1", name: "1", value: 1.32 },
        { id: "u1-x", name: "X", value: 5.8 },
        { id: "u1-2", name: "2", value: 7 }
      ],
      "O/U": [
        { id: "u1-o2.5", name: "Over 2.5", value: 1.4 },
        { id: "u1-u2.5", name: "Under 2.5", value: 2.75 }
      ],
      "DC": [
        { id: "u1-1x", name: "1X", value: 1.09 },
        { id: "u1-12", name: "12", value: 1.13 },
        { id: "u1-x2", name: "X2", value: 3.1 }
      ],
      "1st Half O/U": [
        { id: "u1-h-o", name: "Over 1.5", value: 2.15 },
        { id: "u1-h-u", name: "Under 1.5", value: 1.65 }
      ],
      "Handicap": [
        { id: "u1-h1", name: "(-1) 1", value: 1.82 },
        { id: "u1-h2", name: "(+1) 2", value: 1.95 }
      ]
    }
  },
  {
    id: "up-2",
    gameId: "11643",
    sport: "football",
    league: "EFL Trophy",
    countryOrCategory: "England",
    homeTeam: "Leicester",
    awayTeam: "Fulham U21",
    startTime: "18:00",
    isLive: false,
    isHot: true,
    marketsCount: 180,
    markets: {
      "1X2": [
        { id: "u2-1", name: "1", value: 1.14 },
        { id: "u2-x", name: "X", value: 8.8 },
        { id: "u2-2", name: "2", value: 13 }
      ],
      "O/U": [
        { id: "u2-o2.5", name: "Over 2.5", value: 1.3 },
        { id: "u2-u2.5", name: "Under 2.5", value: 3.3 }
      ],
      "DC": [
        { id: "u2-1x", name: "1X", value: 1.03 },
        { id: "u2-12", name: "12", value: 1.07 },
        { id: "u2-x2", name: "X2", value: 4.8 }
      ],
      "1st Half O/U": [
        { id: "u2-h-o", name: "Over 1.5", value: 1.85 },
        { id: "u2-h-u", name: "Under 1.5", value: 1.9 }
      ],
      "Handicap": [
        { id: "u2-h1", name: "(-2) 1", value: 2.05 },
        { id: "u2-h2", name: "(+2) 2", value: 1.7 }
      ]
    }
  },
  {
    id: "up-3",
    gameId: "48079",
    sport: "football",
    league: "EFL Trophy",
    countryOrCategory: "England",
    homeTeam: "Luton Town",
    awayTeam: "Ipswich Town U21",
    startTime: "18:00",
    isLive: false,
    isHot: true,
    marketsCount: 195,
    markets: {
      "1X2": [
        { id: "u3-1", name: "1", value: 1.2 },
        { id: "u3-x", name: "X", value: 7.2 },
        { id: "u3-2", name: "2", value: 9.9 }
      ],
      "O/U": [
        { id: "u3-o2.5", name: "Over 2.5", value: 1.35 },
        { id: "u3-u2.5", name: "Under 2.5", value: 3 }
      ],
      "DC": [
        { id: "u3-1x", name: "1X", value: 1.04 },
        { id: "u3-12", name: "12", value: 1.08 },
        { id: "u3-x2", name: "X2", value: 4.1 }
      ],
      "1st Half O/U": [
        { id: "u3-h-o", name: "Over 1.5", value: 1.95 },
        { id: "u3-h-u", name: "Under 1.5", value: 1.8 }
      ],
      "Handicap": [
        { id: "u3-h1", name: "(-1.5) 1", value: 1.62 },
        { id: "u3-h2", name: "(+1.5) 2", value: 2.25 }
      ]
    }
  },
  {
    id: "up-4",
    gameId: "54201",
    sport: "football",
    league: "Premier League",
    countryOrCategory: "England",
    homeTeam: "Arsenal FC",
    awayTeam: "Chelsea FC",
    startTime: "20:00",
    isLive: false,
    isHot: true,
    marketsCount: 420,
    markets: {
      "1X2": [
        { id: "u4-1", name: "1", value: 1.85 },
        { id: "u4-x", name: "X", value: 3.75 },
        { id: "u4-2", name: "2", value: 4.2 }
      ],
      "O/U": [
        { id: "u4-o2.5", name: "Over 2.5", value: 1.75 },
        { id: "u4-u2.5", name: "Under 2.5", value: 2.05 }
      ],
      "DC": [
        { id: "u4-1x", name: "1X", value: 1.22 },
        { id: "u4-12", name: "12", value: 1.25 },
        { id: "u4-x2", name: "X2", value: 1.95 }
      ],
      "1st Half O/U": [
        { id: "u4-h-o", name: "Over 1.5", value: 2.5 },
        { id: "u4-h-u", name: "Under 1.5", value: 1.5 }
      ],
      "Handicap": [
        { id: "u4-h1", name: "(-1) 1", value: 2.55 },
        { id: "u4-h2", name: "(+1) 2", value: 1.52 }
      ]
    }
  },
  {
    id: "up-5",
    gameId: "63124",
    sport: "football",
    league: "La Liga",
    countryOrCategory: "Spain",
    homeTeam: "Real Madrid",
    awayTeam: "Atletico Madrid",
    startTime: "21:00",
    isLive: false,
    isHot: true,
    marketsCount: 388,
    markets: {
      "1X2": [
        { id: "u5-1", name: "1", value: 1.92 },
        { id: "u5-x", name: "X", value: 3.5 },
        { id: "u5-2", name: "2", value: 3.95 }
      ],
      "O/U": [
        { id: "u5-o2.5", name: "Over 2.5", value: 1.82 },
        { id: "u5-u2.5", name: "Under 2.5", value: 1.98 }
      ],
      "DC": [
        { id: "u5-1x", name: "1X", value: 1.25 },
        { id: "u5-12", name: "12", value: 1.28 },
        { id: "u5-x2", name: "X2", value: 1.85 }
      ],
      "1st Half O/U": [
        { id: "u5-h-o", name: "Over 1.5", value: 2.6 },
        { id: "u5-h-u", name: "Under 1.5", value: 1.45 }
      ],
      "Handicap": [
        { id: "u5-h1", name: "(-1) 1", value: 2.65 },
        { id: "u5-h2", name: "(+1) 2", value: 1.48 }
      ]
    }
  },
  {
    id: "up-6",
    gameId: "77218",
    sport: "basketball",
    league: "NBA",
    countryOrCategory: "USA",
    homeTeam: "Boston Celtics",
    awayTeam: "LA Lakers",
    startTime: "23:30",
    isLive: false,
    isHot: true,
    marketsCount: 160,
    markets: {
      "1X2": [
        { id: "b1-1", name: "1", value: 1.55 },
        { id: "b1-x", name: "X", value: 15 },
        { id: "b1-2", name: "2", value: 2.45 }
      ],
      "O/U": [
        { id: "b1-o220", name: "Over 224.5", value: 1.9 },
        { id: "b1-u220", name: "Under 224.5", value: 1.9 }
      ],
      "Handicap": [
        { id: "b1-h1", name: "(-4.5) 1", value: 1.9 },
        { id: "b1-h2", name: "(+4.5) 2", value: 1.9 }
      ]
    }
  }
];
var INITIAL_OPEN_BETS = [
  {
    id: "bet-101",
    ticketId: "SBGH-9821-4821",
    type: "Multiple",
    date: "22/09 18:24",
    isLive: true,
    selections: [
      {
        matchId: "live-2",
        gameId: "38192",
        matchTitle: "Inter Milano vs Hacken Gothenburg W",
        marketName: "1X2",
        selectionName: "Home",
        odd: 2.1,
        isLive: true,
        liveOdds: 1.09,
        liveOddsTrend: "same",
        liveScore: "1:0",
        liveTime: "84' H2",
        hasTracker: true,
        hasStats: true
      },
      {
        matchId: "live-1",
        gameId: "29811",
        matchTitle: "Bayern Munich W vs Manchester City WFC",
        marketName: "Handicap 0:2",
        selectionName: "Away (0:2)",
        odd: 1.27,
        isLive: true,
        liveOdds: 1.18,
        liveOddsTrend: "down",
        liveScore: "2:1",
        liveTime: "83' H2",
        hasTracker: true,
        hasStats: true
      },
      {
        matchId: "live-6",
        gameId: "49120",
        matchTitle: "Peterborough United vs Colchester United",
        marketName: "1X2",
        selectionName: "Home",
        odd: 1.86,
        isLive: true,
        liveOdds: 1.46,
        liveOddsTrend: "same",
        liveScore: "0:0",
        liveTime: "26' H1",
        hasTracker: true,
        hasStream: true,
        hasStats: false
      }
    ],
    stake: 20,
    totalOdds: 4.96,
    potentialWin: 99.2,
    status: "open",
    cashoutAvailable: false,
    cashoutAmount: 24.5
  }
];
var INITIAL_BET_HISTORY = [
  {
    id: "bet-100",
    ticketId: "SBGH-9810-1129",
    type: "Single",
    date: "21/09 20:45",
    isLive: false,
    selections: [
      {
        matchId: "hist-1",
        gameId: "88219",
        matchTitle: "Liverpool vs Bournemouth",
        marketName: "1X2",
        selectionName: "1",
        odd: 1.28,
        isLive: false
      }
    ],
    stake: 50,
    totalOdds: 1.28,
    potentialWin: 64,
    status: "won",
    cashoutAvailable: false
  },
  {
    id: "bet-99",
    ticketId: "SBGH-9799-0043",
    type: "Multiple",
    date: "20/09 16:30",
    isLive: false,
    selections: [
      {
        matchId: "hist-2",
        gameId: "77123",
        matchTitle: "Barcelona vs Getafe",
        marketName: "1X2",
        selectionName: "1",
        odd: 1.25,
        isLive: false
      },
      {
        matchId: "hist-3",
        gameId: "77124",
        matchTitle: "Juventus vs Napoli",
        marketName: "O/U",
        selectionName: "Over 2.5",
        odd: 2.1,
        isLive: false
      }
    ],
    stake: 15,
    totalOdds: 2.62,
    potentialWin: 39.3,
    status: "lost",
    cashoutAvailable: false
  }
];
var INITIAL_USER = {
  username: "",
  // "No username set"
  balance: 0,
  // matches GHS 0.00 in screenshots 1, 2, 14
  currency: "GHS",
  loyaltyTier: "Tier 1",
  loyaltyProgress: 68,
  nextUpdate: "01 Oct",
  dailyStreak: 5,
  unreadNotifications: 1,
  phone: "20******5",
  firstName: "CHARLES",
  lastName: "ASUMAH",
  dateOfBirth: "15/05/1998",
  location: "Ghana",
  email: "",
  isEmailVerified: false,
  avatarUrl: "/user_beach_avatar.jpg",
  isLoggedIn: true
};

// src/server/db.ts
var Database = class {
  constructor() {
    this.matches = [];
    this.users = /* @__PURE__ */ new Map();
    this.userSessions = /* @__PURE__ */ new Map();
    // token -> phone
    this.openBets = /* @__PURE__ */ new Map();
    // phone -> bets
    this.betHistory = /* @__PURE__ */ new Map();
    // phone -> bets
    this.transactions = /* @__PURE__ */ new Map();
    // phone -> transactions
    this.bookingCodes = /* @__PURE__ */ new Map();
    this.init();
  }
  init() {
    this.matches = JSON.parse(JSON.stringify(INITIAL_MATCHES));
    const defaultUser = JSON.parse(JSON.stringify(INITIAL_USER));
    const phone = defaultUser.phone || "20******5";
    this.users.set(phone, defaultUser);
    this.userSessions.set("mock-session-token-sportybet", phone);
    this.openBets.set(phone, JSON.parse(JSON.stringify(INITIAL_OPEN_BETS)));
    this.betHistory.set(phone, JSON.parse(JSON.stringify(INITIAL_BET_HISTORY)));
    this.transactions.set(phone, [
      {
        id: "tx-001",
        type: "deposit",
        amount: 50,
        currency: "GHS",
        provider: "MTN Mobile Money",
        accountNumber: "024****892",
        reference: "GH2609228912",
        status: "completed",
        date: new Date(Date.now() - 36e5 * 24).toISOString(),
        description: "MoMo Deposit via *711*222#"
      },
      {
        id: "tx-002",
        type: "bet_placed",
        amount: 10,
        currency: "GHS",
        reference: "TKT-GH-99120",
        status: "completed",
        date: new Date(Date.now() - 36e5 * 5).toISOString(),
        description: "Single Bet - Bayern Munich W"
      }
    ]);
    this.bookingCodes.set("BC72A9", {
      code: "BC72A9",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: new Date(Date.now() + 864e5 * 3).toISOString(),
      selections: INITIAL_OPEN_BETS[0]?.selections || [],
      totalOdds: INITIAL_OPEN_BETS[0]?.totalOdds || 2.15
    });
  }
  getUserByToken(token) {
    if (!token) return this.users.get("20******5") || null;
    const cleanToken = token.replace("Bearer ", "").trim();
    const phone = this.userSessions.get(cleanToken) || "20******5";
    return this.users.get(phone) || null;
  }
};
var db = new Database();

// src/server/routes/authRoutes.ts
var authRouter = (0, import_express.Router)();
authRouter.post("/login", (req, res) => {
  const { phone, password } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number is required" });
  }
  let user = db.users.get(phone);
  if (!user) {
    user = {
      username: `user_${phone.slice(-4)}`,
      balance: 100,
      currency: "GHS",
      loyaltyTier: "Tier 1",
      loyaltyProgress: 96,
      nextUpdate: "01 Oct",
      dailyStreak: 5,
      unreadNotifications: 1,
      phone,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      location: "Accra, Ghana",
      email: "",
      isEmailVerified: false,
      avatarUrl: "/user_beach_avatar.jpg",
      isLoggedIn: true
    };
    db.users.set(phone, user);
  } else {
    user.isLoggedIn = true;
  }
  const token = `sporty-session-${Buffer.from(phone + Date.now()).toString("base64")}`;
  db.userSessions.set(token, phone);
  return res.json({
    success: true,
    token,
    user
  });
});
authRouter.post("/register", (req, res) => {
  const { phone, password } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number is required" });
  }
  const newUser = {
    username: `user_${phone.slice(-4)}`,
    balance: 50,
    // Welcome signup bonus GHS 50.00
    currency: "GHS",
    loyaltyTier: "Tier 1",
    loyaltyProgress: 10,
    nextUpdate: "01 Oct",
    dailyStreak: 1,
    unreadNotifications: 1,
    phone,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    location: "Accra, Ghana",
    email: "",
    isEmailVerified: false,
    avatarUrl: "/user_beach_avatar.jpg",
    isLoggedIn: true
  };
  db.users.set(phone, newUser);
  const token = `sporty-session-${Buffer.from(phone + Date.now()).toString("base64")}`;
  db.userSessions.set(token, phone);
  return res.json({
    success: true,
    token,
    message: "Registration successful! Welcome bonus of GHS 50.00 credited.",
    user: newUser
  });
});
authRouter.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const user = db.getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  return res.json({
    success: true,
    user
  });
});
authRouter.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").trim();
    const phone = db.userSessions.get(token);
    if (phone) {
      const user = db.users.get(phone);
      if (user) user.isLoggedIn = false;
      db.userSessions.delete(token);
    }
  }
  return res.json({ success: true, message: "Logged out successfully" });
});
authRouter.put("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  const user = db.getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  const { firstName, lastName, email, dateOfBirth, username } = req.body;
  if (firstName !== void 0) user.firstName = firstName;
  if (lastName !== void 0) user.lastName = lastName;
  if (email !== void 0) user.email = email;
  if (dateOfBirth !== void 0) user.dateOfBirth = dateOfBirth;
  if (username !== void 0) user.username = username;
  return res.json({
    success: true,
    message: "Profile updated successfully",
    user
  });
});
authRouter.post("/daily-streak", (req, res) => {
  const authHeader = req.headers.authorization;
  const user = db.getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  user.dailyStreak = (user.dailyStreak || 0) + 1;
  user.balance = parseFloat((user.balance + 1).toFixed(2));
  return res.json({
    success: true,
    message: `Daily streak claimed! Streak is now ${user.dailyStreak} days. +1.00 GHS bonus added!`,
    dailyStreak: user.dailyStreak,
    balance: user.balance
  });
});

// src/server/routes/walletRoutes.ts
var import_express2 = require("express");
var walletRouter = (0, import_express2.Router)();
walletRouter.get("/balance", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  return res.json({
    success: true,
    currency: user.currency || "GHS",
    balance: user.balance,
    bonusBalance: 0
  });
});
walletRouter.post("/deposit", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const { amount, provider, accountNumber } = req.body;
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 1) {
    return res.status(400).json({ success: false, error: "Minimum deposit amount is GHS 1.00" });
  }
  if (numAmount > 2e4) {
    return res.status(400).json({ success: false, error: "Maximum deposit amount is GHS 20,000.00" });
  }
  user.balance = parseFloat((user.balance + numAmount).toFixed(2));
  const ref = `DEP-${Date.now().toString().slice(-8)}`;
  const newTx = {
    id: `tx-${Date.now()}`,
    type: "deposit",
    amount: numAmount,
    currency: user.currency || "GHS",
    provider: provider || "MTN Mobile Money",
    accountNumber: accountNumber || user.phone,
    reference: ref,
    status: "completed",
    date: (/* @__PURE__ */ new Date()).toISOString(),
    description: `Deposit via ${provider || "Mobile Money"}`
  };
  const userPhone = user.phone || "20******5";
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);
  return res.json({
    success: true,
    message: `Successfully deposited ${user.currency} ${numAmount.toFixed(2)} via ${provider || "Mobile Money"}`,
    balance: user.balance,
    transaction: newTx
  });
});
walletRouter.post("/withdraw", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const { amount, provider, accountNumber } = req.body;
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 2) {
    return res.status(400).json({ success: false, error: "Minimum withdrawal amount is GHS 2.00" });
  }
  if (numAmount > user.balance) {
    return res.status(400).json({
      success: false,
      error: `Insufficient balance. Available: ${user.currency} ${user.balance.toFixed(2)}`
    });
  }
  user.balance = parseFloat((user.balance - numAmount).toFixed(2));
  const ref = `WTH-${Date.now().toString().slice(-8)}`;
  const newTx = {
    id: `tx-${Date.now()}`,
    type: "withdrawal",
    amount: numAmount,
    currency: user.currency || "GHS",
    provider: provider || "Mobile Money",
    accountNumber: accountNumber || user.phone,
    reference: ref,
    status: "completed",
    date: (/* @__PURE__ */ new Date()).toISOString(),
    description: `Withdrawal to ${accountNumber || user.phone}`
  };
  const userPhone = user.phone || "20******5";
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);
  return res.json({
    success: true,
    message: `Withdrawal of ${user.currency} ${numAmount.toFixed(2)} processed successfully to ${accountNumber || user.phone}`,
    balance: user.balance,
    transaction: newTx
  });
});
walletRouter.get("/transactions", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const userPhone = user.phone || "20******5";
  const txs = db.transactions.get(userPhone) || [];
  return res.json({
    success: true,
    count: txs.length,
    transactions: txs
  });
});

// src/server/routes/betRoutes.ts
var import_express3 = require("express");
var betRouter = (0, import_express3.Router)();
function generateBookingCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
betRouter.post("/place", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized. Please login to place a bet." });
  }
  const { selections, stake, type } = req.body;
  const numStake = parseFloat(stake);
  if (!selections || !Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ success: false, error: "At least one selection is required" });
  }
  if (isNaN(numStake) || numStake < 1) {
    return res.status(400).json({ success: false, error: "Minimum stake is GHS 1.00" });
  }
  if (numStake > user.balance) {
    return res.status(400).json({
      success: false,
      error: `Insufficient balance. Available: ${user.currency} ${user.balance.toFixed(2)}`
    });
  }
  let totalOdds = 1;
  selections.forEach((s) => {
    totalOdds *= s.odd;
  });
  totalOdds = parseFloat(totalOdds.toFixed(2));
  let bonusMultiplier = 1;
  if (selections.length >= 3) {
    bonusMultiplier += (selections.length - 2) * 0.05;
  }
  const potentialWin = parseFloat((numStake * totalOdds * bonusMultiplier).toFixed(2));
  user.balance = parseFloat((user.balance - numStake).toFixed(2));
  const ticketId = `B-GH-${Math.floor(1e7 + Math.random() * 9e7)}`;
  const newBet = {
    id: `bet-${Date.now()}`,
    ticketId,
    type: selections.length > 1 ? "Multiple" : "Single",
    date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + (/* @__PURE__ */ new Date()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    isLive: selections.some((s) => s.isLive),
    selections,
    stake: numStake,
    totalOdds,
    potentialWin,
    status: "open",
    cashoutAvailable: true,
    cashoutAmount: parseFloat((numStake * 0.95).toFixed(2)),
    canRebet: true
  };
  const userPhone = user.phone || "20******5";
  const openBets = db.openBets.get(userPhone) || [];
  openBets.unshift(newBet);
  db.openBets.set(userPhone, openBets);
  const newTx = {
    id: `tx-${Date.now()}`,
    type: "bet_placed",
    amount: numStake,
    currency: user.currency || "GHS",
    reference: ticketId,
    status: "completed",
    date: (/* @__PURE__ */ new Date()).toISOString(),
    description: `${newBet.type} Bet (${selections.length} selections)`
  };
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);
  return res.json({
    success: true,
    message: "Bet placed successfully!",
    ticketId,
    bet: newBet,
    remainingBalance: user.balance
  });
});
betRouter.get("/open", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const userPhone = user.phone || "20******5";
  let bets = db.openBets.get(userPhone) || [];
  bets = bets.map((b) => {
    if (b.status === "open" && b.cashoutAvailable) {
      const fluctuation = Math.random() * 0.1 - 0.03;
      const currentCashout = b.cashoutAmount || b.stake * 0.9;
      const updated = Math.max(b.stake * 0.5, Math.min(b.potentialWin * 0.92, currentCashout * (1 + fluctuation)));
      return {
        ...b,
        cashoutAmount: parseFloat(updated.toFixed(2))
      };
    }
    return b;
  });
  db.openBets.set(userPhone, bets);
  return res.json({
    success: true,
    count: bets.length,
    bets
  });
});
betRouter.get("/history", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const userPhone = user.phone || "20******5";
  const history = db.betHistory.get(userPhone) || [];
  return res.json({
    success: true,
    count: history.length,
    bets: history
  });
});
betRouter.post("/cashout", (req, res) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const { betId } = req.body;
  if (!betId) {
    return res.status(400).json({ success: false, error: "betId is required" });
  }
  const userPhone = user.phone || "20******5";
  const openBets = db.openBets.get(userPhone) || [];
  const betIndex = openBets.findIndex((b) => b.id === betId || b.ticketId === betId);
  if (betIndex === -1) {
    return res.status(404).json({ success: false, error: "Open bet not found or already settled" });
  }
  const bet = openBets[betIndex];
  const cashoutVal = bet.cashoutAmount || bet.stake * 0.9;
  user.balance = parseFloat((user.balance + cashoutVal).toFixed(2));
  bet.status = "cashed_out";
  bet.cashoutAvailable = false;
  openBets.splice(betIndex, 1);
  db.openBets.set(userPhone, openBets);
  const history = db.betHistory.get(userPhone) || [];
  history.unshift(bet);
  db.betHistory.set(userPhone, history);
  const newTx = {
    id: `tx-${Date.now()}`,
    type: "cashout",
    amount: cashoutVal,
    currency: user.currency || "GHS",
    reference: bet.ticketId,
    status: "completed",
    date: (/* @__PURE__ */ new Date()).toISOString(),
    description: `Cashout for ticket ${bet.ticketId}`
  };
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);
  return res.json({
    success: true,
    message: `Successfully cashed out ${user.currency} ${cashoutVal.toFixed(2)}!`,
    cashoutAmount: cashoutVal,
    newBalance: user.balance,
    bet
  });
});
betRouter.post("/booking-code", (req, res) => {
  const { selections } = req.body;
  if (!selections || !Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ success: false, error: "Selections are required to generate booking code" });
  }
  let totalOdds = 1;
  selections.forEach((s) => {
    totalOdds *= s.odd;
  });
  const code = generateBookingCode();
  const record = {
    code,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    expiresAt: new Date(Date.now() + 864e5 * 3).toISOString(),
    // 3 days validity
    selections,
    totalOdds: parseFloat(totalOdds.toFixed(2))
  };
  db.bookingCodes.set(code, record);
  return res.json({
    success: true,
    bookingCode: code,
    totalOdds: record.totalOdds,
    selectionsCount: selections.length,
    expiresAt: record.expiresAt,
    shareUrl: `https://sportybet.com/gh/m/?code=${code}`
  });
});
betRouter.get("/booking-code/:code", (req, res) => {
  const code = req.params.code.toUpperCase().trim();
  const record = db.bookingCodes.get(code);
  if (!record) {
    return res.status(404).json({
      success: false,
      error: `Booking code "${code}" not found or expired.`
    });
  }
  return res.json({
    success: true,
    bookingCode: record.code,
    selections: record.selections,
    totalOdds: record.totalOdds,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt
  });
});

// src/server/routes/matchesRoutes.ts
var import_express4 = require("express");
var matchesRouter = (0, import_express4.Router)();
matchesRouter.get("/", (req, res) => {
  const { sport, live, league, search } = req.query;
  let result = [...db.matches];
  if (sport && typeof sport === "string") {
    result = result.filter((m) => m.sport.toLowerCase() === sport.toLowerCase());
  }
  if (live !== void 0) {
    const isLive = live === "true" || live === "1";
    result = result.filter((m) => m.isLive === isLive);
  }
  if (league && typeof league === "string") {
    result = result.filter((m) => m.league.toLowerCase().includes(league.toLowerCase()));
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    result = result.filter(
      (m) => m.homeTeam.toLowerCase().includes(q) || m.awayTeam.toLowerCase().includes(q) || m.league.toLowerCase().includes(q) || m.gameId.includes(q)
    );
  }
  return res.json({
    success: true,
    total: result.length,
    matches: result
  });
});
matchesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const match = db.matches.find((m) => m.id === id || m.gameId === id);
  if (!match) {
    return res.status(404).json({ success: false, error: "Match not found" });
  }
  const extendedMarkets = {
    ...match.markets,
    "Both Teams To Score (GG/NG)": [
      { id: `${match.id}-btts-yes`, name: "Yes (GG)", value: 1.74, trend: "same" },
      { id: `${match.id}-btts-no`, name: "No (NG)", value: 2.05, trend: "same" }
    ],
    "Draw No Bet (DNB)": [
      { id: `${match.id}-dnb-1`, name: "1 (DNB)", value: 1.45, trend: "same" },
      { id: `${match.id}-dnb-2`, name: "2 (DNB)", value: 2.65, trend: "same" }
    ],
    "Exact Goals": [
      { id: `${match.id}-eg-0-1`, name: "0 - 1 Goal", value: 3.2, trend: "same" },
      { id: `${match.id}-eg-2-3`, name: "2 - 3 Goals", value: 1.95, trend: "same" },
      { id: `${match.id}-eg-4+`, name: "4+ Goals", value: 3.8, trend: "same" }
    ]
  };
  return res.json({
    success: true,
    match: {
      ...match,
      markets: extendedMarkets
    }
  });
});
matchesRouter.post("/simulate-live", (req, res) => {
  db.matches.forEach((m) => {
    if (m.isLive) {
      const matchMinute = parseInt(m.minute || "45");
      if (!isNaN(matchMinute) && matchMinute < 90) {
        m.minute = `${matchMinute + 1}'`;
      }
      if (m.markets && m.markets["1X2"]) {
        m.markets["1X2"].forEach((odd) => {
          const delta = (Math.random() - 0.5) * 0.04;
          const oldVal = odd.value;
          odd.value = parseFloat(Math.max(1.01, oldVal + delta).toFixed(2));
          odd.trend = odd.value > oldVal ? "up" : odd.value < oldVal ? "down" : "same";
        });
      }
    }
  });
  return res.json({
    success: true,
    message: "Live match scores and odds updated",
    liveMatchesCount: db.matches.filter((m) => m.isLive).length
  });
});

// src/server/footballApi.ts
var import_express5 = require("express");
var footballRouter = (0, import_express5.Router)();
var liveCache = { timestamp: 0, data: [] };
var CACHE_TTL_MS = 45e3;
var DEFAULT_KEY = "4995ee7869ce07d01b61d0a7d0b24307";
function getApiKey() {
  return process.env.API_FOOTBALL_KEY || process.env.RAPIDAPI_KEY || DEFAULT_KEY;
}
async function fetchFromApiFootball(endpoint) {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const isRapidApi = apiKey.length > 40 && !apiKey.startsWith("v3.");
  const url = isRapidApi ? `https://api-football-v1.p.rapidapi.com/v3/${endpoint}` : `https://v3.football.api-sports.io/${endpoint}`;
  const headers = isRapidApi ? {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
  } : {
    "x-apisports-key": apiKey
  };
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`API-Football error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}
footballRouter.get("/status", async (req, res) => {
  const apiKey = getApiKey();
  try {
    const statusData = await fetchFromApiFootball("status");
    const requests = statusData?.response?.requests || { current: 0, limit_day: 100 };
    const account = statusData?.response?.account || {};
    res.json({
      configured: true,
      provider: "API-Football (api-sports.io)",
      mode: "live_real_data",
      accountName: account.firstname ? `${account.firstname} ${account.lastname || ""}`.trim() : "Active",
      requestsUsed: requests.current,
      dailyLimit: requests.limit_day,
      message: `Connected to API-Football (${requests.current}/${requests.limit_day} requests used today)`
    });
  } catch {
    res.json({
      configured: Boolean(apiKey),
      provider: "API-Football (api-sports.io)",
      mode: apiKey ? "live_real_data" : "demo_simulation",
      message: "Active"
    });
  }
});
footballRouter.get("/live", async (req, res) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.json({
      success: true,
      source: "demo_simulation",
      configured: false,
      data: null
    });
  }
  const now = Date.now();
  if (liveCache.data.length > 0 && now - liveCache.timestamp < CACHE_TTL_MS) {
    return res.json({
      success: true,
      source: "api_football_cache",
      configured: true,
      data: liveCache.data
    });
  }
  try {
    const fixturesData = await fetchFromApiFootball("fixtures?live=all");
    if (!fixturesData || !fixturesData.response || fixturesData.response.length === 0) {
      return res.json({ success: true, source: "api_football", data: [] });
    }
    let liveOddsMap = {};
    try {
      const oddsData = await fetchFromApiFootball("odds/live");
      if (oddsData && oddsData.response) {
        for (const item of oddsData.response) {
          liveOddsMap[item.fixture.id] = item.odds;
        }
      }
    } catch {
    }
    const transformed = fixturesData.response.slice(0, 30).map((item) => {
      const fixture = item.fixture;
      const league = item.league;
      const teams = item.teams;
      const goals = item.goals;
      const fixtureOdds = liveOddsMap[fixture.id] || [];
      const ftMarket = fixtureOdds.find(
        (m) => m.name === "Fulltime Result" || m.name === "Match Winner" || m.name === "1X2"
      );
      let homeOdd = 0;
      let drawOdd = 0;
      let awayOdd = 0;
      if (ftMarket && ftMarket.values && ftMarket.values.length >= 3) {
        const h = ftMarket.values.find((v) => v.value === "Home" || v.value === "1");
        const d = ftMarket.values.find((v) => v.value === "Draw" || v.value === "X");
        const a = ftMarket.values.find((v) => v.value === "Away" || v.value === "2");
        if (h && d && a) {
          homeOdd = parseFloat(parseFloat(h.odd).toFixed(2));
          drawOdd = parseFloat(parseFloat(d.odd).toFixed(2));
          awayOdd = parseFloat(parseFloat(a.odd).toFixed(2));
        }
      }
      const elapsed = fixture.status.elapsed || 1;
      const homeScore = goals.home ?? 0;
      const awayScore = goals.away ?? 0;
      const diff = homeScore - awayScore;
      if (!homeOdd || !drawOdd || !awayOdd) {
        if (diff > 0) {
          homeOdd = Math.max(1.05, parseFloat((1.3 - elapsed / 200 * 0.25).toFixed(2)));
          drawOdd = parseFloat((4 + diff * 1.5).toFixed(2));
          awayOdd = parseFloat((7 + diff * 3).toFixed(2));
        } else if (diff < 0) {
          awayOdd = Math.max(1.05, parseFloat((1.3 - elapsed / 200 * 0.25).toFixed(2)));
          drawOdd = parseFloat((4 + Math.abs(diff) * 1.5).toFixed(2));
          homeOdd = parseFloat((7 + Math.abs(diff) * 3).toFixed(2));
        } else {
          homeOdd = parseFloat((2.3 + Math.random() * 0.3).toFixed(2));
          drawOdd = parseFloat((2.8 + Math.random() * 0.4).toFixed(2));
          awayOdd = parseFloat((2.9 + Math.random() * 0.5).toFixed(2));
        }
      }
      const totalGoals = homeScore + awayScore;
      const ouLine = totalGoals + 0.5;
      return {
        id: `live-api-${fixture.id}`,
        gameId: String(fixture.id).slice(-5),
        sport: "football",
        league: league.name,
        countryOrCategory: league.country,
        homeTeam: teams.home.name,
        awayTeam: teams.away.name,
        homeScore,
        awayScore,
        period: fixture.status.short || "1H",
        minute: `${elapsed}' ${fixture.status.short || ""}`,
        isLive: true,
        startTime: "Live",
        isHot: diff === 0 || elapsed > 75,
        hasLiveStream: Boolean(fixture.id % 2 === 0),
        marketsCount: 65 + fixture.id % 90,
        markets: {
          "1X2": [
            { id: `o-${fixture.id}-1`, name: "1", value: homeOdd, trend: "same" },
            { id: `o-${fixture.id}-X`, name: "X", value: drawOdd, trend: "same" },
            { id: `o-${fixture.id}-2`, name: "2", value: awayOdd, trend: "same" }
          ],
          "O/U": [
            { id: `o-${fixture.id}-over`, name: `Over ${ouLine}`, value: 1.82, trend: "same" },
            { id: `o-${fixture.id}-under`, name: `Under ${ouLine}`, value: 1.98, trend: "same" }
          ],
          "DC": [
            { id: `o-${fixture.id}-1x`, name: "1X", value: parseFloat((homeOdd / 1.7).toFixed(2)) || 1.18, trend: "same" },
            { id: `o-${fixture.id}-12`, name: "12", value: 1.28, trend: "same" },
            { id: `o-${fixture.id}-x2`, name: "X2", value: parseFloat((awayOdd / 1.7).toFixed(2)) || 1.55, trend: "same" }
          ]
        }
      };
    });
    liveCache = { timestamp: now, data: transformed };
    return res.json({
      success: true,
      source: "api_football",
      configured: true,
      count: transformed.length,
      data: transformed
    });
  } catch (err) {
    console.error("Error fetching API-Football live:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// src/server/app.ts
var app = (0, import_express6.default)();
app.use(import_express6.default.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.get("/api", (req, res) => {
  res.json({
    status: "online",
    platform: "SportyBet Ghana Full-Stack Serverless API",
    version: "1.0.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    endpoints: {
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET /api/auth/me",
        "POST /api/auth/logout",
        "PUT /api/auth/profile",
        "POST /api/auth/daily-streak"
      ],
      wallet: [
        "GET /api/wallet/balance",
        "POST /api/wallet/deposit",
        "POST /api/wallet/withdraw",
        "GET /api/wallet/transactions"
      ],
      bets: [
        "POST /api/bets/place",
        "GET /api/bets/open",
        "GET /api/bets/history",
        "POST /api/bets/cashout",
        "POST /api/bets/booking-code",
        "GET /api/bets/booking-code/:code"
      ],
      matches: [
        "GET /api/matches",
        "GET /api/matches/:id",
        "POST /api/matches/simulate-live"
      ],
      football_live_feed: [
        "GET /api/football/status",
        "GET /api/football/live"
      ]
    }
  });
});
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);
app.use("/api/wallet", walletRouter);
app.use("/wallet", walletRouter);
app.use("/api/bets", betRouter);
app.use("/bets", betRouter);
app.use("/api/matches", matchesRouter);
app.use("/matches", matchesRouter);
app.use("/api/football", footballRouter);
app.use("/football", footballRouter);

// server.ts
import_dotenv.default.config();
var PORT = 3e3;
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express7.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SportyBet Ghana Full-Stack Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
