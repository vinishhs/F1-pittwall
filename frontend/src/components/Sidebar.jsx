import React, { useEffect, useState } from 'react';
import { Database, ChevronRight, Activity, Layers, Archive, BarChart2, Wifi } from 'lucide-react';
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
        <aside className="w-56 bg-terminal-surface border-r border-terminal-border flex flex-col h-full shrink-0">
            {/* System Status Header */}
            <div className="p-4 border-b border-terminal-border">
                <h2 className="text-[11px] text-brand-cyan tracking-widest font-bold terminal-glow">SYSTEM STATUS</h2>
                <span className="text-[10px] text-brand-cyan/60 tracking-wider">V4.2 STABLE ACCESS</span>
            </div>

            {/* Saved History */}
            <div className="p-3 border-b border-terminal-border">
                <div className="flex items-center gap-2 mb-3">
                    <Database className="w-3.5 h-3.5 text-[#4a5568]" />
                    <span className="text-[10px] text-[#4a5568] tracking-widest uppercase">Session Archive</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading ? (
                    <div className="text-[#4a5568] text-[11px] p-2 tracking-wider animate-pulse">LOADING...</div>
                ) : (
                    comparisons.map((comp) => (
                        <div key={comp._id} className="p-2.5 bg-terminal-base/50 rounded hover:bg-terminal-elevated cursor-pointer transition border border-transparent hover:border-brand-cyan/20 group">
                            <div className="text-[11px] text-[#c8d6e5] tracking-wider">{comp.title}</div>
                            <div className="text-[10px] text-[#4a5568] mt-0.5 flex justify-between">
                                <span>{comp.year} {comp.race}</span>
                            </div>
                            <div className="text-[10px] text-brand-cyan/70 mt-0.5">
                                {comp.driver1} vs {comp.driver2}
                            </div>
                        </div>
                    ))
                )}
                {!loading && comparisons.length === 0 && (
                    <div className="text-[#4a5568] text-[10px] p-2 tracking-wider">NO_ARCHIVE_DATA</div>
                )}
            </div>

            {/* Connection Widget */}
            <div className="p-3 border-t border-terminal-border">
                <div className="terminal-card rounded p-2.5 text-[10px] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[#4a5568] tracking-wider">CONNECTION</span>
                        <div className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-brand-cyan"></span>
                            <span className="w-1 h-1 rounded-full bg-brand-cyan"></span>
                            <span className="w-1 h-1 rounded-full bg-brand-cyan"></span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#4a5568]">UPLINK</span>
                        <span className="text-brand-cyan">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#4a5568]">LATENCY</span>
                        <span className="text-brand-cyan">24MS</span>
                    </div>
                    <div className="w-full h-0.5 bg-terminal-border rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-brand-cyan rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
