import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import TelemetryCharts from './components/TelemetryCharts';
import TrackMap from './components/TrackMap';
import HistoryGallery from './components/HistoryGallery';
import SectorChart from './components/SectorChart';
import StatsCard from './components/StatsCard';
import StrategyView from './components/StrategyView';
import { Activity, Zap, Timer, Map, Archive, BarChart2, Layers, Settings, User } from 'lucide-react';
import client from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'garage' | 'strategy'

  const [telemetryData, setTelemetryData] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [hoverIndex, setHoverIndex] = useState(null);

  const [loadedParams, setLoadedParams] = useState(null);

  const handleHover = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  const handleFetchData = async (params) => {
    setStatus('loading');
    setErrorMsg('');
    setTelemetryData(null);
    setSectorData(null);
    setHoverIndex(null);

    if (activeTab === 'garage') setActiveTab('analysis');

    try {
      console.log("Requesting Analysis...", params);

      const [telemetryRes, sectorRes] = await Promise.all([
        client.get('/telemetry', { params }),
        client.get('/sectors', { params })
      ]);

      if (telemetryRes.data.distance && telemetryRes.data.distance.length === 500) {
        setTelemetryData(telemetryRes.data);
      } else {
        throw new Error("Telemetry data invalid.");
      }

      if (sectorRes.data) {
        setSectorData(sectorRes.data);
      }

      setLoadedParams(params);
      setStatus('success');
    } catch (err) {
      console.error("Analysis Error:", err);
      console.log("FETCH_CATCH_BLOCK_REACHED:", err);
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || err.message || "Failed to fetch analysis");
    }
  };

  const handleLoadHistory = (savedItem) => {
    setActiveTab('analysis');
    const params = {
      year: savedItem.year,
      race: savedItem.race,
      session: savedItem.session,
      driver1: savedItem.driver1,
      driver2: savedItem.driver2
    };
    setLoadedParams(params);
    handleFetchData(params);
  };

  const d1Name = loadedParams?.driver1 || 'D1';
  const d2Name = loadedParams?.driver2 || 'D2';

  const tabs = [
    { id: 'analysis', label: 'TELEMETRY', icon: BarChart2 },
    { id: 'strategy', label: 'STRATEGY', icon: Layers },
    { id: 'garage', label: 'GARAGE', icon: Archive },
  ];

  return (
    <div className="flex min-h-screen w-full bg-terminal-base text-[#c8d6e5] font-mono scanline-bg selection:bg-brand-cyan/30 selection:text-white">
      {/* Sidebar Area */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* === TOP HEADER BAR === */}
        <header className="h-12 border-b border-terminal-border flex items-center justify-between px-6 bg-terminal-surface/80 backdrop-blur-xl z-20 shrink-0">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded border border-brand-cyan/50 flex items-center justify-center bg-brand-cyan/10">
                <Activity className="w-4 h-4 text-brand-cyan" />
              </div>
              <h1 className="text-sm tracking-widest text-brand-cyan terminal-glow">
                <span className="font-bold">ENGINEER</span><span className="italic opacity-70">TERMINAL</span>
              </h1>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 text-[11px] tracking-widest transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-brand-cyan border-brand-cyan'
                      : 'text-[#4a5568] border-transparent hover:text-[#c8d6e5] hover:border-[#4a5568]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {status === 'loading' && <span className="text-brand-crimson text-[10px] tracking-wider animate-pulse flex items-center gap-2"><Zap className="w-3 h-3" /> PROCESSING...</span>}
            {status === 'success' && <span className="text-brand-cyan text-[10px] tracking-wider flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan terminal-blink"></span> LIVE_LINK</span>}
            <Settings className="w-4 h-4 text-[#4a5568] cursor-pointer hover:text-brand-cyan transition" />
            <div className="w-7 h-7 rounded border border-terminal-border flex items-center justify-center bg-terminal-elevated cursor-pointer hover:border-brand-cyan/30 transition">
              <User className="w-3.5 h-3.5 text-[#4a5568]" />
            </div>
          </div>
        </header>

        {/* Dashboard Content Swapper */}
        <div className="flex-1 p-5 relative flex flex-col overflow-y-auto">
          {activeTab === 'garage' ? (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <HistoryGallery onLoad={handleLoadHistory} />
            </div>
          ) : (
            <>
              {/* Controls Section */}
              <div className="mb-5 z-10">
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
                activeTab === 'strategy' ? (
                  <StrategyView loadedParams={loadedParams} />
                ) : (
                  <div className="flex-1 grid grid-cols-4 gap-5 min-h-0 animate-in fade-in duration-500">
                    {/* Left Column: Charts (75%) */}
                    <div className="col-span-3 flex flex-col gap-4 min-h-0">
                      <div className="terminal-card rounded-lg p-1 relative">
                        <TelemetryCharts data={telemetryData} onHover={handleHover} hoverIndex={hoverIndex} />
                      </div>
                      <div className="h-40 shrink-0">
                        <SectorChart data={sectorData} driver1={d1Name} driver2={d2Name} />
                      </div>
                    </div>

                    {/* Right Column: Track Map & Stats (25%) */}
                    <div className="col-span-1 flex flex-col gap-5">
                      <div className="flex-1 min-h-[300px] flex flex-col">
                        <TrackMap data={telemetryData} hoverIndex={hoverIndex} />
                      </div>
                      <StatsCard sectorData={sectorData} />
                    </div>
                  </div>
                )
              ) : (
                status !== 'loading' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-[#4a5568] z-0">
                    <Map className="w-16 h-16 mb-4 opacity-20" />
                    {status === 'error' ? (
                        <p className="text-sm text-brand-crimson">{errorMsg}</p>
                    ) : (
                        <p className="text-sm tracking-wider">SELECT RACE PARAMETERS TO INITIALIZE_</p>
                    )}
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* === BOTTOM STATUS BAR === */}
        <footer className="h-8 border-t border-terminal-border flex items-center justify-between px-6 bg-terminal-surface/80 text-[10px] tracking-wider shrink-0">
          <div className="flex items-center gap-6 text-[#4a5568]">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span> TELEM_STABLE</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span> LATENCY_0.02ms</span>
          </div>
          <span className="text-[#4a5568]">BROADCAST CORE INTERFACE // V7.4.2_BUILD.092</span>
        </footer>

        {/* Loading Overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 bg-terminal-base/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-brand-cyan/30 border-t-brand-cyan rounded-full animate-spin mb-4"></div>
            <h2 className="text-sm text-brand-cyan tracking-[0.3em] terminal-glow animate-pulse">CRUNCHING DATA</h2>
            <p className="text-[#4a5568] text-[11px] mt-2 tracking-wider">Calculating Sector Deltas & Theoretical Bests...</p>
          </div>
        )}
      </main>
    </div>
  );
}
