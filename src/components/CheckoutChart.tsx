import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ChartSeries, DataPoint, MilestoneMarker } from '../types';
import { MILESTONE_DOTS } from '../data/chartData';

interface CheckoutChartProps {
  data: DataPoint[];
  seriesList: ChartSeries[];
  activeSeries: Record<string, boolean>;
  hoveredSeries: string | null;
  onHoverPoint?: (point: DataPoint | null, xCoord: number, yCoord: number) => void;
  onSelectMilestone?: (milestone: MilestoneMarker) => void;
}

export const CheckoutChart: React.FC<CheckoutChartProps> = ({
  data,
  seriesList,
  activeSeries,
  hoveredSeries,
  onHoverPoint,
  onSelectMilestone,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneMarker | null>(null);

  // Layout Dimensions (matching exact proportions in compact hero layout)
  const svgWidth = 640;
  const svgHeight = 260;

  const xOrigin = 75; // Y-axis line X
  const xRight = 580; // Oct 31 X
  const xAxisEnd = 610; // X-axis line continues past Oct 31

  const yTopAxis = 20; // Y-axis line starts slightly above 100k
  const y100k = 35;
  const y0k = 220; // baseline X-axis
  const plotHeight = y0k - y100k; // 185px

  const stepX = (xRight - xOrigin) / (data.length - 1);

  // Helper to calculate X and Y coordinates
  const getX = (index: number) => xOrigin + index * stepX;
  const getY = (val: number) => y0k - (val / 100) * plotHeight;

  // Y-axis ticks
  const yTicks = [
    { label: '100k', value: 100, y: y100k },
    { label: '75k', value: 75, y: y0k - 0.75 * plotHeight },
    { label: '50k', value: 50, y: y0k - 0.5 * plotHeight },
    { label: '25k', value: 25, y: y0k - 0.25 * plotHeight },
    { label: '0k', value: 0, y: y0k },
  ];

  // Build SVG path string for a series
  const buildPath = (seriesId: string) => {
    return data.map((pt, i) => {
      const val = (pt as unknown as Record<string, number>)[seriesId] ?? 0;
      const x = getX(i);
      const y = getY(val);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  };

  // Mouse move handler for interactive crosshair & tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const svgX = clientX * scaleX;

    if (svgX < xOrigin - 20 || svgX > xRight + 25) {
      setHoveredPointIndex(null);
      if (onHoverPoint) onHoverPoint(null, 0, 0);
      return;
    }

    // Find nearest point
    const relativeX = Math.max(0, Math.min(xRight - xOrigin, svgX - xOrigin));
    const nearestIndex = Math.round(relativeX / stepX);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, nearestIndex));

    setHoveredPointIndex(clampedIndex);

    if (onHoverPoint) {
      const point = data[clampedIndex];
      const pointSvgX = getX(clampedIndex);
      // Average y of active series at this point
      const activeValues = seriesList
        .filter((s) => activeSeries[s.id] ?? true)
        .map((s) => (point as unknown as Record<string, number>)[s.id] ?? 0);
      const avgVal = activeValues.length > 0 ? activeValues.reduce((a, b) => a + b, 0) / activeValues.length : 50;
      onHoverPoint(point, pointSvgX, getY(avgVal));
    }
  };

  const handleMouseLeave = () => {
    setHoveredPointIndex(null);
    if (onHoverPoint) onHoverPoint(null, 0, 0);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ======================================================== */}
        {/* AXES LINES with smooth reveal animation */}
        {/* ======================================================== */}
        {/* Left Vertical Axis Line */}
        <motion.line
          id="y-axis-line"
          x1={xOrigin}
          y1={yTopAxis}
          x2={xOrigin}
          y2={y0k}
          stroke="#555E6D"
          strokeWidth="2.2"
          strokeLinecap="square"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Bottom Horizontal Axis Line */}
        <motion.line
          id="x-axis-line"
          x1={xOrigin}
          y1={y0k}
          x2={xAxisEnd}
          y2={y0k}
          stroke="#555E6D"
          strokeWidth="2.2"
          strokeLinecap="square"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        />

        {/* ======================================================== */}
        {/* Y-AXIS LABELS */}
        {/* ======================================================== */}
        {yTicks.map((tick, idx) => (
          <motion.text
            key={tick.label}
            x={xOrigin - 14}
            y={tick.y + 4.5}
            textAnchor="end"
            fill="#64748B"
            className="text-[13px] font-medium select-none"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + idx * 0.06 }}
          >
            {tick.label}
          </motion.text>
        ))}

        {/* ======================================================== */}
        {/* X-AXIS LABELS */}
        {/* ======================================================== */}
        {data.map((pt, i) => {
          if (!pt.isAxisTick || !pt.label) return null;
          const x = getX(i);
          return (
            <motion.text
              key={`x-label-${pt.id}`}
              x={x}
              y={y0k + 24}
              textAnchor="middle"
              fill="#64748B"
              className="text-[13px] font-medium select-none"
              initial={{ opacity: 0, y: y0k + 28 }}
              animate={{ opacity: 1, y: y0k + 24 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
            >
              {pt.label}
            </motion.text>
          );
        })}

        {/* ======================================================== */}
        {/* INTERACTIVE VERTICAL HOVER CROSSHAIR */}
        {/* ======================================================== */}
        {hoveredPointIndex !== null && (
          <g className="transition-opacity duration-150">
            <line
              x1={getX(hoveredPointIndex)}
              y1={yTopAxis}
              x2={getX(hoveredPointIndex)}
              y2={y0k}
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          </g>
        )}

        {/* ======================================================== */}
        {/* DATA SERIES PATHS - DRAWN WITH FLUID MOTION ANIMATIONS */}
        {/* ======================================================== */}
        {seriesList.map((series, sIdx) => {
          const isActive = activeSeries[series.id] ?? true;
          if (!isActive) return null;

          const isHovered = hoveredSeries === series.id;
          const isDimmed = hoveredSeries !== null && !isHovered;
          const pathD = buildPath(series.id);

          return (
            <g
              key={series.id}
              id={`series-group-${series.id}`}
              className="transition-opacity duration-200"
              style={{ opacity: isDimmed ? 0.2 : 1 }}
            >
              <motion.path
                id={`path-${series.id}`}
                d={pathD}
                fill="none"
                stroke={series.color}
                strokeWidth={isHovered ? series.strokeWidth + 1.2 : series.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={
                  series.lineStyle === 'dashed'
                    ? (series.dashArray || '8 5')
                    : series.lineStyle === 'dotted'
                    ? (series.dashArray || '2.5 5')
                    : undefined
                }
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: 1.3,
                    ease: [0.25, 1, 0.5, 1],
                    delay: 0.2 + sIdx * 0.12,
                  },
                  opacity: {
                    duration: 0.3,
                    delay: 0.2 + sIdx * 0.12,
                  },
                }}
              />
            </g>
          );
        })}

        {/* ======================================================== */}
        {/* SOLID BULLET DOTS (Exact matching points in image) */}
        {/* ======================================================== */}
        {MILESTONE_DOTS.map((m, mIdx) => {
          const series = seriesList.find((s) => s.id === m.seriesId);
          if (!series || activeSeries[series.id] === false) return null;

          const cx = getX(m.pointIndex);
          const cy = getY(m.value);
          const isHovered = hoveredPointIndex === m.pointIndex;

          return (
            <motion.g
              key={`dot-${m.seriesId}-${m.pointIndex}`}
              id={`milestone-dot-${m.seriesId}-${m.pointIndex}`}
              className="cursor-pointer group"
              onClick={() => {
                setActiveMilestone(m);
                if (onSelectMilestone) onSelectMilestone(m);
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 20,
                delay: 0.8 + mIdx * 0.15,
              }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              {/* Outer hover ring */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 11 : 8}
                fill={series.color}
                fillOpacity={isHovered ? 0.25 : 0}
                className="transition-all duration-200"
              />
              {/* Main solid filled dot (exact r=6.5 in original) */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 7.5 : 6.5}
                fill={series.color}
                className="transition-all duration-150 shadow-sm"
              />
            </motion.g>
          );
        })}

        {/* ======================================================== */}
        {/* HOVER INDICATOR DOTS ACROSS ALL ACTIVE SERIES */}
        {/* ======================================================== */}
        {hoveredPointIndex !== null &&
          seriesList.map((series) => {
            const isActive = activeSeries[series.id] ?? true;
            if (!isActive) return null;

            const pt = data[hoveredPointIndex];
            const val = (pt as unknown as Record<string, number>)[series.id] ?? 0;
            const cx = getX(hoveredPointIndex);
            const cy = getY(val);

            // Don't duplicate the existing milestone dots if identical
            const isMilestone = MILESTONE_DOTS.some(
              (m) => m.pointIndex === hoveredPointIndex && m.seriesId === series.id
            );
            if (isMilestone) return null;

            return (
              <circle
                key={`hover-indicator-${series.id}`}
                cx={cx}
                cy={cy}
                r="4.5"
                fill="#ffffff"
                stroke={series.color}
                strokeWidth="2.5"
                className="pointer-events-none"
              />
            );
          })}
      </svg>

      {/* Floating Milestone Popover if clicked */}
      {activeMilestone && (
        <div
          id="milestone-card"
          className="absolute top-2 right-2 bg-slate-900 text-white rounded-xl px-3.5 py-2.5 shadow-xl text-xs font-mono max-w-xs border border-slate-700/80 animate-in fade-in zoom-in-95 duration-150 z-20"
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-emerald-400">
              {seriesList.find((s) => s.id === activeMilestone.seriesId)?.name}
            </span>
            <button
              onClick={() => setActiveMilestone(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-slate-200 font-semibold mb-0.5">
            Value: {activeMilestone.label}
          </div>
          {activeMilestone.note && (
            <div className="text-[11px] text-slate-300 font-sans leading-tight">
              {activeMilestone.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
