import React from 'react';

export default function StatsCard({ sectorData }) {
  if (!sectorData || !sectorData.d1 || !sectorData.d2) {
    return (
      <div className="w-full h-full bg-terminal-surface rounded-lg border border-terminal-border flex items-center justify-center text-[#4a5568] text-[10px] tracking-widest">
        AWAITING_SECTOR_DATA...
      </div>
    );
  }

  return (
    <div className="min-h-64 bg-terminal-surface rounded-lg border border-terminal-border p-5 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-terminal-border pb-2 mb-4">
        <span className="w-2 h-2 bg-brand-cyan"></span>
        <h3 className="text-[11px] text-[#c8d6e5] tracking-widest">RACE_PACE_ANALYSIS</h3>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-[9px] text-[#4a5568] tracking-widest text-center">
        <div>SECTOR_01</div>
        <div>SECTOR_02</div>
        <div>SECTOR_03</div>
      </div>

      {/* Driver 1 Sector Times */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-terminal-base p-1.5 rounded border-l-2 border-brand-cyan text-center text-[12px] text-brand-cyan">
          {sectorData.d1.s1.toFixed(3)}
        </div>
        <div className="bg-terminal-base p-1.5 rounded border-l-2 border-brand-cyan text-center text-[12px] text-brand-cyan">
          {sectorData.d1.s2.toFixed(3)}
        </div>
        <div className="bg-terminal-base p-1.5 rounded border-l-2 border-brand-cyan text-center text-[12px] text-brand-cyan">
          {sectorData.d1.s3.toFixed(3)}
        </div>
      </div>

      {/* Driver 2 Sector Times */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-terminal-base p-1.5 rounded border-l-2 border-brand-crimson text-center text-[12px] text-brand-crimson">
          {sectorData.d2.s1.toFixed(3)}
        </div>
        <div className="bg-terminal-base p-1.5 rounded border-l-2 border-brand-crimson text-center text-[12px] text-brand-crimson">
          {sectorData.d2.s2.toFixed(3)}
        </div>
        <div className="bg-terminal-base p-1.5 rounded border-l-2 border-brand-crimson text-center text-[12px] text-brand-crimson">
          {sectorData.d2.s3.toFixed(3)}
        </div>
      </div>

      {/* Theoretical vs Actual Best Comparison */}
      <div className="mt-auto space-y-2.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-brand-cyan tracking-wider">D1_THEORETICAL</span>
          <div className="flex items-center gap-2">
            {sectorData.d1.actual_lap > sectorData.d1.theoretical && (
              <span className="px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-[9px] tracking-wider">
                GAP: -{(sectorData.d1.actual_lap - sectorData.d1.theoretical).toFixed(3)}s
              </span>
            )}
            <span className="text-[#c8d6e5]">{sectorData.d1.theoretical.toFixed(3)}s</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-brand-crimson tracking-wider">D2_THEORETICAL</span>
          <div className="flex items-center gap-2">
            {sectorData.d2.actual_lap > sectorData.d2.theoretical && (
              <span className="px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400 text-[9px] tracking-wider">
                GAP: -{(sectorData.d2.actual_lap - sectorData.d2.theoretical).toFixed(3)}s
              </span>
            )}
            <span className="text-[#c8d6e5]">{sectorData.d2.theoretical.toFixed(3)}s</span>
          </div>
        </div>
      </div>

      {/* Sync Badge */}
      <div className="absolute bottom-2 right-2 text-[9px] text-brand-cyan/60 bg-terminal-base/60 px-2 py-1 rounded border border-brand-cyan/20 tracking-widest flex items-center gap-2 z-10">
        <span className="w-1 h-1 bg-brand-cyan rounded-full terminal-blink"></span>
        SYNC: READY
      </div>
    </div>
  );
}
