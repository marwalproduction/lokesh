import React from 'react';
import { motion } from 'motion/react';

interface MetricBannerProps {
  octVelocity?: string;
  oct24Drop?: string;
  convBaseline?: string;
}

export const MetricBanner: React.FC<MetricBannerProps> = ({
  octVelocity = '$128,430',
  oct24Drop = '-$14.2k Risk',
  convBaseline = '98.4% Normal',
}) => {
  return (
    <motion.div
      id="redesigned-metric-banner"
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 26 }}
      className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-[16px] p-2.5 sm:p-3 mb-4 sm:mb-5 will-change-transform shadow-xs"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 sm:divide-x sm:divide-slate-200/90 items-center">
        {/* Metric 1: OCT VELOCITY */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="flex items-center gap-2.5 px-2 sm:px-3"
        >
          {/* Green dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#0E8759] shrink-0 shadow-xs ring-2 ring-emerald-500/15" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-[#8898AA] uppercase font-mono">
              OCT VELOCITY
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#0F172A] tracking-tight font-mono">
              {octVelocity}
            </span>
          </div>
        </motion.div>

        {/* Metric 2: OCT 24 DROP */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="flex items-center gap-2.5 px-2 sm:px-3"
        >
          {/* Red dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shrink-0 shadow-xs ring-2 ring-red-500/15" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-[#8898AA] uppercase font-mono">
              OCT 24 DROP
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#DC2626] tracking-tight font-mono">
              {oct24Drop}
            </span>
          </div>
        </motion.div>

        {/* Metric 3: CONV. BASELINE */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="flex items-center gap-2.5 px-2 sm:px-3"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-[#8898AA] uppercase font-mono">
              CONV. BASELINE
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-[#0E8759] tracking-tight font-mono">
              {convBaseline}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
