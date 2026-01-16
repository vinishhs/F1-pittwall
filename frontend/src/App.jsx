import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import TelemetryCharts from './components/TelemetryCharts';
import TrackMap from './components/TrackMap';
import { Activity, Zap, Timer, Map } from 'lucide-react';
import client from './api/client';

export default function App() {
  const [telemetryData, setTelemetryData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [hoverIndex, setHoverIndex] = useState(null);

  // Optimized Hover Handler to prevent lag
  const handleHover = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  const handleFetchData = async (params) => {
    setStatus('loading');
    setErrorMsg('');
    setTelemetryData(null);
    setHoverIndex(null);

    try {
      console.log("Requesting Telemetry...", params);
      const res = await client.get('/telemetry', { params });

      if (res.data.distance && res.data.distance.length === 500) {
        setTelemetryData(res.data);
        setStatus('success');
      } else {
        throw new Error("Received data but array length is incorrect.");
      }
    } catch (err) {
      console.error("Telemetry Error:", err);
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || err.message || "Failed to fetch");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-brand-red selection:text-white">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur z-20">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-brand-red mr-3" />
            <h1 className="text-xl font-bold tracking-wide">VIRTUAL PIT WALL <span className="text-xs text-slate-500 font-normal ml-2">PHASE 5: GRAND PRIX</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            {status === 'loading' && <span className="text-brand-red animate-pulse flex items-center gap-2"><Zap className="w-3 h-3" /> LIVE DATA SYNC...</span>}
            {status === 'success' && <span className="text-green-500 flex items-center gap-2">● SYSTEM ONLINE</span>}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-hidden relative flex flex-col">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          {/* Controls Section (Top Bar) */}
          <div className="mb-6 z-10">
            <Controls onAnalyze={handleFetchData} status={status} errorMsg={errorMsg} />
          </div>

          {/* Main Visualization Grid */}
          {telemetryData && status === 'success' ? (
            <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
              {/* Left Column: Charts (75%) */}
              <div className="col-span-3 bg-slate-900/50 rounded-lg border border-slate-800 p-1 backdrop-blur-sm relative flex flex-col">
                <TelemetryCharts data={telemetryData} onHover={handleHover} />
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
                    <h3 className="text-sm font-bold uppercase tracking-wider">Lap Telemetry</h3>
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
            /* Empty State / Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 z-0">
              <Map className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-light">Select race parameters and initialize analysis.</p>
            </div>
          )}

          {/* Loading Overlay */}
          {status === 'loading' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-bold text-white tracking-widest animate-pulse">GATHERING TELEMETRY</h2>
              <p className="text-slate-400 text-sm mt-2">Accessing FastF1 Archives...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
