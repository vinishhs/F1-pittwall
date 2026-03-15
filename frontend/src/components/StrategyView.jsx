import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Layers, AlertTriangle, AlertCircle } from 'lucide-react';
import client from '../api/client';

export default function StrategyView({ loadedParams }) {
    const [stintData, setStintData] = useState([]);
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
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

    const plotData = useMemo(() => {
        if (!stintData || stintData.length === 0) return [];

        const traces = [];
        
        // Define colors based on loadedParams if possible, else default Cyan vs Red
        const d1Color = '#06b6d4'; // Cyan
        const d2Color = '#ef4444'; // Red

        stintData.forEach((stint) => {
            const isD1 = loadedParams && stint.Driver === loadedParams.driver1;
            const baseColor = isD1 ? d1Color : d2Color;
            
            // Marker coloring logic: >1.5s is Yellow, >3.0s is Red cliff (or bright magenta if D2 is already red)
            // Actually, we'll use solid Yellow (#eab308) and OrangeRed (#ea580c) for cliff to stand out from regular line red
            const markerColors = stint.LapTimes.map(t => {
                const delta = t - stint.BasePace;
                if (delta > 3.0) return '#ea580c'; // The Cliff (Orange-Red)
                if (delta > 1.5) return '#eab308'; // Warning (Yellow)
                return baseColor; // standard step
            });
            
            // Marker sizes: Make the warnings slightly bigger
            const markerSizes = stint.LapTimes.map(t => {
                const delta = t - stint.BasePace;
                if (delta > 3.0) return 10;
                if (delta > 1.5) return 8;
                return 4;
            });
            
            // Compound line and marker styling
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
                        color: '#000000',
                        width: 1
                    }
                },
                // Build a nice hover template
                text: stint.LapTimes.map((t, i) => 
                    `Lap: ${stint.LapNumbers[i]}<br>` +
                    `Time: ${t.toFixed(3)}s<br>` +
                    `Delta to Base: +${(t - stint.BasePace).toFixed(3)}s<br>` +
                    `Compound: ${stint.Compound} (L${stint.TyreLife[i]})`
                ),
                hoverinfo: 'text',
                connectgaps: false // prevent teleporting line if gap exists
            });
        });

        return traces;
    }, [stintData, loadedParams]);

    if (!loadedParams) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-500">
                <Layers className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-light">Select race parameters and analyze to view strategy.</p>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-500">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                <p className="animate-pulse">Loading Stint History...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-red-500">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="font-bold">{errorMsg}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4 duration-500 max-h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Layers className="w-6 h-6 text-brand-red" />
                        Tire Degradation Overview
                    </h2>
                    <p className="text-sm text-slate-400">Lap-over-lap pace falloff and stint longevity.</p>
                </div>
                <div className="flex gap-4 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 p-2 rounded">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500"></div>{loadedParams.driver1} (Base)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div>{loadedParams.driver2} (Target)</div>
                    <div className="flex items-center gap-2 ml-4 border-l border-slate-800 pl-4"><div className="w-3 h-3 rounded-full bg-yellow-500"></div>&gt; 1.5s Drop</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-600"></div>&gt; 3.0s Cliff</div>
                </div>
            </div>

            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-lg p-2 min-h-0 relative">
                {stintData.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                        <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No valid stint data found for this session.</p>
                    </div>
                ) : (
                    <Plot
                        data={plotData}
                        layout={{
                            autosize: true,
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            margin: { t: 20, b: 40, l: 50, r: 20 },
                            xaxis: {
                                title: { text: "Lap Number", font: { color: "#64748b" } },
                                tickfont: { color: "#64748b" },
                                gridcolor: "#1e293b",
                                dtick: 5
                            },
                            yaxis: {
                                title: { text: "Lap Time (s)", font: { color: "#64748b" } },
                                tickfont: { color: "#64748b" },
                                gridcolor: "#1e293b",
                                dtick: 1
                            },
                            showlegend: true,
                            legend: {
                                orientation: 'h',
                                y: 1.1,
                                font: { color: "#cbd5e1" }
                            },
                            hovermode: 'closest'
                        }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                        config={{ responsive: true, displayModeBar: false }}
                    />
                )}
            </div>
        </div>
    );
}
