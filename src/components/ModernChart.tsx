import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface ModernChartProps {
  onHoverPoint?: (data: { date: string; impact: string; status: string } | null) => void;
  onSelectAnomaly?: () => void;
}

export const ModernChart: React.FC<ModernChartProps> = ({ onSelectAnomaly }) => {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // SVG Coordinate space (Compact Hero Profile)
  const svgWidth = 640;
  const svgHeight = 260;

  // Chart bounds
  const xLeft = 45;
  const xRight = 595;
  const yTop = 35; // $150k
  const yBottom = 225; // X baseline

  // Date X positions along the chart:
  const xDates = [
    { label: 'Oct 01', x: 75 },
    { label: 'Oct 08', x: 205 },
    { label: 'Oct 16', x: 330 },
    { label: 'Oct 24', x: 430 },
    { label: 'Oct 31', x: 575 },
  ];

  // Grid levels (Left: $150k, $100k, $50k. Right: $80, $50, $20)
  const gridLevels = [
    { left: '$150k', right: '$80', y: yTop + 15 },
    { left: '$100k', right: '$50', y: yTop + 75 },
    { left: '$50k', right: '$20', y: yTop + 135 },
  ];

  // Beautiful smooth cubic bezier for the primary green revenue velocity curve
  const greenCurvePath = `
    M 45,188
    C 75,195 105,196 140,182
    C 185,164 240,135 295,125
    C 340,118 385,108 430,95
    C 475,82 540,60 600,52
  `;

  // Area fill under green curve (closed path to baseline yBottom=225)
  const greenAreaPath = `
    ${greenCurvePath}
    L 600,${yBottom}
    L 45,${yBottom}
    Z
  `;

  // Blue dashed curve:
  const blueCurvePath = `
    M 45,172
    C 80,185 120,192 165,190
    C 210,185 265,172 320,154
    C 365,140 400,140 430,144
    C 465,150 500,149 535,133
    C 560,124 580,115 600,108
  `;

  // Oct 24 Anomaly Coordinates:
  const oct24X = 430;
  const greenOct24Y = 95; // intersection on green line
  const blueOct24Y = 144; // intersection on blue line

  return (
    <motion.div
      ref={containerRef}
      id="redesigned-modern-chart"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[#FFFFFF] border border-slate-200/90 rounded-[24px] p-4 sm:p-6 relative select-none will-change-transform"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          {/* Subtle gradient fill under the green curve */}
          <linearGradient id="greenFillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E8759" stopOpacity="0.24" />
            <stop offset="65%" stopColor="#0E8759" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0E8759" stopOpacity="0.0" />
          </linearGradient>

          {/* Soft shadow for the anomaly tooltip */}
          <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ========================================================= */}
        {/* HORIZONTAL DASHED GRID LINES & Y LABELS */}
        {/* ========================================================= */}
        {gridLevels.map((lvl, idx) => (
          <g key={`grid-${idx}`}>
            {/* Left label ($150k, $100k, $50k) */}
            <text
              x={xLeft - 10}
              y={lvl.y + 4}
              textAnchor="end"
              fill="#94A3B8"
              className="font-mono text-[12px] font-medium"
            >
              {lvl.left}
            </text>

            {/* Subtle dashed horizontal grid line */}
            <line
              x1={xLeft}
              y1={lvl.y}
              x2={xRight}
              y2={lvl.y}
              stroke="#E2E8F0"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Right secondary label ($80, $50, $20) */}
            <text
              x={xRight + 12}
              y={lvl.y + 4}
              textAnchor="start"
              fill="#94A3B8"
              className="font-mono text-[12px] font-medium"
            >
              {lvl.right}
            </text>
          </g>
        ))}

        {/* ========================================================= */}
        {/* BASELINE X-AXIS */}
        {/* ========================================================= */}
        <line
          x1={xLeft}
          y1={yBottom}
          x2={xRight + 10}
          y2={yBottom}
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* ========================================================= */}
        {/* X-AXIS DATES */}
        {/* ========================================================= */}
        {xDates.map((d) => (
          <text
            key={d.label}
            x={d.x}
            y={yBottom + 26}
            textAnchor="middle"
            fill="#64748B"
            className="font-mono text-[12px] font-medium"
          >
            {d.label}
          </text>
        ))}

        {/* ========================================================= */}
        {/* GREEN CURVE AREA FILL (SaaS Fast Bloom) */}
        {/* ========================================================= */}
        <motion.path
          d={greenAreaPath}
          fill="url(#greenFillGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        />

        {/* ========================================================= */}
        {/* BLUE DASHED SESSIONS CURVE (SaaS Fast Sweep) */}
        {/* ========================================================= */}
        <motion.path
          d={blueCurvePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        />

        {/* ========================================================= */}
        {/* PRIMARY GREEN VELOCITY CURVE (SaaS Fast Sweep) */}
        {/* ========================================================= */}
        <motion.path
          d={greenCurvePath}
          fill="none"
          stroke="#0E8759"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ========================================================= */}
        {/* OCT 24 VERTICAL DOTTED INCIDENT LINE */}
        {/* ========================================================= */}
        <motion.line
          x1={oct24X}
          y1={greenOct24Y - 20}
          x2={oct24X}
          y2={yBottom}
          stroke="#94A3B8"
          strokeWidth="2"
          strokeDasharray="3 3"
          initial={{ opacity: 0, y2: greenOct24Y }}
          animate={{ opacity: 1, y2: yBottom }}
          transition={{ duration: 0.28, delay: 0.38 }}
        />

        {/* ========================================================= */}
        {/* OCT 24 POINT MARKERS */}
        {/* ========================================================= */}
        {/* Green intersection dot on velocity curve */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20, delay: 0.42 }}
          style={{ transformOrigin: `${oct24X}px ${greenOct24Y}px` }}
        >
          <circle cx={oct24X} cy={greenOct24Y} r="9" fill="#0E8759" fillOpacity="0.25" />
          <circle cx={oct24X} cy={greenOct24Y} r="6.5" fill="#0E8759" stroke="#FFFFFF" strokeWidth="2.5" />
        </motion.g>

        {/* Blue intersection dot on sessions baseline */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 600, damping: 20, delay: 0.46 }}
          style={{ transformOrigin: `${oct24X}px ${blueOct24Y}px` }}
        >
          <circle cx={oct24X} cy={blueOct24Y} r="8" fill="#2563EB" fillOpacity="0.25" />
          <circle cx={oct24X} cy={blueOct24Y} r="5.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
        </motion.g>

        {/* ========================================================= */}
        {/* FLOATING DARK ANOMALY TOOLTIP (SaaS Punchy Pop-in) */}
        {/* ========================================================= */}
        <motion.g
          id="anomaly-tooltip-card"
          onClick={onSelectAnomaly}
          className="cursor-pointer"
          initial={{ opacity: 0, y: -8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.45 }}
          style={{ transformOrigin: `${oct24X}px ${greenOct24Y - 45}px` }}
        >
          {/* Tooltip background card */}
          <rect
            x={oct24X - 130}
            y={greenOct24Y - 78}
            width="200"
            height="62"
            rx="10"
            fill="#101827"
            filter="url(#tooltipShadow)"
            stroke="#1F2937"
            strokeWidth="1"
          />

          {/* Header: Oct 24 • Anomaly Detected */}
          <text
            x={oct24X - 116}
            y={greenOct24Y - 60}
            fill="#F87171"
            className="font-mono text-[10.5px] font-bold tracking-tight"
          >
            Oct 24 • Anomaly Detected
          </text>

          {/* Red indicator dot */}
          <circle
            cx={oct24X - 112}
            cy={greenOct24Y - 44}
            r="3"
            fill="#EF4444"
          />

          {/* Rev Impact: -$14.2k Risk */}
          <text
            x={oct24X - 100}
            y={greenOct24Y - 40}
            fill="#FFFFFF"
            className="font-mono text-[11px] font-bold"
          >
            Rev Impact: <tspan fill="#F87171">-$14.2k</tspan>
          </text>

          {/* Footnote: Symptom visible, manual fix required */}
          <text
            x={oct24X - 116}
            y={greenOct24Y - 24}
            fill="#94A3B8"
            className="font-sans text-[9.5px]"
          >
            Symptom visible, manual fix required
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
};
