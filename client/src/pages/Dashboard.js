import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Radar, Line } from 'react-chartjs-2';
import {
    Users, UserCheck, Shield, ChevronRight, LayoutDashboard,
    FileSearch, Play, Target, TrendingUp, Clock, Sparkles, BrainCircuit, Activity, ArrowRight, MessageSquare, User
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SkillTree from '../components/SkillTree';
import DocumentVault from '../components/DocumentVault';
import TrustScoreTimeline from '../components/TrustScoreTimeline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, PointElement, LineElement, Filler);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        candidates: 0, experts: 0, users: 0, jobs: 0,
        myApps: 0, myInterviews: 0, sysHealth: '100%', latestTicket: null, latestInterview: null
    });
    const [loading, setLoading] = useState(true);
    const [recruiterApps, setRecruiterApps] = useState([]);
    const [syncingId, setSyncingId] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            if (user?.role === 'Admin' || user?.role === 'Recruiter') {
                const [candRes, expRes, userRes, jobRes] = await Promise.all([
                    api.get('/candidates').catch(() => ({ data: [] })),
                    api.get('/experts').catch(() => ({ data: [] })),
                    api.get('/users').catch(() => ({ data: [] })),
                    api.get('/jobs').catch(() => ({ data: [] }))
                ]);
                setStats(prev => ({
                    ...prev,
                    candidates: candRes.data.length,
                    experts: expRes.data.length,
                    users: userRes.data.length,
                    jobs: jobRes.data.length
                }));
                
                const appsRes = await api.get('/applications/all').catch(() => ({ data: [] }));
                setRecruiterApps(appsRes.data.slice(0, 5));
            }

            if (user?.role === 'Candidate') {
                const [appsRes, jobsRes, ivRes, ticketRes] = await Promise.all([
                    api.get('/applications/me').catch(() => ({ data: [] })),
                    api.get('/jobs').catch(() => ({ data: [] })),
                    api.get('/interviews/latest').catch(() => ({ data: null })),
                    api.get('/complaints/me').catch(() => ({ data: [] }))
                ]);

                const openTickets = ticketRes.data ? ticketRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

                setStats(prev => ({
                    ...prev,
                    myApps: appsRes.data?.length || 0,
                    jobs: jobsRes.data?.length || 0,
                    myInterviews: ivRes.data ? 1 : 0,
                    latestTicket: openTickets[0] || null,
                    latestInterview: ivRes.data || null
                }));
            }
        } catch (err) {
            console.error("Failed to load dashboard stats", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user]);

    const handleStatusUpdate = async (appId, newStatus) => {
        setSyncingId(appId);
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            setRecruiterApps(recruiterApps.map(a => a._id === appId ? { ...a, status: newStatus } : a));
            setTimeout(() => setSyncingId(null), 1500);
        } catch (err) {
            console.error("Status update fail", err);
            setSyncingId(null);
        }
    };

    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'System Access',
            data: [12, 19, 15, 22, 18, 25],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const donutData = {
        labels: ['AI Domains', 'Cyber', 'Data', 'Web'],
        datasets: [{
            data: [45, 20, 25, 10],
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
            borderWidth: 0,
        }]
    };

    const radarData = {
        labels: ['Communication', 'Technical Depth', 'Confidence', 'Problem Solving', 'System Design'],
        datasets: [{
            label: 'AI Performance Analysis',
            data: [85, 92, 78, 88, 70],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
        }]
    };

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Candidate Velocity',
            data: [4, 12, 18, 32, 45, 60],
            fill: true,
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 1)',
            tension: 0.4
        }]
    };

    if (loading) {
        return (
            <div className="p-8 h-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Interface</div>
                </div>
            </div>
        );
    }

    /* ──── CANDIDATE DASHBOARD ──── */
    if (user?.role === 'Candidate') {
        const isProfileIncomplete = !user.researchAreas || user.researchAreas.length === 0;

        return (
            <div className="p-8 lg:p-12 h-full flex flex-col bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-slate-200 pb-8">
                    <div>
                        <h1 className="text-4xl font-black flex items-center tracking-tighter uppercase text-slate-900 group">
                            <LayoutDashboard className="mr-4 text-blue-600 group-hover:rotate-12 transition-transform duration-500" size={36} /> Intelligence Hub
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Your personal growth telemetry and application tracking.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/profile" className="px-6 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:scale-105 hover:bg-blue-700 transition-all">
                            View Auth Profile
                        </Link>
                        <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Core Sync Active</span>
                        </div>
                    </div>
                </header>

                {isProfileIncomplete && (
                    <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] p-10 text-white shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 group-hover:rotate-12">
                            <Sparkles size={140} />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Action Required</span>
                            <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Calibrate Your Profile</h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed font-medium">Initialize your expertise matrix to enable high-precision AI job matching and access the expert panel database.</p>
                            <Link to="/profile" className="inline-flex items-center bg-white text-blue-900 px-8 py-4 rounded-xl font-black uppercase tracking-[0.1em] text-xs hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                                Begin Calibration <ChevronRight size={18} className="ml-3" />
                            </Link>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                    {[
                        { title: 'Active Applications', count: stats.myApps, icon: <Activity size={24} />, drop: '/applications', color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:border-blue-400 group/card' },
                        { title: 'Open Opportunities', count: stats.jobs, icon: <Target size={24} />, drop: '/jobs', color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:border-emerald-400 group/card' },
                        { title: 'Mock Sessions Completed', count: stats.myInterviews, icon: <Play size={24} />, drop: '/mock-interview', color: 'text-yellow-600', bg: 'bg-yellow-50', hover: 'hover:border-yellow-400 group/card' },
                    ].map((st, i) => (
                        <Link to={st.drop} key={i} className={`bg-white border-2 border-slate-100 p-8 rounded-[32px] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 block ${st.hover}`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-14 h-14 ${st.bg} ${st.color} rounded-2xl flex items-center justify-center group-hover/card:scale-125 transition-transform duration-500`}>
                                    {st.icon}
                                </div>
                                <div className="text-slate-200 group-hover/card:text-blue-500 transition-colors">
                                    <ArrowRight size={24} className="-rotate-45" />
                                </div>
                            </div>
                            <h3 className="text-6xl font-black mb-2 text-slate-900 tracking-tighter">{st.count}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{st.title}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                    <div className="bg-white rounded-[32px] border-2 border-slate-200 p-10 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2 flex items-center">
                            <BrainCircuit className="mr-3 text-indigo-500" size={28} /> AI Performance Analyzer
                        </h2>
                        <p className="text-slate-500 font-medium mb-8">Latest Mock Interview Evaluation</p>

                        <div className="flex flex-col xl:flex-row gap-8 items-center">
                            <div className="flex-1 w-full max-w-[280px]">
                                <Radar data={radarData} options={{ scales: { r: { min: 0, max: 100, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
                            </div>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100">
                                    <strong className="text-xs uppercase tracking-widest block mb-1">Top Strength</strong>
                                    Highly precise technical articulation and coding syntax.
                                </div>
                                <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100">
                                    <strong className="text-xs uppercase tracking-widest block mb-1">Growth Area</strong>
                                    Expand on scalable system design architectures.
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Global Score</span>
                                    <span className="text-2xl font-black">{stats.latestInterview?.score || 0}/100</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Score Timeline Widget */}
                        <div className="mt-8 border-t border-slate-100 pt-8">
                            <TrustScoreTimeline score={stats.latestInterview?.score || 0} />
                        </div>
                    </div>

                    {stats.latestTicket ? (
                        <div className="bg-white border-2 border-slate-200 rounded-[32px] p-10 relative overflow-hidden shadow-md group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center">
                                    <MessageSquare className="mr-3 text-blue-500" size={24} /> Official Support Update
                                </h2>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${stats.latestTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {stats.latestTicket.status}
                                </span>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-4 text-sm font-bold text-slate-700">
                                {stats.latestTicket.subject}
                            </div>
                            {stats.latestTicket.adminResponse ? (
                                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl shadow-blue-600/20 text-sm font-medium leading-relaxed relative">
                                    <div className="font-black text-[10px] uppercase tracking-widest text-blue-200 mb-2">Resolution from Admin</div>
                                    {stats.latestTicket.adminResponse}
                                </div>
                            ) : (
                                <div className="text-sm font-bold text-slate-400 p-4">Administration is currently reviewing this ticket. Please hang tight.</div>
                            )}
                            <Link to="/complaints" className="mt-6 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline block">View All Tickets</Link>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-slate-200 rounded-[32px] p-10 relative overflow-hidden shadow-md flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mb-4">
                                <Shield size={32} />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-2">All Systems Operational</h2>
                            <p className="text-slate-500 text-sm font-medium">No active support tickets or complaints.</p>
                            <Link to="/complaints" className="mt-6 text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline block">Need Assistance?</Link>
                        </div>
                    )}
                </div>

                <div className="mb-12 relative z-10 w-full">
                    <SkillTree score={stats.latestInterview?.score || 0} />
                </div>

                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4 relative z-10">Core Modules</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                        { title: 'Resume Scan', icon: <FileSearch size={28} />, path: '/resume-analyzer', color: 'hover:border-blue-500/50 hover:bg-blue-50', iconColor: 'text-blue-600', baseColor: 'bg-white border-slate-200 text-slate-900' },
                        { title: 'Mock Lab', icon: <Play size={28} />, path: '/mock-interview', color: 'hover:border-indigo-500/50 hover:bg-indigo-50', iconColor: 'text-indigo-600', baseColor: 'bg-white border-slate-200 text-slate-900' },
                        { title: 'Job Match', icon: <Target size={28} />, path: '/jobs', color: 'hover:border-emerald-500/50 hover:bg-emerald-50', iconColor: 'text-emerald-600', baseColor: 'bg-white border-slate-200 text-slate-900' },
                        { title: 'Skill Gap', icon: <TrendingUp size={28} />, path: '/skill-gap', color: 'hover:border-amber-500/50 hover:bg-amber-50', iconColor: 'text-amber-500', baseColor: 'bg-white border-slate-200 text-slate-900' },
                        { title: 'Tracker', icon: <Clock size={28} />, path: '/applications', color: 'hover:border-pink-500/50 hover:bg-pink-50', iconColor: 'text-pink-600', baseColor: 'bg-white border-slate-200 text-slate-900' }
                    ].map((feature, i) => (
                        <Link key={i} to={feature.path} className={`${feature.baseColor} border p-8 rounded-[32px] flex flex-col items-center justify-center text-center transition-all group ${feature.color} shadow-sm`}>
                            <div className={`mb-4 transition-transform group-hover:scale-110 ${feature.iconColor}`}>
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest">{feature.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    /* ──── RECRUITER DASHBOARD ──── */
    if (user?.role === 'Recruiter') {
        return (
            <div className="p-8 lg:p-12 h-full flex flex-col bg-amber-50/30 overflow-y-auto custom-scrollbar">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-amber-200/50 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tighter uppercase">
                            <Target className="mr-4 text-amber-600" size={36} /> Talent Sourcing Ops
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Manage open job requisitions and candidate pipelining.</p>
                    </div>
                    <div className="bg-white px-6 py-3 border-2 border-amber-100 rounded-2xl shadow-sm flex items-center space-x-3">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Recruiter Access</span>
                    </div>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Active Postings', val: stats.jobs, icon: <Target />, drop: '/jobs', color: 'text-amber-600', bg: 'bg-amber-100' },
                        { label: 'Talent Pool', val: stats.candidates, icon: <Users />, drop: '/candidates', color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'Pending Reviews', val: 0, icon: <FileSearch />, drop: '/applications', color: 'text-pink-600', bg: 'bg-pink-100' },
                        { label: 'Panel Experts', val: stats.experts, icon: <UserCheck />, drop: '/experts', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    ].map((stat, i) => (
                        <Link to={stat.drop} key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-amber-100 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between block">
                            <div className="flex items-start justify-between mb-8">
                                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <div className="w-10 h-10 bg-amber-50 text-amber-500 flex items-center justify-center rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{stat.val}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-10 rounded-[32px] shadow-sm border border-amber-100 flex flex-col items-start justify-center text-left relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-100/50 rounded-full blur-3xl"></div>
                        <h2 className="text-2xl font-black uppercase text-slate-800 mb-2 flex items-center">
                            <Activity className="mr-3 text-amber-500" size={32} /> AI Hiring Insights
                        </h2>
                        <p className="text-slate-500 font-medium mb-8">Candidate pipeline velocity trajectory.</p>
                        <div className="w-full h-48">
                            <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }} />
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[32px] shadow-xl border border-slate-800 flex flex-col relative overflow-hidden text-white">
                        <h2 className="text-2xl font-black uppercase mb-6 flex items-center text-emerald-400">
                            <Target className="mr-3" size={32} /> Smart Job Match AI
                        </h2>
                        <p className="text-slate-400 font-medium mb-10">Top organically surfaced candidates for your open requisitions.</p>
                        <div className="space-y-4 relative z-10 w-full">
                            {['Anbu (Cybersecurity Expert)', 'Vijay (React Engineer)', 'Sarah (Cloud Architect)'].map((c, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/5 hover:bg-white/20 transition-all group">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4">
                                            <User size={18} className="text-emerald-400" />
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{c}</span>
                                    </div>
                                    <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest">{98 - (i * 5)}% MATCH</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* New Section for Expert Board Requirement */}
                <div className="bg-white p-12 rounded-[50px] border border-amber-100 shadow-xl shadow-amber-900/5 mt-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center">
                                <Activity className="mr-4 text-amber-500" size={32} /> Master Application Queue
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Update Candidate Pipeline Statuses</p>
                        </div>
                        <Link to="/applications" className="px-8 py-4 bg-amber-50 text-amber-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-amber-100 transition-all">View Full Tracker</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-slate-50">
                                <tr>
                                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Candidate</th>
                                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Position</th>
                                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Current Stage</th>
                                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recruiterApps.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No Applications in Queue</td>
                                    </tr>
                                ) : recruiterApps.map((app, i) => (
                                    <tr key={app._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="py-6 font-black text-slate-900 uppercase italic tracking-tight">{app.candidate?.name || 'Candidate'}</td>
                                        <td className="py-6 text-sm font-bold text-slate-500">{app.job?.title || 'Position'}</td>
                                        <td className="py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                                                        app.status === 'Shortlisted' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    Shortlist
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'Selected')}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                                                        app.status === 'Selected' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-emerald-600'
                                                    }`}
                                                >
                                                    Select
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'Waiting List')}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                                                        app.status === 'Waiting List' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-amber-500'
                                                    }`}
                                                >
                                                    Waitlist
                                                </button>
                                                {syncingId === app._id && (
                                                    <span className="text-[10px] font-black text-emerald-500 animate-pulse ml-2">SAVED!</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-6 text-right">
                                            <Link to="/applications" className="w-10 h-10 bg-slate-100 text-slate-400 flex items-center justify-center rounded-xl ml-auto group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <ArrowRight size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    /* ──── ADMIN DASHBOARD ──── */
    return (
        <div className="p-8 lg:p-12 h-full flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center tracking-tighter uppercase">
                        <LayoutDashboard className="mr-4 text-slate-900" size={36} /> Command Center
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Ecosystem overview and macro-level intelligence routing.</p>
                </div>
                <div className="bg-white px-6 py-3 border-2 border-slate-100 rounded-2xl shadow-sm flex items-center space-x-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Access</span>
                    <div className="w-1.5 h-6 bg-slate-200 rounded-full mx-2" />
                    <Sparkles className="text-yellow-500" size={16} />
                    <span className="text-xs font-black text-slate-900 uppercase">Sys_Health 100%</span>
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Network Talent', val: stats.candidates, icon: <Users />, drop: '/candidates', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Domain Experts', val: stats.experts, icon: <UserCheck />, drop: '/experts', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active Postings', val: stats.jobs, icon: <Target />, drop: '/jobs', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Platform Users', val: stats.users, icon: <Activity />, drop: '/users', color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <Link to={stat.drop} key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between block">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className="w-10 h-10 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{stat.val}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-white p-10 rounded-[32px] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
                            <TrendingUp className="mr-3 text-blue-500" size={24} /> Activity Telemetry
                        </h3>
                        <span className="px-4 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-lg border border-slate-100">Last 6 Months</span>
                    </div>
                    <div className="h-72">
                        <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f1f5f9' } }, x: { grid: { display: false } } } }} />
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center mb-10">
                        <Shield className="mr-3 text-emerald-500" size={24} /> Domain Matrix
                    </h3>
                    <div className="h-64 flex-1 flex justify-center items-center relative">
                        <Doughnut data={donutData} options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-900">4</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Clusters</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Vault UI */}
            <DocumentVault />

            {/* Support / Quick Action Banner */}
            <div className="bg-slate-900 rounded-[32px] p-10 flex flex-col lg:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="relative z-10 lg:w-2/3 mb-8 lg:mb-0">
                    <div className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex mb-4">Integrations Online</div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Manage AI Expert Panels</h2>
                    <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
                        Ensure you review conflict of interest flags before finalizing interview panels. The system automatically detects overlaps in organization and research history.
                    </p>
                </div>
                <div className="relative z-10 flex-shrink-0">
                    <Link to="/recommendations" className="bg-blue-600 hover:bg-blue-500 flex items-center px-8 py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-xs transition-colors shadow-xl shadow-blue-500/30">
                        Initialize Matching <ArrowRight className="ml-3" size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
