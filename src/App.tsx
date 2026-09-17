import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHART_DATA, SERIES_LIST } from './data/chartData';
import { ChartLegend } from './components/ChartLegend';
import { CheckoutChart } from './components/CheckoutChart';
import { MetricBanner } from './components/MetricBanner';
import { ModernChart } from './components/ModernChart';
import { TimeframePill } from './components/TimeframePill';
import { AiPredictiveChart } from './components/AiPredictiveChart';
import { AnimatedCursor } from './components/AnimatedCursor';
import { DataTableModal } from './components/DataTableModal';
import { FramerExportModal } from './components/FramerExportModal';
import { HollowFrame, SpotlightConfig, ViewfinderFrame } from './components/HollowFrame';
import {
  Play,
  RotateCcw,
  Table,
  Sparkles,
  CheckCircle2,
  Zap,
  Bot,
  ArrowRight,
  Layers,
  Download,
} from 'lucide-react';

export type RedesignVersion = 'v1_basic' | 'v2_modern' | 'v3_ai';

export default function App() {
  // Current active UI Version (1: Basic, 2: Modern, 3: AI-Powered Autonomous)
  const [activeVersion, setActiveVersion] = useState<RedesignVersion>('v3_ai');
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [statusMessage, setStatusMessage] = useState('v3 Autonomous AI: Predictive telemetry & 1-click remediation');
  
  // Hollow Frame Spotlight Focus State (Zooms in on cropped section, b&w rest of UI)
  const [spotlightTarget, setSpotlightTarget] = useState<
    | 'v1_legend'
    | 'v1_graph'
    | 'v2_metrics'
    | 'v2_graph'
    | 'v2_all'
    | 'v2_metrics_graph'
    | 'v3_metrics_graph'
    | 'v3_button'
    | null
  >(null);
  const [spotlightConfig, setSpotlightConfig] = useState<SpotlightConfig | null>(null);

  // Sub-redesign states for V2 fine-grained demo
  const [isHeaderRedesigned, setIsHeaderRedesigned] = useState(true);
  const [isLegendRedesigned, setIsLegendRedesigned] = useState(true);
  const [isChartRedesigned, setIsChartRedesigned] = useState(true);

  // Hotfix deployment state in V3
  const [isHotfixDeployed, setIsHotfixDeployed] = useState(false);

  // Animated cursor state
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 150 });
  const [isCursorClicking, setIsCursorClicking] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('AI Designer');

  // Interactive controls
  const [showDataTable, setShowDataTable] = useState(false);
  const [showFramerModal, setShowFramerModal] = useState(false);
  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>({
    checkoutRev: true,
    grossSessions: true,
    tokenErrors: true,
    convRate: false,
    stripeIosApi: true,
    abandonments: true,
  });
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  // References
  const cardRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const hotfixBtnRef = useRef<HTMLDivElement | null>(null);
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  };

  const scheduleTimeout = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutIds.current.push(id);
    return id;
  };

  // Switch versions directly without intermediary transition screens
  const handleSelectVersion = (targetVersion: RedesignVersion) => {
    if (targetVersion === activeVersion) return;
    clearAllTimeouts();
    setIsPlayingDemo(false);
    setIsCursorVisible(false);
    setSpotlightTarget(null);
    setSpotlightConfig(null);

    setActiveVersion(targetVersion);
    if (targetVersion === 'v1_basic') {
      setIsHeaderRedesigned(false);
      setIsLegendRedesigned(false);
      setIsChartRedesigned(false);
      setStatusMessage('v1 Raw Telemetry: 6-line unaggregated graph');
    } else if (targetVersion === 'v2_modern') {
      setIsHeaderRedesigned(true);
      setIsLegendRedesigned(true);
      setIsChartRedesigned(true);
      setStatusMessage('v2 Modern: Clean Bézier revenue curves & anomaly banner');
    } else {
      setIsHeaderRedesigned(true);
      setIsLegendRedesigned(true);
      setIsChartRedesigned(true);
      setIsHotfixDeployed(false);
      setStatusMessage('v3 Autonomous AI: Predictive trajectory with 1-click automated hotfix');
    }
  };

  // Full animated SaaS showreel transition:
  // 1. Highlight the graph with text: "This is an old graph."
  // 2. Change the graph on the SAME screen.
  // 3. After 1-1.5s, highlight the six legends: "These six legends take too much space. Utilizing this space..."
  // 4. In that exact space, insert the three new screen UI markers.
  // 5. Review completed Screen 2: "The UI is improved, but still lacks automated resolution."
  // 6. Transition to Screen 3: Autonomous AI & 1-Click Hotfix execution.
  const startFullEvolutionAnimation = () => {
    clearAllTimeouts();
    setIsPlayingDemo(true);
    setIsCursorVisible(false);
    setIsHotfixDeployed(false);
    setSpotlightTarget(null);
    setSpotlightConfig(null);

    // ==========================================
    // Initial: Establish Screen 1 (Raw Telemetry)
    // ==========================================
    setActiveVersion('v1_basic');
    setIsHeaderRedesigned(false);
    setIsLegendRedesigned(false);
    setIsChartRedesigned(false);
    setStatusMessage('1/3 Raw Telemetry: Old dashboard with 6 unaggregated streams...');

    // ==========================================
    // Step 1: Highlight the graph and the text: "This is an old graph."
    // ==========================================
    scheduleTimeout(() => {
      setSpotlightTarget('v1_graph');
      setSpotlightConfig({
        id: 'v1_graph',
        titleText: 'This is an old graph.',
        highlightKeyword: 'old graph.',
        themeColor: 'amber',
        placement: 'top',
      });
      setStatusMessage('Step 1: Graph isolated — This is an old graph.');
    }, 2400);

    // ==========================================
    // Step 2: Change the graph on the SAME screen!
    // ==========================================
    scheduleTimeout(() => {
      setIsChartRedesigned(true);
      setSpotlightTarget('v2_graph');
      setSpotlightConfig({
        id: 'v2_graph',
        titleText: 'Graph redesigned into a smooth aggregated curve.',
        highlightKeyword: 'aggregated curve.',
        themeColor: 'blue',
        placement: 'top',
      });
      setStatusMessage('Step 2: Old graph converted to clean aggregated curve on the same screen.');
    }, 5600);

    // ==========================================
    // Step 3: After 1 to 1.5 seconds, highlight the six legends section
    // ("These six legends take too much space. Utilizing this space...")
    // ==========================================
    scheduleTimeout(() => {
      setSpotlightTarget('v1_legend');
      setSpotlightConfig({
        id: 'v1_legend',
        titleText: 'These six legends take too much space. Utilizing this space...',
        highlightKeyword: 'take too much space.',
        themeColor: 'amber',
        placement: 'bottom',
      });
      setStatusMessage('Step 3: Six legends highlighted — Taking too much space...');
    }, 7200);

    // ==========================================
    // Step 4: Show that text, and then insert the three new screen UI markers!
    // ==========================================
    scheduleTimeout(() => {
      setIsLegendRedesigned(true);
      setIsHeaderRedesigned(true);
      setActiveVersion('v2_modern');
      setSpotlightTarget('v2_metrics');
      setSpotlightConfig({
        id: 'v2_metrics',
        titleText: 'Utilizing this space: Converted into 3 core data highlights.',
        highlightKeyword: '3 core data highlights.',
        themeColor: 'blue',
        placement: 'bottom',
      });
      setStatusMessage('Step 4: Space utilized — 3 core data highlight cards inserted in-place.');
    }, 10200);

    // ==========================================
    // Step 5: Review completed Screen 2 with Product Lead cursor inspecting anomaly
    // ==========================================
    scheduleTimeout(() => {
      setSpotlightTarget('v2_all');
      setSpotlightConfig({
        id: 'v2_actionable',
        titleText: "The UI is improved, but still lacks automated resolution.",
        highlightKeyword: "lacks automated resolution.",
        themeColor: 'blue',
        placement: 'bottom',
      });
      setStatusMessage("Screen 2: Reviewing anomaly — still lacks automated remediation");
      setIsCursorVisible(true);
      setCursorLabel('Product Lead');
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setCursorPos({ x: rect.left + rect.width * 0.64, y: rect.top + rect.height * 0.54 });
      }
    }, 14200);

    // ==========================================
    // Step 6: Transition to Screen 3: Autonomous AI (v3)
    // ==========================================
    scheduleTimeout(() => {
      setSpotlightTarget(null);
      setSpotlightConfig(null);
      setIsCursorVisible(false);
      setActiveVersion('v3_ai');
      setIsHotfixDeployed(false);
      setStatusMessage('3/3 AI Autonomous Remediation: Predicting edge failure before customer impact...');
    }, 18800);

    // Step 6A: Predictive drop trajectory isolated
    scheduleTimeout(() => {
      setSpotlightTarget('v3_metrics_graph');
      setSpotlightConfig({
        id: 'v3_predictive',
        titleText: 'October velocity and conversion drop predicted before impact.',
        highlightKeyword: 'before impact.',
        themeColor: 'emerald',
        placement: 'top',
      });
      setStatusMessage('Screen 3: October velocity & projected conversion dip isolated...');
    }, 19800);

    // Step 6B: 1-Click Hotfix Button isolated
    scheduleTimeout(() => {
      setSpotlightTarget('v3_button');
      setSpotlightConfig({
        id: 'v3_hotfix',
        titleText: 'Zero-downtime hotfix ready • 1-click remediation compiled.',
        highlightKeyword: '1-click remediation compiled.',
        themeColor: 'emerald',
        placement: 'top',
      });
      setStatusMessage('1-Click Hotfix Ready: Moving cursor to execute autonomous remediation...');
      setIsCursorVisible(true);
      setCursorLabel('AI Engine');
      const hotfixBtn = document.getElementById('deploy-hotfix-cta-btn');
      if (hotfixBtn) {
        const rect = hotfixBtn.getBoundingClientRect();
        setCursorPos({ x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 });
      }
    }, 24200);

    // Cursor clicks button
    scheduleTimeout(() => {
      setIsCursorClicking(true);
      setStatusMessage('⚡ Executing Zero-Downtime Hotfix...');
    }, 26400);

    scheduleTimeout(() => {
      setIsCursorClicking(false);
      const hotfixBtn = document.getElementById('deploy-hotfix-cta-btn');
      if (hotfixBtn) {
        hotfixBtn.click();
      }
    }, 26700);

    // ==========================================
    // Resolution & Completion
    // ==========================================
    scheduleTimeout(() => {
      setSpotlightTarget(null);
      setSpotlightConfig(null);
      setCursorPos({ x: window.innerWidth * 0.88, y: window.innerHeight * 0.85 });
      setStatusMessage('✨ Autonomous Remediation Verified • Incident Resolved at 99.8% Recovery');
    }, 28800);

    scheduleTimeout(() => {
      setIsCursorVisible(false);
      setIsPlayingDemo(false);
    }, 31500);
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden flex flex-col justify-center">
      {/* Animated Designer Cursor */}
      <AnimatedCursor
        x={cursorPos.x}
        y={cursorPos.y}
        isClicking={isCursorClicking}
        isVisible={isCursorVisible}
        label={cursorLabel}
      />

      {/* Hero Section Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT / HERO VISUAL CARD (Scaled down to fit elegantly alongside text) */}
          <div className="lg:col-span-6 flex flex-col items-center w-full">
            {/* Main Canvas Card Container (Scaled compact for Hero Section) */}
            <main
              ref={cardRef}
              id="exact-ui-card"
              className={`w-full max-w-[580px] bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-4 sm:p-5 transition-all relative overflow-visible will-change-transform border border-slate-200/90`}
            >
              <AnimatePresence mode="wait">
                {/* VERSION 3: AI-POWERED AUTONOMOUS INCIDENT & REMEDIATION */}
                {activeVersion === 'v3_ai' ? (
                  <motion.div
                    key="ui-version-3-ai"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col select-none"
                  >
                    {/* Header */}
                    <div
                      ref={headerRef}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 transition-all duration-500 ${
                        spotlightTarget ? 'grayscale opacity-25 blur-[0.5px]' : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h1 className="text-left text-[19px] sm:text-[22px] font-bold text-slate-900 tracking-tight">
                            Checkout Revenue Velocity & Conversion
                          </h1>
                        </div>
                        <p className="mt-0.5 text-[12px] text-slate-500 font-normal">
                          Predictive incident mitigation & zero-downtime automated hotfix
                        </p>
                      </div>

                      {/* Period indicator */}
                      <div className="self-start sm:self-auto shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
                          <span>This Month</span>
                          <span className="text-slate-400">▾</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Predictive Incident Visualizer & Autonomous Hotfix */}
                    <AiPredictiveChart
                      isDeployed={isHotfixDeployed}
                      onDeployHotfix={() => setIsHotfixDeployed(true)}
                      spotlightPhase={
                        spotlightTarget === 'v3_metrics_graph'
                          ? 'metrics_graph'
                          : spotlightTarget === 'v3_button'
                          ? 'button'
                          : null
                      }
                    />
                  </motion.div>
                ) : (
                  /* UNIFIED SCREEN 1 & 2: IN-PLACE MORPHING ON THE SAME SCREEN */
                  <motion.div
                    key="ui-version-unified"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col select-none"
                  >
                    {/* Header */}
                    <div
                      ref={headerRef}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 transition-all duration-500 ${
                        spotlightTarget === 'v1_legend' ||
                        spotlightTarget === 'v1_graph' ||
                        spotlightTarget === 'v2_metrics' ||
                        spotlightTarget === 'v2_graph' ||
                        spotlightTarget === 'v2_all'
                          ? 'grayscale opacity-25 blur-[0.5px]'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <h1 className="text-left text-[19px] sm:text-[22px] font-bold text-slate-900 tracking-tight">
                          Checkout Revenue Velocity & Conversion
                        </h1>
                        <p className="mt-0.5 text-[12px] text-slate-500 font-normal transition-all duration-300">
                          {isHeaderRedesigned
                            ? 'Aggregated metrics and multi-currency velocity'
                            : 'Raw multi-variable event streams (Unfiltered)'}
                        </p>
                      </div>
                      {isHeaderRedesigned ? (
                        <TimeframePill />
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
                          <span>This Month</span>
                          <span className="text-slate-400">▾</span>
                        </div>
                      )}
                    </div>

                    {/* Upper Section: 6 Legends vs 3 Data Metrics Banner */}
                    <div className="relative mb-3">
                      <AnimatePresence mode="wait">
                        {!isLegendRedesigned ? (
                          <motion.div
                            key="legend-markers"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className={`relative transition-all duration-500 rounded-xl ${
                              spotlightTarget === 'v1_legend'
                                ? 'z-30 scale-[1.03] bg-white shadow-xl ring-2 ring-amber-400/60 p-1.5'
                                : spotlightTarget === 'v1_graph' || spotlightTarget === 'v2_graph'
                                ? 'grayscale opacity-25 blur-[0.5px]'
                                : 'scale-100'
                            }`}
                          >
                            <ViewfinderFrame themeColor="amber" isActive={spotlightTarget === 'v1_legend'} />
                            <ChartLegend
                              seriesList={SERIES_LIST}
                              activeSeries={activeSeries}
                              hoveredSeries={hoveredSeries}
                              onToggleSeries={(id) =>
                                setActiveSeries((prev) => ({ ...prev, [id]: !prev[id] }))
                              }
                              onHoverSeries={setHoveredSeries}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="metrics-banner"
                            initial={{ opacity: 0, scale: 0.98, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 4 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className={`relative transition-all duration-500 rounded-2xl ${
                              spotlightTarget === 'v2_metrics'
                                ? 'z-30 scale-[1.03] bg-white shadow-2xl ring-2 ring-blue-500/50 p-1'
                                : spotlightTarget === 'v1_graph' || spotlightTarget === 'v2_graph'
                                ? 'grayscale opacity-25 blur-[0.5px]'
                                : spotlightTarget === 'v2_all'
                                ? 'z-30 scale-[1.01] bg-white shadow-md p-0.5'
                                : 'scale-100'
                            }`}
                          >
                            <ViewfinderFrame themeColor="blue" isActive={spotlightTarget === 'v2_metrics'} />
                            <MetricBanner
                              octVelocity="$128,430"
                              oct24Drop="-$14.2k Risk"
                              convBaseline="98.4% Normal"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Lower Section: Raw 6-Line Chart vs Modern Aggregated Bézier Chart */}
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        {!isChartRedesigned ? (
                          <motion.div
                            key="chart-raw"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.99 }}
                            transition={{ duration: 0.35 }}
                            className={`relative transition-all duration-500 rounded-2xl ${
                              spotlightTarget === 'v1_graph'
                                ? 'z-30 scale-[1.04] bg-white shadow-2xl ring-2 ring-amber-400/60 p-1'
                                : spotlightTarget === 'v1_legend' || spotlightTarget === 'v2_metrics'
                                ? 'grayscale opacity-25 blur-[0.5px]'
                                : 'scale-100'
                            }`}
                          >
                            <ViewfinderFrame themeColor="amber" isActive={spotlightTarget === 'v1_graph'} />
                            <CheckoutChart
                              data={CHART_DATA}
                              seriesList={SERIES_LIST}
                              activeSeries={activeSeries}
                              hoveredSeries={hoveredSeries}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="chart-modern"
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.99 }}
                            transition={{ duration: 0.35 }}
                            className={`relative transition-all duration-500 rounded-2xl ${
                              spotlightTarget === 'v2_graph'
                                ? 'z-30 scale-[1.03] bg-white shadow-2xl ring-2 ring-blue-500/50 p-1'
                                : spotlightTarget === 'v1_legend' || spotlightTarget === 'v2_metrics'
                                ? 'grayscale opacity-25 blur-[0.5px]'
                                : spotlightTarget === 'v2_all'
                                ? 'z-30 scale-[1.01] bg-white shadow-md ring-1 ring-blue-500/30 p-0.5'
                                : 'scale-100'
                            }`}
                          >
                            <ViewfinderFrame
                              themeColor="blue"
                              isActive={spotlightTarget === 'v2_graph' || spotlightTarget === 'v2_all'}
                            />
                            <ModernChart onSelectAnomaly={() => handleSelectVersion('v3_ai')} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hollow Frame Zoom Spotlight Overlay (B&W dimming + On-screen floating note) */}
              <HollowFrame config={spotlightConfig} isVisible={!!spotlightConfig} />
            </main>
          </div>

          {/* RIGHT SIDE: PORTFOLIO HERO CONTENT */}
          <div className="lg:col-span-6 flex flex-col items-start text-left lg:pl-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium tracking-wide shadow-xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SaaS UI Evolution & Remediation</span>
            </div>

            {/* Display Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
              Turning raw telemetry into{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                autonomous action.
              </span>
            </h2>

            {/* Subtext description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
              I design interfaces that bridge complex machine diagnostics with immediate, one-click execution. Watch how messy 6-variable data transforms into executive clarity and predictive self-healing.
            </p>

            {/* Interactive Stage Selectors */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl mb-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleSelectVersion('v1_basic')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeVersion === 'v1_basic'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Raw Data
              </button>
              <button
                type="button"
                onClick={() => handleSelectVersion('v2_modern')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeVersion === 'v2_modern'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. UI Redesign
              </button>
              <button
                type="button"
                onClick={() => handleSelectVersion('v3_ai')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeVersion === 'v3_ai'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Autonomous AI
              </button>
            </div>

            {/* Interactive triggers */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
              <button
                type="button"
                onClick={startFullEvolutionAnimation}
                disabled={isPlayingDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-semibold text-sm shadow-md shadow-slate-900/15 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Play Live Evolution</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectVersion('v3_ai')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Inspect AI Hotfix</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFramerModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Export for Framer</span>
              </button>
            </div>

            {/* Portfolio Key Stats */}
            <div className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/90 text-slate-800">
              <div>
                <span className="block text-2xl font-bold text-slate-900">
                  3 Tiers
                </span>
                <span className="text-xs text-slate-500 font-medium">Design System</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-emerald-600">
                  99.8%
                </span>
                <span className="text-xs text-slate-500 font-medium">Recovery Rate</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-900">
                  &lt; 500ms
                </span>
                <span className="text-xs text-slate-500 font-medium">Remediation</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dataset Modal */}
      <DataTableModal
        isOpen={showDataTable}
        onClose={() => setShowDataTable(false)}
        data={CHART_DATA}
        seriesList={SERIES_LIST}
      />

      {/* Framer Export Modal */}
      <FramerExportModal
        isOpen={showFramerModal}
        onClose={() => setShowFramerModal(false)}
      />
    </div>
  );
}

