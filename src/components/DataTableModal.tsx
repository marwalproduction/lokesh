import React from 'react';
import { ChartSeries, DataPoint } from '../types';

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DataPoint[];
  seriesList: ChartSeries[];
}

export const DataTableModal: React.FC<DataTableModalProps> = ({
  isOpen,
  onClose,
  data,
  seriesList,
}) => {
  if (!isOpen) return null;

  const copyAsJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const copyAsCsv = () => {
    const headers = ['Date', 'Tick', ...seriesList.map((s) => s.name)];
    const rows = data.map((d) => [
      d.fullDate,
      d.label || '-',
      ...seriesList.map((s) => ((d as unknown as Record<string, number>)[s.id] ?? 0).toFixed(1)),
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    navigator.clipboard.writeText(csvContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Checkout Velocity Dataset
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              9 data points across 6 tracked telemetry series
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyAsCsv}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Copy CSV
            </button>
            <button
              onClick={copyAsJson}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Copy JSON
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-x-auto max-h-[60vh]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="pb-2.5 pr-4">Date</th>
                <th className="pb-2.5 pr-4">Axis</th>
                {seriesList.map((s) => (
                  <th key={s.id} className="pb-2.5 px-3 text-right" style={{ color: s.color }}>
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((pt) => (
                <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-slate-800">{pt.fullDate}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{pt.label || '—'}</td>
                  {seriesList.map((s) => {
                    const val = (pt as unknown as Record<string, number>)[s.id];
                    return (
                      <td key={s.id} className="py-2.5 px-3 text-right font-medium text-slate-700">
                        {val !== undefined ? `${val.toFixed(1)}k` : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
