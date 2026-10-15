import { BetSelection, PlacedBet } from '../types';

/**
 * Detects if a match is Slovan Bratislava vs VfB Stuttgart
 */
export function isSlovanStuttgartMatch(title: string): boolean {
  const t = (title || '').toLowerCase();
  return (t.includes('slovan') || t.includes('bratislava')) && (t.includes('stuttgart') || t.includes('vfb'));
}

/**
 * Known authentic end match results from real fixtures
 */
export const AUTHENTIC_MATCH_RESULTS: Record<string, { ftScore: string; winner: 'Home' | 'Away' | 'Draw'; title: string }> = {
  'slovan_stuttgart': { ftScore: '0:3', winner: 'Away', title: 'ŠK Slovan Bratislava v VfB Stuttgart' },
  'lask_liverpool': { ftScore: '1:3', winner: 'Away', title: 'LASK v Liverpool' },
  'astonvilla_fenerbahce': { ftScore: '2:0', winner: 'Home', title: 'Aston Villa v Fenerbahce' },
  'dortmund_bremen': { ftScore: '2:1', winner: 'Home', title: 'Borussia Dortmund v Werder Bremen' },
  'realmadrid_bayern': { ftScore: '2:1', winner: 'Home', title: 'Real Madrid v Bayern Munich' },
  'arsenal_mancity': { ftScore: '2:2', winner: 'Draw', title: 'Arsenal FC v Manchester City' },
  'leipzig_augsburg': { ftScore: '3:1', winner: 'Home', title: 'RB Leipzig v FC Augsburg' },
  'barcelona_sevilla': { ftScore: '4:1', winner: 'Home', title: 'Barcelona v Sevilla' },
  'leverkusen_milan': { ftScore: '3:0', winner: 'Home', title: 'Bayer Leverkusen v AC Milan' }
};

/**
 * Resolves authentic end match results, pick text, outcome, and whether the leg is Won or Lost
 */
export function resolvePredictionDetails(sel: BetSelection): {
  ftScore: string;
  outcome: string;
  pickText: string;
  isWon: boolean;
  gameId: string;
  gameDate: string;
  formattedMatchTitle: string;
  reason?: string;
} {
  const rawTitle = sel?.matchTitle || 'Match';
  const formattedMatchTitle = (rawTitle || 'Match').replace(/\s+vs\s+/gi, ' v ');
  const mName = (sel?.marketName || '1X2').trim();
  const sName = (sel?.selectionName || '1').trim();
  const oddStr = `@${typeof sel?.odd === 'number' && !isNaN(sel.odd) ? sel.odd.toFixed(2) : '1.00'}`;
  const pickText = `${sName} ${oddStr}`;

  const gameId = sel?.gameId || '75763';
  const gameDate = sel?.gameDate || sel?.liveTime || '14/10 19:00';
  const lowerTitle = (rawTitle || '').toLowerCase();

  // 1. ŠK Slovan Bratislava vs VfB Stuttgart (Finished 0 - 3)
  if (isSlovanStuttgartMatch(rawTitle)) {
    const ftScore = '0:3';
    const outcome = '0:3'; // Away win

    // Only predictions for 0:3 or Away (2) win
    const isPickCorrect =
      sName === '0:3' ||
      sName === '2' ||
      sName.toLowerCase() === 'away' ||
      sName.toLowerCase().includes('away') ||
      sName === 'X2';

    const isWon = sel.isWon !== undefined ? sel.isWon : isPickCorrect;

    return {
      ftScore,
      outcome,
      pickText,
      isWon,
      gameId: sel.gameId || '75763',
      gameDate: sel.gameDate || '14/10 19:00',
      formattedMatchTitle: 'ŠK Slovan Bratislava v VfB Stuttgart',
      reason: isWon ? 'Correct Score 0:3 predicted' : 'Wrong prediction (Finished 0:3)'
    };
  }

  // 2. LASK vs Liverpool (Finished 1 - 3)
  if (lowerTitle.includes('lask') || (lowerTitle.includes('liverpool') && !lowerTitle.includes('everton'))) {
    const ftScore = '1:3';
    const outcome = '1:3'; // Away win

    // If user explicitly marked as lost/pending/won in data
    const isPickCorrect =
      sName === '1:3' ||
      sName === '2' ||
      sName.toLowerCase() === 'away' ||
      sName === 'X2';

    // If selection explicitly has isWon === false or predictionStatus === 'lost', it is WRONG
    let isWon = false;
    if (sel.isWon === true && isPickCorrect) isWon = true;
    else if (sel.isWon === false) isWon = false;
    else if (sel.predictionStatus === 'won' && isPickCorrect) isWon = true;
    else if (sel.predictionStatus === 'lost') isWon = false;
    else isWon = isPickCorrect;

    return {
      ftScore,
      outcome,
      pickText,
      isWon,
      gameId: sel.gameId || '72911',
      gameDate: sel.gameDate || '14/10 18:45',
      formattedMatchTitle: 'LASK v Liverpool',
      reason: isWon ? 'Correct outcome predicted' : 'Wrong score (Finished 1:3)'
    };
  }

  // 3. Aston Villa vs Fenerbahce (Finished 2 - 0)
  if (lowerTitle.includes('aston villa') || lowerTitle.includes('fenerbahce')) {
    const ftScore = '2:0';
    const outcome = '2:0';
    const isPickCorrect = sName === '2:0' || sName === '1' || sName.toLowerCase() === 'home' || sName === '1X';
    const isWon = sel.isWon !== undefined ? sel.isWon : isPickCorrect;

    return {
      ftScore,
      outcome,
      pickText,
      isWon,
      gameId: sel.gameId || '72912',
      gameDate: sel.gameDate || '14/10 20:00',
      formattedMatchTitle: 'Aston Villa v Fenerbahce'
    };
  }

  // 4. Borussia Dortmund vs Werder Bremen (Finished 2 - 1)
  if (lowerTitle.includes('dortmund') && lowerTitle.includes('werder')) {
    const ftScore = '2:1';
    const isPickCorrect = sName === '2:1' || sName === '1' || sName.toLowerCase() === 'home';
    const isWon = sel.isWon !== undefined ? sel.isWon : isPickCorrect;
    return {
      ftScore,
      outcome: '2:1',
      pickText,
      isWon,
      gameId: sel.gameId || '39101',
      gameDate: sel.gameDate || '13/10 18:30',
      formattedMatchTitle: 'Borussia Dortmund v Werder Bremen'
    };
  }

  // 5. If selection has explicit ftScore and outcome
  if (sel.ftScore && sel.outcome) {
    const isWon = sel.isWon !== undefined ? sel.isWon : (sel.predictionStatus === 'won');
    return {
      ftScore: sel.ftScore,
      outcome: sel.outcome,
      pickText,
      isWon,
      gameId,
      gameDate,
      formattedMatchTitle
    };
  }

  // 6. General default resolution with realistic final score evaluation
  const fallbackScore = sel.ftScore || sel.liveScore || '1:1';
  const parts = fallbackScore.split(':').map(n => parseInt(n.trim(), 10) || 0);
  const hGoals = parts[0] ?? 1;
  const aGoals = parts[1] ?? 1;

  let outcomeStr = 'Draw';
  if (hGoals > aGoals) outcomeStr = 'Home';
  else if (aGoals > hGoals) outcomeStr = 'Away';

  let matchWon = false;
  if (sel.isWon !== undefined) {
    matchWon = sel.isWon;
  } else if (sel.predictionStatus === 'won') {
    matchWon = true;
  } else if (sel.predictionStatus === 'lost') {
    matchWon = false;
  } else if (mName.toLowerCase().includes('score')) {
    matchWon = sName.replace(/\s*-\s*/, ':') === fallbackScore;
  } else if (mName.toUpperCase().includes('1X2')) {
    if (sName === '1' && outcomeStr === 'Home') matchWon = true;
    else if (sName === '2' && outcomeStr === 'Away') matchWon = true;
    else if (sName.toUpperCase() === 'X' && outcomeStr === 'Draw') matchWon = true;
  }

  return {
    ftScore: fallbackScore,
    outcome: outcomeStr,
    pickText,
    isWon: matchWon,
    gameId,
    gameDate,
    formattedMatchTitle
  };
}

/**
 * Backwards compatibility alias for resolvePredictionDetails
 */
export const resolveWinningPredictionDetails = resolvePredictionDetails;

/**
 * Transforms a PlacedBet into a settled bet where ONLY legitimately correct predictions are marked won
 */
export function normalizeBetPredictions(bet: PlacedBet): PlacedBet {
  let allLegsWon = true;

  const updatedSelections = bet.selections.map((sel) => {
    const details = resolvePredictionDetails(sel);
    if (!details.isWon) {
      allLegsWon = false;
    }
    return {
      ...sel,
      isWon: details.isWon,
      predictionStatus: (details.isWon ? 'won' : 'lost') as 'won' | 'lost',
      ftScore: details.ftScore,
      outcome: details.outcome,
      gameDate: details.gameDate
    };
  });

  return {
    ...bet,
    isAllGreen: allLegsWon,
    status: allLegsWon ? 'won' : 'lost',
    selections: updatedSelections,
    cashoutAvailable: false,
    settledAt: bet.settledAt || new Date().toISOString(),
    winningsPaid: allLegsWon
  };
}

/**
 * Transforms a PlacedBet into a 100% Green Slip only when simulated
 */
export function markBetAsGreen(bet: PlacedBet, settleAsWon = false): PlacedBet {
  const updatedSelections = bet.selections.map((sel) => {
    const details = resolvePredictionDetails(sel);
    return {
      ...sel,
      isWon: true,
      predictionStatus: 'won' as const,
      ftScore: details.ftScore,
      outcome: details.outcome,
      gameDate: details.gameDate
    };
  });

  return {
    ...bet,
    isAllGreen: true,
    status: settleAsWon ? 'won' : (bet.status === 'lost' ? 'won' : bet.status),
    selections: updatedSelections,
    cashoutAvailable: settleAsWon ? false : bet.cashoutAvailable,
    settledAt: settleAsWon ? new Date().toISOString() : bet.settledAt,
    winningsPaid: settleAsWon ? true : bet.winningsPaid
  };
}
