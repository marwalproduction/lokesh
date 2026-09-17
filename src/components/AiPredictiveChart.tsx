import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  RefreshCw, 
  ArrowRight
} from 'lucide-react';
import { ViewfinderFrame } from './HollowFrame';

interface AiPredictiveChartProps {
  onDeployHotfix?: () => void;
  isDeployed?: boolean;
  spotlightPhase?: 'metrics_graph' | 'button' | null;
}

export const AiPredictiveChart: React.FC<AiPredictiveChartProps> = ({
  onDeployHotfix,
  isDeployed: externalDeployed,
  spotlightPhase = null,
}) => {
  const [internalDeployed, setInternalDeployed] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const isDeployed = externalDeployed !== undefined ? externalDeployed : internalDeployed;

  // ViewBox: Compact 560 x 200 SVG for balanced hero scale
  const svgWidth = 560;
  const svgHeight = 200;

  const xLeft = 52;
  const xMid = 310;
  const xRight = 530;

  const yMax = 30;
  const yBottom = 160;

  // Clean horizontal grid levels: 150k, 100k, 50k
  const gridLevels = [
    { label: '$150k', y: 35 },
    { label: '$100k', y: 80 },
    { label: '$50k', y: 125 },
    { label: '$0', y: 160 },
  ];

  // X dates
  const xLabels = [
    { label: 'Oct 01', x: 52 },
    { label: 'Oct 08', x: 138 },
    { label: 'Oct 16', x: 224 },
    { label: 'Oct 24', x: 310 },
    { label: 'Oct 28', x: 420 },
    { label: 'Oct 31', x: 520 },
  ];

  // 1) Secondary Line: Gross Sessions (Soft Slate/Blue dashed)
  // Shows continuous background telemetry across the entire timeline
  const grossSessionsPath = `
    M ${xLeft},145
    C 100,140 140,132 180,118
    C 230,100 270,92 310,88
    C 360,84 420,78 470,72
    L ${xRight},68
  `;

  // 2) Primary Line: Checkout Revenue ($)
  // Part A: Historical baseline leading up to Oct 24
  const revenueHistoryPath = `
    M ${xLeft},135
    C 100,128 140,110 180,88
    C 220,68 265,58 310,54
  `;

  // Part B (Dropped): Predicted unresolved drop trajectory
  const droppedTrajectoryPath = `
    M 310,54
    C 340,60 375,98 415,124
    C 450,142 490,148 530,150
  `;

  const droppedAreaPath = `
    M 310,54
    C 340,60 375,98 415,124
    C 450,142 490,148 530,150
    L 530,${yBottom}
    L 310,${yBottom}
    Z
  `;

  // Part C (Recovered): When hotfix is deployed
  const recoveredTrajectoryPath = `
    M 310,54
    C 335,60 365,66 400,62
    C 440,56 480,48 530,46
  `;

  const recoveredAreaPath = `
    M 310,54
    C 335,60 365,66 400,62
    C 440,56 480,48 530,46
    L 530,${yBottom}
    L 310,${yBottom}
    Z
  `;

  const handleTriggerHotfix = () => {
    if (isDeploying || isDeployed) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setInternalDeployed(true);
      if (onDeployHotfix) onDeployHotfix();
    }, 700);
  };

  return (
    <div className="flex flex-col w-full text-slate-800">
      
      {/* 1 & 2: METRICS & PREDICTIVE CHART CONTAINER */}
      <div
        className={`relative transition-all duration-500 rounded-2xl ${
          spotlightPhase === 'metrics_graph'
            ? 'z-30 scale-[1.03] shadow-lg ring-1 ring-emerald-500/40 bg-white'
            : spotlightPhase === 'button'
            ? 'grayscale opacity-30 blur-[0.5px]'
            : 'scale-100 opacity-100'
        }`}
      >
        <ViewfinderFrame themeColor="emerald" isActive={spotlightPhase === 'metrics_graph'} />

        {/* 1. TOP METRIC BANNER (Human-crafted Stripe / Linear style) */}
        <div className="w-full bg-[#FAFAFA] border border-slate-200/90 rounded-[14px] p-2.5 sm:p-3 mb-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 sm:divide-x sm:divide-slate-200 items-center">
            
            {/* Metric 1: Baseline */}
            <div className="flex items-center gap-2.5 px-2 sm:px-3">
              <span className="w-2 h-2 rounded-full bg-slate-800 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-medium tracking-normal text-slate-500">
                  Oct Velocity
                </span>
                <span className="text-[16px] sm:text-[17px] font-semibold text-slate-900 tracking-tight">
                  $128,430
                </span>
              </div>
            </div>

            {/* Metric 2: Impact / Resolution */}
            <div className="flex items-center gap-2.5 px-2 sm:px-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isDeployed ? 'bg-emerald-600' : 'bg-red-500'}`} />
              <div className="flex flex-col">
                <span className="text-[11px] font-medium tracking-normal text-slate-500">
                  {isDeployed ? 'Remediation' : 'Predicted Risk'}
                </span>
                <span className={`text-[16px] sm:text-[17px] font-semibold tracking-tight ${
                  isDeployed ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  {isDeployed ? '+$14.2k Saved' : '-$14.2k at risk'}
                </span>
              </div>
            </div>

            {/* Metric 3: System Health */}
            <div className="flex items-center gap-2.5 px-2 sm:px-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isDeployed ? 'bg-emerald-600' : 'bg-amber-500'}`} />
              <div className="flex flex-col">
                <span className="text-[11px] font-medium tracking-normal text-slate-500">
                  Conversion Rate
                </span>
                <span className="text-[16px] sm:text-[17px] font-semibold text-slate-900 tracking-tight">
                  {isDeployed ? '99.8% nominal' : '29.8% projected'}
                </span>
              </div>
            </div>

          </div>
        </div>

      {/* 2. CHART CANVAS (Standardized Clean SVG matching Reference 1 & 2) */}
      <div className="w-full bg-white border border-slate-200/90 rounded-[20px] p-3 sm:p-4 mb-4 relative select-none">
        
        {/* Subtle Legend Bar */}
        <div className="flex items-center justify-between gap-2 mb-2 px-1 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#0E8759] rounded-full" />
              <span className="text-slate-600 text-[11.5px] font-medium">Checkout Rev ($)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-400 rounded-full border-b border-dashed" />
              <span className="text-slate-500 text-[11.5px] font-medium">Gross Sessions</span>
            </div>
          </div>

          <span className="text-slate-400 text-[11px] font-mono">
            {isDeployed ? 'Hotfix Applied' : 'T-18m Token Anomaly'}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Green Area Gradient */}
            <linearGradient id="aiGreenFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E8759" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#0E8759" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0E8759" stopOpacity="0.0" />
            </linearGradient>

            {/* Red Area Gradient */}
            <linearGradient id="aiRedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.16" />
              <stop offset="70%" stopColor="#DC2626" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Dashed Grid Lines & Labels */}
          {gridLevels.map((lvl, idx) => (
            <g key={`grid-ai-${idx}`}>
              <text
                x={xLeft - 10}
                y={lvl.y + 4}
                textAnchor="end"
                fill="#94A3B8"
                className="text-[11.5px] font-medium"
              >
                {lvl.label}
              </text>
              <line
                x1={xLeft}
                y1={lvl.y}
                x2={xRight}
                y2={lvl.y}
                stroke="#F1F5F9"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            </g>
          ))}

          {/* Bottom X Baseline */}
          <line
            x1={xLeft}
            y1={yBottom}
            x2={xRight}
            y2={yBottom}
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />

          {/* Secondary Line: Gross Sessions (continuous dashed line) */}
          <path
            d={grossSessionsPath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2.2"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />

          {/* Primary Revenue Line: Historical Baseline up to Oct 24 */}
          <path
            d={revenueHistoryPath}
            fill="none"
            stroke="#0E8759"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Trajectory After Oct 24: Unresolved Drop vs Remediated Recovery */}
          {!isDeployed ? (
            <g id="dropped-trajectory-group">
              {/* Soft red area under dropped line */}
              <path
                d={droppedAreaPath}
                fill="url(#aiRedFill)"
              />
              {/* Dropping dashed red curve */}
              <motion.path
                d={droppedTrajectoryPath}
                fill="none"
                stroke="#DC2626"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="5 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Floating Pill Badge for Dropped state */}
              <g transform="translate(370, 102)">
                <rect
                  x="0"
                  y="0"
                  width="135"
                  height="26"
                  rx="13"
                  fill="#FFFFFF"
                  stroke="#FCA5A5"
                  strokeWidth="1"
                  className="shadow-sm"
                />
                <circle cx="14" cy="13" r="3.5" fill="#DC2626" />
                <text
                  x="24"
                  y="17"
                  fill="#DC2626"
                  className="text-[11.5px] font-semibold tracking-tight"
                >
                  -$14.2k Risk
                </text>
              </g>
            </g>
          ) : (
            <g id="recovered-trajectory-group">
              {/* Soft green area under recovered line */}
              <path
                d={recoveredAreaPath}
                fill="url(#aiGreenFill)"
              />
              {/* Smooth recovered green curve */}
              <motion.path
                d={recoveredTrajectoryPath}
                fill="none"
                stroke="#0E8759"
                strokeWidth="3.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Floating Pill Badge for Recovered state */}
              <g transform="translate(370, 36)">
                <rect
                  x="0"
                  y="0"
                  width="145"
                  height="26"
                  rx="13"
                  fill="#FFFFFF"
                  stroke="#86EFAC"
                  strokeWidth="1"
                  className="shadow-sm"
                />
                <circle cx="14" cy="13" r="3.5" fill="#16A34A" />
                <text
                  x="24"
                  y="17"
                  fill="#15803D"
                  className="text-[11.5px] font-semibold tracking-tight"
                >
                  99.8% Remediated
                </text>
              </g>
            </g>
          )}

          {/* Oct 24 Vertical Anomaly Divider Marker */}
          <line
            x1={xMid}
            y1={yMax}
            x2={xMid}
            y2={yBottom}
            stroke={isDeployed ? '#10B981' : '#EF4444'}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Point indicator on Oct 24 intersection */}
          <circle
            cx={xMid}
            cy="54"
            r="5"
            fill="#FFFFFF"
            stroke={isDeployed ? '#0E8759' : '#DC2626'}
            strokeWidth="2.5"
          />

          {/* X-Axis Date Labels */}
          {xLabels.map((item) => (
            <text
              key={item.label}
              x={item.x}
              y={yBottom + 20}
              textAnchor="middle"
              fill={item.label === 'Oct 24' ? (isDeployed ? '#0E8759' : '#DC2626') : '#64748B'}
              className={`text-[11.5px] ${item.label === 'Oct 24' ? 'font-bold' : 'font-medium'}`}
            >
              {item.label}
            </text>
          ))}
        </svg>
      </div>
      </div>

      {/* 3. SINGLE CLEAN ACTION BUTTON: Deploy Automated Hotfix Now */}
      <div
        className={`w-full relative transition-all duration-500 rounded-xl ${
          spotlightPhase === 'button'
            ? 'z-30 scale-[1.05] shadow-xl'
            : spotlightPhase === 'metrics_graph'
            ? 'grayscale opacity-30 blur-[0.5px]'
            : 'scale-100 opacity-100'
        }`}
      >
        <ViewfinderFrame themeColor="emerald" isActive={spotlightPhase === 'button'} />

        <button
          id="deploy-hotfix-cta-btn"
          type="button"
          onClick={handleTriggerHotfix}
          disabled={isDeploying || isDeployed}
          className={`w-full py-3 px-4 rounded-xl font-medium text-[13.5px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
            isDeployed
              ? 'bg-emerald-700 text-white cursor-default'
              : isDeploying
              ? 'bg-slate-800 text-slate-300 cursor-wait'
              : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white'
          }`}
        >
          {isDeploying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Deploying automated hotfix...</span>
            </>
          ) : isDeployed ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Automated Hotfix Active (Revenue Restored)</span>
            </>
          ) : (
            <>
              <span>Deploy Automated Hotfix Now</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
