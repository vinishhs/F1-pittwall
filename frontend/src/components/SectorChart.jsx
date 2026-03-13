import React from 'react';
import Plot from 'react-plotly.js';

export default function SectorChart({ data, driver1, driver2 }) {
    if (!data || !data.d1 || !data.d2) return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest animate-in fade-in">
            Awaiting Sector Data...
        </div>
    );

    // Color Logic: Purple (#a855f7) for faster, Slate (#475569) for slower
    const getColors = (secKey) => {
        const t1 = Number(data.d1[secKey]) || 0;
        const t2 = Number(data.d2[secKey]) || 0;

        if (t1 === 0 || t2 === 0) return ['#475569', '#475569'];

        if (t1 < t2) return ['#a855f7', '#475569']; // D1 faster (Purple), D2 slower (Slate)
        return ['#475569', '#a855f7']; // D1 slower, D2 faster
    };

    const s1Colors = getColors('s1');
    const s2Colors = getColors('s2');
    const s3Colors = getColors('s3');

    // Prepare Traces
    const trace1 = {
        x: ['Sector 1', 'Sector 2', 'Sector 3'],
        y: [Number(data.d1.s1), Number(data.d1.s2), Number(data.d1.s3)],
        name: driver1,
        type: 'bar',
        marker: {
            color: [s1Colors[0], s2Colors[0], s3Colors[0]],
            line: { width: 0 }
        },
        text: [Number(data.d1.s1).toFixed(3), Number(data.d1.s2).toFixed(3), Number(data.d1.s3).toFixed(3)],
        textposition: 'auto',
        hoverinfo: 'y+name'
    };

    const trace2 = {
        x: ['Sector 1', 'Sector 2', 'Sector 3'],
        y: [Number(data.d2.s1), Number(data.d2.s2), Number(data.d2.s3)],
        name: driver2,
        type: 'bar',
        marker: {
            color: [s1Colors[1], s2Colors[1], s3Colors[1]],
            line: { width: 0 }
        },
        text: [Number(data.d2.s1).toFixed(3), Number(data.d2.s2).toFixed(3), Number(data.d2.s3).toFixed(3)],
        textposition: 'auto',
        hoverinfo: 'y+name'
    };

    const layout = {
        barmode: 'group',
        height: 140,
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 30, b: 20, l: 40, r: 10 },
        font: { family: 'monospace' },
        xaxis: {
            tickfont: { color: '#94a3b8', size: 10 },
            fixedrange: true
        },
        yaxis: {
            title: 'Seconds',
            titlefont: { size: 10, color: '#64748b' },
            tickfont: { color: '#64748b', size: 10 },
            gridcolor: '#1e293b',
            zeroline: false,
            fixedrange: true
        },
        showlegend: false,
        hoverlabel: {
            bgcolor: '#1e293b',
            bordercolor: '#334155',
            font: { color: '#f8fafc' }
        },
        // Add Annotations for Deltas
        annotations: ['s1', 's2', 's3'].map((sec, i) => {
            const delta = data.deltas[sec];
            if (delta === null) return null;

            const maxVal = Math.max(data.d1[sec], data.d2[sec]);
            const sign = delta > 0 ? '+' : ''; // If positive, D1 is slower (gap to D2). If negative, D1 is faster.
            // Actually, delta = d1 - d2.
            // If delta is -0.1, D1 is 0.1s faster.
            // If delta is +0.1, D1 is 0.1s slower.
            // Usually we show Gap magnitude.
            const absDelta = Math.abs(delta).toFixed(3);

            return {
                x: i,
                y: maxVal,
                text: `${absDelta}s`,
                showarrow: false,
                yshift: 10,
                font: { color: '#e2e8f0', size: 10, weight: 'bold' }
            };
        }).filter(a => a)
    };

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-2 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between px-2 mb-1">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Sector Dominance
                </h3>
                <div className="flex gap-3 text-[10px] font-mono">
                    <span className="text-purple-400">5a0 FASTER</span>
                    <span className="text-slate-500">5a0 SLOWER</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                <Plot
                    data={[trace1, trace2]}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                    config={{ responsive: true, displayModeBar: false, staticPlot: false }}
                />
            </div>
        </div>
    );
}
