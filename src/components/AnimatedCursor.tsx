import React from 'react';
import { motion } from 'motion/react';

interface AnimatedCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
  isVisible: boolean;
  label?: string;
  angle?: number;
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  x,
  y,
  isClicking,
  isVisible,
  label = 'UI Designer',
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      id="animated-designer-cursor"
      className="pointer-events-none fixed z-50 select-none will-change-transform"
      style={{
        left: 0,
        top: 0,
      }}
      animate={{
        x: x,
        y: y,
      }}
      transition={{
        // Smooth keynote momentum curve (Google I/O keynote style)
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Click Shockwave Ring */}
      {isClicking && (
        <motion.div
          className="absolute -left-6 -top-6 w-16 h-16 rounded-full border-[2.5px] border-emerald-500 bg-emerald-400/25 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.1, 0.9, 0.2, 1] }}
        />
      )}

      {/* SVG Designer Cursor Arrow with Snappy Click Squish */}
      <motion.div
        animate={{
          scale: isClicking ? 0.78 : 1,
          rotate: isClicking ? -8 : 0,
        }}
        transition={{ duration: 0.08, ease: 'easeOut' }}
        className="relative will-change-transform"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_5px_14px_rgba(0,0,0,0.35)]"
        >
          {/* Black arrow with crisp white border */}
          <path
            d="M3 3L10.07 20.07L13.58 13.58L20.07 10.07L3 3Z"
            fill="#0F172A"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>

        {/* Linear/Figma Style Designer Pill Badge */}
        {label && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-5 top-3.5 bg-slate-950/90 backdrop-blur-md text-white text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25)] whitespace-nowrap border border-slate-700/80 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            {label}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
