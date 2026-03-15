import React from 'react';
import Plot from 'react-plotly.js';

export default function TelemetryCharts({ data, onHover, hoverIndex }) {
    if (!data) return null;

    const { distance, d1, d2, delta } = data;

    // Trace Definitions
    const traceDelta = {
        x: distance,
        y: delta,
        name: 'Delta (Sec)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#facc15', width: 2 },
        xaxis: 'x',
        yaxis: 'y'
    };

    const traceSpeedD1 = {
        x: distance,
        y: d1.Speed,
        name: 'D1 Speed',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#00f0ff', width: 2 },
        xaxis: 'x',
        yaxis: 'y2'
    };
    const traceSpeedD2 = {
        x: distance,
        y: d2.Speed,
        name: 'D2 Speed',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#e53935', width: 2 },
        xaxis: 'x',
        yaxis: 'y2'
    };

    const traceThrottleD1 = {
        x: distance,
        y: d1.Throttle,
        name: 'D1 Throttle',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#00f0ff', width: 2 },
        xaxis: 'x',
        yaxis: 'y3'
    };
    const traceThrottleD2 = {
        x: distance,
        y: d2.Throttle,
        name: 'D2 Throttle',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#e53935', width: 2 },
        xaxis: 'x',
        yaxis: 'y3'
    };

    const traceBrakeD1 = {
        x: distance,
        y: d1.Brake,
        name: 'D1 Brake',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#00f0ff', width: 2 },
        xaxis: 'x',
        yaxis: 'y4'
    };
    const traceBrakeD2 = {
        x: distance,
        y: d2.Brake,
        name: 'D2 Brake',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#e53935', width: 2 },
        xaxis: 'x',
        yaxis: 'y4'
    };

    const getEnergyColors = (driverData) => {
        return driverData.Throttle.map((t, i) => {
            const delta = driverData.EnergyDelta[i];
            if (delta < 0 && t > 95) return '#e53935';
            if (delta > 0) return '#22c55e';
            return '#4a5568';
        });
    };

    const traceEnergyD1 = {
        x: distance,
        y: d1.Energy,
        name: 'D1 Energy',
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: getEnergyColors(d1), size: 1 },
        line: { color: '#00f0ff', width: 1.5, shape: 'spline' },
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
        line: { color: '#e53935', width: 1.5, shape: 'spline' },
        xaxis: 'x',
        yaxis: 'y5'
    };

    const axisCommon = {
        gridcolor: '#1a2332',
        tickfont: { color: '#4a5568', family: 'Share Tech Mono', size: 10 },
        titlefont: { color: '#4a5568', family: 'Share Tech Mono', size: 11 },
    };

    const layout = {
        grid: { rows: 5, columns: 1, pattern: 'independent' },
        height: 900,
        paper_bgcolor: '#0d1117',
        plot_bgcolor: '#0d1117',
        font: { color: '#c8d6e5', family: 'Share Tech Mono' },
        margin: { t: 50, b: 50, l: 60, r: 20 },
        showlegend: false,
        hovermode: 'x unified',

        xaxis: {
            title: 'Distance (m)',
            showgrid: false,
            zeroline: false,
            rangeslider: { visible: false },
            showspikes: true,
            spikemode: 'across',
            spikedash: 'dash',
            spikecolor: '#00f0ff',
            spikethickness: 1,
            hoverformat: '.0f',
            ...axisCommon
        },

        yaxis: { title: 'DELTA_(S)', domain: [0.84, 1.0], zeroline: true, zerolinecolor: '#1a2332', ...axisCommon },
        yaxis2: { title: 'SPEED_(KPH)', domain: [0.64, 0.81], ...axisCommon },
        yaxis3: { title: 'THROTTLE_(%)', domain: [0.44, 0.61], range: [0, 105], ...axisCommon },
        yaxis4: { title: 'BRAKE', domain: [0.24, 0.41], ...axisCommon },
        yaxis5: { title: 'ENERGY_(%)', domain: [0, 0.17], range: [0, 105], ...axisCommon },

        xaxis2: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis3: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis4: { matches: 'x', overlaying: 'x', showticklabels: false },
        xaxis5: { matches: 'x', overlaying: 'x', showticklabels: false }
    };

    // Aero Indicator
    const getAeroProps = (drs) => {
        if (drs === 1) return { 
            text: 'X-MODE: ACTIVE', 
            dotColor: 'bg-brand-cyan',
            textColor: 'text-brand-cyan'
        };
        return { 
            text: 'Z-MODE: STANDBY', 
            dotColor: 'bg-purple-500',
            textColor: 'text-purple-400'
        };
    };

    const currentIdx = hoverIndex !== null ? hoverIndex : 0;
    const aeroValue = d1.aero_mode ? d1.aero_mode[currentIdx] : (d2.aero_mode ? d2.aero_mode[currentIdx] : 0);
    const props = getAeroProps(aeroValue);

    return (
        <div className="w-full h-full bg-terminal-surface rounded-lg p-4 border border-terminal-border overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${props.dotColor} terminal-blink`}></span>
                        <span className={`text-[10px] tracking-widest ${props.textColor}`}>{props.text}</span>
                    </div>
                </div>
                <span className="text-[10px] text-[#4a5568] tracking-widest">TELEMETRY_ENGINE_V7.4</span>
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
