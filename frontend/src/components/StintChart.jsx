import React from 'react';
import Plot from 'react-plotly.js';

export default function StintChart({ data }) {
    if (!data || data.length === 0) return (
        <div className="w-full h-32 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-600 text-sm">
            No Stint Data Available
        </div>
    );

    // Pirelli Tire Colors
    const compoundColors = {
        'SOFT': '#ef4444',    // Red
        'MEDIUM': '#facc15',  // Yellow
        'HARD': '#f8fafc',    // White
        'INTERMEDIATE': '#22c55e', // Green
        'WET': '#3b82f6',     // Blue
        'UNKNOWN': '#64748b'  // Slate
    };

    // Transform data for Plotly Horizontal Bars
    // We need to create a trace for each Stint segment to control color easily
    // Or closer to a gantt chart approach. 
    // Plotly 'barh' needs base.

    const traces = data.map((stint) => {
        const duration = stint.EndLap - stint.StartLap;
        const color = compoundColors[stint.Compound.toUpperCase()] || compoundColors['UNKNOWN'];

        return {
            x: [duration], // Width of the bar
            y: [stint.Driver],
            base: [stint.StartLap], // Start position
            orientation: 'h',
            type: 'bar',
            name: `${stint.Compound} (${stint.TyreLife} Laps)`,
            text: stint.Compound.substring(0, 1), // S, M, H
            textposition: 'auto',
            hoverinfo: 'text',
            hovertext: `Compound: ${stint.Compound}<br>Laps: ${stint.StartLap}-${stint.EndLap}<br>Life: ${stint.TyreLife}`,
            marker: {
                color: color,
                line: {
                    color: '#0f172a', // Separator color
                    width: 2
                }
            },
            showlegend: false
        };
    });

    const layout = {
        barmode: 'stack', // Stack them horizontally
        height: 140, // Compact height
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 30, b: 30, l: 50, r: 20 },

        yaxis: {
            color: '#94a3b8',
            tickfont: { size: 14, weight: 'bold' },
            categoryorder: 'category descending'
        },
        xaxis: {
            title: 'Lap Number',
            color: '#64748b',
            gridcolor: '#1e293b',
            zeroline: false
        },
        showlegend: false
    };

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-2 flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">Tire Strategy</h3>
            <div className="flex-1 min-h-0">
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
