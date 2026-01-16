import React from 'react';
import Plot from 'react-plotly.js';

export default function TelemetryCharts({ data }) {
    if (!data) return null;

    const { distance, d1, d2, delta } = data;

    // Trace Definitions
    // 1. Delta (Subplot 1)
    const traceDelta = {
        x: distance,
        y: delta,
        name: 'Delta (Sec)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#facc15', width: 2 }, // Yellow
        xaxis: 'x',
        yaxis: 'y'
    };

    // 2. Speed (Subplot 2)
    const traceSpeedD1 = {
        x: distance,
        y: d1.Speed,
        name: 'D1 Speed',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#06b6d4', width: 2 }, // Cyan
        xaxis: 'x',
        yaxis: 'y2'
    };
    const traceSpeedD2 = {
        x: distance,
        y: d2.Speed,
        name: 'D2 Speed',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#ef4444', width: 2 }, // Red
        xaxis: 'x',
        yaxis: 'y2'
    };

    // 3. Throttle (Subplot 3)
    const traceThrottleD1 = {
        x: distance,
        y: d1.Throttle,
        name: 'D1 Throttle',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#06b6d4', width: 2 },
        xaxis: 'x',
        yaxis: 'y3'
    };
    const traceThrottleD2 = {
        x: distance,
        y: d2.Throttle,
        name: 'D2 Throttle',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#ef4444', width: 2 },
        xaxis: 'x',
        yaxis: 'y3'
    };

    // 4. Brake (Subplot 4)
    const traceBrakeD1 = {
        x: distance,
        y: d1.Brake,
        name: 'D1 Brake',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#06b6d4', width: 2 },
        xaxis: 'x',
        yaxis: 'y4'
    };
    const traceBrakeD2 = {
        x: distance,
        y: d2.Brake,
        name: 'D2 Brake',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#ef4444', width: 2 },
        xaxis: 'x',
        yaxis: 'y4'
    };

    const layout = {
        grid: { rows: 4, columns: 1, pattern: 'independent' },
        height: 800,
        paper_bgcolor: '#0f172a', // Slate 900
        plot_bgcolor: '#0f172a',
        font: { color: '#e2e8f0' },
        showlegend: true,
        hovermode: 'x unified',

        // Axes Configuration
        xaxis: {
            title: 'Distance (m)',
            showgrid: false,
            zeroline: false,
            rangeslider: { visible: false } // Disable generic rangeslider
        },

        yaxis: {
            title: 'Delta (s)',
            domain: [0.77, 1], // Top 23%
            zeroline: true,
            zerolinecolor: '#475569'
        },
        yaxis2: {
            title: 'Speed (km/h)',
            domain: [0.52, 0.75],
            matches: 'y2'
        },
        yaxis3: {
            title: 'Throttle (%)',
            domain: [0.27, 0.50],
            range: [0, 105]
        },
        yaxis4: {
            title: 'Brake',
            domain: [0, 0.25]
        },

        // Sync Zooming (Crucial: allxaxis matches 'x')
        // Actually in Plotly Independent Axes, we just share the same xaxis anchor
        // or we use matches: 'x' if using multiple xaxes. 
        // Here we use one 'xaxis' for all y-axes implies they are already shared.
        // But to be explicit for all subplots:
        xaxis2: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis3: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis4: { matches: 'x', overlaying: 'x', showticklabels: false }
    };

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-xl overflow-hidden">
            <Plot
                data={[
                    traceDelta,
                    traceSpeedD1, traceSpeedD2,
                    traceThrottleD1, traceThrottleD2,
                    traceBrakeD1, traceBrakeD2
                ]}
                layout={layout}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                config={{ responsive: true, displayModeBar: false }}
            />
        </div>
    );
}
