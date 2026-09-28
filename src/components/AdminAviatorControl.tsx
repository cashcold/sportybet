import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Gauge,
  Compass,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  RotateCcw,
  Check,
  Clock,
  Sliders,
  ChevronRight,
  Eye,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
  Hash,
  Flame,
  Plane
} from 'lucide-react';
import {
  aviatorEngine,
  AviatorEngineState,
  AviatorRoundInfo,
  calculateFlightDuration,
  determineGameSign
} from '../services/aviatorEngine';

interface AdminAviatorControlProps {
  onShowToast: (msg: string) => void;
  onNavigateToGame?: () => void;
}

export const AdminAviatorControl: React.FC<AdminAviatorControlProps> = ({
  onShowToast,
  onNavigateToGame
}) => {
  const [engineState, setEngineState] = useState<AviatorEngineState>(aviatorEngine.getState());
  const [customCrashInput, setCustomCrashInput] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
  const [editingUpcomingIdx, setEditingUpcomingIdx] = useState<number | null>(null);

  useEffect(() => {
    const unsub = aviatorEngine.subscribe((newState) => {
      setEngineState(newState);
      setSelectedSpeed(newState.nextRound.speedMultiplier);
    });
    return unsub;
  }, []);

  const { currentRound, nextRound, upcomingQueue, history, adminOverrideActive } = engineState;

  // Preset crash multipliers
  const quickPresets = [
    { label: 'Instant Trap', value: 1.05, tier: 'TRAP', color: 'border-rose-500 text-rose-400' },
    { label: 'Low Blue', value: 1.65, tier: 'BLUE', color: 'border-sky-500 text-sky-400' },
    { label: 'Purple Solid', value: 2.75, tier: 'PURPLE', color: 'border-purple-500 text-purple-400' },
    { label: 'Cloud Sweet', value: 4.50, tier: 'PURPLE', color: 'border-purple-500 text-purple-400' },
    { label: 'Rocket 10x', value: 11.20, tier: 'MAGENTA', color: 'border-pink-500 text-pink-400' },
    { label: 'Super 25x', value: 25.00, tier: 'MAGENTA', color: 'border-pink-500 text-pink-400' },
    { label: 'Mega 50x', value: 50.00, tier: 'JACKPOT', color: 'border-amber-400 text-amber-400' },
    { label: 'Jackpot 100x', value: 100.00, tier: 'JACKPOT', color: 'border-amber-400 text-amber-400' }
  ];

  // Quick speed presets
  const speedOptions = [
    { label: '0.7x Glider', value: 0.7, desc: 'Slow, elongated climb' },
    { label: '1.0x Normal', value: 1.0, desc: 'Standard Spribe physics' },
    { label: '1.5x Fast Turbo', value: 1.5, desc: 'High acceleration' },
    { label: '2.0x Supersonic', value: 2.0, desc: 'Ultra-fast blast off' }
  ];

  const handleApplyCustomCrash = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customCrashInput);
    if (isNaN(val) || val < 1.0) {
      onShowToast('Please enter a valid multiplier (minimum 1.00x)');
      return;
    }

    aviatorEngine.overrideNextRound({
      crashPoint: val,
      speedMultiplier: selectedSpeed
    });

    onShowToast(`Next Aviator flight rigged to ${val.toFixed(2)}x (Speed: ${selectedSpeed}x)!`);
    setCustomCrashInput('');
  };

  const handleApplyPreset = (value: number) => {
    aviatorEngine.overrideNextRound({
      crashPoint: value,
      speedMultiplier: selectedSpeed
    });
    onShowToast(`Next Aviator flight set to ${value.toFixed(2)}x at ${selectedSpeed}x speed`);
  };

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    aviatorEngine.setNextFlightSpeed(speed);
    onShowToast(`Next flight plane speed set to ${speed}x`);
  };

  const handleResetNatural = () => {
    aviatorEngine.resetToNaturalAlgorithm();
    setSelectedSpeed(1.0);
    onShowToast('Reset next flights to natural Spribe algorithmic RNG distribution');
  };

  return (
    <div className="space-y-5">
      {/* 1. TOP SPOTLIGHT HERO: NEXT AVIATOR PLANE FLY SPEED & SIGN OF NEXT GAME */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181124] via-[#121927] to-[#0d141e] border-2 border-red-500/40 p-4 sm:p-6 shadow-2xl space-y-5">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header row */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#293649] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 shadow-inner">
              <Plane className="w-6 h-6 stroke-[2.2] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white tracking-wide uppercase">
                  Aviator Next Game Predictor & Radar
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                  Live Master Feed
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Displays the next Aviator plane fly speed, duration, and cryptographic outcome sign before takeoff.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {adminOverrideActive && (
              <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Admin Override Active</span>
              </span>
            )}
            <button
              onClick={handleResetNatural}
              className="px-3 py-1.5 bg-[#1f2b3b] hover:bg-[#28384d] text-neutral-300 hover:text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-[#2b3a4d] transition-colors cursor-pointer"
              title="Reset to natural random generator"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Natural RNG</span>
            </button>
            {onNavigateToGame && (
              <button
                onClick={onNavigateToGame}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black flex items-center space-x-1 shadow transition-colors cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Watch Game</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. THE DUAL SPOTLIGHT CARDS: NEXT FLY SPEED & SIGN OF NEXT GAME */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CARD A: SIGN OF NEXT GAME */}
          <div className={`rounded-xl p-4 sm:p-5 border ${nextRound.sign.borderClass} ${nextRound.sign.bgClass} shadow-xl flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>SIGN OF NEXT GAME</span>
                </span>
                <span className="text-xs font-extrabold text-neutral-400">
                  Round {nextRound.roundId}
                </span>
              </div>

              {/* Huge Multiplier Outcome & Tier Badge */}
              <div className="mt-3 flex items-baseline space-x-3">
                <div className={`text-4xl sm:text-5xl font-black tracking-tight ${nextRound.sign.textClass} drop-shadow-md`}>
                  {nextRound.crashPoint.toFixed(2)}x
                </div>
                <div className="flex flex-col">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${nextRound.sign.borderClass} ${nextRound.sign.textClass} bg-black/40`}>
                    {nextRound.sign.trendIcon} {nextRound.sign.tier.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-0.5">
                    {nextRound.sign.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Signal Indicators */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Signal Trend:</span>
                <span className="font-bold text-white flex items-center space-x-1">
                  <span>{nextRound.sign.trend}</span>
                  <span>{nextRound.sign.trendIcon}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Outcome Category:</span>
                <span className={`font-black ${nextRound.sign.textClass}`}>
                  {nextRound.sign.badgeText}
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 italic">
                "{nextRound.sign.description}"
              </p>
            </div>

            {/* Provably Fair SHA-512 Signature */}
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-[#00df59]" />
                  <span>SHA-512 Server Seed Hash Sign:</span>
                </span>
                <span className="text-[#00df59] font-bold">Committed</span>
              </div>
              <div className="font-mono text-[10px] text-neutral-300 truncate select-all">
                {nextRound.provablyFair.serverSeedHash}
              </div>
            </div>
          </div>

          {/* CARD B: NEXT AVIATOR PLANE FLY SPEED */}
          <div className="rounded-xl p-4 sm:p-5 border border-sky-500/30 bg-gradient-to-b from-[#0f1b2b] to-[#0a1320] shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <span>NEXT AVIATOR PLANE FLY SPEED</span>
                </span>
                <span className="text-xs font-bold text-neutral-400">
                  Trajectory Dynamics
                </span>
              </div>

              {/* Large Flight Duration & Speed Profile */}
              <div className="mt-3 flex items-baseline space-x-3">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-sky-300 drop-shadow-md">
                  {nextRound.estimatedDurationSec.toFixed(1)}s
                </div>
                <div className="flex flex-col">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border border-sky-400/40 text-sky-300 bg-sky-950/40">
                    {nextRound.speedProfile}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-0.5">
                    Expected Flight Time to Crash
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#142337] border border-[#213854]">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Speed Multiplier</div>
                <div className="text-sm font-black text-white mt-0.5 flex items-center space-x-1">
                  <span>{nextRound.speedMultiplier.toFixed(1)}x</span>
                  <span className="text-[10px] text-sky-400 font-normal">({nextRound.speedLabel})</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#142337] border border-[#213854]">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Climb Rate</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">
                  +{nextRound.climbRatePerSec.toFixed(2)}x / sec
                </div>
              </div>
            </div>

            {/* Fly Speed Selector */}
            <div className="space-y-1.5 pt-2 border-t border-sky-500/20">
              <label className="text-[11px] font-bold text-neutral-300 flex items-center justify-between">
                <span>Calibrate Next Plane Fly Speed:</span>
                <span className="text-sky-400">{selectedSpeed.toFixed(1)}x Factor</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {speedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSpeedChange(opt.value)}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded border transition-all cursor-pointer text-center ${
                      selectedSpeed === opt.value
                        ? 'bg-sky-500 text-black border-sky-400 font-black shadow-md'
                        : 'bg-[#132030] text-neutral-300 border-[#22364c] hover:bg-[#1a2c42]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. CURRENT FLIGHT RADAR STATUS */}
        <div className="relative z-10 p-3.5 rounded-xl bg-black/40 border border-[#26374d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full animate-ping ${
              currentRound.status === 'flying'
                ? 'bg-red-500'
                : currentRound.status === 'crashed'
                ? 'bg-amber-500'
                : 'bg-emerald-400'
            }`} />
            <div>
              <span className="text-neutral-400">Current Arena Flight:</span>{' '}
              <span className="font-extrabold text-white uppercase">{currentRound.roundId}</span>{' '}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                currentRound.status === 'flying'
                  ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                  : currentRound.status === 'crashed'
                  ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
              }`}>
                {currentRound.status}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <span className="text-neutral-400">Live Elevation:</span>{' '}
              <span className="font-black text-red-400 text-sm">
                {currentRound.currentMultiplier.toFixed(2)}x
              </span>
            </div>
            <div>
              <span className="text-neutral-400">Destination Crash:</span>{' '}
              <span className="font-black text-white text-sm">
                {currentRound.crashPoint.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. OVERRIDE / RIGGING CONTROLS: PRESET OUTCOMES FOR NEXT FLIGHT */}
      <div className="bg-[#141e2b] border border-[#253549] rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase text-white tracking-wider">
              Force Next Flight Crash Multiplier & Sign
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400">
            Click any sign preset or type custom target
          </span>
        </div>

        {/* 1-Click Multiplier Preset Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleApplyPreset(preset.value)}
              className={`p-2.5 rounded-lg border bg-[#182434] hover:bg-[#203146] active:scale-95 transition-all text-left cursor-pointer flex flex-col justify-between ${
                nextRound.crashPoint === preset.value && adminOverrideActive
                  ? `${preset.color} bg-[#24354c] ring-2 ring-red-500`
                  : 'border-[#273a50]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">
                  {preset.label}
                </span>
                <span className={`text-[10px] font-black uppercase px-1 rounded ${preset.color}`}>
                  {preset.tier}
                </span>
              </div>
              <div className="text-lg font-black text-white mt-1">
                {preset.value.toFixed(2)}x
              </div>
            </button>
          ))}
        </div>

        {/* Custom Exact Target Multiplier Form */}
        <form onSubmit={handleApplyCustomCrash} className="pt-2 border-t border-[#233346] flex flex-col sm:flex-row gap-2.5 items-end sm:items-center">
          <div className="flex-1 w-full space-y-1">
            <label className="text-[11px] font-bold text-neutral-300 block">
              Set Exact Custom Crash Multiplier for Next Round:
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="1.00"
                max="5000.00"
                value={customCrashInput}
                onChange={(e) => setCustomCrashInput(e.target.value)}
                placeholder="e.g. 15.50 or 2.10"
                className="w-full bg-[#0d141e] border border-[#2b3d54] rounded-lg px-3.5 py-2 text-white font-mono text-sm placeholder:text-neutral-500 focus:outline-none focus:border-red-500 pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-xs pointer-events-none">
                x
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Apply to Next Flight</span>
          </button>
        </form>
      </div>

      {/* 5. SCHEDULED RADAR FORECAST: NEXT 8 UPCOMING ROUNDS */}
      <div className="bg-[#141e2b] border border-[#253549] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-black uppercase text-white tracking-wider">
              Upcoming Aviator Flight Radar Schedule (Next 8 Games)
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400">
            Algorithmic forecast with crash signs & flight speed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#233549] text-neutral-400 text-[10px] font-black uppercase tracking-wider">
                <th className="pb-2">Queue #</th>
                <th className="pb-2">Round ID</th>
                <th className="pb-2">Crash Target</th>
                <th className="pb-2">Fly Speed / Duration</th>
                <th className="pb-2">Sign of Game</th>
                <th className="pb-2">Trend Signal</th>
                <th className="pb-2 text-right">Provably Fair Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2a39]">
              {/* Row 1: Next Immediate Round */}
              <tr className="bg-red-950/20 font-bold">
                <td className="py-2.5 text-red-400 font-black flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>NEXT UP</span>
                </td>
                <td className="py-2.5 font-mono text-white">{nextRound.roundId}</td>
                <td className="py-2.5">
                  <span className={`text-sm font-black ${nextRound.sign.textClass}`}>
                    {nextRound.crashPoint.toFixed(2)}x
                  </span>
                </td>
                <td className="py-2.5 text-neutral-300">
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-sky-400" />
                    <span>{nextRound.estimatedDurationSec.toFixed(1)}s ({nextRound.speedMultiplier}x)</span>
                  </div>
                </td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${nextRound.sign.borderClass} ${nextRound.sign.textClass} bg-black/30`}>
                    {nextRound.sign.tier.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="text-white font-bold flex items-center space-x-1">
                    <span>{nextRound.sign.trend}</span>
                    <span>{nextRound.sign.trendIcon}</span>
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono text-[10px] text-neutral-400">
                  {nextRound.provablyFair.serverSeedHash.slice(0, 16)}...
                </td>
              </tr>

              {/* Rows 2+: Future Queued Rounds */}
              {upcomingQueue.map((item, idx) => (
                <tr key={item.roundId} className="hover:bg-[#192433] transition-colors">
                  <td className="py-2 text-neutral-400 font-bold">+{idx + 1}</td>
                  <td className="py-2 font-mono text-neutral-300">{item.roundId}</td>
                  <td className="py-2 font-black text-white">{item.crashPoint.toFixed(2)}x</td>
                  <td className="py-2 text-neutral-400">
                    {item.estimatedDurationSec.toFixed(1)}s ({item.speedMultiplier}x)
                  </td>
                  <td className="py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${item.sign.borderClass} ${item.sign.textClass}`}>
                      {item.sign.badgeText}
                    </span>
                  </td>
                  <td className="py-2 text-neutral-300">
                    <span className="flex items-center space-x-1">
                      <span>{item.sign.trend}</span>
                      <span>{item.sign.trendIcon}</span>
                    </span>
                  </td>
                  <td className="py-2 text-right font-mono text-[10px] text-neutral-500">
                    {item.provablyFair.serverSeedHash.slice(0, 14)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. RECENT FLIGHT HISTORY STRIP */}
      <div className="bg-[#141e2b] border border-[#253549] rounded-xl p-4 space-y-2 shadow-lg">
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
          <span>Recent Flight Multiplier Outcomes (Last Rounds)</span>
          <span className="text-[10px] text-neutral-500">Recorded Multipliers</span>
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          {history.slice(0, 16).map((mult, idx) => {
            let color = 'bg-[#102130] text-[#34b4ff] border-[#34b4ff]/30';
            if (mult >= 10.0) {
              color = 'bg-[#31112c] text-[#f046e2] border-[#c017b4]/40';
            } else if (mult >= 2.0) {
              color = 'bg-[#211432] text-[#b77eff] border-[#9042f6]/40';
            }
            return (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-full text-xs font-black border ${color}`}
              >
                {mult.toFixed(2)}x
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
