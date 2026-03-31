import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import {
    Search, Plus, Trash2, X, Download, Send, LogIn, ArrowRight, Phone, Mail, Globe, Sparkles, Edit
} from 'lucide-react';
import { getProfessionalImage, downloadImage } from '../utils/imageUtils';

const Experts = () => {
    const { user } = useContext(AuthContext);
    const [experts, setExperts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false); // Changed from showAddForm
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [newExpert, setNewExpert] = useState({
        name: '', email: '', domain: '', organization: '', experienceYears: 1, tag: 'AVAILABLE', bio: ''
    });

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const { data } = await api.get('/experts');
                if (data.length === 0) {
                     setExperts([
                        { name: "ANBU", domain: "ARTIFICIAL INTELLIGENCE", organization: "ExpertSync Lead", experienceYears: 12, tag: "AVAILABLE" },
                        { name: "VIJI26", domain: "MACHINE LEARNING", organization: "Senior Domain Expert", experienceYears: 15, tag: "AVAILABLE" }
                    ]);
                } else {
                    setExperts(data);
                }
            } catch (err) {
                console.error("Failed to fetch experts", err);
                setExperts([
                    { name: "ANBU", domain: "ARTIFICIAL INTELLIGENCE", organization: "ExpertSync Lead", experienceYears: 12, tag: "AVAILABLE" },
                    { name: "VIJI26", domain: "MACHINE LEARNING", organization: "Senior Domain Expert", experienceYears: 15, tag: "AVAILABLE" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, []);

    const handleAddExpert = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newExpert,
                email: `${newExpert.name.toLowerCase().replace(/\s+/g, '')}@expert.com`,
                experienceYears: Number(newExpert.experienceYears) || 0
            };
            await api.post('/experts', payload);
            // Re-fetch experts after adding a new one
            const { data } = await api.get('/experts');
            setExperts(data);
            setShowAddModal(false);
            setNewExpert({ name: '', email: '', domain: '', organization: '', experienceYears: 1, tag: 'AVAILABLE', bio: '' });
        } catch (err) {
            console.error("Add expert failed", err);
            alert("Failed to add expert.");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Delete this expert?')) {
            try {
                await api.delete(`/experts/${id}`);
                setExperts(experts.filter(exp => (exp._id || exp.name) !== id));
            } catch (error) {
                console.error("Error deleting expert:", error);
            }
        }
    };

    const handleToggleStatus = async (e, exp) => {
        e.stopPropagation();
        if (!exp._id) return alert("Cannot update status for fallback experts.");
        const newStatus = exp.status === 'Available' ? 'Not Available' : 'Available';
        try {
            await api.put(`/experts/${exp._id}`, { status: newStatus });
            setExperts(experts.map(ex => ex._id === exp._id ? { ...ex, status: newStatus } : ex));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredExperts = experts.filter(e =>
        (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.domain || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto font-sans">
            <header className="mb-20">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-4">Live Matching</p>
                        <h1 className="text-7xl font-black text-slate-900 uppercase tracking-tighter">
                            Top Experts <span className="text-yellow-500 underline decoration-yellow-300 decoration-8 underline-offset-[20px]">Board</span>
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[450px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search live experts..." 
                                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-yellow-500/10 shadow-xl shadow-slate-950/5 transition-all outline-none font-bold placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {(user?.role === 'Admin' || user?.role === 'Recruiter') && (
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="w-16 h-16 bg-slate-900 text-white rounded-[24px] shadow-2xl shadow-slate-950/30 hover:bg-yellow-500 transition-all flex items-center justify-center active:scale-95 flex-shrink-0"
                            >
                                <Plus size={28} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-left pb-20">
                {loading ? (
                    <div className="col-span-full py-40 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing Registry...</div>
                ) : (
                    filteredExperts.map(exp => (
                        <div 
                            key={exp._id || exp.name} 
                            onClick={() => setSelectedExpert(exp)}
                            className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 cursor-pointer group flex flex-col relative"
                        >
                            <div className="h-[450px] relative overflow-hidden bg-slate-100">
                                <img 
                                    src={getProfessionalImage(exp.name)} 
                                    alt={exp.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                                />
                                <div className="absolute top-10 left-10 flex items-center space-x-3">
                                    <span className={`text-white text-[10px] px-6 py-2.5 rounded-xl font-black uppercase tracking-widest shadow-xl transition-all ${
                                        (exp.status || exp.tag || 'Available') === 'Available'
                                        ? 'bg-yellow-500 shadow-yellow-500/20'
                                        : 'bg-red-500 shadow-red-500/20'
                                    }`}>
                                        {exp.status || exp.tag || 'Available'}
                                    </span>
                                    {user?.role === 'Admin' && exp._id && (
                                        <button
                                            onClick={(e) => handleToggleStatus(e, exp)}
                                            className="bg-white/90 backdrop-blur text-slate-900 text-[9px] px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                                        >
                                            Toggle
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); downloadImage(getProfessionalImage(exp.name), `${exp.name.toLowerCase()}-expert.jpg`); }}
                                    className="absolute top-10 right-10 p-5 bg-white/40 backdrop-blur-md rounded-3xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500 hover:text-white shadow-xl"
                                >
                                    <Download size={24} />
                                </button>
                            </div>
                            
                            <div className="p-12 flex flex-col flex-1">
                                <h3 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter group-hover:text-yellow-600 transition-colors leading-[0.8]">{exp.name}</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-12 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
                                    {exp.domain}
                                </p>
                                
                                <div className="mt-auto pt-10 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none flex items-center group-hover:translate-x-2 transition-transform">
                                        View Profile <LogIn size={14} className="ml-3 rotate-180" />
                                    </span>
                                    <div className="flex space-x-3">
                                        {user?.role === 'Admin' && (
                                            <button 
                                                onClick={(e) => handleDelete(e, exp._id || exp.name)}
                                                className="w-14 h-14 flex items-center justify-center text-red-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                title="Remove Expert"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        )}
                                        <div className="w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center group-hover:bg-yellow-500 transition-all shadow-xl shadow-slate-950/5">
                                            <Send size={24} className="-translate-y-0.5 translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Detail */}
            {selectedExpert && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in text-slate-900">
                    <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[80px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
                        <div className="md:w-[45%] relative h-[450px] md:h-auto overflow-hidden">
                            <img 
                                src={getProfessionalImage(selectedExpert.name)} 
                                alt={selectedExpert.name} 
                                className="w-full h-full object-cover grayscale-[0.1]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-16">
                                <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.6em] mb-6">Expertise Board Certified</span>
                                <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-4">{selectedExpert.name}</h1>
                                <p className="text-white/60 font-black uppercase tracking-widest text-xs italic">{selectedExpert.organization || 'Verified Master Architect'}</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col bg-white">
                            <header className="p-10 border-b border-slate-50 flex justify-end">
                                <button onClick={() => setSelectedExpert(null)} className="p-6 hover:bg-slate-50 rounded-full transition-all group">
                                    <X size={32} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                                </button>
                            </header>

                            <div className="p-16 space-y-16 overflow-y-auto flex-1 text-left">
                                <section className="grid grid-cols-2 gap-12">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Domain Focus</p>
                                        <div className="bg-yellow-50 text-yellow-800 font-black px-10 py-6 rounded-[32px] border border-yellow-100 uppercase italic text-xl shadow-sm">
                                            {selectedExpert.domain}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Industry Seniority</p>
                                        <div className="bg-slate-50 text-slate-900 font-black px-10 py-6 rounded-[32px] border border-slate-100 uppercase italic text-xl shadow-sm">
                                            {selectedExpert.experienceYears}Y LEADERSHIP
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center underline decoration-yellow-500 decoration-4 underline-offset-8">
                                        Professional Narrative & Vision
                                    </p>
                                    <div className="bg-slate-50/50 p-12 rounded-[60px] border border-slate-100/50">
                                        <p className="text-slate-600 font-medium leading-relaxed italic text-2xl">
                                            {selectedExpert.bio || `${selectedExpert.name} represents the absolute upper percentile of industry knowledge in ${selectedExpert.domain.toLowerCase()}. With a heavy focus on structural innovation, they serve as a critical catalyst for technical evaluation.`}
                                        </p>
                                    </div>
                                </section>

                                <div className="flex items-center space-x-12">
                                    <div className="flex items-center space-x-4 text-xs font-black text-slate-900 uppercase tracking-widest">
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><Send size={16} /></div>
                                        <span>direct@expert.panel</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-xs font-black text-slate-950 uppercase tracking-widest">
                                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/20"><Plus size={16} /></div>
                                        <span>San Francisco Hub</span>
                                    </div>
                                </div>
                            </div>

                            <footer className="p-16 pt-0 flex space-x-6">
                                <button onClick={() => setSelectedExpert(null)} className="flex-1 px-12 py-7 bg-slate-100 text-slate-900 rounded-[28px] font-black uppercase tracking-widest transition-all hover:bg-slate-200">Dismiss View</button>
                                <button className="flex-[2] bg-yellow-500 text-white px-12 py-7 rounded-[28px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-yellow-500/40 active:scale-95 flex items-center justify-center group">
                                    Initiate Deployment <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Add Expert Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white max-w-2xl w-full rounded-[40px] shadow-2xl p-12 animate-scale-in">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Authorize New <span className="text-yellow-500">Expertise</span></h2>
                                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Enroll a top-tier specialist into the directory</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <X size={24} className="text-slate-300" />
                            </button>
                        </div>
                        <form onSubmit={handleAddExpert} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:text-slate-300" value={newExpert.name} onChange={(e) => setNewExpert({...newExpert, name: e.target.value})} placeholder="e.g. Diya" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Domain</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:text-slate-300" value={newExpert.domain} onChange={(e) => setNewExpert({...newExpert, domain: e.target.value})} placeholder="e.g. AI Ethics" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Current Organization</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:text-slate-300" value={newExpert.organization} onChange={(e) => setNewExpert({...newExpert, organization: e.target.value})} placeholder="e.g. Google AI" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Experience (Years)</label>
                                    <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold placeholder:text-slate-300" value={newExpert.experienceYears} onChange={(e) => setNewExpert({...newExpert, experienceYears: e.target.value})} placeholder="10" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Professional Biography</label>
                                <textarea className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[30px] min-h-[120px] focus:ring-4 focus:ring-yellow-500/10 outline-none font-bold placeholder:text-slate-300" value={newExpert.bio} onChange={(e) => setNewExpert({...newExpert, bio: e.target.value})} placeholder="Describe expert background..." />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Dismiss</button>
                                <button type="submit" className="flex-[2] bg-slate-900 hover:bg-yellow-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Enroll Expert</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experts;
