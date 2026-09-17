export interface DataPoint {
  id: string;
  index: number;
  label: string; // e.g. "Oct 01" or empty if intermediate
  fullDate: string;
  isAxisTick: boolean;
  stripeIosApi: number; // in thousands (k)
  checkoutRev: number;
  grossSessions: number;
  tokenErrors: number;
  abandonments: number;
  convRate?: number;
}

export interface ChartSeries {
  id: string;
  name: string;
  color: string;
  textColor: string;
  strokeWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  dashArray?: string;
  dotPoints?: number[]; // indices of points that have solid bullet circles
  unit?: string;
}

export interface MilestoneMarker {
  pointIndex: number;
  seriesId: string;
  label: string;
  value: number;
  note?: string;
}
