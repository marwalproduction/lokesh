import React from 'react';

export const TimeframePill: React.FC = () => {
  return (
    <div
      id="timeframe-pill"
      className="inline-flex items-center bg-[#EEF2F6] rounded-[16px] px-4 py-2.5 sm:px-5 sm:py-3 select-none transition-all shadow-none border-0 shrink-0"
    >
      {/* Left label: Timeframe: with exact letter spacing and muted slate color */}
      <span
        className="font-mono text-[13px] text-[#6B7C93] tracking-normal whitespace-nowrap font-normal mr-4"
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        Timeframe:
      </span>

      {/* Right value: 2 lines in bold monospace dark navy */}
      <div
        className="flex flex-col text-left font-mono font-bold text-[#152238] text-[13px] leading-[1.28] tracking-tight"
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        <span className="whitespace-nowrap">30D (Oct Peak</span>
        <span className="whitespace-nowrap">&amp; Incident)</span>
      </div>
    </div>
  );
};

