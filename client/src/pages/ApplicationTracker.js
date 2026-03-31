import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle2, XCircle, Search, Briefcase, X, Landmark, Sparkles, Brain, User, AlertTriangle, Activity } from 'lucide-react';

const ApplicationTracker = () => {
    const { user } = useContext(AuthContext);
    const [apps, setApps] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const endpoint = user?.role === 'Candidate' ? '/applications/me' : '/applications';
                const { data } = await api.get(endpoint);
                setApps(data);
                setFilteredApps(data);
            } catch (err) {
                console.error("Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [user]);

    useEffect(() => {
        const filtered = apps.filter(app =>
            (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.job?.company || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredApps(filtered);
    }, [searchTerm, apps]);

    const [selectedApp, setSelectedApp] = useState(null);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
            case 'selected': return <CheckCircle2 size={18} className="text-green-500" />;
            case 'rejected': return <XCircle size={18} className="text-red-500" />;
            case 'closed': return <XCircle size={18} className="text-slate-400" />;
            case 'waiting list': return <Clock size={18} className="text-amber-500" />;
            default: return <Clock size={18} className="text-blue-500" />;
        }
    };

    const renderTimeline = (currentStatus) => {
        const stages = ['Applied', 'Shortlisted', 'Waiting List', 'Selected'];
        let currentIndex = 0;

        const status = currentStatus?.toLowerCase() || 'applied';
        if (status === 'shortlisted') currentIndex = 1;
        else if (status === 'waiting list') currentIndex = 2;
        else if (status === 'accepted' || status === 'selected') currentIndex = 3;
        else if (status === 'rejected') currentIndex = -1;

        return (
            <div className="w-full py-8 text-center relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full hidden sm:block z-0"></div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-8 sm:space-y-0 text-xs font-black uppercase tracking-widest text-slate-400">
                    {stages.map((stage, idx) => {
                        let isCompleted = currentIndex >= idx;
                        let isCurrent = currentIndex === idx;
                        let isRejected = currentIndex === -1 && idx === 0;

                        return (
                            <div key={idx} className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-500 border-4 ${isRejected ? 'bg-red-50 border-red-200 text-red-500' :
                                        isCurrent ? 'bg-blue-600 border-blue-200 text-white shadow-lg shadow-blue-500/30 scale-125' :
                                            isCompleted ? 'bg-emerald-500 border-emerald-100 text-white' :
                                                'bg-white border-slate-200 text-slate-300'
                                    }`}>
                                    {isRejected ? <XCircle size={16} /> : isCompleted ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                                </div>
                                <span className={isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : isRejected ? 'text-red-500' : ''}>{stage}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                    <Activity className="mr-3 text-blue-600" /> Application Tracker
                </h1>
                <p className="text-slate-500 mt-1">Monitor your interview status and recruitment journey in real-time.</p>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-up">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-slate-800">Recent Applications</h3>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by role or company..."
                            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Applied Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-medium">Loading applications...</td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                        <h4 className="text-lg font-bold text-slate-300">No applications found</h4>
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map(app => (
                                    <tr
                                        key={app._id}
                                        onClick={() => setSelectedApp(app)}
                                        className="hover:bg-slate-50 transition-all group cursor-pointer"
                                    >
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{app.job?.title || "Specialized Consultant"}</div>
                                            <div className="text-xs text-slate-400 mt-1 flex items-center font-medium">
                                                <Landmark size={12} className="mr-1.5" /> {app.job?.company || "Secret Org"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-slate-600">
                                            {user?.role === 'Candidate' ? new Date(app.createdAt).toLocaleDateString() : (
                                                <div className="flex items-center text-xs">
                                                    <User size={12} className="mr-1 text-slate-400" />
                                                    {app.candidate?.name || 'Unknown Candidate'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center">
                                                <span className="mr-2">{getStatusIcon(app.status)}</span>
                                                <span className={`text-xs font-bold uppercase tracking-widest ${app.status === 'Accepted' || app.status === 'Selected' ? 'text-green-600' :
                                                        app.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
                                                    }`}>
                                                    {app.status || 'Applied'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                                {user?.role === 'Candidate' ? 'Details' : 'Update Status'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedApp.job?.title}</h2>
                                <p className="text-blue-600 font-bold text-sm mt-1">{selectedApp.job?.company}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Application Status</span>
                                    {user?.role === 'Candidate' ? (
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(selectedApp.status)}
                                            <span className={`font-bold uppercase ${selectedApp.status === 'Rejected' ? 'text-red-600' : selectedApp.status === 'Accepted' || selectedApp.status === 'Selected' ? 'text-green-600' : 'text-blue-600'}`}>{selectedApp.status || 'Applied'}</span>
                                        </div>
                                    ) : (
                                        <select
                                            className="w-full bg-white border border-slate-200 text-slate-800 font-bold py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all font-xs uppercase tracking-widest"
                                            value={selectedApp.status || 'Applied'}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                setSelectedApp({ ...selectedApp, status: newStatus });
                                                setApps(apps.map(a => a._id === selectedApp._id ? { ...a, status: newStatus } : a));
                                                await api.put(`/applications/${selectedApp._id}/status`, { status: newStatus });
                                            }}
                                        >
                                            <option value="Applied">APPLIED</option>
                                            <option value="Shortlisted">SHORTLISTED</option>
                                            <option value="Interview">INTERVIEW</option>
                                            <option value="Waiting List">WAITLIST</option>
                                            <option value="Selected">SELECTED</option>
                                            <option value="Rejected">REJECTED</option>
                                        </select>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{user?.role === 'Candidate' ? 'Compatibility Score' : 'Candidate Email'}</span>
                                    <span className={`text-xl font-black ${user?.role === 'Candidate' ? 'text-blue-600' : 'text-slate-800 text-sm'}`}>{user?.role === 'Candidate' ? '89%' : selectedApp.candidate?.email}</span>
                                </div>
                            </div>

                            {/* Visual Progress Timeline (Feature Request 8) */}
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <h3 className="text-center text-sm font-black uppercase tracking-widest text-slate-500 mb-8">Recruitment Journey Timeline</h3>
                                {renderTimeline(selectedApp.status)}
                            </div>

                            {user?.role === 'Candidate' ? (
                                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                    <Sparkles className="absolute top-4 right-4 text-emerald-400/20 w-16 h-16" />
                                    <h4 className="font-black uppercase tracking-tighter text-emerald-400 mb-2 flex items-center">
                                        <Brain className="mr-2" size={20} /> AI Hiring Insights Let
                                    </h4>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        Your technical framework aligns effectively with this position's vector requirements. Prepare for intensive system design questioning involving state architecture and asynchronous lifecycle methodologies.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200">
                                    <h4 className="font-black uppercase tracking-tighter text-amber-600 mb-2 flex items-center">
                                        <AlertTriangle className="mr-2" size={20} /> Expert Verification Panel
                                    </h4>
                                    <p className="text-amber-700 text-sm leading-relaxed font-medium">
                                        As an admin or recruiter, dynamically modifying the candidate's status will instantly reflect on their secure application portal. Update accurately.
                                    </p>
                                </div>
                            )}

                        </div>

                        <div className="p-8 pt-0 flex gap-4">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                            >
                                Back to Tracker
                            </button>
                            {user?.role === 'Candidate' && (
                                <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-xl font-bold transition-all border border-red-200 active:scale-95 flex items-center justify-center">
                                    <X className="mr-2 w-5 h-5" /> Withdraw App
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationTracker;
