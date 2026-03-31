import React from 'react';
import { Sparkles } from 'lucide-react';

const SynergyRings = ({ score }) => {
    const isPerfect = score >= 90;
    const isGood = score >= 70;

    return (
        <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
            {/* Outer Rotating Ring 1 */}
            <div className={`absolute inset-0 rounded-full border-[1px] ${isPerfect ? 'border-amber-400' : isGood ? 'border-emerald-400' : 'border-blue-400'} opacity-30 blur-[1px] animate-[spin_8s_linear_infinite]`} style={{ borderLeftWidth: '0' }} />
            
            {/* Outer Rotating Ring 2 (Counter) */}
            <div className={`absolute inset-2 rounded-full border-[2px] ${isPerfect ? 'border-amber-500' : isGood ? 'border-emerald-500' : 'border-blue-500'} opacity-40 blur-[1px] animate-[spin_12s_linear_infinite_reverse]`} style={{ borderRightWidth: '0' }} />
            
            {/* Inner Ring */}
            <div className={`absolute inset-6 rounded-full border-4 ${isPerfect ? 'border-amber-300' : isGood ? 'border-emerald-300' : 'border-blue-300'} opacity-50 animate-pulse`} style={{ borderTopWidth: '0' }} />

            {/* Glowing Background Core */}
            <div className={`absolute inset-10 rounded-full bg-gradient-to-tr ${isPerfect ? 'from-amber-400 to-yellow-200' : isGood ? 'from-emerald-400 to-teal-200' : 'from-blue-400 to-cyan-200'} opacity-20 blur-xl animate-pulse`} />

            {/* Core Score Display */}
            <div className={`relative z-10 w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.1)] border-4 ${isPerfect ? 'border-amber-100 shadow-amber-200/50' : isGood ? 'border-emerald-100 shadow-emerald-200/50' : 'border-blue-100 shadow-blue-200/50'}`}>
                <span className={`text-4xl font-black ${isPerfect ? 'text-amber-500' : isGood ? 'text-emerald-500' : 'text-blue-500'}`}>
                    {score}<span className="text-xl">%</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 flex items-center">
                    {isPerfect && <Sparkles size={10} className="mr-1 text-amber-500" />} Synergy
                </span>
            </div>
            
            {/* Particles */}
            {isPerfect && (
                <>
                    <div className="absolute top-0 right-10 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                    <div className="absolute bottom-4 left-10 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping delay-300" />
                </>
            )}
        </div>
    );
};

export default SynergyRings;
