import React, { useState, useCallback } from 'react';
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
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* === TOP HEADER BAR === */}
        <header className="h-28 border-b border-terminal-border bg-terminal-surface backdrop-blur-xl z-20 shrink-0 relative">
          {/* Status Indicators - Pinned to the top-right corner of the whole header */}
          <div className="absolute top-6 right-6 left-auto z-30 font-mono">
            {status === 'loading' && <span className="text-brand-crimson text-[10px] tracking-widest animate-pulse flex items-center gap-2 px-3 py-1 bg-brand-crimson/5 border border-brand-crimson/20 rounded-sm"><Zap className="w-3 h-3" /> PROCESSING_DATA</span>}
            {status === 'success' && <span className="text-brand-cyan text-[10px] tracking-widest flex items-center gap-2 px-3 py-1 bg-brand-cyan/5 border border-brand-cyan/20 rounded-sm"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan terminal-blink shadow-[0_0_5px_#00f0ff]"></span> PITWALL_LINK_ACTIVE</span>}
          </div>

          <div className="h-full w-full max-w-[1920px] mx-auto px-6 flex flex-col items-center justify-center">
            {/* Top Level: Branding */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-9 h-9 rounded border border-brand-cyan/40 flex items-center justify-center bg-brand-cyan/5 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
                <Activity className="w-5 h-5 text-brand-cyan" />
              </div>
              <h1 className="text-xl tracking-[0.25em] text-brand-cyan font-krona terminal-glow leading-none">
                <span className="font-bold">F1</span> <span className="opacity-80 ml-2 uppercase">Virtual Pitwall</span>
              </h1>
            </div>

            {/* Bottom Level: Navigation Tabs */}
            <nav className="flex items-center gap-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-2.5 text-[13px] font-titillium font-bold tracking-[0.15em] transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-brand-cyan border-brand-cyan bg-brand-cyan/5 shadow-[0_8px_15px_-8px_rgba(0,240,255,0.2)]'
                      : 'text-[#4a5568] border-transparent hover:text-[#c8d6e5] hover:border-terminal-border/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* === FIXED CONTROLS SECTION === */}
        {activeTab !== 'garage' && (
          <div className="px-5 pt-5 pb-2 bg-terminal-base border-b border-terminal-border/20 z-10">
            <Controls
              key={loadedParams ? JSON.stringify(loadedParams) : 'default'}
              initialParams={loadedParams}
              onAnalyze={handleFetchData}
              status={status}
              errorMsg={errorMsg}
            />
          </div>
        )}

        {/* === SCROLLABLE DASHBOARD AREA === */}
        <div className="flex-1 w-full relative flex flex-col overflow-y-auto px-5 py-3">
          {/* Loading Overlay (Data Only) */}
          {status === 'loading' && (
            <div className="absolute inset-0 w-full h-full bg-terminal-base/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin mb-6 drop-shadow-[0_0_10px_rgba(0,240,255,0.2)]"></div>
              <h2 className="text-xl text-brand-cyan tracking-[0.4em] terminal-glow animate-pulse uppercase">CRUNCHING_DATA</h2>
              <p className="text-[#4a5568] text-[11px] mt-4 tracking-[0.3em] font-mono uppercase leading-relaxed">
                [ ACCESSING TELEMETRY_ENGINE_V7.4 ]
                <br />
                CALCULATING_SECTOR_DELTAS_AND_THEORETICAL_BESTS...
              </p>
            </div>
          )}

          {activeTab === 'garage' ? (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <HistoryGallery onLoad={handleLoadHistory} />
            </div>
          ) : (
            <>

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
                  <div className="flex-1 flex flex-col items-center justify-center text-[#4a5568] z-0 py-20">
                    <Map className="w-16 h-16 mb-4 opacity-20" />
                    {status === 'error' ? (
                        <p className="text-sm text-brand-crimson">{errorMsg}</p>
                    ) : (
                        <p className="text-sm tracking-wider uppercase">READY_FOR_INITIALIZATION_</p>
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
      </main>
    </div>
  );
}
