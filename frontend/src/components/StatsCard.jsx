import React from 'react';

export default function StatsCard({ sectorData }) {
  if (!sectorData || !sectorData.d1 || !sectorData.d2) {
    return (
      <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest">
        Awaiting Sector Data...
      </div>
    );
  }

  return (
    <div className="min-h-64 bg-slate-900 rounded-lg border border-slate-800 p-5 shadow-xl flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-800/30 to-transparent rounded-bl-full pointer-events-none"></div>

      <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2 mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider">Race Pace Analysis</h3>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-[10px] text-slate-500 font-bold text-center">
        <div>SECTOR 1</div>
        <div>SECTOR 2</div>
        <div>SECTOR 3</div>
      </div>

      {/* Driver 1 Sector Times */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-slate-950 p-1.5 rounded border-l-2 border-cyan-500 text-center font-mono text-xs text-white">
          {sectorData.d1.s1.toFixed(3)}
        </div>
        <div className="bg-slate-950 p-1.5 rounded border-l-2 border-cyan-500 text-center font-mono text-xs text-white">
          {sectorData.d1.s2.toFixed(3)}
        </div>
        <div className="bg-slate-950 p-1.5 rounded border-l-2 border-cyan-500 text-center font-mono text-xs text-white">
          {sectorData.d1.s3.toFixed(3)}
        </div>
      </div>

      {/* Driver 2 Sector Times */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-950 p-1.5 rounded border-l-2 border-brand-red text-center font-mono text-xs text-white">
          {sectorData.d2.s1.toFixed(3)}
        </div>
        <div className="bg-slate-950 p-1.5 rounded border-l-2 border-brand-red text-center font-mono text-xs text-white">
          {sectorData.d2.s2.toFixed(3)}
        </div>
        <div className="bg-slate-950 p-1.5 rounded border-l-2 border-brand-red text-center font-mono text-xs text-white">
          {sectorData.d2.s3.toFixed(3)}
        </div>
      </div>

      {/* Theoretical vs Actual Best Comparison */}
      <div className="mt-auto space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-cyan-400">D1 THEORETICAL</span>
          <div className="flex items-center gap-2">
            {sectorData.d1.actual_lap > sectorData.d1.theoretical && (
              <span className="px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                Potential: -{(sectorData.d1.actual_lap - sectorData.d1.theoretical).toFixed(3)}s
              </span>
            )}
            <span className="font-mono text-white">{sectorData.d1.theoretical.toFixed(3)}s</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-brand-red">D2 THEORETICAL</span>
          <div className="flex items-center gap-2">
            {sectorData.d2.actual_lap > sectorData.d2.theoretical && (
              <span className="px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                Potential: -{(sectorData.d2.actual_lap - sectorData.d2.theoretical).toFixed(3)}s
              </span>
            )}
            <span className="font-mono text-white">{sectorData.d2.theoretical.toFixed(3)}s</span>
          </div>
        </div>
      </div>

      {/* Sync ID pinned to absolute bottom-right corner with strong engineer terminal vibe */}
      <div className="absolute bottom-2 right-2 text-[10px] text-green-400 font-mono bg-black/60 px-2 py-1 rounded border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.2)] tracking-widest flex items-center gap-2 z-10">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        SYNC: READY
      </div>
    </div>
  );
}
