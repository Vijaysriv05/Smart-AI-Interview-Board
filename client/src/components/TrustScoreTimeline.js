import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, Monitor, CheckCircle, Activity } from 'lucide-react';

const TrustScoreTimeline = ({ score = 0 }) => {
    const [events, setEvents] = useState([
        { time: '0:00', type: 'start', label: 'Session Started', icon: <Activity size={12} />, color: 'bg-emerald-500' },
        { time: 'End', type: 'end', label: 'Session Completed', icon: <CheckCircle size={12} />, color: 'bg-blue-500' },
    ]);

    useEffect(() => {
        // Hydrate from localStorage if real flags were detected during mock interview
        const savedEvents = localStorage.getItem('interviewTrustEvents');
        if (savedEvents) {
            try {
                const parsed = JSON.parse(savedEvents);
                // Reconstruct icons
                const hydrated = parsed.map(e => ({
                    ...e,
                    icon: e.type === 'start' ? <Activity size={12}/> :
                          e.type === 'end' ? <CheckCircle size={12}/> :
                          e.type === 'normal' ? <CheckCircle size={12}/> :
                          e.label.includes('Tab') ? <Monitor size={12}/> : <Eye size={12}/>
                }));
                setEvents(hydrated);
            } catch (e) {}
        }
    }, []);

    const flagsCount = events.filter(e => e.type === 'flag').length;

    return (
        <div className="bg-white border-2 border-slate-200 p-8 rounded-[32px] shadow-sm mt-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center">
                    <ShieldAlert className="mr-3 text-rose-500" size={24} /> Trust Score Timeline
                </h3>
                <div className="flex space-x-4">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center ${flagsCount > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {flagsCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse" />} {flagsCount === 0 ? 'Perfect Integrity' : `${flagsCount} Flags`}
                    </span>
                    <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-800">
                        Score: {score}/100
                    </span>
                </div>
            </div>

            <div className="relative z-10 w-full pt-10 pb-6 px-4">
                {/* Horizontal Timeline Bar */}
                <div className="absolute left-6 right-6 top-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 w-full opacity-30" />
                </div>

                <div className="flex justify-between items-start relative">
                    {events.map((event, i) => (
                        <div key={i} className="flex flex-col items-center group/node relative w-16">
                            {/* Time Label Above */}
                            <span className="text-[10px] font-black text-slate-400 mb-2">{event.time}</span>
                            
                            {/* Node */}
                            <div className={`w-8 h-8 rounded-full ${event.color} text-white flex items-center justify-center relative z-10 shadow-lg ring-4 ring-white group-hover/node:scale-125 transition-transform cursor-pointer`}>
                                {event.icon}
                                {event.type === 'flag' && <div className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-50" />}
                            </div>

                            {/* Label Below (Hidden until hover on desktop) */}
                            <div className="absolute top-full mt-4 bg-slate-900 text-white text-[10px] font-bold p-2 rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {event.label}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustScoreTimeline;
