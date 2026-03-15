import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Layers, AlertTriangle, AlertCircle } from 'lucide-react';
import client from '../api/client';

export default function StrategyView({ loadedParams }) {
    const [stintData, setStintData] = useState([]);
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!loadedParams) return;
        
        const fetchStints = async () => {
            setStatus('loading');
            try {
                const res = await client.get('/stints', { params: loadedParams });
                setStintData(res.data);
                setStatus('success');
            } catch (err) {
                console.error("Stints Fetch Error:", err);
                setStatus('error');
                setErrorMsg("Failed to load stint data.");
            }
        };

        fetchStints();
    }, [loadedParams]);

    const { plotData, shapes, strategyInfo } = useMemo(() => {
        if (!stintData || stintData.length === 0) return { plotData: [], shapes: [], strategyInfo: [] };

        const traces = [];
        const rects = [];
        const strategies = [];
        
        const d1Color = '#00f0ff';
        const d2Color = '#e53935';

        stintData.forEach((stint) => {
            const isD1 = loadedParams && stint.Driver === loadedParams.driver1;
            const baseColor = isD1 ? d1Color : d2Color;
            
            const markerColors = stint.LapTimes.map(t => {
                const delta = t - stint.BasePace;
                if (delta > 3.0) return '#e53935'; 
                if (delta > 1.5) return '#eab308'; 
                return baseColor;
            });
            
            const markerSizes = stint.LapTimes.map(t => {
                const delta = t - stint.BasePace;
                if (delta > 3.0) return 10;
                if (delta > 1.5) return 8;
                return 4;
            });
            
            let dashStyle = 'solid';
            let markerSymbol = 'circle';
            if (stint.Compound === 'MEDIUM') {
                dashStyle = 'dash';
                markerSymbol = 'square';
            } else if (stint.Compound === 'HARD') {
                dashStyle = 'dot';
                markerSymbol = 'diamond';
            }

            traces.push({
                x: stint.LapNumbers,
                y: stint.LapTimes,
                mode: 'lines+markers',
                type: 'scatter',
                name: `${stint.Driver} - S${stint.Stint} (${stint.Compound})`,
                line: {
                    color: baseColor,
                    width: 2,
                    dash: dashStyle
                },
                marker: {
                    symbol: markerSymbol,
                    color: markerColors,
                    size: markerSizes,
                    line: {
                        color: '#0a0e17',
                        width: 1
                    }
                },
                text: stint.LapTimes.map((t, i) => 
                    `Lap: ${stint.LapNumbers[i]}<br>` +
                    `Time: ${t.toFixed(3)}s<br>` +
                    `Delta to Base: +${(t - stint.BasePace).toFixed(3)}s<br>` +
                    `Compound: ${stint.Compound} (L${stint.TyreLife[i]})`
                ),
                hoverinfo: 'text',
                connectgaps: false
            });

            if (stint.Strategy) {
                rects.push({
                    type: 'rect',
                    xref: 'x',
                    yref: 'paper',
                    x0: stint.Strategy.PitWindowStart,
                    x1: stint.Strategy.PitWindowEnd,
                    y0: 0,
                    y1: 1,
                    fillcolor: 'rgba(0, 240, 255, 0.08)',
                    line: { width: 1, color: 'rgba(0, 240, 255, 0.25)', dash: 'dot' }
                });
                strategies.push({
                    driver: stint.Driver,
                    start: stint.Strategy.PitWindowStart,
                    end: stint.Strategy.PitWindowEnd,
                    exitDelta: stint.Strategy.ProjectedExitDelta,
                    color: baseColor
                });
            }
        });

        return { plotData: traces, shapes: rects, strategyInfo: strategies };
    }, [stintData, loadedParams]);

    if (!loadedParams) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-[#4a5568] animate-in fade-in duration-500">
                <Layers className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm tracking-wider">SELECT RACE PARAMETERS TO INITIALIZE_</p>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-[#4a5568] animate-in fade-in duration-500">
                <div className="w-12 h-12 border-2 border-terminal-border border-t-brand-cyan rounded-full animate-spin mb-4"></div>
                <p className="animate-pulse text-[11px] tracking-widest">LOADING_STINT_HISTORY...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-crimson">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-[11px] tracking-wider">{errorMsg}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4 duration-500 max-h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-4">
                    <div className="w-1 h-6 bg-brand-crimson"></div>
                    <div>
                        <h2 className="text-[13px] tracking-widest text-[#c8d6e5]">
                            STRATEGY & TIRE LIFECYCLE
                        </h2>
                        <p className="text-[10px] text-[#4a5568] tracking-wider mt-0.5">COMPARATIVE ANALYSIS: LAP TIME DELTA (S) VS TOTAL LAPS</p>
                    </div>
                    <div className="px-2 py-0.5 bg-brand-crimson/20 text-brand-crimson text-[9px] tracking-wider rounded border border-brand-crimson/30 terminal-blink">
                        ● LIVE DATA
                    </div>
                </div>
                <div className="flex gap-6 text-[10px] text-[#4a5568] tracking-wider">
                    <span className="flex items-center gap-2">── SOFT (S)</span>
                    <span className="flex items-center gap-2">- - MEDIUM (M)</span>
                    <span className="flex items-center gap-2">··· HARD (H)</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 bg-terminal-surface border border-terminal-border rounded-lg p-2 min-h-0 relative mb-4">
                {stintData.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#4a5568]">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p className="text-[11px] tracking-wider">NO_VALID_STINT_DATA</p>
                    </div>
                ) : (
                    <Plot
                        data={plotData}
                        layout={{
                            autosize: true,
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            margin: { t: 20, b: 40, l: 50, r: 20 },
                            font: { family: 'Share Tech Mono' },
                            xaxis: {
                                title: { text: "LAP NUMBER", font: { color: "#4a5568", family: "Share Tech Mono" } },
                                tickfont: { color: "#4a5568", family: "Share Tech Mono" },
                                gridcolor: "#1a2332",
                                dtick: 5
                            },
                            yaxis: {
                                title: { text: "LAP TIME (S)", font: { color: "#4a5568", family: "Share Tech Mono" } },
                                tickfont: { color: "#4a5568", family: "Share Tech Mono" },
                                gridcolor: "#1a2332",
                                dtick: 1
                            },
                            showlegend: true,
                            legend: {
                                orientation: 'h',
                                y: 1.1,
                                font: { color: "#4a5568", family: "Share Tech Mono", size: 10 }
                            },
                            hovermode: 'closest',
                            shapes: shapes
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                        config={{ responsive: true, displayModeBar: false }}
                    />
                )}
            </div>

            {/* Strategy Insight Cards */}
            {strategyInfo.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-12 duration-1000 ease-out">
                    {strategyInfo.map((info, idx) => {
                        const isClear = info.exitDelta == null || Math.abs(info.exitDelta) > 2.0;
                        const exitLabel = info.exitDelta != null
                            ? (info.exitDelta >= 0 ? `+${info.exitDelta}s ahead` : `${Math.abs(info.exitDelta)}s behind`)
                            : 'N/A';
                        const targetDriver = loadedParams.driver1 === info.driver ? loadedParams.driver2 : loadedParams.driver1;

                        return (
                            <div key={idx} className="terminal-card rounded-lg p-4 border-l-2 border-l-brand-cyan hover:bg-terminal-elevated transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] text-[#4a5568] tracking-widest">
                                        STRATEGY INSIGHT
                                    </h3>
                                    <span style={{ color: info.color }} className="text-[11px] tracking-wider">{info.driver}</span>
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#4a5568] tracking-widest mb-1">RECOMMENDED WINDOW</p>
                                    <p className="text-xl text-brand-cyan terminal-glow tracking-wider">LAPS {info.start}—{info.end}</p>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Traffic Analysis Card */}
                    {strategyInfo[0] && (
                        <div className="terminal-card rounded-lg p-4 border-l-2 border-l-brand-crimson hover:bg-terminal-elevated transition-all duration-300">
                            <h3 className="text-[10px] text-[#4a5568] tracking-widest mb-3">TRAFFIC ANALYSIS</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-[#4a5568] tracking-wider">CURRENT STATUS</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded tracking-wider ${
                                        (strategyInfo[0].exitDelta == null || Math.abs(strategyInfo[0].exitDelta) > 2.0)
                                            ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                                            : 'bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30'
                                    }`}>
                                        {(strategyInfo[0].exitDelta == null || Math.abs(strategyInfo[0].exitDelta) > 2.0) ? 'CLEAR AIR' : 'IN TRAFFIC'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-[#4a5568] tracking-wider">PIT EXIT (EST)</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded tracking-wider bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                                        CLEAR AIR
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Track Position Delta Card */}
                    {strategyInfo[0] && (
                        <div className="terminal-card rounded-lg p-4 border-l-2 border-l-yellow-500 hover:bg-terminal-elevated transition-all duration-300">
                            <h3 className="text-[10px] text-[#4a5568] tracking-widest mb-1">TRACK POSITION DELTA</h3>
                            <p className="text-[9px] text-[#4a5568] tracking-wider mb-3">
                                VS {loadedParams.driver2} (TARGET)
                            </p>
                            <p className="text-2xl text-brand-crimson tracking-wider">
                                {strategyInfo[0].exitDelta != null ? (
                                    <>{strategyInfo[0].exitDelta >= 0 ? '+' : '-'}{Math.abs(strategyInfo[0].exitDelta).toFixed(1)}s</>
                                ) : 'N/A'}
                                <span className="text-[10px] text-brand-crimson/60 ml-2">BEHIND</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
