import React from 'react';

interface SportyBetLogoProps {
  className?: string;
  variant?: 'white' | 'red';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

/**
 * SportyBet Official Brand Logo
 * Matches the exact typography, stylized 'S' with top-right and bottom-left ball dots,
 * and bold rounded geometric font from official SportyBet branding.
 */
export const SportyBetLogo: React.FC<SportyBetLogoProps> = ({
  className = '',
  variant = 'white',
  size = 'md',
}) => {
  const textColor = variant === 'red' ? '#de1a22' : '#ffffff';
  const dotColor = variant === 'red' ? '#de1a22' : '#ffffff';

  // Size configurations calibrated for mobile & web
  const sizeStyles = {
    sm: { 
      container: 'h-5 text-[14.5px]', 
      dot: 'w-[2.8px] h-[2.8px]', 
      dotTop: '-top-[0.5px] -right-[1.1px]', 
      dotBottom: '-bottom-[0.5px] -left-[1.4px]' 
    },
    md: { 
      container: 'h-6 text-[17.5px]', 
      dot: 'w-[3.4px] h-[3.4px]', 
      dotTop: '-top-[0.5px] -right-[1.4px]', 
      dotBottom: '-bottom-[0.5px] -left-[1.7px]' 
    },
    lg: { 
      container: 'h-7 text-[20px]', 
      dot: 'w-[3.8px] h-[3.8px]', 
      dotTop: '-top-[1px] -right-[1.6px]', 
      dotBottom: '-bottom-[1px] -left-[2px]' 
    },
    xl: { 
      container: 'h-8 text-[23px]', 
      dot: 'w-[4.4px] h-[4.4px]', 
      dotTop: '-top-[1px] -right-[2px]', 
      dotBottom: '-bottom-[1px] -left-[2.4px]' 
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <div 
      className={`inline-flex items-center select-none font-['Montserrat','Plus_Jakarta_Sans',system-ui,sans-serif] ${currentSize.container} ${className}`}
      style={{
        fontStyle: 'italic',
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: 1
      }}
    >
      {/* Custom Stylized 'S' with signature SportyBet top-right and bottom-left dots */}
      <span className="relative inline-block mr-[0.5px]">
        {/* Top-right satellite dot */}
        <span 
          className={`absolute ${currentSize.dotTop} ${currentSize.dot} rounded-full pointer-events-none`}
          style={{ backgroundColor: dotColor }}
        />

        {/* Bottom-left satellite dot */}
        <span 
          className={`absolute ${currentSize.dotBottom} ${currentSize.dot} rounded-full pointer-events-none`}
          style={{ backgroundColor: dotColor }}
        />

        {/* Capital 'S' */}
        <span 
          className="font-extrabold text-inherit"
          style={{ color: textColor }}
        >
          S
        </span>
      </span>

      {/* 'porty' in athletic geometric sans with matching bold weight */}
      <span 
        className="font-extrabold tracking-[-0.025em]"
        style={{ color: textColor }}
      >
        porty
      </span>

      {/* 'Bet' in matching font and weight */}
      <span 
        className="font-extrabold tracking-[-0.025em]"
        style={{ color: textColor }}
      >
        Bet
      </span>
    </div>
  );
};

/**
 * Pure SVG version of the official SportyBet logo for places where vector rendering is preferred.
 */
export const SportyBetLogoSvg: React.FC<{
  className?: string;
  fill?: string;
  height?: number;
}> = ({
  className = 'h-5 w-auto',
  fill = '#ffffff',
  height = 20
}) => {
  return (
    <svg 
      height={height} 
      viewBox="0 0 150 26" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="SportyBet"
    >
      <g transform="skewX(-7) translate(3, 0)">
        {/* S top-right dot */}
        <circle cx="16" cy="5.5" r="2.1" fill={fill} />
        
        {/* S bottom-left dot */}
        <circle cx="2" cy="19.5" r="2.1" fill={fill} />

        {/* Text rendered with Montserrat/Plus Jakarta Sans extra bold */}
        <text
          x="3"
          y="20.5"
          fill={fill}
          fontFamily="'Montserrat', 'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="-0.025em"
          fontStyle="italic"
        >
          SportyBet
        </text>
      </g>
    </svg>
  );
};
