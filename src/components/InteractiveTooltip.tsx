import React from 'react';
import { ChartSeries, DataPoint } from '../types';

interface InteractiveTooltipProps {
  point: DataPoint | null;
  seriesList: ChartSeries[];
  activeSeries: Record<string, boolean>;
  position: { x: number; y: number } | null;
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  point,
  seriesList,
  activeSeries,
  position,
}) => {
  if (!point || !position) return null;

  return (
    <div
      id="chart-floating-tooltip"
      className="pointer-events-none absolute z-30 transition-all duration-75 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${Math.max(10, position.y - 120)}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-xl p-3 min-w-[210px] text-xs font-mono">
        {/* Header date */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <span className="font-semibold text-slate-800 text-[13px]">
            {point.fullDate || point.label || `Point ${point.index + 1}`}
          </span>
          {point.label && (
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {point.label}
            </span>
          )}
        </div>

        {/* Metrics values list */}
        <div className="space-y-1.5">
          {seriesList.map((series) => {
            const isActive = activeSeries[series.id] ?? true;
            if (!isActive) return null;

            const val = (point as unknown as Record<string, number>)[series.id];
            if (val === undefined) return null;

            return (
              <div
                key={`tt-${series.id}`}
                className="flex items-center justify-between gap-3 text-slate-700"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: series.color }}
                  />
                  <span className="truncate text-[11px] font-medium">
                    {series.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {val.toFixed(1)}k
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
