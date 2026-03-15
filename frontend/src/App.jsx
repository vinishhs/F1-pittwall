import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import TelemetryCharts from './components/TelemetryCharts';
import TrackMap from './components/TrackMap';
import HistoryGallery from './components/HistoryGallery';
import SectorChart from './components/SectorChart';
import StatsCard from './components/StatsCard'; // Added missing import
import { Activity, Zap, Timer, Map, Archive, BarChart2, Layers } from 'lucide-react';
import client from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'garage' | 'strategy'

  const [telemetryData, setTelemetryData] = useState(null);
  const [sectorData, setSectorData] = useState(null); // New State for Sectors
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [hoverIndex, setHoverIndex] = useState(null);

  // State to force Controls to sync when loading from history
  const [loadedParams, setLoadedParams] = useState(null);

  const handleHover = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  // Updated to fetch Telemetry AND Sectors
  const handleFetchData = async (params) => {
    setStatus('loading');
    setErrorMsg('');
    setTelemetryData(null);
    setSectorData(null);
    setHoverIndex(null);

    // Keep active tab in Analysis when re-fetching
    setActiveTab('analysis');

    try {
      console.log("Requesting Analysis...", params);

      // Parallel Requests
      // Note: client baseURL includes '/api', so we use '/telemetry' and '/sectors'
      const [telemetryRes, sectorRes] = await Promise.all([
        client.get('/telemetry', { params }),
        client.get('/sectors', { params })
      ]);

      // Telemetry Validation
      if (telemetryRes.data.distance && telemetryRes.data.distance.length === 500) {
        setTelemetryData(telemetryRes.data);
      } else {
        throw new Error("Telemetry data invalid.");
      }

      // Sector Data
      if (sectorRes.data) {
        setSectorData(sectorRes.data);
      }

      setStatus('success');
    } catch (err) {
      console.error("Analysis Error:", err);
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || err.message || "Failed to fetch analysis");
    }
  };

  // Handler for loading from Garage
  const handleLoadHistory = (savedItem) => {
    // 1. Switch to Analysis Tab
    setActiveTab('analysis');
    // 2. Hydrate Controls (via key/prop)
    const params = {
      year: savedItem.year,
      race: savedItem.race,
      session: savedItem.session,
      driver1: savedItem.driver1,
      driver2: savedItem.driver2
    };
    setLoadedParams(params);
    // 3. Trigger Fetch immediately
    handleFetchData(params);
  };

  // Helper for loaded params display in chart
  const d1Name = loadedParams?.driver1 || 'D1';
  const d2Name = loadedParams?.driver2 || 'D2';

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-brand-red selection:text-white">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Navigation / Header */}
        <header className="pt-6 pb-4 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-brand-red mr-3" />
              <h1 className="text-xl font-bold tracking-wide">VIRTUAL PIT WALL <span className="text-xs text-slate-500 font-normal ml-2">PHASE 7</span></h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'analysis' ? 'bg-brand-red text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <BarChart2 className="w-4 h-4" />
                Analysis
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'strategy' ? 'bg-brand-red text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <Layers className="w-4 h-4" />
                Strategy
              </button>
              <button
                onClick={() => setActiveTab('garage')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'garage' ? 'bg-brand-red text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <Archive className="w-4 h-4" />
                The Garage
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            {status === 'loading' && <span className="text-brand-red animate-pulse flex items-center gap-2"><Zap className="w-3 h-3" /> ANALYZING...</span>}
            {status === 'success' && <span className="text-green-500 flex items-center gap-2">● LIVE</span>}
          </div>
        </header>

        {/* Dashboard Content Swapper */}
        <div className="flex-1 p-6 relative flex flex-col scroll-smooth">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          {activeTab === 'garage' ? (
            // --- GARAGE VIEW ---
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <HistoryGallery onLoad={handleLoadHistory} />
            </div>
          ) : activeTab === 'strategy' ? (
            // --- STRATEGY VIEW (Phase 1 Placeholder) ---
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-500">
                <Layers className="w-20 h-20 mb-6 text-brand-red/50 animate-pulse" />
                <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-4 shadow-sm text-center">
                    Tire Degradation Analysis
                </h2>
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-slate-700/50 rounded-lg text-slate-400 font-mono tracking-widest text-sm">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    STATUS: [COMING SOON]
                </div>
                <p className="mt-8 text-center max-w-md italic opacity-80 leading-relaxed text-sm">
                    Phase 1 Stint Pacing Logic is running locally in the Data Engine.<br/>
                    Frontend Visualization Modules are currently locked for 2026.
                </p>
            </div>
          ) : (
            // --- ANALYSIS DASHBOARD VIEW ---
            <>
              {/* Controls Section (Top Bar) */}
              <div className="mb-6 z-10">
                {/* Key prop ensures re-mount when loadedParams change, resolving the sync issue */}
                <Controls
                  key={loadedParams ? JSON.stringify(loadedParams) : 'default'}
                  initialParams={loadedParams}
                  onAnalyze={handleFetchData}
                  status={status}
                  errorMsg={errorMsg}
                />
              </div>

              {/* Main Visualization Grid */}
              {telemetryData && sectorData && status !== 'error' ? (
                <div className="flex-1 grid grid-cols-4 gap-6 min-h-0 animate-in fade-in duration-500">
                  {/* Left Column: Charts (75%) */}
                  <div className="col-span-3 flex flex-col gap-4 min-h-0">
                    {/* Telemetry Stack */}
                    <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-1 backdrop-blur-sm relative">
                      <TelemetryCharts data={telemetryData} onHover={handleHover} hoverIndex={hoverIndex} />
                    </div>

                    {/* Sector Dominance Chart (New Phase 7) */}
                    <div className="h-40 shrink-0">
                      <SectorChart data={sectorData} driver1={d1Name} driver2={d2Name} />
                    </div>
                  </div>

                  {/* Right Column: Track Map & Stats (25%) */}
                  <div className="col-span-1 flex flex-col gap-6">
                    {/* Track Map Card */}
                    <div className="flex-1 min-h-[300px] flex flex-col">
                      <TrackMap data={telemetryData} hoverIndex={hoverIndex} />
                    </div>

                    {/* Stats Card - Updated Layout */}
                    <StatsCard sectorData={sectorData} />
                  </div>
                </div>
              ) : (
                /* Empty State */
                status !== 'loading' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 z-0">
                    <Map className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-light">Select race parameters to initialize.</p>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Loading Overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-white tracking-widest animate-pulse">CRUNCHING DATA</h2>
            <p className="text-slate-400 text-sm mt-2">Calculating Sector Deltas & Theoretical Bests...</p>
          </div>
        )}
      </main>
    </div>
  );
}
