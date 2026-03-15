import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';

export default function TrackMap({ data, hoverIndex }) {
    const [mapMode, setMapMode] = useState('dominance');

    if (!data) return (
        <div className="w-full h-full bg-terminal-surface rounded-lg p-4 border border-terminal-border flex items-center justify-center text-[#4a5568] text-[11px] tracking-widest">
            NO_TRACK_DATA
        </div>
    );

    const { d1, delta } = data;

    const trackTrace = useMemo(() => {
        let colors = [];
        if (mapMode === 'dominance') {
            colors = delta.map(d => d < 0 ? '#00f0ff' : '#e53935');
        } else {
            colors = d1.EnergyDelta.map((d, i) => {
                const t = d1.Throttle[i];
                if (d < 0 && t > 95) return '#e53935';
                if (d > 0) return '#22c55e';
                return '#4a5568';
            });
        }

        return {
            x: d1.X,
            y: d1.Y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: colors,
                size: 6,
            },
            hoverinfo: 'none',
            name: 'Track Map'
        };
    }, [d1, delta, mapMode]);

    const scrubberTrace = useMemo(() => {
        if (hoverIndex === null || hoverIndex === undefined || !d1.X[hoverIndex]) return null;

        return {
            x: [d1.X[hoverIndex]],
            y: [d1.Y[hoverIndex]],
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: '#00f0ff',
                size: 16,
                line: {
                    color: '#0a0e17',
                    width: 2
                }
            },
            hoverinfo: 'none',
            name: 'Current Position'
        };
    }, [d1, hoverIndex]);

    const plotData = [trackTrace];
    if (scrubberTrace) {
        plotData.push(scrubberTrace);
    }

    const layout = {
        autosize: true,
        height: 300,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false,
        xaxis: { visible: false, showgrid: false, zeroline: false },
        yaxis: { visible: false, showgrid: false, zeroline: false, scaleanchor: 'x', scaleratio: 1 }
    };

    return (
        <div className="w-full h-full bg-terminal-surface rounded-lg border border-terminal-border overflow-hidden relative">
            {/* Header */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-3">
                <h3 className="text-[11px] text-[#c8d6e5] tracking-widest">CIRCUIT ANALYSIS</h3>
            </div>
            {/* Mode Toggle */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-0 text-[10px] tracking-wider bg-terminal-base rounded border border-terminal-border overflow-hidden">
                <button 
                    onClick={() => setMapMode('dominance')}
                    className={`px-2.5 py-1 transition ${mapMode === 'dominance' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-[#4a5568] hover:text-[#c8d6e5]'}`}
                >
                    MAP: SPEED
                </button>
                <button 
                    onClick={() => setMapMode('energy')}
                    className={`px-2.5 py-1 transition ${mapMode === 'energy' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-[#4a5568] hover:text-[#c8d6e5]'}`}
                >
                    MAP: ENERGY
                </button>
            </div>
            <Plot
                data={plotData}
                layout={layout}
                useResizeHandler={true}
                style={{ 
                    width: "100%", 
                    height: "100%", 
                    filter: mapMode === 'energy' ? 'drop-shadow(0 0 4px rgba(0,240,255,0.2))' : 'none' 
                }}
                className={mapMode === 'energy' ? "energy-glow-mode" : ""}
                config={{ responsive: true, displayModeBar: false, staticPlot: true }}
            />
            <style>{`
                .energy-glow-mode .scatterlayer .trace:first-child path {
                    filter: drop-shadow(0px 0px 6px currentColor);
                }
                .scatterlayer .trace:nth-child(2) path {
                    filter: drop-shadow(0px 0px 8px rgba(0, 240, 255, 0.8));
                }
            `}</style>
            {/* Legend */}
            <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1 text-[10px] bg-terminal-base/80 p-2 rounded border border-terminal-border backdrop-blur-sm">
                {mapMode === 'dominance' ? (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-0.5 bg-brand-cyan"></div>
                            <span className="text-brand-cyan tracking-wider">HARVEST</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-0.5 bg-brand-crimson"></div>
                            <span className="text-brand-crimson tracking-wider">DEPLOY</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-0.5 bg-brand-crimson"></div>
                            <span className="text-brand-crimson tracking-wider">BOOST_(MOM)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-0.5 bg-green-500"></div>
                            <span className="text-green-400 tracking-wider">RECHARGE</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
