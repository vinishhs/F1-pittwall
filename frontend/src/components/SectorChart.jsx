import React from 'react';
import Plot from 'react-plotly.js';

export default function SectorChart({ data, driver1, driver2 }) {
    if (!data || !data.d1 || !data.d2) return (
        <div className="w-full h-full bg-terminal-surface rounded-lg border border-terminal-border flex items-center justify-center text-[#4a5568] text-[10px] tracking-widest animate-in fade-in">
            AWAITING_SECTOR_DATA...
        </div>
    );

    const getColors = (secKey) => {
        const t1 = Number(data.d1[secKey]) || 0;
        const t2 = Number(data.d2[secKey]) || 0;

        if (t1 === 0 || t2 === 0) return ['#1a2332', '#1a2332'];

        if (t1 < t2) return ['#00f0ff', '#1a2332'];
        return ['#1a2332', '#e53935'];
    };

    const s1Colors = getColors('s1');
    const s2Colors = getColors('s2');
    const s3Colors = getColors('s3');

    const trace1 = {
        x: ['SECTOR_01', 'SECTOR_02', 'SECTOR_03'],
        y: [Number(data.d1.s1), Number(data.d1.s2), Number(data.d1.s3)],
        name: driver1,
        type: 'bar',
        marker: {
            color: [s1Colors[0], s2Colors[0], s3Colors[0]],
            line: { width: 0 }
        },
        text: [Number(data.d1.s1).toFixed(3), Number(data.d1.s2).toFixed(3), Number(data.d1.s3).toFixed(3)],
        textposition: 'auto',
        textfont: { color: '#c8d6e5', size: 10, family: 'Share Tech Mono' },
        hoverinfo: 'y+name'
    };

    const trace2 = {
        x: ['SECTOR_01', 'SECTOR_02', 'SECTOR_03'],
        y: [Number(data.d2.s1), Number(data.d2.s2), Number(data.d2.s3)],
        name: driver2,
        type: 'bar',
        marker: {
            color: [s1Colors[1], s2Colors[1], s3Colors[1]],
            line: { width: 0 }
        },
        text: [Number(data.d2.s1).toFixed(3), Number(data.d2.s2).toFixed(3), Number(data.d2.s3).toFixed(3)],
        textposition: 'auto',
        textfont: { color: '#c8d6e5', size: 10, family: 'Share Tech Mono' },
        hoverinfo: 'y+name'
    };

    const layout = {
        barmode: 'group',
        height: 140,
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 30, b: 20, l: 40, r: 10 },
        font: { family: 'Share Tech Mono', color: '#4a5568' },
        xaxis: {
            tickfont: { color: '#4a5568', size: 10, family: 'Share Tech Mono' },
            fixedrange: true
        },
        yaxis: {
            title: 'Seconds',
            titlefont: { size: 10, color: '#4a5568', family: 'Share Tech Mono' },
            tickfont: { color: '#4a5568', size: 10, family: 'Share Tech Mono' },
            gridcolor: '#1a2332',
            zeroline: false,
            fixedrange: true
        },
        showlegend: false,
        hoverlabel: {
            bgcolor: '#0d1117',
            bordercolor: '#1a2332',
            font: { color: '#c8d6e5', family: 'Share Tech Mono' }
        },
        annotations: ['s1', 's2', 's3'].map((sec, i) => {
            const delta = data.deltas[sec];
            if (delta === null) return null;

            const maxVal = Math.max(data.d1[sec], data.d2[sec]);
            const absDelta = Math.abs(delta).toFixed(3);

            return {
                x: i,
                y: maxVal,
                text: `${absDelta}s`,
                showarrow: false,
                yshift: 10,
                font: { color: '#c8d6e5', size: 10, family: 'Share Tech Mono', weight: 'bold' }
            };
        }).filter(a => a)
    };

    return (
        <div className="w-full h-full bg-terminal-surface rounded-lg border border-terminal-border p-2 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between px-2 mb-1">
                <h3 className="text-[10px] text-[#4a5568] tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-cyan"></span> LIVE_SECTOR_DOMINANCE
                </h3>
                <div className="flex gap-3 text-[9px] tracking-wider">
                    <span className="text-brand-cyan flex items-center gap-1"><span className="w-2 h-2 bg-brand-cyan"></span> {driver1}</span>
                    <span className="text-brand-crimson flex items-center gap-1"><span className="w-2 h-2 bg-brand-crimson"></span> {driver2}</span>
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
