import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import TelemetryCharts from './components/TelemetryCharts';
import TrackMap from './components/TrackMap';
import HistoryGallery from './components/HistoryGallery';
import StintChart from './components/StintChart';
import { Activity, Zap, Timer, Map, Archive, BarChart2 } from 'lucide-react';
import client from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'garage'

  const [telemetryData, setTelemetryData] = useState(null);
  const [stintData, setStintData] = useState(null); // New State for Stints
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [hoverIndex, setHoverIndex] = useState(null);

  // State to force Controls to sync when loading from history
  const [loadedParams, setLoadedParams] = useState(null);

  const handleHover = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  // Updated to fetch both Telemetry AND Stints
  const handleFetchData = async (params) => {
    setStatus('loading');
    setErrorMsg('');
    setTelemetryData(null);
    setStintData(null);
    setHoverIndex(null);

    // Keep active tab in Analysis when re-fetching
    setActiveTab('analysis');

    try {
      console.log("Requesting Analysis...", params);

      // Parallel Requests
      // Note: client baseURL includes '/api', so we use '/telemetry' and '/stints'
      const [telemetryRes, stintRes] = await Promise.all([
        client.get('/telemetry', { params }),
        client.get('/stints', { params })
      ]);

      // Telemetry Validation
      if (telemetryRes.data.distance && telemetryRes.data.distance.length === 500) {
        setTelemetryData(telemetryRes.data);
      } else {
        throw new Error("Telemetry data invalid.");
      }

      // Stint Data
      if (stintRes.data) {
        setStintData(stintRes.data);
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

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-brand-red selection:text-white">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Navigation / Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <Activity className="w-6 h-6 text-brand-red mr-3" />
              <h1 className="text-xl font-bold tracking-wide">VIRTUAL PIT WALL <span className="text-xs text-slate-500 font-normal ml-2">PHASE 6</span></h1>
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
                onClick={() => setActiveTab('garage')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'garage' ? 'bg-brand-red text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                <Archive className="w-4 h-4" />
                The Garage
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            {status === 'loading' && <span className="text-brand-red animate-pulse flex items-center gap-2"><Zap className="w-3 h-3" /> SYNCING DATA...</span>}
            {status === 'success' && <span className="text-green-500 flex items-center gap-2">● READY</span>}
          </div>
        </header>

        {/* Dashboard Content Swapper */}
        <div className="flex-1 p-6 overflow-hidden relative flex flex-col">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          {activeTab === 'garage' ? (
            // --- GARAGE VIEW ---
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <HistoryGallery onLoad={handleLoadHistory} />
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
              {telemetryData && status !== 'error' ? (
                <div className="flex-1 grid grid-cols-4 gap-6 min-h-0 animate-in fade-in duration-500">
                  {/* Left Column: Charts (75%) */}
                  <div className="col-span-3 flex flex-col gap-4 min-h-0">
                    {/* Telemetry Stack */}
                    <div className="flex-1 bg-slate-900/50 rounded-lg border border-slate-800 p-1 backdrop-blur-sm relative">
                      <TelemetryCharts data={telemetryData} onHover={handleHover} />
                    </div>

                    {/* Stint Strategy Chart (New Phase 6) */}
                    <div className="h-40 shrink-0">
                      <StintChart data={stintData} />
                    </div>
                  </div>

                  {/* Right Column: Track Map & Stats (25%) */}
                  <div className="col-span-1 flex flex-col gap-6">
                    {/* Track Map Card */}
                    <div className="flex-1 min-h-[300px] flex flex-col">
                      <TrackMap data={telemetryData} hoverIndex={hoverIndex} />
                    </div>

                    {/* Stats Card */}
                    <div className="h-48 bg-slate-900 rounded-lg border border-slate-800 p-4 shadow-xl flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2">
                        <Timer className="w-4 h-4" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">Race Pace</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-slate-950/50 p-2 rounded border-l-2 border-cyan-500">
                          <span className="text-[10px] text-slate-500 block">MAX SPEED (D1)</span>
                          <span className="text-xl font-mono text-cyan-400">
                            {Math.max(...telemetryData.d1.Speed).toFixed(0)} <span className="text-xs">km/h</span>
                          </span>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded border-l-2 border-brand-red">
                          <span className="text-[10px] text-slate-500 block">MAX SPEED (D2)</span>
                          <span className="text-xl font-mono text-brand-red">
                            {Math.max(...telemetryData.d2.Speed).toFixed(0)} <span className="text-xs">km/h</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto text-xs text-center text-slate-600 font-mono">
                        SYNC_ID: {hoverIndex ?? '---'} / 500
                      </div>
                    </div>
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

          {/* Loading Overlay */}
          {status === 'loading' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-bold text-white tracking-widest animate-pulse">COMPUTING STRATEGY</h2>
              <p className="text-slate-400 text-sm mt-2">Analyzing Telemetry & Tire Degradation...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
