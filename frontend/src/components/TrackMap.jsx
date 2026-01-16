import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

export default function TrackMap({ data, hoverIndex }) {
    if (!data) return (
        <div className="w-full h-full bg-slate-900 rounded-lg p-4 border border-slate-800 flex items-center justify-center text-slate-500">
            No Track Data
        </div>
    );

    const { d1, delta } = data;

    // 1. Prepare Track Trace (Dominance Coloring)
    // We use 'markers' mode with a dense point cloud to simulate a multi-colored line.
    // This allows us to color each point individually based on the delta.
    const trackTrace = useMemo(() => {
        const colors = delta.map(d => d < 0 ? '#06b6d4' : '#ef4444'); // Cyan (D1 faster) vs Red (D2 faster)

        return {
            x: d1.X,
            y: d1.Y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: colors,
                size: 6, // Thickness of the "line"
            },
            hoverinfo: 'none', // Disable default hover info to keep it clean
            name: 'Track Map'
        };
    }, [d1, delta]);

    // 2. Prepare Scrubber Trace (Pulsing Dot)
    const scrubberTrace = useMemo(() => {
        if (hoverIndex === null || hoverIndex === undefined || !d1.X[hoverIndex]) return null;

        return {
            x: [d1.X[hoverIndex]],
            y: [d1.Y[hoverIndex]],
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: '#ffffff',
                size: 14,
                line: {
                    color: '#000000',
                    width: 2
                }
            },
            hoverinfo: 'none',
            name: 'Current Position'
        };
    }, [d1, hoverIndex]);

    // Combine traces
    const plotData = [trackTrace];
    if (scrubberTrace) {
        plotData.push(scrubberTrace);
    }

    const layout = {
        autosize: true,
        height: 300, // Fixed height for the map container
        paper_bgcolor: 'rgba(0,0,0,0)', // Transparent
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false,

        // Hide Axes for "Floating" look
        xaxis: {
            visible: false,
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            visible: false,
            showgrid: false,
            zeroline: false,
            scaleanchor: 'x', // CRITICAL: Ensures correct aspect ratio
            scaleratio: 1
        }
    };

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/50 rounded text-xs font-bold text-slate-300">
                TRACK DOMINANCE
            </div>
            <Plot
                data={plotData}
                layout={layout}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                config={{ responsive: true, displayModeBar: false, staticPlot: true }}
            />
            {/* Legend Overlay */}
            <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-1 text-[10px] font-mono bg-black/60 p-2 rounded border border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-cyan-100">Driver 1</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-red-100">Driver 2</span>
                </div>
            </div>
        </div>
    );
}
