import React, { useState, useEffect } from 'react';
import { PlayCircle, AlertTriangle, ChevronDown } from 'lucide-react';

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

    return (
        <div className="relative">
            {/* Controls Container with visible border and glow */}
            <div className="bg-terminal-surface border border-brand-cyan/20 rounded-lg p-5 shadow-cyan-glow relative overflow-hidden">
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent"></div>

                <div className="flex items-end gap-5">
                    <div className="flex-1 grid grid-cols-5 gap-5">
                        {/* Year */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-brand-cyan/80 tracking-[0.25em] font-bold">YEAR</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-terminal-base text-[#c8d6e5] text-[13px] tracking-wider rounded-md border border-terminal-border px-3 py-2.5 outline-none focus:border-brand-cyan/60 focus:shadow-cyan-glow transition-all cursor-pointer hover:border-brand-cyan/30"
                                    value={params.year}
                                    onChange={(e) => setParams({ ...params, year: e.target.value })}
                                >
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-cyan/50 pointer-events-none" />
                            </div>
                        </div>

                        {/* Race */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-brand-cyan/80 tracking-[0.25em] font-bold">GRAND_PRIX</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-terminal-base text-[#c8d6e5] text-[13px] tracking-wider rounded-md border border-terminal-border px-3 py-2.5 outline-none focus:border-brand-cyan/60 focus:shadow-cyan-glow transition-all cursor-pointer hover:border-brand-cyan/30"
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
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-cyan/50 pointer-events-none" />
                            </div>
                        </div>

                        {/* Session */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-brand-cyan/80 tracking-[0.25em] font-bold">SESSION</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-terminal-base text-[#c8d6e5] text-[13px] tracking-wider rounded-md border border-terminal-border px-3 py-2.5 outline-none focus:border-brand-cyan/60 focus:shadow-cyan-glow transition-all cursor-pointer hover:border-brand-cyan/30"
                                    value={params.session}
                                    onChange={(e) => setParams({ ...params, session: e.target.value })}
                                >
                                    <option value="Q">Qualifying</option>
                                    <option value="R">Race</option>
                                    <option value="FP1">FP1</option>
                                    <option value="FP2">FP2</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-cyan/50 pointer-events-none" />
                            </div>
                        </div>

                        {/* Driver Alpha */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-brand-cyan tracking-[0.25em] font-bold">DRIVER_ALPHA</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-brand-cyan/5 text-brand-cyan text-[15px] font-bold tracking-widest rounded-md border border-brand-cyan/30 px-3 py-2.5 outline-none focus:border-brand-cyan focus:shadow-cyan-glow transition-all cursor-pointer hover:bg-brand-cyan/10"
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
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-cyan/50 pointer-events-none" />
                            </div>
                        </div>

                        {/* Driver Bravo */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-brand-crimson tracking-[0.25em] font-bold">DRIVER_BRAVO</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-brand-crimson/5 text-brand-crimson text-[15px] font-bold tracking-widest rounded-md border border-brand-crimson/30 px-3 py-2.5 outline-none focus:border-brand-crimson focus:shadow-crimson-glow transition-all cursor-pointer hover:bg-brand-crimson/10"
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
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-crimson/50 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* RUN Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={status === 'loading'}
                        className="h-[44px] px-8 bg-brand-cyan text-terminal-base font-bold rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[13px] tracking-[0.3em] hover:shadow-cyan-glow hover:scale-[1.02] active:scale-95 shrink-0"
                    >
                        {status === 'loading' ? (
                            <span className="tracking-widest animate-pulse">WAIT</span>
                        ) : (
                            <span>RUN</span>
                        )}
                    </button>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent"></div>
            </div>

            {/* Error Toast */}
            {status === 'error' && (
                <div className="fixed top-14 right-6 z-50 p-3 bg-brand-crimson/20 border border-brand-crimson/50 rounded-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
                    <AlertTriangle className="w-4 h-4 text-brand-crimson" />
                    <span className="text-brand-crimson text-[11px] tracking-wider">{errorMsg}</span>
                </div>
            )}
        </div>
    );
}
