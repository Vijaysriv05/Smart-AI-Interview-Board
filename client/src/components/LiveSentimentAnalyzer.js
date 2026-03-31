import React, { useState, useEffect } from 'react';
import { Activity, BrainCircuit } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const LiveSentimentAnalyzer = () => {
    const [dataPoints, setDataPoints] = useState([70, 75, 80, 85, 82, 90]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => {
                const newData = [...prev.slice(1)];
                newData.push(Math.max(40, Math.min(100, newData[newData.length - 1] + (Math.random() * 20 - 10))));
                return newData;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const data = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [{
            label: 'Confidence Interval',
            data: dataPoints,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
        }]
    };

    return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-80 relative overflow-hidden text-white flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center mb-1">
                        <Activity size={12} className="mr-2" /> Live Sentiment
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">System Online</p>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-inner">
                    <BrainCircuit size={16} className="text-emerald-500 animate-pulse" />
                </div>
            </div>

            <div className="flex justify-between items-end mb-4 relative z-10">
                <span className="text-4xl font-black tracking-tighter text-white">
                    {Math.round(dataPoints[dataPoints.length - 1])}
                    <span className="text-sm text-slate-500 ml-1">%</span>
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    dataPoints[dataPoints.length - 1] > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                    {dataPoints[dataPoints.length - 1] > 80 ? 'Optimal' : 'Investigating'}
                </span>
            </div>

            <div className="h-24 relative z-10 -mx-2 -mb-2">
                <Line 
                    data={data} 
                    options={{ 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false }, tooltip: { enabled: false } }, 
                        scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } },
                        animation: { duration: 500 }
                    }} 
                />
            </div>
        </div>
    );
};

export default LiveSentimentAnalyzer;
