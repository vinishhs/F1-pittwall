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
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-pulse">
                <Archive className="w-12 h-12 mb-4 opacity-50" />
                <p>Accessing Garage Archives...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="font-bold">{errorMsg}</p>
                <button onClick={fetchHistory} className="mt-4 text-sm underline hover:text-red-400">Retry Connection</button>
            </div>
        );
    }

    if (comparisons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <Archive className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">Your Garage is Empty</p>
                <p className="text-sm opacity-60">Analyze a race to save it here.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-4 custom-scrollbar">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 sticky top-0 bg-slate-950/80 backdrop-blur py-2 z-10">
                <Archive className="w-6 h-6 text-slate-400" />
                The Garage <span className="text-xs font-normal text-slate-500 ml-2">({comparisons.length} Runs)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {comparisons.map((item) => (
                    <div
                        key={item._id}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-brand-red/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all group relative overflow-hidden"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-800 to-transparent opacity-20 rounded-bl-full"></div>

                        {/* Content */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    {item.race} <span className="text-slate-500 text-xs font-normal border border-slate-700 px-1 rounded">{item.year}</span>
                                </h3>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">{item.session === 'Q' ? 'Qualifying' : item.session === 'R' ? 'Race' : item.session}</p>
                            </div>
                        </div>

                        {/* Matchup */}
                        <div className="bg-slate-950/50 rounded p-3 mb-4 flex items-center justify-between border border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-cyan-400 text-sm">{item.driver1}</span>
                                <span className="text-slate-600 text-xs">vs</span>
                                <span className="font-bold text-red-400 text-sm">{item.driver2}</span>
                            </div>
                            <Users className="w-4 h-4 text-slate-700" />
                        </div>

                        {/* Action */}
                        <button
                            onClick={() => onLoad(item)}
                            className="w-full py-2 bg-slate-800 hover:bg-brand-red text-slate-300 hover:text-white rounded flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                        >
                            <PlayCircle className="w-4 h-4" />
                            Load Analysis
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
