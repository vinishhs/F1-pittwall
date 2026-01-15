import React, { useState } from 'react';
import { PlayCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import client from '../api/client';

export default function Controls() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const handleAnalyze = async () => {
        setStatus('loading');
        setErrorMsg('');
        try {
            // H ardcoded for Phase 3 Verification
            const params = {
                year: 2024,
                race: 'Silverstone',
                session: 'Q',
                driver1: 'VER',
                driver2: 'NOR'
            };

            console.log("Requesting Telemetry...", params);
            const res = await client.get('/telemetry', { params });

            console.log("TELEMETRY DATA RECEIVED:", res.data);

            // Basic verification of shape
            if (res.data.distance && res.data.distance.length === 500) {
                setStatus('success');
            } else {
                throw new Error("Received data but array length is incorrect.");
            }

        } catch (err) {
            console.error("Telemetry Error:", err);
            setStatus('error');
            setErrorMsg(err.message || "Failed to fetch");
        }
    };

    return (
        <div className="p-6">
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-xl max-w-lg">
                <h1 className="text-2xl font-bold text-white mb-2">Telemetry Analysis</h1>
                <p className="text-slate-400 mb-6">Phase 3 Verification: Click to fetch 2024 Silverstone data.</p>

                <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-brand-red hover:bg-red-600 text-white font-bold rounded flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <span>Analyzing...</span>
                    ) : (
                        <>
                            <PlayCircle className="w-5 h-5" />
                            <span>Analyze (VER vs NOR)</span>
                        </>
                    )}
                </button>

                {status === 'error' && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Data Received! Check Console for JSON.</span>
                    </div>
                )}
            </div>
        </div>
    );
}
