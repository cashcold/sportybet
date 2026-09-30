import { Match, OddItem } from '../types';

export interface MarketItem {
  id: string;
  name: string;
  category: 'Main' | 'Goals' | 'Half' | 'Combos' | 'Minutes' | 'Players';
  type: '3col' | '2col' | 'lines' | 'handicap' | 'grid' | 'multigoals' | 'asian_handicap';
  subCategory?: string;
  odds?: { name: string; value: number }[];
  lines?: { line: string; over: number; under?: number }[];
  handicaps?: { line: string; home: number; draw?: number; away: number }[];
  asianHandicaps?: { hLine: string; hOdd: number; aLine: string; aOdd: number }[];
  gridHeader?: string[];
  gridRows?: { label: string; values: { name: string; value: number }[] }[];
}

export function generateAllMatchMarkets(match: Match): MarketItem[] {
  const home = match.homeTeam || 'Home';
  const away = match.awayTeam || 'Away';

  return [
    // ==========================================
    // 1. MAIN MARKETS
    // ==========================================
    {
      id: '1x2',
      name: '1X2',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.43 },
        { name: 'Draw', value: 4.88 },
        { name: 'Away', value: 7.36 }
      ]
    },
    {
      id: '1x2-1up',
      name: '1X2 - 1UP',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.23 },
        { name: 'Draw', value: 4.88 },
        { name: 'Away', value: 3.05 }
      ]
    },
    {
      id: '1x2-2up',
      name: '1X2 - 2UP',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.40 },
        { name: 'Draw', value: 4.88 },
        { name: 'Away', value: 6.49 }
      ]
    },
    {
      id: '1x2-never-down',
      name: '1X2 - Never Down',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.61 },
        { name: 'Draw', value: 4.88 },
        { name: 'Away', value: 8.31 }
      ]
    },
    {
      id: 'double-chance',
      name: 'Double Chance',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home or Draw', value: 1.11 },
        { name: 'Home or Away', value: 1.18 },
        { name: 'Draw or Away', value: 2.60 }
      ]
    },
    {
      id: 'double-chance-1up',
      name: 'Double Chance - 1UP',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home or Draw', value: 1.08 },
        { name: 'Home or Away', value: 1.14 },
        { name: 'Draw or Away', value: 2.06 }
      ]
    },
    {
      id: 'draw-no-bet',
      name: 'Draw No Bet',
      category: 'Main',
      type: '2col',
      odds: [
        { name: 'Home', value: 1.15 },
        { name: 'Away', value: 5.30 }
      ]
    },
    {
      id: '1st-goal',
      name: '1st Goal',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.34 },
        { name: 'None', value: 13.50 },
        { name: 'Away', value: 3.20 }
      ]
    },
    {
      id: 'last-goal',
      name: 'Last Goal',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.39 },
        { name: 'None', value: 15.00 },
        { name: 'Away', value: 3.50 }
      ]
    },
    {
      id: 'home-no-bet',
      name: 'Home No Bet',
      category: 'Main',
      type: '2col',
      odds: [
        { name: 'Draw', value: 1.54 },
        { name: 'Away', value: 2.25 }
      ]
    },
    {
      id: 'away-no-bet',
      name: 'Away No Bet',
      category: 'Main',
      type: '2col',
      odds: [
        { name: 'Home', value: 1.22 },
        { name: 'Draw', value: 3.70 }
      ]
    },
    {
      id: 'handicap',
      name: 'Handicap',
      category: 'Main',
      type: 'handicap',
      handicaps: [
        { line: '0:1', home: 2.15, draw: 3.75, away: 2.90 },
        { line: '0:2', home: 3.90, draw: 4.40, away: 1.68 },
        { line: '0:3', home: 8.20, draw: 6.50, away: 1.24 },
        { line: '0:4', home: 17.50, draw: 10.50, away: 1.08 },
        { line: '0:5', home: 32.00, draw: 15.50, away: 1.02 },
        { line: '1:0', home: 1.10, draw: 8.20, away: 19.50 },
        { line: '2:0', home: 1.01, draw: 13.50, away: 47.00 }
      ]
    },
    {
      id: 'asian-handicap',
      name: 'Asian Handicap',
      category: 'Main',
      type: 'asian_handicap',
      asianHandicaps: [
        { hLine: '-2.5', hOdd: 3.75, aLine: '+2.5', aOdd: 1.25 },
        { hLine: '-1.5', hOdd: 2.10, aLine: '+1.5', aOdd: 1.67 },
        { hLine: '-0.5', hOdd: 1.40, aLine: '+0.5', aOdd: 2.80 },
        { hLine: '+0.5', hOdd: 1.11, aLine: '-0.5', aOdd: 6.10 }
      ]
    },
    {
      id: '1st-half-result-or-match-result',
      name: '1st Half Result or Match Result',
      category: 'Main',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.25 },
        { name: 'Draw', value: 1.86 },
        { name: 'Away', value: 3.80 }
      ]
    },

    // ==========================================
    // 2. GOALS MARKETS
    // ==========================================
    {
      id: 'over-under',
      name: 'Over/Under',
      category: 'Goals',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.02, under: 12.00 },
        { line: '1.0', over: 1.03, under: 11.00 },
        { line: '1.5', over: 1.21, under: 4.25 },
        { line: '2.0', over: 1.31, under: 3.33 },
        { line: '2.5', over: 1.68, under: 2.15 },
        { line: '3.0', over: 2.15, under: 1.69 },
        { line: '3.5', over: 2.70, under: 1.46 },
        { line: '4.0', over: 4.10, under: 1.23 },
        { line: '4.5', over: 4.75, under: 1.18 },
        { line: '5.0', over: 7.90, under: 1.07 },
        { line: '5.5', over: 8.40, under: 1.06 }
      ]
    },
    {
      id: 'over-under-early-goals',
      name: 'Over/Under - Early Goals',
      category: 'Goals',
      type: 'lines',
      lines: [
        { line: '1.5', over: 1.19 },
        { line: '2.5', over: 1.62 },
        { line: '3.5', over: 2.49 }
      ]
    },
    {
      id: 'home-over-under',
      name: `${home} Over/Under`,
      category: 'Goals',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.10, under: 6.20 },
        { line: '1.5', over: 1.52, under: 2.45 },
        { line: '2.5', over: 2.55, under: 1.48 },
        { line: '3.5', over: 4.90, under: 1.15 },
        { line: '4.5', over: 9.25, under: 1.04 }
      ]
    },
    {
      id: 'away-over-under',
      name: `${away} Over/Under`,
      category: 'Goals',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.73, under: 2.05 },
        { line: '1.5', over: 4.50, under: 1.18 },
        { line: '2.5', over: 11.00, under: 1.02 }
      ]
    },
    {
      id: 'gg-ng',
      name: 'GG/NG (Both Teams to Score)',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.98 },
        { name: 'No', value: 1.83 }
      ]
    },
    {
      id: 'gg-ng-2plus',
      name: 'GG/NG 2+',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 6.19 },
        { name: 'No', value: 1.09 }
      ]
    },
    {
      id: 'any-team-score-2-row',
      name: 'Any Team To Score 2 or More Goals in a Row',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.53 },
        { name: 'No', value: 2.53 }
      ]
    },
    {
      id: 'any-team-score-3-row',
      name: 'Any Team To Score 3 or More Goals in a Row',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.14 },
        { name: 'No', value: 1.37 }
      ]
    },
    {
      id: 'home-score-2-row',
      name: `${home} To Score 2 or More Goals in a Row`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.72 },
        { name: 'No', value: 2.14 }
      ]
    },
    {
      id: 'home-score-3-row',
      name: `${home} To Score 3 or More Goals in a Row`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.33 },
        { name: 'No', value: 1.33 }
      ]
    },
    {
      id: 'away-score-2-row',
      name: `${away} To Score 2 or More Goals in a Row`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 6.87 },
        { name: 'No', value: 1.11 }
      ]
    },
    {
      id: 'away-score-3-row',
      name: `${away} To Score 3 or More Goals in a Row`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 17.63 },
        { name: 'No', value: 1.01 }
      ]
    },
    {
      id: 'any-team-lead-1',
      name: 'Any Team to lead by 1 Goal at any time',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.03 },
        { name: 'No', value: 9.98 }
      ]
    },
    {
      id: 'any-team-lead-2',
      name: 'Any Team to lead by 2 Goals at any time',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.68 },
        { name: 'No', value: 2.10 }
      ]
    },
    {
      id: 'any-team-lead-3',
      name: 'Any Team to lead by 3 Goals at any time',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.28 },
        { name: 'No', value: 1.31 }
      ]
    },
    {
      id: 'home-lead-1',
      name: `${home} to lead by 1 Goal at any time`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.23 },
        { name: 'No', value: 3.86 }
      ]
    },
    {
      id: 'home-lead-2',
      name: `${home} to lead by 2 Goals at any time`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.89 },
        { name: 'No', value: 1.84 }
      ]
    },
    {
      id: 'home-lead-3',
      name: `${home} to lead by 3 Goals at any time`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.43 },
        { name: 'No', value: 1.29 }
      ]
    },
    {
      id: 'away-lead-1',
      name: `${away} to lead by 1 Goal at any time`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.06 },
        { name: 'No', value: 1.35 }
      ]
    },
    {
      id: 'away-lead-2',
      name: `${away} to lead by 2 Goals at any time`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 8.97 },
        { name: 'No', value: 1.04 }
      ]
    },
    {
      id: 'away-lead-3',
      name: `${away} to lead by 3 Goals at any time`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 13.83 },
        { name: 'No', value: 1.01 }
      ]
    },
    {
      id: 'excluded-goals-home',
      name: `Excluded Number of Goals - ${home}`,
      category: 'Goals',
      type: '3col',
      odds: [
        { name: '0', value: 1.10 },
        { name: '1', value: 1.27 },
        { name: '2', value: 1.30 },
        { name: '3+', value: 1.46 }
      ]
    },
    {
      id: 'excluded-goals-away',
      name: `Excluded Number of Goals - ${away}`,
      category: 'Goals',
      type: '3col',
      odds: [
        { name: '0', value: 1.71 },
        { name: '1', value: 1.47 },
        { name: '2', value: 1.12 },
        { name: '3+', value: 1.02 }
      ]
    },
    {
      id: 'home-goals',
      name: `${home} Team Goals`,
      category: 'Goals',
      type: '3col',
      odds: [
        { name: '0', value: 7.10 },
        { name: '1', value: 3.50 },
        { name: '2', value: 3.30 },
        { name: '3+', value: 2.50 }
      ]
    },
    {
      id: 'away-goals',
      name: `${away} Team Goals`,
      category: 'Goals',
      type: '3col',
      odds: [
        { name: '0', value: 1.98 },
        { name: '1', value: 2.50 },
        { name: '2', value: 6.00 },
        { name: '3+', value: 18.00 }
      ]
    },
    {
      id: 'goal-range',
      name: 'Goal Range',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: '0-1', value: 4.00 },
        { name: '2-3', value: 2.00 },
        { name: '4-6', value: 2.90 },
        { name: '7+', value: 28.00 }
      ]
    },
    {
      id: 'teams-to-score',
      name: 'Teams to Score',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'None', value: 14.50 },
        { name: 'Only Home', value: 2.20 },
        { name: 'Only Away', value: 12.50 },
        { name: 'Both Teams', value: 1.88 }
      ]
    },
    {
      id: 'home-clean-sheet',
      name: `${home} Clean Sheet`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.05 },
        { name: 'No', value: 1.73 }
      ]
    },
    {
      id: 'away-clean-sheet',
      name: `${away} Clean Sheet`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 6.20 },
        { name: 'No', value: 1.10 }
      ]
    },
    {
      id: 'home-win-nil',
      name: `${home} to Win to Nil`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.35 },
        { name: 'No', value: 1.60 }
      ]
    },
    {
      id: 'away-win-nil',
      name: `${away} to Win to Nil`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 10.50 },
        { name: 'No', value: 1.05 }
      ]
    },
    {
      id: 'home-win-both-halves',
      name: `${home} to Win Both Halves`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.40 },
        { name: 'No', value: 1.32 }
      ]
    },
    {
      id: 'home-win-either-half',
      name: `${home} to Win Either Half`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.22 },
        { name: 'No', value: 3.60 }
      ]
    },
    {
      id: 'away-win-either-half',
      name: `${away} to Win Either Half`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.20 },
        { name: 'No', value: 1.27 }
      ]
    },
    {
      id: 'odd-even',
      name: 'Odd/Even',
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Odd', value: 1.92 },
        { name: 'Even', value: 1.89 }
      ]
    },
    {
      id: 'home-odd-even',
      name: `${home} Odd/Even`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Odd', value: 1.94 },
        { name: 'Even', value: 1.87 }
      ]
    },
    {
      id: 'away-odd-even',
      name: `${away} Odd/Even`,
      category: 'Goals',
      type: '2col',
      odds: [
        { name: 'Odd', value: 2.40 },
        { name: 'Even', value: 1.59 }
      ]
    },

    // ==========================================
    // 3. HALF MARKETS (1ST HALF & 2ND HALF)
    // ==========================================
    {
      id: '1st-half-1x2',
      name: '1st Half - 1X2',
      category: 'Half',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.89 },
        { name: 'Draw', value: 2.60 },
        { name: 'Away', value: 7.00 }
      ]
    },
    {
      id: '1st-half-over-under',
      name: '1st Half - Over/Under',
      category: 'Half',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.33, under: 3.50 },
        { line: '1.0', over: 1.65, under: 2.30 },
        { line: '1.5', over: 2.50, under: 1.56 },
        { line: '2.0', over: 4.75, under: 1.21 },
        { line: '2.5', over: 6.00, under: 1.15 },
        { line: '3.0', over: 14.00, under: 1.03 }
      ]
    },
    {
      id: '1st-half-double-chance',
      name: '1st Half - Double Chance',
      category: 'Half',
      type: '3col',
      odds: [
        { name: 'Home or Draw', value: 1.12 },
        { name: 'Home or Away', value: 1.47 },
        { name: 'Draw or Away', value: 1.84 }
      ]
    },
    {
      id: '1st-half-1st-goal',
      name: '1st Half - 1st Goal',
      category: 'Half',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.72 },
        { name: 'None', value: 3.33 },
        { name: 'Away', value: 4.50 }
      ]
    },
    {
      id: '1st-half-handicap',
      name: '1st Half - Handicap',
      category: 'Half',
      type: 'handicap',
      handicaps: [
        { line: '0:1', home: 4.60, draw: 3.00, away: 1.91 },
        { line: '0:2', home: 14.50, draw: 6.00, away: 1.20 },
        { line: '1:0', home: 1.11, draw: 7.00, away: 37.00 }
      ]
    },
    {
      id: '1st-half-asian-handicap',
      name: '1st Half - Asian Handicap',
      category: 'Half',
      type: 'asian_handicap',
      asianHandicaps: [
        { hLine: '-1.5', hOdd: 4.50, aLine: '+1.5', aOdd: 1.21 },
        { hLine: '-0.5', hOdd: 1.89, aLine: '+0.5', aOdd: 1.92 }
      ]
    },
    {
      id: '1st-half-home-over-under',
      name: `1st half - ${home} Over/Under`,
      category: 'Half',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.52, under: 2.40 },
        { line: '1.5', over: 3.50, under: 1.28 },
        { line: '2.5', over: 8.60, under: 1.05 }
      ]
    },
    {
      id: '1st-half-away-over-under',
      name: `1st half - ${away} Over/Under`,
      category: 'Half',
      type: 'lines',
      lines: [
        { line: '0.5', over: 3.00, under: 1.35 },
        { line: '1.5', over: 10.50, under: 1.02 }
      ]
    },
    {
      id: '1st-half-gg-ng',
      name: '1st Half - GG/NG',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 4.80 },
        { name: 'No', value: 1.19 }
      ]
    },
    {
      id: '1st-half-draw-no-bet',
      name: '1st Half - Draw No Bet',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Home', value: 1.22 },
        { name: 'Away', value: 4.30 }
      ]
    },
    {
      id: '1st-half-excluded-goals',
      name: 'Excluded Number of Goals - First Half',
      category: 'Half',
      type: '3col',
      odds: [
        { name: '0', value: 1.30 },
        { name: '1', value: 1.46 },
        { name: '2', value: 1.24 },
        { name: '3+', value: 1.12 }
      ]
    },
    {
      id: '1st-half-exact-goals',
      name: '1st Half - Exact Goals',
      category: 'Half',
      type: '2col',
      odds: [
        { name: '0', value: 3.50 },
        { name: '1', value: 2.65 },
        { name: '2', value: 4.00 },
        { name: '3+', value: 6.25 }
      ]
    },
    {
      id: '1st-half-home-clean-sheet',
      name: `1st Half - ${home} Clean Sheet`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.35 },
        { name: 'No', value: 3.00 }
      ]
    },
    {
      id: '1st-half-away-clean-sheet',
      name: `1st Half - ${away} Clean Sheet`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.40 },
        { name: 'No', value: 1.52 }
      ]
    },
    {
      id: '1st-half-1x2-gg-ng',
      name: '1st Half - 1X2 & GG/NG',
      category: 'Half',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: 'Home & Yes', value: 12.50 },
            { name: 'Draw & Yes', value: 8.40 },
            { name: 'Away & Yes', value: 44.00 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: 'Home & No', value: 2.05 },
            { name: 'Draw & No', value: 3.20 },
            { name: 'Away & No', value: 7.40 }
          ]
        }
      ]
    },
    {
      id: '1st-half-1x2-ou-15',
      name: '1st Half - 1X2 & Over/Under 1.5',
      category: 'Half',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Under 1.5',
          values: [
            { name: 'Home & Under 1.5', value: 3.33 },
            { name: 'Draw & Under 1.5', value: 3.25 },
            { name: 'Away & Under 1.5', value: 9.00 }
          ]
        },
        {
          label: 'Over 1.5',
          values: [
            { name: 'Home & Over 1.5', value: 3.60 },
            { name: 'Draw & Over 1.5', value: 8.60 },
            { name: 'Away & Over 1.5', value: 23.00 }
          ]
        }
      ]
    },
    {
      id: '1st-half-home-win-nil',
      name: `1st Half ${home} to Win to Nil`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.10 },
        { name: 'No', value: 1.75 }
      ]
    },
    {
      id: '1st-half-away-win-nil',
      name: `1st Half ${away} to Win to Nil`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 7.50 },
        { name: 'No', value: 1.09 }
      ]
    },
    {
      id: '1st-half-odd-even',
      name: '1st Half - Odd/Even',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Odd', value: 2.05 },
        { name: 'Even', value: 1.79 }
      ]
    },
    {
      id: 'half-time-home-odd-even',
      name: `Half-time ${home} Total Goals Odd or Even`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Even', value: 1.65 },
        { name: 'Odd', value: 2.25 }
      ]
    },
    {
      id: 'half-time-away-odd-even',
      name: `Half-time ${away} Total Goals Odd or Even`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Even', value: 1.26 },
        { name: 'Odd', value: 3.75 }
      ]
    },
    // 2ND HALF
    {
      id: '2nd-half-1x2',
      name: '2nd Half - 1X2',
      category: 'Half',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.77 },
        { name: 'Draw', value: 2.95 },
        { name: 'Away', value: 6.20 }
      ]
    },
    {
      id: '2nd-half-over-under',
      name: '2nd Half - Over/Under',
      category: 'Half',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.23, under: 4.50 },
        { line: '1.0', over: 1.39, under: 3.10 },
        { line: '1.5', over: 2.05, under: 1.83 },
        { line: '2.0', over: 3.25, under: 1.37 },
        { line: '2.5', over: 4.25, under: 1.24 },
        { line: '3.0', over: 9.00, under: 1.08 }
      ]
    },
    {
      id: '2nd-half-double-chance',
      name: '2nd Half - Double Chance',
      category: 'Half',
      type: '3col',
      odds: [
        { name: 'Home or Draw', value: 1.14 },
        { name: 'Home or Away', value: 1.38 },
        { name: 'Draw or Away', value: 1.96 }
      ]
    },
    {
      id: '2nd-half-1st-goal',
      name: '2nd Half - 1st Goal',
      category: 'Half',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.65 },
        { name: 'None', value: 4.50 },
        { name: 'Away', value: 4.10 }
      ]
    },
    {
      id: '2nd-half-handicap',
      name: '2nd Half - Handicap',
      category: 'Half',
      type: 'handicap',
      handicaps: [
        { line: '0:1', home: 3.75, draw: 3.20, away: 2.05 },
        { line: '0:2', home: 10.00, draw: 5.40, away: 1.27 },
        { line: '1:0', home: 1.13, draw: 6.75, away: 26.00 }
      ]
    },
    {
      id: '2nd-half-asian-handicap',
      name: '2nd Half - Asian Handicap',
      category: 'Half',
      type: 'asian_handicap',
      asianHandicaps: [
        { hLine: '-1.5', hOdd: 3.70, aLine: '+1.5', aOdd: 1.28 },
        { hLine: '-0.5', hOdd: 1.78, aLine: '+0.5', aOdd: 2.05 }
      ]
    },
    {
      id: '2nd-half-home-over-under',
      name: `2nd Half - ${home} Over/Under`,
      category: 'Half',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.40, under: 2.80 },
        { line: '1.5', over: 2.80, under: 1.40 },
        { line: '2.5', over: 6.60, under: 1.09 }
      ]
    },
    {
      id: '2nd-half-away-over-under',
      name: `2nd Half - ${away} Over/Under`,
      category: 'Half',
      type: 'lines',
      lines: [
        { line: '0.5', over: 2.55, under: 1.47 },
        { line: '1.5', over: 8.60, under: 1.05 }
      ]
    },
    {
      id: '2nd-half-gg-ng',
      name: '2nd Half - GG/NG',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 3.80 },
        { name: 'No', value: 1.27 }
      ]
    },
    {
      id: '2nd-half-draw-no-bet',
      name: '2nd Half - Draw No Bet',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Home', value: 1.24 },
        { name: 'Away', value: 4.20 }
      ]
    },
    {
      id: '2nd-half-exact-goals',
      name: '2nd Half - Exact Goals',
      category: 'Half',
      type: '3col',
      odds: [
        { name: '0', value: 4.50 },
        { name: '1', value: 2.85 },
        { name: '2+', value: 2.00 }
      ]
    },
    {
      id: '2nd-half-home-clean-sheet',
      name: `2nd Half - ${home} Clean Sheet`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.47 },
        { name: 'No', value: 2.55 }
      ]
    },
    {
      id: '2nd-half-away-clean-sheet',
      name: `2nd Half - ${away} Clean Sheet`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.80 },
        { name: 'No', value: 1.40 }
      ]
    },
    {
      id: '2nd-half-home-win-nil',
      name: `2nd Half ${home} to Win to Nil`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.05 },
        { name: 'No', value: 1.78 }
      ]
    },
    {
      id: '2nd-half-away-win-nil',
      name: `2nd Half ${away} to Win to Nil`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 7.50 },
        { name: 'No', value: 1.09 }
      ]
    },
    {
      id: '2nd-half-odd-even',
      name: '2nd Half - Odd/Even',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Odd', value: 1.99 },
        { name: 'Even', value: 1.83 }
      ]
    },
    {
      id: '2nd-half-home-odd-even',
      name: `2nd Half ${home} Total Goals Odd or Even`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Even', value: 1.78 },
        { name: 'Odd', value: 2.05 }
      ]
    },
    {
      id: '2nd-half-away-odd-even',
      name: `2nd Half ${away} Total Goals Odd or Even`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Even', value: 1.35 },
        { name: 'Odd', value: 3.20 }
      ]
    },
    {
      id: 'highest-scoring-half',
      name: 'Highest Scoring Half',
      category: 'Half',
      type: '3col',
      odds: [
        { name: '1st Half', value: 3.00 },
        { name: '2nd Half', value: 2.15 },
        { name: 'Equal', value: 3.70 }
      ]
    },
    {
      id: 'home-highest-scoring-half',
      name: `${home} Highest Scoring Half`,
      category: 'Half',
      type: '3col',
      odds: [
        { name: '1st Half', value: 3.00 },
        { name: '2nd Half', value: 2.40 },
        { name: 'Equal', value: 3.10 }
      ]
    },
    {
      id: 'away-highest-scoring-half',
      name: `${away} Highest Scoring Half`,
      category: 'Half',
      type: '3col',
      odds: [
        { name: '1st Half', value: 4.50 },
        { name: '2nd Half', value: 3.40 },
        { name: 'Equal', value: 1.80 }
      ]
    },
    {
      id: 'both-halves-over-15',
      name: 'Both Halves Over 1.5',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 4.80 },
        { name: 'No', value: 1.19 }
      ]
    },
    {
      id: 'both-halves-under-15',
      name: 'Both Halves Under 1.5',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.80 },
        { name: 'No', value: 1.44 }
      ]
    },
    {
      id: '1st-2nd-half-gg-ng',
      name: '1st/2nd Half GG/NG',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'No/No', value: 1.48 },
        { name: 'Yes/No', value: 6.00 },
        { name: 'No/Yes', value: 4.40 },
        { name: 'Yes/Yes', value: 19.50 }
      ]
    },
    {
      id: 'home-score-both-halves',
      name: `${home} to Score In Both Halves`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.15 },
        { name: 'No', value: 1.61 }
      ]
    },
    {
      id: 'away-score-both-halves',
      name: `${away} to Score In Both Halves`,
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 6.40 },
        { name: 'No', value: 1.07 }
      ]
    },
    {
      id: 'btts-both-halves',
      name: 'Both Teams to Score in Both Halves Yes/No',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 15.00 },
        { name: 'No', value: 1.02 }
      ]
    },
    {
      id: 'no-draw-btts',
      name: 'No Draw Both Teams To Score Yes/No',
      category: 'Half',
      type: '2col',
      odds: [
        { name: 'Yes', value: 2.75 },
        { name: 'No', value: 1.44 }
      ]
    },

    // ==========================================
    // 4. COMBOS MARKETS
    // ==========================================
    {
      id: '1x2-ou-15',
      name: '1X2 & Over/Under 1.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Under 1.5',
          values: [
            { name: 'Home & Under 1.5', value: 7.10 },
            { name: 'Draw & Under 1.5', value: 14.00 },
            { name: 'Away & Under 1.5', value: 18.50 }
          ]
        },
        {
          label: 'Over 1.5',
          values: [
            { name: 'Home & Over 1.5', value: 1.61 },
            { name: 'Draw & Over 1.5', value: 6.00 },
            { name: 'Away & Over 1.5', value: 9.60 }
          ]
        }
      ]
    },
    {
      id: '1x2-ou-25',
      name: '1X2 & Over/Under 2.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Under 2.5',
          values: [
            { name: 'Home & Under 2.5', value: 3.60 },
            { name: 'Draw & Under 2.5', value: 5.60 },
            { name: 'Away & Under 2.5', value: 14.00 }
          ]
        },
        {
          label: 'Over 2.5',
          values: [
            { name: 'Home & Over 2.5', value: 2.00 },
            { name: 'Draw & Over 2.5', value: 17.50 },
            { name: 'Away & Over 2.5', value: 12.50 }
          ]
        }
      ]
    },
    {
      id: '1x2-ou-35',
      name: '1X2 & Over/Under 3.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Under 3.5',
          values: [
            { name: 'Home & Under 3.5', value: 2.10 },
            { name: 'Draw & Under 3.5', value: 5.70 },
            { name: 'Away & Under 3.5', value: 8.30 }
          ]
        },
        {
          label: 'Over 3.5',
          values: [
            { name: 'Home & Over 3.5', value: 3.30 },
            { name: 'Draw & Over 3.5', value: 18.00 },
            { name: 'Away & Over 3.5', value: 31.00 }
          ]
        }
      ]
    },
    {
      id: '1x2-ou-45',
      name: '1X2 & Over/Under 4.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Under 4.5',
          values: [
            { name: 'Home & Under 4.5', value: 1.69 },
            { name: 'Draw & Under 4.5', value: 4.40 },
            { name: 'Away & Under 4.5', value: 7.40 }
          ]
        },
        {
          label: 'Over 4.5',
          values: [
            { name: 'Home & Over 4.5', value: 5.60 },
            { name: 'Draw & Over 4.5', value: 100.00 },
            { name: 'Away & Over 4.5', value: 48.00 }
          ]
        }
      ]
    },
    {
      id: '1x2-gg-ng',
      name: '1X2 & GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: 'Home & Yes', value: 3.10 },
            { name: 'Draw & Yes', value: 6.10 },
            { name: 'Away & Yes', value: 13.50 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: 'Home & No', value: 2.25 },
            { name: 'Draw & No', value: 14.50 },
            { name: 'Away & No', value: 12.50 }
          ]
        }
      ]
    },
    {
      id: 'ou-gg-ng',
      name: 'Over/Under & GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Over 2.5', 'Under 2.5'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: 'Over 2.5 & Yes', value: 2.25 },
            { name: 'Under 2.5 & Yes', value: 9.00 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: 'Over 2.5 & No', value: 5.00 },
            { name: 'Under 2.5 & No', value: 2.45 }
          ]
        }
      ]
    },
    {
      id: '1st-goal-1x2',
      name: '1st Goal & 1X2',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Home Goal',
          values: [
            { name: 'Home Goal & Home', value: 1.51 },
            { name: 'Home Goal & Draw', value: 11.50 },
            { name: 'Home Goal & Away', value: 38.00 }
          ]
        },
        {
          label: 'Away Goal',
          values: [
            { name: 'Away Goal & Home', value: 9.60 },
            { name: 'Away Goal & Draw', value: 11.50 },
            { name: 'Away Goal & Away', value: 7.40 }
          ]
        },
        {
          label: 'No Goal',
          values: [
            { name: 'No Goal (0:0)', value: 13.50 }
          ]
        }
      ]
    },
    {
      id: 'dc-ou-15',
      name: 'Double Chance & Over/Under 1.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Under 1.5',
          values: [
            { name: '1X & Under 1.5', value: 4.60 },
            { name: '12 & Under 1.5', value: 5.00 },
            { name: 'X2 & Under 1.5', value: 7.80 }
          ]
        },
        {
          label: 'Over 1.5',
          values: [
            { name: '1X & Over 1.5', value: 1.32 },
            { name: '12 & Over 1.5', value: 1.41 },
            { name: 'X2 & Over 1.5', value: 3.70 }
          ]
        }
      ]
    },
    {
      id: 'dc-ou-25',
      name: 'Double Chance & Over/Under 2.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Under 2.5',
          values: [
            { name: '1X & Under 2.5', value: 2.25 },
            { name: '12 & Under 2.5', value: 2.90 },
            { name: 'X2 & Under 2.5', value: 4.00 }
          ]
        },
        {
          label: 'Over 2.5',
          values: [
            { name: '1X & Over 2.5', value: 1.83 },
            { name: '12 & Over 2.5', value: 1.77 },
            { name: 'X2 & Over 2.5', value: 7.25 }
          ]
        }
      ]
    },
    {
      id: 'dc-ou-35',
      name: 'Double Chance & Over/Under 3.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Under 3.5',
          values: [
            { name: '1X & Under 3.5', value: 1.60 },
            { name: '12 & Under 3.5', value: 1.73 },
            { name: 'X2 & Under 3.5', value: 3.40 }
          ]
        },
        {
          label: 'Over 3.5',
          values: [
            { name: '1X & Over 3.5', value: 2.80 },
            { name: '12 & Over 3.5', value: 2.95 },
            { name: 'X2 & Over 3.5', value: 11.00 }
          ]
        }
      ]
    },
    {
      id: 'dc-ou-45',
      name: 'Double Chance & Over/Under 4.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Under 4.5',
          values: [
            { name: '1X & Under 4.5', value: 1.29 },
            { name: '12 & Under 4.5', value: 1.41 },
            { name: 'X2 & Under 4.5', value: 2.75 }
          ]
        },
        {
          label: 'Over 4.5',
          values: [
            { name: '1X & Over 4.5', value: 5.10 },
            { name: '12 & Over 4.5', value: 4.80 },
            { name: 'X2 & Over 4.5', value: 31.00 }
          ]
        }
      ]
    },
    {
      id: 'dc-gg-ng',
      name: 'Double Chance & GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: '1X & Yes', value: 2.10 },
            { name: '12 & Yes', value: 2.55 },
            { name: 'X2 & Yes', value: 4.25 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: '1X & No', value: 1.96 },
            { name: '12 & No', value: 1.93 },
            { name: 'X2 & No', value: 6.75 }
          ]
        }
      ]
    },
    {
      id: 'dc-1st-half-gg-ng',
      name: 'Double Chance & 1st Half GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: '1X & 1st Half Yes', value: 5.00 },
            { name: '12 & 1st Half Yes', value: 5.60 },
            { name: 'X2 & 1st Half Yes', value: 11.50 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: '1X & 1st Half No', value: 1.30 },
            { name: '12 & 1st Half No', value: 1.37 },
            { name: 'X2 & 1st Half No', value: 3.20 }
          ]
        }
      ]
    },
    {
      id: 'dc-2nd-half-gg-ng',
      name: 'Double Chance & 2nd Half GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: '1X & 2nd Half Yes', value: 4.00 },
            { name: '12 & 2nd Half Yes', value: 4.50 },
            { name: 'X2 & 2nd Half Yes', value: 9.10 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: '1X & 2nd Half No', value: 1.38 },
            { name: '12 & 2nd Half No', value: 1.46 },
            { name: 'X2 & 2nd Half No', value: 3.50 }
          ]
        }
      ]
    },
    {
      id: '1st-half-dc-gg-ng',
      name: '1st Half - Double Chance & GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: '1st Half 1X & Yes', value: 4.90 },
            { name: '1st Half 12 & Yes', value: 9.40 },
            { name: '1st Half X2 & Yes', value: 6.75 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: '1st Half 1X & No', value: 1.32 },
            { name: '1st Half 12 & No', value: 1.62 },
            { name: '1st Half X2 & No', value: 2.25 }
          ]
        }
      ]
    },
    {
      id: '2nd-half-1x2-ou-15',
      name: '2nd Half - 1X2 & Over/Under 1.5',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Under 1.5',
          values: [
            { name: '2nd Half Home & Under 1.5', value: 3.75 },
            { name: '2nd Half Draw & Under 1.5', value: 4.25 },
            { name: '2nd Half Away & Under 1.5', value: 9.10 }
          ]
        },
        {
          label: 'Over 1.5',
          values: [
            { name: '2nd Half Home & Over 1.5', value: 2.85 },
            { name: '2nd Half Draw & Over 1.5', value: 7.50 },
            { name: '2nd Half Away & Over 1.5', value: 15.50 }
          ]
        }
      ]
    },
    {
      id: '2nd-half-1x2-gg-ng',
      name: '2nd Half - 1X2 & GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home', 'Draw', 'Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: '2nd Half Home & Yes', value: 8.80 },
            { name: '2nd Half Draw & Yes', value: 7.40 },
            { name: '2nd Half Away & Yes', value: 29.00 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: '2nd Half Home & No', value: 2.00 },
            { name: '2nd Half Draw & No', value: 4.20 },
            { name: '2nd Half Away & No', value: 7.00 }
          ]
        }
      ]
    },
    {
      id: '2nd-half-dc-gg-ng',
      name: '2nd Half - Double Chance & GG/NG',
      category: 'Combos',
      type: 'grid',
      gridHeader: ['Home/Draw', 'Home/Away', 'Draw/Away'],
      gridRows: [
        {
          label: 'Yes',
          values: [
            { name: '2nd Half 1X & Yes', value: 4.00 },
            { name: '2nd Half 12 & Yes', value: 6.60 },
            { name: '2nd Half X2 & Yes', value: 5.75 }
          ]
        },
        {
          label: 'No',
          values: [
            { name: '2nd Half 1X & No', value: 1.42 },
            { name: '2nd Half 12 & No', value: 1.61 },
            { name: '2nd Half X2 & No', value: 2.65 }
          ]
        }
      ]
    },
    // Chance Mix
    {
      id: 'home-or-over-25',
      name: `${home} or Over 2.5`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.20 },
        { name: 'No', value: 3.90 }
      ]
    },
    {
      id: 'home-or-under-25',
      name: `${home} or Under 2.5`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.08 },
        { name: 'No', value: 6.10 }
      ]
    },
    {
      id: 'draw-or-over-25',
      name: 'Draw or Over 2.5',
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.34 },
        { name: 'No', value: 2.90 }
      ]
    },
    {
      id: 'draw-or-under-25',
      name: 'Draw or Under 2.5',
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.87 },
        { name: 'No', value: 1.80 }
      ]
    },
    {
      id: 'away-or-over-25',
      name: `${away} or Over 2.5`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.52 },
        { name: 'No', value: 2.30 }
      ]
    },
    {
      id: 'away-or-under-25',
      name: `${away} or Under 2.5`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.80 },
        { name: 'No', value: 1.87 }
      ]
    },
    {
      id: 'home-or-gg',
      name: `${home} or GG`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.09 },
        { name: 'No', value: 5.75 }
      ]
    },
    {
      id: 'draw-or-gg',
      name: 'Draw or GG',
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.72 },
        { name: 'No', value: 1.97 }
      ]
    },
    {
      id: 'away-or-gg',
      name: `${away} or GG`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.70 },
        { name: 'No', value: 2.00 }
      ]
    },
    {
      id: 'home-or-clean-sheet',
      name: `${home} or Any Clean Sheet`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.19 },
        { name: 'No', value: 4.00 }
      ]
    },
    {
      id: 'draw-or-clean-sheet',
      name: 'Draw or Any Clean Sheet',
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.43 },
        { name: 'No', value: 2.55 }
      ]
    },
    {
      id: 'away-or-clean-sheet',
      name: `${away} or Any Clean Sheet`,
      category: 'Combos',
      type: '2col',
      odds: [
        { name: 'Yes', value: 1.60 },
        { name: 'No', value: 2.15 }
      ]
    },

    // ==========================================
    // 5. MINUTES MARKETS (Time Intervals)
    // ==========================================
    {
      id: '1x2-1-10',
      name: '10 minutes - 1X2 from 1 to 10',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 5.25 },
        { name: 'Draw', value: 1.20 },
        { name: 'Away', value: 15.00 }
      ]
    },
    {
      id: '1x2-1-5',
      name: '1X2 from 1 to 5 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 7.75 },
        { name: 'Draw', value: 1.10 },
        { name: 'Away', value: 18.50 }
      ]
    },
    {
      id: '1x2-1-15',
      name: '1X2 from 1 to 15 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 3.75 },
        { name: 'Draw', value: 1.36 },
        { name: 'Away', value: 11.50 }
      ]
    },
    {
      id: '1x2-1-20',
      name: '1X2 from 1 to 20 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 3.10 },
        { name: 'Draw', value: 1.51 },
        { name: 'Away', value: 9.70 }
      ]
    },
    {
      id: '1x2-1-25',
      name: '1X2 from 1 to 25 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 2.65 },
        { name: 'Draw', value: 1.67 },
        { name: 'Away', value: 8.75 }
      ]
    },
    {
      id: '1x2-1-30',
      name: '1X2 from 1 to 30 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 2.40 },
        { name: 'Draw', value: 1.83 },
        { name: 'Away', value: 8.10 }
      ]
    },
    {
      id: '1x2-1-35',
      name: '1X2 from 1 to 35 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 2.20 },
        { name: 'Draw', value: 2.00 },
        { name: 'Away', value: 7.60 }
      ]
    },
    {
      id: '1x2-1-40',
      name: '1X2 from 1 to 40 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 2.00 },
        { name: 'Draw', value: 2.20 },
        { name: 'Away', value: 7.30 }
      ]
    },
    {
      id: '1x2-1-50',
      name: '1X2 from 1 to 50 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.76 },
        { name: 'Draw', value: 2.65 },
        { name: 'Away', value: 6.90 }
      ]
    },
    {
      id: '1x2-1-55',
      name: '1X2 from 1 to 55 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.68 },
        { name: 'Draw', value: 2.85 },
        { name: 'Away', value: 6.90 }
      ]
    },
    {
      id: '1x2-1-60',
      name: '1X2 from 1 to 60 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.61 },
        { name: 'Draw', value: 3.10 },
        { name: 'Away', value: 6.90 }
      ]
    },
    {
      id: '1x2-1-65',
      name: '1X2 from 1 to 65 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.56 },
        { name: 'Draw', value: 3.25 },
        { name: 'Away', value: 7.00 }
      ]
    },
    {
      id: '1x2-1-70',
      name: '1X2 from 1 to 70 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.51 },
        { name: 'Draw', value: 3.50 },
        { name: 'Away', value: 7.00 }
      ]
    },
    {
      id: '1x2-1-75',
      name: '1X2 from 1 to 75 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.47 },
        { name: 'Draw', value: 3.70 },
        { name: 'Away', value: 7.20 }
      ]
    },
    {
      id: '1x2-1-80',
      name: '1X2 from 1 to 80 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.44 },
        { name: 'Draw', value: 3.90 },
        { name: 'Away', value: 7.20 }
      ]
    },
    {
      id: '1x2-1-85',
      name: '1X2 from 1 to 85 minute',
      category: 'Minutes',
      type: '3col',
      odds: [
        { name: 'Home', value: 1.40 },
        { name: 'Draw', value: 4.20 },
        { name: 'Away', value: 7.25 }
      ]
    },
    // Goal intervals
    {
      id: 'ou-1-5',
      name: 'Total Goals Over/Under from 1 to 5 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 6.50, under: 1.11 },
        { line: '1.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-10',
      name: 'Total Goals Over/Under from 1 to 10 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 3.75, under: 1.26 },
        { line: '1.5', over: 17.00, under: 1.01 },
        { line: '2.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-15',
      name: 'Total Goals Over/Under from 1 to 15 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 2.90, under: 1.42 },
        { line: '1.5', over: 13.00, under: 1.03 },
        { line: '2.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-20',
      name: 'Total Goals Over/Under from 1 to 20 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 2.30, under: 1.62 },
        { line: '1.5', over: 8.50, under: 1.07 },
        { line: '2.5', over: 19.00 },
        { line: '3.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-25',
      name: 'Total Goals Over/Under from 1 to 25 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.97, under: 1.83 },
        { line: '1.5', over: 6.00, under: 1.13 },
        { line: '2.5', over: 17.00, under: 1.01 },
        { line: '3.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-30',
      name: 'Total Goals Over/Under from 1 to 30 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.76, under: 2.08 },
        { line: '1.5', over: 4.75, under: 1.19 },
        { line: '2.5', over: 15.00, under: 1.02 },
        { line: '3.5', over: 19.00 },
        { line: '4.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-35',
      name: 'Total Goals Over/Under from 1 to 35 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.60, under: 2.35 },
        { line: '1.5', over: 3.75, under: 1.26 },
        { line: '2.5', over: 11.00, under: 1.04 },
        { line: '3.5', over: 19.00 },
        { line: '4.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-40',
      name: 'Total Goals Over/Under from 1 to 40 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.48, under: 2.65 },
        { line: '1.5', over: 3.20, under: 1.35 },
        { line: '2.5', over: 8.50, under: 1.07 },
        { line: '3.5', over: 17.00, under: 1.01 },
        { line: '4.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-50',
      name: 'Total Goals Over/Under from 1 to 50 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.27, under: 3.70 },
        { line: '1.5', over: 2.20, under: 1.67 },
        { line: '2.5', over: 5.00, under: 1.18 },
        { line: '3.5', over: 13.00, under: 1.03 },
        { line: '4.5', over: 19.00 },
        { line: '5.5', over: 19.00 }
      ]
    },
    {
      id: 'ou-1-55',
      name: 'Total Goals Over/Under from 1 to 55 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.22, under: 4.35 },
        { line: '1.5', over: 1.97, under: 1.83 },
        { line: '2.5', over: 4.10, under: 1.24 },
        { line: '3.5', over: 10.00, under: 1.05 },
        { line: '4.5', over: 17.00, under: 1.01 }
      ]
    },
    {
      id: 'ou-1-60',
      name: 'Total Goals Over/Under from 1 to 60 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.18, under: 5.00 },
        { line: '1.5', over: 1.80, under: 2.00 },
        { line: '2.5', over: 3.45, under: 1.31 },
        { line: '3.5', over: 8.00, under: 1.08 },
        { line: '4.5', over: 17.00, under: 1.01 }
      ]
    },
    {
      id: 'ou-1-65',
      name: 'Total Goals Over/Under from 1 to 65 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.15, under: 5.50 },
        { line: '1.5', over: 1.67, under: 2.20 },
        { line: '2.5', over: 3.00, under: 1.39 },
        { line: '3.5', over: 6.50, under: 1.11 },
        { line: '4.5', over: 15.00, under: 1.02 }
      ]
    },
    {
      id: 'ou-1-70',
      name: 'Total Goals Over/Under from 1 to 70 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.12, under: 6.25 },
        { line: '1.5', over: 1.55, under: 2.45 },
        { line: '2.5', over: 2.65, under: 1.48 },
        { line: '3.5', over: 5.50, under: 1.15 },
        { line: '4.5', over: 13.00, under: 1.03 }
      ]
    },
    {
      id: 'ou-1-75',
      name: 'Total Goals Over/Under from 1 to 75 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.10, under: 7.00 },
        { line: '1.5', over: 1.47, under: 2.70 },
        { line: '2.5', over: 2.40, under: 1.57 },
        { line: '3.5', over: 4.75, under: 1.19 },
        { line: '4.5', over: 10.00, under: 1.05 }
      ]
    },
    {
      id: 'ou-1-80',
      name: 'Total Goals Over/Under from 1 to 80 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.08, under: 8.00 },
        { line: '1.5', over: 1.39, under: 3.00 },
        { line: '2.5', over: 2.15, under: 1.70 },
        { line: '3.5', over: 4.10, under: 1.24 },
        { line: '4.5', over: 8.50, under: 1.07 }
      ]
    },
    {
      id: 'ou-1-85',
      name: 'Total Goals Over/Under from 1 to 85 minute',
      category: 'Minutes',
      type: 'lines',
      lines: [
        { line: '0.5', over: 1.06, under: 9.00 },
        { line: '1.5', over: 1.33, under: 3.30 },
        { line: '2.5', over: 1.97, under: 1.83 },
        { line: '3.5', over: 3.50, under: 1.30 },
        { line: '4.5', over: 7.00, under: 1.10 }
      ]
    },

    // ==========================================
    // 6. PLAYERS & GOALSCORERS
    // ==========================================
    {
      id: '1st-goalscorer',
      name: '1st Goalscorer',
      category: 'Players',
      type: '3col',
      odds: [
        { name: `${home} Top Scorer`, value: 3.50 },
        { name: `${home} Attacking Mid`, value: 4.20 },
        { name: `${away} Forward`, value: 8.50 },
        { name: 'No Goalscorer', value: 13.50 }
      ]
    },
    {
      id: 'last-goalscorer',
      name: 'Last Goalscorer',
      category: 'Players',
      type: '3col',
      odds: [
        { name: `${home} Top Scorer`, value: 3.50 },
        { name: `${home} Attacking Mid`, value: 4.20 },
        { name: `${away} Forward`, value: 8.50 },
        { name: 'No Goalscorer', value: 13.50 }
      ]
    },
    {
      id: 'anytime-goalscorer',
      name: 'Anytime Goalscorer',
      category: 'Players',
      type: '3col',
      odds: [
        { name: `${home} Top Scorer`, value: 1.85 },
        { name: `${home} Attacking Mid`, value: 2.10 },
        { name: `${away} Forward`, value: 3.80 },
        { name: `${home} Defender`, value: 6.50 }
      ]
    }
  ];
}
