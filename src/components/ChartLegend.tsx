import React from 'react';
import { ChartSeries } from '../types';

interface ChartLegendProps {
  seriesList: ChartSeries[];
  activeSeries: Record<string, boolean>;
  hoveredSeries: string | null;
  onToggleSeries: (seriesId: string) => void;
  onHoverSeries: (seriesId: string | null) => void;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  seriesList,
  activeSeries,
  hoveredSeries,
  onToggleSeries,
  onHoverSeries,
}) => {
  // 6 series arranged in 2 rows of 3 columns
  // Row 1: Checkout Rev ($), Gross Sessions, Token Errors
  // Row 2: Conv. Rate (%), Stripe iOS API, Abandonments
  const row1 = [
    seriesList.find((s) => s.id === 'checkoutRev')!,
    seriesList.find((s) => s.id === 'grossSessions')!,
    seriesList.find((s) => s.id === 'tokenErrors')!,
  ].filter(Boolean);

  const row2 = [
    seriesList.find((s) => s.id === 'convRate')!,
    seriesList.find((s) => s.id === 'stripeIosApi')!,
    seriesList.find((s) => s.id === 'abandonments')!,
  ].filter(Boolean);

  const renderLegendItem = (series: ChartSeries) => {
    const isActive = activeSeries[series.id] ?? true;
    const isHovered = hoveredSeries === series.id;

    return (
      <button
        key={series.id}
        id={`legend-btn-${series.id}`}
        type="button"
        onClick={() => onToggleSeries(series.id)}
        onMouseEnter={() => onHoverSeries(series.id)}
        onMouseLeave={() => onHoverSeries(null)}
        className={`flex items-center gap-2.5 transition-all duration-150 select-none group text-left cursor-pointer focus:outline-none ${
          !isActive ? 'opacity-35 grayscale' : isHovered ? 'opacity-100 scale-102' : 'opacity-100'
        }`}
        title={`Click to ${isActive ? 'hide' : 'show'} ${series.name}`}
      >
        {/* Exact Line Swatch */}
        <span
          className="inline-block shrink-0 rounded-full transition-all"
          style={{
            width: '20px',
            height: '3.5px',
            backgroundColor: series.color,
          }}
        />

        {/* Monospace exact label */}
        <span
          className="font-mono text-[12.5px] sm:text-[13px] font-semibold tracking-tight whitespace-nowrap"
          style={{ color: series.textColor }}
        >
          {series.name}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full mb-8 sm:mb-10">
      {/* 3 columns grid with left alignment matching the chart canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 sm:gap-y-4 gap-x-6 md:gap-x-10 max-w-2xl">
        {/* Row 1 items */}
        {row1.map(renderLegendItem)}

        {/* Row 2 items */}
        {row2.map(renderLegendItem)}
      </div>
    </div>
  );
};
