import React from 'react';
import Plot from 'react-plotly.js';

export default function TelemetryCharts({ data, onHover, hoverIndex }) {
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

    // 5. Energy (Subplot 5)
    // Conditional Coloring for Energy (Green for Recharge, Red for Boost)
    const getEnergyColors = (driverData) => {
        return driverData.Throttle.map((t, i) => {
            const delta = driverData.EnergyDelta[i];
            if (delta < 0 && t > 95) return '#ef4444'; // Red (Boost/MOM)
            if (delta > 0) return '#22c55e'; // Green (Recharge)
            return '#94a3b8'; // Slate 400 (Neutral)
        });
    };

    const traceEnergyD1 = {
        x: distance,
        y: d1.Energy,
        name: 'D1 Energy',
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: getEnergyColors(d1), size: 1 },
        line: { color: '#06b6d4', width: 1.5, shape: 'spline' },
        xaxis: 'x',
        yaxis: 'y5'
    };
    const traceEnergyD2 = {
        x: distance,
        y: d2.Energy,
        name: 'D2 Energy',
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: getEnergyColors(d2), size: 1 },
        line: { color: '#ef4444', width: 1.5, shape: 'spline' },
        xaxis: 'x',
        yaxis: 'y5'
    };

    const layout = {
        grid: { rows: 5, columns: 1, pattern: 'independent' },
        height: 900,
        paper_bgcolor: '#0f172a', // Slate 900
        plot_bgcolor: '#0f172a',
        font: { color: '#e2e8f0' },
        margin: { t: 50, b: 50, l: 60, r: 20 },
        showlegend: false,
        hovermode: 'x unified',

        // Axes Configuration
        xaxis: {
            title: 'Distance (m)',
            showgrid: false,
            zeroline: false,
            rangeslider: { visible: false },
            showspikes: true,
            spikemode: 'across',
            spikedash: 'dash',
            spikecolor: '#ffffff',
            spikethickness: 1,
            hoverformat: '.0f'
        },

        yaxis: {
            title: 'Delta (s)',
            domain: [0.84, 1.0], // Top 16%
            zeroline: true,
            zerolinecolor: '#475569'
        },
        yaxis2: {
            title: 'Speed (km/h)',
            domain: [0.64, 0.81]
        },
        yaxis3: {
            title: 'Throttle (%)',
            domain: [0.44, 0.61],
            range: [0, 105]
        },
        yaxis4: {
            title: 'Brake',
            domain: [0.24, 0.41]
        },
        yaxis5: {
            title: 'Energy (%)',
            domain: [0, 0.17],
            range: [0, 105]
        },

        xaxis2: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis3: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis4: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis5: { matches: 'x', overlaying: 'x', showticklabels: false }
    };

    // Aero Indicator Determination
    const getAeroProps = (drs) => {
        if (drs === 1) return { 
            text: '[X-MODE: STRAIGHT]', 
            color: 'text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff] animate-pulse',
            shadow: '0 0 10px #00f5ff'
        };
        return { 
            text: '[Z-MODE: CORNER]', 
            color: 'text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7] animate-pulse',
            shadow: '0 0 10px #a855f7'
        };
    };

    // For 2026 Regulations: Determine Aero mode based on hover position or default to start
    const currentIdx = hoverIndex !== null ? hoverIndex : 0;
    const aeroValue = d1.aero_mode ? d1.aero_mode[currentIdx] : (d2.aero_mode ? d2.aero_mode[currentIdx] : 0);
    const props = getAeroProps(aeroValue);

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2 px-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">2026 Aero Control</div>
                <div 
                    className={`px-3 py-1 rounded-full border text-[10px] font-black transition-all duration-300 ${props.color}`}
                    style={{ boxShadow: props.shadow }}
                >
                    {props.text}
                </div>
            </div>
            
            <div className="flex-1 min-h-[800px]">
                <Plot
                    data={[
                        traceDelta,
                        traceSpeedD1, traceSpeedD2,
                        traceThrottleD1, traceThrottleD2,
                        traceBrakeD1, traceBrakeD2,
                        traceEnergyD1, traceEnergyD2
                    ]}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                    config={{ responsive: true, displayModeBar: false }}
                    onHover={(e) => {
                        if (onHover && e.points && e.points.length > 0) {
                            onHover(e.points[0].pointIndex);
                        }
                    }}
                />
            </div>
        </div>
    );
}
