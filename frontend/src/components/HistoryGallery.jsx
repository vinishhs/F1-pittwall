import React, { useEffect, useState } from 'react';
import { Archive, PlayCircle, AlertTriangle, Calendar, Users, Trophy } from 'lucide-react';
import client from '../api/client';

export default function HistoryGallery({ onLoad }) {
    const [comparisons, setComparisons] = useState([]);
    const [status, setStatus] = useState('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setStatus('loading');
        try {
            const res = await client.get('/comparisons');
            setComparisons(res.data);
            setStatus('success');
        } catch (err) {
            console.error("History Fetch Error:", err);
            setStatus('error');
            setErrorMsg("Database Connection Error");
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[#4a5568] animate-pulse">
                <Archive className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-[11px] tracking-widest">ACCESSING_GARAGE_ARCHIVES...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-brand-crimson">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-[11px] tracking-wider">{errorMsg}</p>
                <button onClick={fetchHistory} className="mt-4 text-[10px] tracking-wider text-brand-cyan hover:underline">RETRY_CONNECTION</button>
            </div>
        );
    }

    if (comparisons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[#4a5568]">
                <Archive className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm tracking-wider">GARAGE_EMPTY</p>
                <p className="text-[10px] opacity-60 tracking-wider mt-1">ANALYZE A RACE TO SAVE IT HERE_</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-terminal-base/90 backdrop-blur-sm py-3 z-10 border-b border-terminal-border">
                <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 bg-brand-crimson/20 text-brand-crimson text-[9px] tracking-wider rounded border border-brand-crimson/30">ENGINEER CONSOLE</span>
                    <h2 className="text-lg tracking-widest text-[#c8d6e5]">
                        THE GARAGE<span className="text-brand-cyan mx-2">&</span>HISTORY
                    </h2>
                </div>
                <span className="text-[10px] text-[#4a5568] tracking-wider">{comparisons.length} ARCHIVED_SESSIONS</span>
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-[11px] text-[#4a5568] tracking-widest italic">ARCHIVE // SAVED SESSIONS</h3>
                <div className="flex-1 h-px bg-terminal-border"></div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {Array.isArray(comparisons) ? comparisons.map((item) => (
                    <div
                        key={item._id}
                        className="terminal-card rounded-lg p-4 hover:border-brand-cyan/30 transition-all group relative overflow-hidden"
                    >
                        {/* Session Type Badge */}
                        <div className="mb-3">
                            <span className="px-2 py-0.5 text-[9px] tracking-wider rounded border border-brand-cyan/30 text-brand-cyan bg-brand-cyan/10">
                                {item.session === 'Q' ? 'QUALIFYING' : item.session === 'R' ? 'RACE TRACE' : item.session}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="mb-3">
                            <h3 className="text-[13px] text-[#c8d6e5] tracking-wider">
                                {item.year} {item.race.toUpperCase()} GP
                            </h3>
                        </div>

                        {/* Matchup */}
                        <div className="mb-4 text-[11px] tracking-wider">
                            <span className="text-brand-cyan">{item.driver1}</span>
                            <span className="text-[#4a5568] mx-2">VS</span>
                            <span className="text-brand-crimson">{item.driver2}</span>
                        </div>

                        {/* Action */}
                        <button
                            onClick={() => onLoad(item)}
                            className="w-full py-2 bg-terminal-base hover:bg-brand-cyan/10 text-brand-cyan rounded flex items-center justify-center gap-2 text-[10px] tracking-widest transition-colors border border-terminal-border hover:border-brand-cyan/30"
                        >
                            RECALL SESSION
                        </button>
                    </div>
                )) : null}
            </div>

            {/* System Diagnostics Log */}
            <div className="mt-6">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] text-[#4a5568] tracking-widest">[ ] SYSTEM DIAGNOSTICS // LIVE LOG</span>
                    <div className="flex-1 h-px bg-terminal-border"></div>
                </div>
                <div className="terminal-card rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-px bg-terminal-border text-[9px] tracking-wider">
                        <div className="bg-terminal-surface p-2 text-brand-cyan">TIMESTAMP [UTC]</div>
                        <div className="bg-terminal-surface p-2 text-brand-cyan">EVENT ID / TYPE</div>
                        <div className="bg-terminal-surface p-2 text-brand-cyan">NETWORK STATUS</div>
                        <div className="bg-terminal-surface p-2 text-brand-cyan text-right">RTT LATENCY</div>
                    </div>
                    <div className="grid grid-cols-4 gap-px bg-terminal-border text-[10px]">
                        <div className="bg-terminal-base p-2 text-[#4a5568]">{new Date().toISOString().split('T')[0]}</div>
                        <div className="bg-terminal-base p-2 text-[#4a5568]">[API_FETCH] FASTF1 SESSION</div>
                        <div className="bg-terminal-base p-2 text-brand-cyan flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-brand-cyan rounded-full"></span> STABLE_CONNECTION
                        </div>
                        <div className="bg-terminal-base p-2 text-brand-cyan text-right">12.42ms</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
