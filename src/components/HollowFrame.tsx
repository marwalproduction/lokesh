import React from 'react';
import { motion } from 'motion/react';

export type SpotlightTheme =
  | 'v1_legend'
  | 'v1_graph'
  | 'v2_metrics'
  | 'v2_graph'
  | 'v2_actionable'
  | 'v3_predictive'
  | 'v3_hotfix';

export interface SpotlightConfig {
  id: SpotlightTheme;
  titleText: string;
  highlightKeyword?: string;
  themeColor: 'amber' | 'blue' | 'emerald' | 'rose';
  tagBadge?: string;
  placement?: 'top' | 'bottom' | 'floating-top';
}

interface HollowFrameProps {
  config: SpotlightConfig | null;
  isVisible: boolean;
}

export const HollowFrame: React.FC<HollowFrameProps> = ({ config, isVisible }) => {
  if (!isVisible || !config) return null;

  const colorStyles = {
    amber: {
      gradient: 'from-amber-600 to-orange-600',
    },
    blue: {
      gradient: 'from-blue-600 to-indigo-600',
    },
    emerald: {
      gradient: 'from-emerald-600 to-teal-600',
    },
    rose: {
      gradient: 'from-rose-600 to-red-600',
    },
  }[config.themeColor];

  // If highlightKeyword is present, split the title text cleanly to display smoothly
  const baseText = config.highlightKeyword && config.titleText.includes(config.highlightKeyword)
    ? config.titleText.replace(config.highlightKeyword, '').trimEnd()
    : config.titleText;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 pointer-events-none rounded-[20px] overflow-hidden font-sans"
    >
      {/* Background Dim & Blur Layer covering non-highlighted sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
      />

      {/* Floating Note Banner (Positioned to never overlap focused elements) */}
      <div
        className={`absolute left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none ${
          config.placement === 'bottom'
            ? 'bottom-3 sm:bottom-4'
            : config.placement === 'floating-top'
            ? '-top-12 sm:-top-14'
            : 'top-2 sm:top-2.5'
        }`}
      >
        <motion.div
          initial={{ y: config.placement === 'bottom' ? 8 : -8, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: config.placement === 'bottom' ? 8 : -8, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white/98 backdrop-blur-md border border-slate-200/95 shadow-[0_10px_35px_rgba(0,0,0,0.14)] rounded-xl py-2.5 px-4 sm:px-6 flex items-center justify-center max-w-[94%] text-center pointer-events-auto"
        >
          {/* Prominent, crisp readable text without badge pill */}
          <p className="text-[14.5px] sm:text-[16px] font-semibold text-slate-900 tracking-tight leading-snug flex items-center flex-wrap justify-center gap-1.5">
            <span>{baseText}</span>
            {config.highlightKeyword && (
              <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorStyles.gradient}`}>
                {config.highlightKeyword}
              </span>
            )}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Hollow Frame Viewfinder Border overlaying the target section
interface ViewfinderFrameProps {
  themeColor?: 'amber' | 'blue' | 'emerald' | 'rose';
  isActive: boolean;
}

export const ViewfinderFrame: React.FC<ViewfinderFrameProps> = ({
  themeColor = 'blue',
  isActive,
}) => {
  if (!isActive) return null;

  const colorMap = {
    amber: { border: 'border-amber-400', glow: 'shadow-[0_0_24px_rgba(251,191,36,0.25)]', stroke: '#F59E0B' },
    blue: { border: 'border-blue-500', glow: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]', stroke: '#3B82F6' },
    emerald: { border: 'border-emerald-500', glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]', stroke: '#10B981' },
    rose: { border: 'border-rose-400', glow: 'shadow-[0_0_24px_rgba(244,63,94,0.25)]', stroke: '#F43F5E' },
  }[themeColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute -inset-2 sm:-inset-2.5 z-30 pointer-events-none rounded-2xl border-2 ${colorMap.border} ${colorMap.glow}`}
    >
      {/* 4 Corner Viewfinder Crop Brackets */}
      {/* Top-Left */}
      <svg className="absolute -top-1.5 -left-1.5 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M1 10V3C1 1.89543 1.89543 1 3 1H10" stroke={colorMap.stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {/* Top-Right */}
      <svg className="absolute -top-1.5 -right-1.5 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M6 1H13C14.1046 1 15 1.89543 15 3V10" stroke={colorMap.stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {/* Bottom-Left */}
      <svg className="absolute -bottom-1.5 -left-1.5 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M1 6V13C1 14.1046 1.89543 15 3 15H10" stroke={colorMap.stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {/* Bottom-Right */}
      <svg className="absolute -bottom-1.5 -right-1.5 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M6 15H13C14.1046 15 15 14.1046 15 13V6" stroke={colorMap.stroke} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
