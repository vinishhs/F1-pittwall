import React, { useEffect, useState } from 'react';
import { Database, Wifi } from 'lucide-react';
import client from '../api/client';

export default function Sidebar() {
    const [comparisons, setComparisons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComparisons = async () => {
            try {
                const res = await client.get('/comparisons');
                if (res.data && res.data.warning && Array.isArray(res.data.data)) {
                    setComparisons(res.data.data);
                } else {
                    setComparisons(Array.isArray(res.data) ? res.data : []);
                }
            } catch (err) {
                console.error("Failed to load comparisons", err);
            } finally {
                setLoading(false);
            }
        };
        fetchComparisons();
    }, []);

    return (
        <aside className="w-52 bg-terminal-surface border-r border-terminal-border flex flex-col shrink-0 overflow-hidden">
            {/* ── Logo / System Status ── */}
            <div className="px-4 py-4 border-b border-terminal-border">
                <div className="text-[11px] text-brand-cyan tracking-[0.2em] font-bold terminal-glow leading-relaxed">
                    SYSTEM STATUS
                </div>
                <div className="text-[9px] text-brand-cyan/40 tracking-[0.15em] mt-0.5">
                    V4.2 STABLE ACCESS
                </div>
            </div>

            {/* ── Session Archive Section ── */}
            <div className="px-4 py-3 border-b border-terminal-border">
                <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-[#4a5568]" />
                    <span className="text-[9px] text-[#4a5568] tracking-[0.2em]">SESSION ARCHIVE</span>
                </div>
            </div>

            {/* ── History List ── */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 min-h-0">
                {loading ? (
                    <div className="text-[#4a5568] text-[10px] px-2 py-2 tracking-wider animate-pulse">LOADING...</div>
                ) : comparisons.length > 0 ? (
                    comparisons.map((comp) => (
                        <div key={comp._id} className="px-3 py-2 rounded hover:bg-terminal-elevated cursor-pointer transition border border-transparent hover:border-brand-cyan/15 group">
                            <div className="text-[10px] text-[#c8d6e5] tracking-wider leading-snug truncate">{comp.title}</div>
                            <div className="text-[9px] text-[#4a5568] mt-1 truncate">
                                {comp.year} · {comp.race}
                            </div>
                            <div className="text-[9px] text-brand-cyan/60 mt-0.5 truncate">
                                {comp.driver1} vs {comp.driver2}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-[#4a5568] text-[9px] px-2 py-2 tracking-[0.15em]">NO ARCHIVE DATA</div>
                )}
            </div>

            {/* ── Connection Status ── */}
            <div className="px-3 py-3 border-t border-terminal-border mt-auto shrink-0">
                <div className="bg-terminal-base rounded px-3 py-2.5 border border-terminal-border space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-[#4a5568] tracking-[0.15em]">CONNECTION</span>
                        <div className="flex gap-[3px]">
                            <span className="w-[5px] h-[5px] rounded-full bg-brand-cyan"></span>
                            <span className="w-[5px] h-[5px] rounded-full bg-brand-cyan"></span>
                            <span className="w-[5px] h-[5px] rounded-full bg-brand-cyan/40"></span>
                        </div>
                    </div>
                    <div className="flex justify-between text-[9px]">
                        <span className="text-[#4a5568]">UPLINK</span>
                        <span className="text-brand-cyan tracking-wider">ACTIVE</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                        <span className="text-[#4a5568]">LATENCY</span>
                        <span className="text-brand-cyan tracking-wider">24MS</span>
                    </div>
                    <div className="w-full h-[2px] bg-terminal-border rounded-full overflow-hidden">
                        <div className="h-full bg-brand-cyan/60 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
