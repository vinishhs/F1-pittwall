import React, { useState } from 'react';
import { PlayCircle, AlertTriangle } from 'lucide-react';

export default function Controls({ onAnalyze, status, errorMsg }) {
    const [params, setParams] = useState({
        year: '2024',
        race: 'Silverstone',
        session: 'Q',
        driver1: 'VER',
        driver2: 'NOR'
    });

    const handleAnalyze = () => {
        if (onAnalyze) {
            onAnalyze(params);
        }
    };

    return (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-xl flex items-center gap-4">
            {/* Simple Horizontal Layout for Controls in Phase 5 */}
            <div className="flex-1 grid grid-cols-5 gap-4">
                {/* Year */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Year</label>
                    <select
                        className="bg-slate-800 text-white text-sm rounded border border-slate-700 p-2 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                        value={params.year}
                        onChange={(e) => setParams({ ...params, year: e.target.value })}
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>

                {/* Race */}
                <div className="flex flex-col col-span-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Grand Prix</label>
                    <select
                        className="bg-slate-800 text-white text-sm rounded border border-slate-700 p-2 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                        value={params.race}
                        onChange={(e) => setParams({ ...params, race: e.target.value })}
                    >
                        <option value="Bahrain">Bahrain</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Australia">Australia</option>
                        <option value="Miami">Miami</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Spain">Spain</option>
                        <option value="Canada">Canada</option>
                        <option value="Austria">Austria</option>
                        <option value="Silverstone">Silverstone</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Spa">Belgium (Spa)</option>
                        <option value="Monza">Italy (Monza)</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Suzuka">Japan (Suzuka)</option>
                        <option value="Austin">USA (Austin)</option>
                        <option value="Las Vegas">Las Vegas</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                    </select>
                </div>

                {/* Session */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Session</label>
                    <select
                        className="bg-slate-800 text-white text-sm rounded border border-slate-700 p-2 outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                        value={params.session}
                        onChange={(e) => setParams({ ...params, session: e.target.value })}
                    >
                        <option value="Q">Qualifying</option>
                        <option value="R">Race</option>
                        <option value="FP1">FP1</option>
                        <option value="FP2">FP2</option>
                    </select>
                </div>

                {/* Driver 1 */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-cyan-500 font-bold uppercase mb-1">Driver 1 (Ref)</label>
                    <select
                        className="bg-slate-800 text-cyan-400 font-bold text-sm rounded border border-slate-700 p-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        value={params.driver1}
                        onChange={(e) => setParams({ ...params, driver1: e.target.value })}
                    >
                        <option value="VER">VER</option>
                        <option value="PER">PER</option>
                        <option value="LEC">LEC</option>
                        <option value="SAI">SAI</option>
                        <option value="HAM">HAM</option>
                        <option value="RUS">RUS</option>
                        <option value="NOR">NOR</option>
                        <option value="PIA">PIA</option>
                        <option value="ALO">ALO</option>
                    </select>
                </div>

                {/* Driver 2 */}
                <div className="flex flex-col">
                    <label className="text-[10px] text-red-500 font-bold uppercase mb-1">Driver 2 (Tar)</label>
                    <select
                        className="bg-slate-800 text-red-400 font-bold text-sm rounded border border-slate-700 p-2 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        value={params.driver2}
                        onChange={(e) => setParams({ ...params, driver2: e.target.value })}
                    >
                        <option value="VER">VER</option>
                        <option value="PER">PER</option>
                        <option value="LEC">LEC</option>
                        <option value="SAI">SAI</option>
                        <option value="HAM">HAM</option>
                        <option value="RUS">RUS</option>
                        <option value="NOR">NOR</option>
                        <option value="PIA">PIA</option>
                        <option value="ALO">ALO</option>
                    </select>
                </div>
            </div>

            {/* Action Button */}
            <div className="w-40 flex flex-col justify-end">
                <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    className="w-full h-[42px] bg-brand-red hover:bg-red-600 text-white font-bold rounded flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20 text-sm"
                >
                    {status === 'loading' ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            <PlayCircle className="w-4 h-4" />
                            <span>Analyze</span>
                        </>
                    )}
                </button>
            </div>

            {/* Error Message */}
            {status === 'error' && (
                <div className="fixed top-24 right-6 z-50 p-4 bg-red-900/90 border border-red-500 rounded shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
                    <AlertTriangle className="w-5 h-5 text-red-200" />
                    <span className="text-white font-medium text-sm">{errorMsg}</span>
                </div>
            )}
        </div>
    );
}
