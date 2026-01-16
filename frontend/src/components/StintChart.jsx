import React from 'react';
import Plot from 'react-plotly.js';

export default function StintChart({ data }) {
    if (!data || data.length === 0) return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest animate-in fade-in">
            Strategy Data Unavailable for this Session Type
        </div>
    );

    // Official F1 Pirelli Tire Colors
    const compoundColors = {
        'SOFT': '#ef4444',    // Red
        'MEDIUM': '#eab308',  // Yellow
        'HARD': '#f8fafc',    // White
        'INTERMEDIATE': '#22c55e', // Green
        'WET': '#3b82f6',     // Blue
        'UNKNOWN': '#64748b'  // Slate
    };

    // Prepare data for Plotly
    // We iterate through stints and create a trace for EACH stint to allow individual coloring
    // In a stacked horizontal bar, x is length, y is category (Driver)
    const traces = data.map((stint) => {
        const duration = stint.EndLap - stint.StartLap;
        const color = compoundColors[stint.Compound.toUpperCase()] || compoundColors['UNKNOWN'];

        return {
            x: [duration],
            y: [stint.Driver], // Y-axis is Driver Name
            base: [stint.StartLap], // Offset from start
            orientation: 'h',
            type: 'bar',
            name: stint.Compound, // For Legend
            text: stint.Compound.substring(0, 1), // S, M, H
            textposition: 'auto',
            hoverinfo: 'text',
            hovertext: `<b style="color:${color}">${stint.Compound}</b><br>Laps: ${stint.StartLap} - ${stint.EndLap}<br>Life: ${stint.TyreLife}`,
            marker: {
                color: color,
                line: {
                    color: '#020617', // Dark separator
                    width: 1
                }
            },
            showlegend: false
        };
    });

    const layout = {
        barmode: 'stack',
        height: 140, // Fixed height
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 25, b: 25, l: 60, r: 20 }, // Left margin for Driver Names

        yaxis: {
            color: '#94a3b8',
            tickfont: { size: 12, weight: 'bold', family: 'monospace' },
            fixedrange: true,
            categoryorder: 'category descending'
        },
        xaxis: {
            title: 'Lap Number',
            titlefont: { size: 10, color: '#475569' },
            color: '#64748b',
            gridcolor: '#1e293b',
            zeroline: false,
            fixedrange: true
        },
        showlegend: false,
        hoverlabel: {
            bgcolor: '#1e293b',
            bordercolor: '#334155',
            font: { color: '#f8fafc' }
        }
    };

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-2 flex flex-col relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Tire Strategy
            </h3>
            <div className="flex-1 min-h-0 relative">
                <Plot
                    data={traces}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                    config={{ responsive: true, displayModeBar: false, staticPlot: false }}
                />
            </div>
        </div>
    );
}
