import { BetSelection, PlacedBet } from '../types';

/**
 * Resolves exact winning score, outcome, and pick text based on the user's prediction
 * Matching the exact SportyBet layout shown in Screenshot_20260927_102225_Chrome.jpg
 */
export function resolveWinningPredictionDetails(sel: BetSelection): {
  ftScore: string;
  outcome: string;
  pickText: string;
  isWon: boolean;
  gameId: string;
  gameDate: string;
  formattedMatchTitle: string;
} {
  const title = sel.matchTitle || 'Match';
  // Use "v" between teams as shown in SportyBet screenshot (e.g. Albania v Belarus)
  const formattedMatchTitle = title.replace(/\s+vs\s+/gi, ' v ');
  const mName = (sel.marketName || '1X2').trim();
  const sName = (sel.selectionName || '1').trim();
  const oddStr = `@${sel.odd.toFixed(2)}`;

  // Default game ID and date
  const gameId = sel.gameId || '23888';
  const gameDate = sel.gameDate || sel.liveTime || '04/10 18:30';
  const lowerTitle = title.toLowerCase();

  // If selection explicitly defines settled result (e.g. from real Bet History)
  if (sel.ftScore && sel.outcome) {
    return {
      ftScore: sel.ftScore,
      outcome: sel.outcome,
      pickText: `${sName} ${oddStr}`,
      isWon: sel.isWon ?? true,
      gameId,
      gameDate,
      formattedMatchTitle
    };
  }

  // Canonical Aviator game resolution
  if (lowerTitle.includes('aviator') || mName.toLowerCase().includes('crash')) {
    return {
      ftScore: sel.ftScore || 'Crashed @ 3.42x',
      outcome: sel.outcome || 'Cashed Out Successfully',
      pickText: sel.selectionName || `Cashed Out @ ${sel.odd.toFixed(2)}x`,
      isWon: true,
      gameId: sel.gameId || '4891',
      gameDate: sel.gameDate || '27/09 14:18',
      formattedMatchTitle: sel.matchTitle || 'Aviator Crash Radar (Round #4891)'
    };
  }

  // Specific canonical matches from SportyBet screenshot
  if (lowerTitle.includes('albania') && lowerTitle.includes('belarus')) {
    return {
      ftScore: '2:0',
      outcome: 'Home',
      pickText: `Home ${oddStr}`,
      isWon: true,
      gameId: '23888',
      gameDate: '26/09 18:45',
      formattedMatchTitle: 'Albania v Belarus'
    };
  }

  if (lowerTitle.includes('czechia') && lowerTitle.includes('croatia')) {
    return {
      ftScore: '1:2',
      outcome: 'Away',
      pickText: `Away ${oddStr}`,
      isWon: true,
      gameId: '44737',
      gameDate: '26/09 18:45',
      formattedMatchTitle: 'Czechia v Croatia'
    };
  }

  if (lowerTitle.includes('england') && lowerTitle.includes('spain')) {
    return {
      ftScore: '2:3',
      outcome: 'Away',
      pickText: `Away ${oddStr}`,
      isWon: true,
      gameId: '44945',
      gameDate: '26/09 18:45',
      formattedMatchTitle: 'England v Spain'
    };
  }

  if (lowerTitle.includes('usa') && lowerTitle.includes('peru')) {
    return {
      ftScore: '4:1',
      outcome: 'Home',
      pickText: `Home ${oddStr}`,
      isWon: true,
      gameId: '32014',
      gameDate: '26/09 20:30',
      formattedMatchTitle: 'USA v Peru'
    };
  }

  if (lowerTitle.includes('canada') && lowerTitle.includes('chile')) {
    return {
      ftScore: '2:1',
      outcome: 'Yes',
      pickText: `Yes ${oddStr}`,
      isWon: true,
      gameId: '48193',
      gameDate: '26/09 23:00',
      formattedMatchTitle: 'Canada v Chile'
    };
  }

  if (lowerTitle.includes('dortmund') && lowerTitle.includes('werder')) {
    return {
      ftScore: '2:1',
      outcome: 'Home',
      pickText: `Home ${oddStr}`,
      isWon: true,
      gameId: '39101',
      gameDate: '26/09 18:30',
      formattedMatchTitle: 'Borussia Dortmund v Werder Bremen'
    };
  }

  if (lowerTitle.includes('leipzig') && lowerTitle.includes('augsburg')) {
    return {
      ftScore: '3:1',
      outcome: 'Home',
      pickText: `Home ${oddStr}`,
      isWon: true,
      gameId: '39102',
      gameDate: '26/09 18:30',
      formattedMatchTitle: 'RB Leipzig v FC Augsburg'
    };
  }

  // Generalized Prediction Matching Logic:
  // 1. 1X2 Market
  if (mName.toUpperCase().includes('1X2') || mName.toUpperCase() === 'WINNER' || mName.toUpperCase() === 'MATCH WINNER') {
    if (sName === '1' || sName.toLowerCase() === 'home' || sName.toLowerCase().includes('home')) {
      return {
        ftScore: '2:0',
        outcome: 'Home',
        pickText: `Home ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
    if (sName === '2' || sName.toLowerCase() === 'away' || sName.toLowerCase().includes('away')) {
      return {
        ftScore: '1:2',
        outcome: 'Away',
        pickText: `Away ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
    if (sName.toUpperCase() === 'X' || sName.toLowerCase() === 'draw') {
      return {
        ftScore: '1:1',
        outcome: 'Draw',
        pickText: `Draw ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
  }

  // 2. Over / Under Goals
  if (mName.toUpperCase().includes('O/U') || mName.toLowerCase().includes('over') || mName.toLowerCase().includes('under')) {
    if (sName.toLowerCase().includes('over')) {
      return {
        ftScore: '3:1',
        outcome: sName,
        pickText: `${sName} ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
    if (sName.toLowerCase().includes('under')) {
      return {
        ftScore: '1:0',
        outcome: sName,
        pickText: `${sName} ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
  }

  // 3. Both Teams To Score (GG/NG)
  if (mName.toUpperCase().includes('GG') || mName.toUpperCase().includes('BTTS')) {
    if (sName.toLowerCase() === 'yes' || sName.toUpperCase() === 'GG') {
      return {
        ftScore: '2:1',
        outcome: 'Yes',
        pickText: `Yes ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
    return {
      ftScore: '2:0',
      outcome: 'No',
      pickText: `No ${oddStr}`,
      isWon: true,
      gameId,
      gameDate,
      formattedMatchTitle
    };
  }

  // 4. Double Chance
  if (mName.toUpperCase().includes('DC') || mName.toLowerCase().includes('double chance')) {
    if (sName === '1X') {
      return {
        ftScore: '2:0',
        outcome: '1X',
        pickText: `1X ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
    if (sName === 'X2') {
      return {
        ftScore: '1:2',
        outcome: 'X2',
        pickText: `X2 ${oddStr}`,
        isWon: true,
        gameId,
        gameDate,
        formattedMatchTitle
      };
    }
    return {
      ftScore: '2:1',
      outcome: '12',
      pickText: `12 ${oddStr}`,
      isWon: true,
      gameId,
      gameDate,
      formattedMatchTitle
    };
  }

  // Default Universal Winning Fallback
  return {
    ftScore: '2:1',
    outcome: sName,
    pickText: `${sName} ${oddStr}`,
    isWon: true,
    gameId,
    gameDate,
    formattedMatchTitle
  };
}

/**
 * Transforms a PlacedBet into a 100% Green Slip with all correct predictions
 */
export function markBetAsGreen(bet: PlacedBet, settleAsWon = false): PlacedBet {
  const updatedSelections = bet.selections.map((sel) => {
    const details = resolveWinningPredictionDetails(sel);
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
