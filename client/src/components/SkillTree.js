import React from 'react';
import { ShieldCheck, Target, Zap, Medal } from 'lucide-react';

const SkillTree = ({ score }) => {
    const skills = [
        { name: 'Core Foundations', active: score > 20, icon: <ShieldCheck size={16} /> },
        { name: 'Algorithmic Thinking', active: score > 40, icon: <Target size={16} /> },
        { name: 'System Architecture', active: score > 60, icon: <Zap size={16} /> },
        { name: 'AI Integration', active: score > 80, icon: <Medal size={16} /> },
    ];

    return (
        <div className="bg-slate-900 rounded-[32px] p-10 relative overflow-hidden text-white shadow-2xl mt-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center text-indigo-400 z-10 relative">
                <Zap className="mr-3" size={28} /> RPG Skill Tree
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                {skills.map((skill, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center group relative">
                            {/* Glow Effect */}
                            {skill.active && <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />}
                            
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 border-2 transition-all duration-500 ${
                                skill.active 
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.8)]' 
                                : 'bg-slate-800 border-slate-700 text-slate-500 grayscale'
                            }`}>
                                {skill.icon}
                            </div>
                            <span className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] ${skill.active ? 'text-indigo-200' : 'text-slate-600'}`}>
                                {skill.name}
                            </span>
                        </div>
                        
                        {/* Connecting Line */}
                        {index < skills.length - 1 && (
                            <div className="hidden md:block flex-1 h-1 bg-slate-800 mx-2 rounded-full relative overflow-hidden">
                                {skill.active && (
                                    <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)] transition-all animate-[expandLine_1s_ease-out_forwards]" style={{ width: skills[index + 1].active ? '100%' : '50%' }} />
                                )}
                            </div>
                        )}
                        {/* Mobile Connecting Line */}
                        {index < skills.length - 1 && (
                            <div className="md:hidden w-1 h-8 bg-slate-800 my-2 rounded-full relative overflow-hidden">
                                {skill.active && (
                                    <div className="absolute top-0 right-0 left-0 bg-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,1)]" style={{ height: skills[index + 1].active ? '100%' : '50%' }} />
                                )}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <style jsx>{`
                @keyframes expandLine {
                    from { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default SkillTree;
