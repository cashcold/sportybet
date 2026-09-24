import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ticket, GripVertical } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

export const FloatingBetslipButton: React.FC = () => {
  const { betslip, openBets, user, setIsBetslipOpen, isBetslipOpen, setActiveTab } = useBetting();

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isActivelyMoving, setIsActivelyMoving] = useState(false);

  const isDraggingRef = useRef(false);
  const didDragJustFinishRef = useRef(false);
  const holdTimerRef = useRef<number | null>(null);

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    hasMoved: false,
  });

  // Calculate boundary box clamped to mobile container or viewport
  const getBounds = useCallback(() => {
    if (typeof window === 'undefined') {
      return { minX: 8, maxX: 300, minY: 64, maxY: 600, containerRect: null };
    }

    const container = document.querySelector('.max-w-md');
    const containerRect = container ? container.getBoundingClientRect() : null;

    const btnSize = 52;
    const padding = 10;

    let minX = padding;
    let maxX = window.innerWidth - btnSize - padding;

    if (containerRect && containerRect.width > 0) {
      minX = Math.max(padding, containerRect.left + padding);
      maxX = Math.min(window.innerWidth - btnSize - padding, containerRect.right - btnSize - padding);
    }

    // Safety fallback if container bounds are inverted
    if (maxX < minX) {
      maxX = minX + 20;
    }

    const minY = 64; // Below top header
    const maxY = Math.max(minY + 50, window.innerHeight - btnSize - 68); // Above bottom nav (52px + margin)

    return { minX, maxX, minY, maxY, containerRect };
  }, []);

  // Initialize position from localStorage or default to right side at 188px
  useEffect(() => {
    const { minX, maxX, minY, maxY } = getBounds();

    try {
      const saved = localStorage.getItem('sportybet_floating_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          const clampedX = Math.max(minX, Math.min(parsed.x, maxX));
          const clampedY = Math.max(minY, Math.min(parsed.y, maxY));
          setPosition({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default: pinned to right edge inside mobile container at top: 188px
    setPosition({ x: maxX, y: Math.min(188, maxY) });
  }, [getBounds]);

  // Keep within bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const { minX, maxX, minY, maxY } = getBounds();
        return {
          x: Math.max(minX, Math.min(prev.x, maxX)),
          y: Math.max(minY, Math.min(prev.y, maxY)),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getBounds]);

  if (isBetslipOpen) return null;

  // Active counts
  const activeOpenBetsCount = user.isLoggedIn ? openBets.length : 0;
  const totalOdds = betslip.length > 0
    ? betslip.reduce((acc, curr) => acc * curr.odd, 1)
    : 0;

  const handleClick = () => {
    if (betslip.length > 0) {
      setIsBetslipOpen(true);
    } else if (activeOpenBetsCount > 0) {
      setActiveTab('open_bets');
    } else {
      setIsBetslipOpen(true);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Allow left mouse click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const { maxX, maxY } = getBounds();
    const currentX = position?.x ?? maxX;
    const currentY = position?.y ?? Math.min(188, maxY);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: currentX,
      startPosY: currentY,
      hasMoved: false,
    };

    isDraggingRef.current = true;
    didDragJustFinishRef.current = false;

    // Start hold timer: visual feedback that click-and-hold is activated
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      if (isDraggingRef.current) {
        setIsHolding(true);
      }
    }, 100);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    // 4px movement threshold
    if (!dragStartRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
      dragStartRef.current.hasMoved = true;
      setIsActivelyMoving(true);
      setIsHolding(true);
    }

    if (dragStartRef.current.hasMoved) {
      const { minX, maxX, minY, maxY } = getBounds();
      const rawX = dragStartRef.current.startPosX + dx;
      const rawY = dragStartRef.current.startPosY + dy;

      const nextX = Math.max(minX, Math.min(rawX, maxX));
      const nextY = Math.max(minY, Math.min(rawY, maxY));

      setPosition({ x: nextX, y: nextY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const moved = dragStartRef.current.hasMoved;
    setIsHolding(false);
    setIsActivelyMoving(false);

    if (moved) {
      didDragJustFinishRef.current = true;
      setTimeout(() => {
        didDragJustFinishRef.current = false;
      }, 120);

      // Save final position to localStorage
      setPosition((curr) => {
        if (curr) {
          try {
            localStorage.setItem('sportybet_floating_pos', JSON.stringify(curr));
          } catch {
            // ignore
          }
        }
        return curr;
      });
    } else {
      handleClick();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    isDraggingRef.current = false;
    setIsHolding(false);
    setIsActivelyMoving(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (didDragJustFinishRef.current || dragStartRef.current.hasMoved) {
      e.preventDefault();
      return;
    }
    handleClick();
  };

  const displayBadgeCount = betslip.length > 0 ? betslip.length : activeOpenBetsCount;
  const isElevated = isHolding || isActivelyMoving;

  return (
    <div
      role="region"
      aria-label="Floating open bets and betslip shortcut (drag to move)"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        position: 'fixed',
        left: `${position?.x ?? 0}px`,
        top: `${position?.y ?? 188}px`,
        zIndex: isElevated ? 60 : 45,
        touchAction: 'none',
        visibility: position === null ? 'hidden' : 'visible',
      }}
      className="select-none pointer-events-auto transition-transform duration-75"
    >
      {/* Floating Drag Hint Pill during hold/drag */}
      {isElevated && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0d1218]/95 border border-emerald-500/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1 pointer-events-none animate-in fade-in zoom-in-90 duration-150">
          <GripVertical className="w-2.5 h-2.5 text-emerald-400" />
          <span>{isActivelyMoving ? 'Move anywhere • Release to place' : 'Hold & drag to move'}</span>
        </div>
      )}

      {/* Main Draggable Floating Action Button */}
      <button
        type="button"
        onClick={onButtonClick}
        className={`relative w-12 h-12 rounded-full bg-[#00a826] hover:bg-[#009221] active:bg-[#00821d] flex items-center justify-center text-white border-2 border-[#121922] transition-all cursor-grab active:cursor-grabbing group shadow-2xl ${
          isElevated
            ? 'scale-110 ring-4 ring-emerald-400/50 shadow-[0_12px_28px_rgba(0,0,0,0.8),0_0_20px_rgba(0,168,38,0.7)]'
            : 'hover:scale-105 active:scale-95'
        }`}
        aria-label={
          betslip.length > 0
            ? `Betslip (${betslip.length}) - Click to open, hold to drag`
            : activeOpenBetsCount > 0
            ? `Open Bets (${activeOpenBetsCount}) - Click to open, hold to drag`
            : 'Open Betslip - Click to open, hold to drag'
        }
        title="Click to open • Click & hold to move around screen"
      >
        {/* Grip dots hint on left edge when resting */}
        <div className="absolute -left-1 opacity-0 group-hover:opacity-60 transition-opacity flex flex-col gap-0.5 py-1">
          <span className="w-1 h-1 rounded-full bg-white" />
          <span className="w-1 h-1 rounded-full bg-white" />
          <span className="w-1 h-1 rounded-full bg-white" />
        </div>

        {/* Dynamic Icon / Odds Content */}
        {betslip.length > 0 ? (
          <span className="text-[10px] font-black tracking-tighter leading-none px-0.5 truncate max-w-[42px]">
            {totalOdds >= 1000 ? `${totalOdds.toFixed(0)}...` : totalOdds >= 100 ? `${totalOdds.toFixed(0)}` : totalOdds.toFixed(2)}
          </span>
        ) : activeOpenBetsCount > 0 ? (
          /* Exact Circular Open Bets Arrows with Dollar Symbol */
          <svg className="w-5 h-5 text-white stroke-[2.2] group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.5 10.5A7.8 7.8 0 0 0 6.2 6.2L4 8.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <polyline
              points="4 4 4 8.5 8.5 8.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.5 13.5A7.8 7.8 0 0 0 17.8 17.8L20 15.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <polyline
              points="20 20 20 15.5 15.5 15.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="12"
              y="15.2"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="900"
              fill="currentColor"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              $
            </text>
          </svg>
        ) : (
          <Ticket className="w-5 h-5 stroke-[2.4] group-hover:rotate-6 transition-transform" />
        )}

        {/* Badge count number (betslip or open bets) */}
        <span
          className={`absolute -top-1 -right-1 font-black text-[11px] min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow border transition-all ${
            activeOpenBetsCount > 0 && betslip.length === 0
              ? 'bg-[#de1a22] text-white border-[#de1a22]'
              : 'bg-white text-black border-neutral-300'
          }`}
        >
          {displayBadgeCount}
        </span>
      </button>
    </div>
  );
};

