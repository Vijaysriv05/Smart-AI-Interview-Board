import React, { useState, useContext, useEffect } from 'react';
import { TrendingUp, AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SkillGap = () => {
    const { user } = useContext(AuthContext);
    const [gaps, setGaps] = useState([]);

    useEffect(() => {
        // Calculate Gaps based on User Skills vs Senior AI Role
        const targetSkills = ["React", "Node.js", "MongoDB", "Docker", "Kubernetes", "Microservices", "Cloud Architecture"];
        const userSkills = user?.skills ? user.skills.split(',').map(s => s.trim()) : [];
        
        const calculatedGaps = targetSkills.map(skill => {
            const hasSkill = userSkills.some(us => us.toLowerCase() === skill.toLowerCase());
            return {
                skill,
                current: hasSkill ? 90 : 10,
                target: 100,
                missing: hasSkill ? [] : [skill],
                resources: hasSkill ? `Advanced ${skill} Mastery` : `Getting Started with ${skill}`
            };
        });
        setGaps(calculatedGaps.slice(0, 5)); // Show top 5
    }, [user]);

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Skill Gap Analyzer</h1>
                <p className="text-slate-500 mt-1">Visualize your current skill standing against target roles and discover your learning path.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-6">
                    {gaps.map((gap, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">{gap.skill}</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${gap.current < 40 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {gap.current < 40 ? 'Action Needed' : 'Improving'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="relative h-4 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
                                <div 
                                    className="absolute h-full bg-blue-600 rounded-full transition-all duration-1000" 
                                    style={{ width: `${gap.current}%` }}
                                ></div>
                                <div 
                                    className="absolute h-full border-l-2 border-slate-900 border-dashed transition-all duration-1000 z-10" 
                                    style={{ left: `${gap.target}%` }}
                                >
                                    <span className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-slate-900 uppercase">Target</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                        <AlertCircle size={14} className="mr-2 text-amber-500" /> Missing Competencies
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {gap.missing.map(m => (
                                            <span key={m} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">{m}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2 flex items-center">
                                        <BookOpen size={14} className="mr-2" /> Recommended Course
                                    </h4>
                                    <p className="text-sm font-bold text-indigo-700 mb-2">{gap.resources}</p>
                                    <a 
                                        href={`https://www.coursera.org/search?query=${encodeURIComponent(gap.skill)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs font-black text-blue-600 flex items-center hover:translate-x-1 transition-transform uppercase tracking-tighter"
                                    >
                                        Start Learning <ChevronRight size={14} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <TrendingUp className="w-20 h-20 absolute -bottom-4 -right-4 text-white opacity-10" />
                        <h3 className="text-xl font-bold mb-4">Overall Readiness</h3>
                        <div className="text-5xl font-black text-blue-400 mb-2">64%</div>
                        <p className="text-slate-400 text-sm leading-relaxed">You've improved by 12% this month. At this rate, you'll be Senior-ready in 4 months.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Learning Path Focus</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">1</div>
                                <span className="text-sm text-slate-700 font-medium">Cloud Fundamentals</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">2</div>
                                <span className="text-sm text-slate-400">Advanced Backend Logic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillGap;
