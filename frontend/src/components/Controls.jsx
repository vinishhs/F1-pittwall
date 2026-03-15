import React, { useState, useEffect } from 'react';
import { PlayCircle, AlertTriangle } from 'lucide-react';

export default function Controls({ onAnalyze, status, errorMsg, initialParams }) {
    const [params, setParams] = useState(initialParams || {
        year: '2024',
        race: 'Silverstone',
        session: 'Q',
        driver1: 'VER',
        driver2: 'NOR'
    });

    useEffect(() => {
        if (initialParams) {
            setParams(initialParams);
        }
    }, [initialParams]);

    const handleAnalyze = () => {
        if (onAnalyze) {
            onAnalyze(params);
        }
    };

    const selectClasses = "w-full bg-terminal-base text-[#c8d6e5] text-[12px] tracking-wider rounded border border-terminal-border p-2.5 outline-none focus:border-brand-cyan/50 focus:shadow-cyan-glow transition-all";

    return (
        <div className="terminal-card rounded-lg p-4 flex items-end gap-4">
            <div className="flex-1 grid grid-cols-5 gap-4">
                {/* Year */}
                <div className="flex flex-col">
                    <label className="text-[9px] text-[#4a5568] tracking-[0.2em] mb-1.5">YEAR</label>
                    <select
                        className={selectClasses}
                        value={params.year}
                        onChange={(e) => setParams({ ...params, year: e.target.value })}
                    >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>

                {/* Race */}
                <div className="flex flex-col">
                    <label className="text-[9px] text-[#4a5568] tracking-[0.2em] mb-1.5">GRAND PRIX</label>
                    <select
                        className={selectClasses}
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
                    <label className="text-[9px] text-[#4a5568] tracking-[0.2em] mb-1.5">SESSION</label>
                    <select
                        className={selectClasses}
                        value={params.session}
                        onChange={(e) => setParams({ ...params, session: e.target.value })}
                    >
                        <option value="Q">Qualifying</option>
                        <option value="R">Race</option>
                        <option value="FP1">FP1</option>
                        <option value="FP2">FP2</option>
                    </select>
                </div>

                {/* Driver Alpha */}
                <div className="flex flex-col">
                    <label className="text-[9px] text-brand-cyan/70 tracking-[0.2em] mb-1.5">DRIVER_ALPHA</label>
                    <select
                        className={`${selectClasses} !text-brand-cyan !border-brand-cyan/30`}
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

                {/* Driver Bravo */}
                <div className="flex flex-col">
                    <label className="text-[9px] text-brand-crimson/70 tracking-[0.2em] mb-1.5">DRIVER_BRAVO</label>
                    <select
                        className={`${selectClasses} !text-brand-crimson !border-brand-crimson/30`}
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

            {/* RUN Button */}
            <div className="w-28 flex flex-col justify-end">
                <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    className="w-full h-[42px] bg-brand-cyan text-terminal-base font-bold rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[12px] tracking-widest hover:shadow-cyan-glow active:scale-95"
                >
                    {status === 'loading' ? (
                        <span className="tracking-widest">WAIT...</span>
                    ) : (
                        <span>RUN</span>
                    )}
                </button>
            </div>

            {/* Error Toast */}
            {status === 'error' && (
                <div className="fixed top-14 right-6 z-50 p-3 bg-brand-crimson/20 border border-brand-crimson/50 rounded flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
                    <AlertTriangle className="w-4 h-4 text-brand-crimson" />
                    <span className="text-brand-crimson text-[11px] tracking-wider">{errorMsg}</span>
                </div>
            )}
        </div>
    );
}
