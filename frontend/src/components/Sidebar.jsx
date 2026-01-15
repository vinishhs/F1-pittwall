import React, { useEffect, useState } from 'react';
import { Database, ChevronRight } from 'lucide-react';
import client from '../api/client';

export default function Sidebar() {
    const [comparisons, setComparisons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComparisons = async () => {
            try {
                const res = await client.get('/comparisons');
                setComparisons(res.data);
            } catch (err) {
                console.error("Failed to load comparisons", err);
            } finally {
                setLoading(false);
            }
        };
        fetchComparisons();
    }, []);

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-red" />
                <h2 className="font-bold text-slate-100">Saved History</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {loading ? (
                    <div className="text-slate-500 text-sm p-2">Loading...</div>
                ) : (
                    comparisons.map((comp) => (
                        <div key={comp._id} className="p-3 bg-slate-800/50 rounded hover:bg-slate-800 cursor-pointer transition border border-transparent hover:border-slate-700 group">
                            <div className="text-sm font-semibold text-slate-200">{comp.title}</div>
                            <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                <span>{comp.year} {comp.race}</span>
                            </div>
                            <div className="text-xs text-brand-cyan mt-1">
                                {comp.driver1} vs {comp.driver2}
                            </div>
                        </div>
                    ))
                )}
                {!loading && comparisons.length === 0 && (
                    <div className="text-slate-500 text-sm p-2 italic">No history found.</div>
                )}
            </div>
        </aside>
    );
}
