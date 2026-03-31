import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    Users, Search, Download, Trash2, 
    X, Mail, Briefcase, GraduationCap, 
    Globe, Phone, MapPin, Calendar, Sparkles, Plus, Send
} from 'lucide-react';
import { getProfessionalImage, downloadImage } from '../utils/imageUtils';

const Candidates = () => {
    const { user } = useContext(AuthContext);
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCandidate, setNewCandidate] = useState({
        name: '', email: '', password: 'Password123!', researchAreas: '', organization: '', bio: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const { data } = await api.get('/candidates');
                setCandidates(data);
            } catch (err) {
                console.error("Failed to fetch candidates", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/users', { ...newCandidate, role: 'Candidate' });
            setCandidates([data, ...candidates]);
            setShowAddModal(false);
            setNewCandidate({ name: '', email: '', password: 'Password123!', researchAreas: '', organization: '', bio: '' });
        } catch (err) {
            console.error("Add candidate failed", err);
            alert("Failed to add candidate. Check if email exists.");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove this candidate?')) {
            try {
                await api.delete(`/candidates/${id}`);
                setCandidates(candidates.filter(c => c._id !== id));
            } catch (error) {
                console.error("Error deleting candidate:", error);
                alert("Failed to delete candidate.");
            }
        }
    };

    const filteredCandidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.researchAreas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                        <Users className="mr-3 text-blue-600" /> Candidate Directory
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and evaluate global talent for expert job matching.</p>
                </div>
                <div className="flex items-center space-x-6 w-full md:w-auto">
                    {user?.role === 'Admin' && (
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-black text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center whitespace-nowrap"
                        >
                            <Plus className="mr-2" size={18} /> Add Candidate
                        </button>
                    )}
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search candidates..." 
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Research Areas</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-400">Loading directory...</td></tr>
                        ) : filteredCandidates.map(c => (
                            <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedCandidate(c)}>
                                <td className="px-6 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm relative group-hover:scale-110 transition-transform">
                                            <img 
                                                src={getProfessionalImage(c.name)} 
                                                alt={c.name} 
                                                className="w-full h-full object-cover"
                                            />
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); downloadImage(getProfessionalImage(c.name), `${c.name}-profile.jpg`); }}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Download size={14} />
                                            </button>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{c.name}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{c.organization || 'Independent Expert'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6">
                                    <span className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs block truncate p-2 bg-slate-50/50 rounded-lg group-hover:bg-white transition-colors">
                                        {c.researchAreas || "No research areas specified"}
                                    </span>
                                </td>
                                <td className="px-6 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {user?.role === 'Admin' && (
                                            <button 
                                                onClick={(e) => handleDelete(e, c._id)}
                                                className="p-2.5 text-red-400 hover:text-red-600 transition-all hover:bg-red-50 rounded-xl"
                                                title="Delete Candidate"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        <button className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                            View Profile
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCandidates.length === 0 && !loading && (
                    <div className="py-20 text-center text-slate-400 font-medium">No candidates matching your search found.</div>
                )}
            </div>

            {/* Candidate Profile Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                        <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-slate-800">Expert Profile Dossier</h2>
                            <button onClick={() => setSelectedCandidate(null)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </header>
                        
                        <div className="flex-1 overflow-y-auto p-10 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="md:col-span-1">
                                    <div className="rounded-3xl overflow-hidden shadow-2xl relative group mb-8">
                                        <img 
                                            src={getProfessionalImage(selectedCandidate.name)} 
                                            alt={selectedCandidate.name} 
                                            className="w-full h-[320px] object-cover"
                                        />
                                        <button 
                                            onClick={() => downloadImage(getProfessionalImage(selectedCandidate.name), `${selectedCandidate.name}-portrait.jpg`)}
                                            className="absolute top-4 right-4 p-3 bg-black/30 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black shadow-xl"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-sm font-semibold text-slate-600 p-4 bg-slate-50 rounded-2xl">
                                            <Mail size={18} className="mr-3 text-blue-500" /> {selectedCandidate.email}
                                        </div>
                                        <div className="flex items-center text-sm font-semibold text-slate-600 p-4 bg-slate-50 rounded-2xl">
                                            <Phone size={18} className="mr-3 text-blue-500" /> +1 (555) 728-1920
                                        </div>
                                        <div className="flex items-center text-sm font-semibold text-slate-600 p-4 bg-slate-50 rounded-2xl">
                                            <MapPin size={18} className="mr-3 text-blue-500" /> San Francisco, CA
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-12">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
                                            <h1 className="text-4xl font-black text-slate-900 leading-none">{selectedCandidate.name}</h1>
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">{selectedCandidate.organization || 'Research Authority'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <Briefcase size={20} className="mb-4 text-blue-600" />
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Current Sector</h4>
                                            <p className="font-bold text-slate-800">Advanced AI Research</p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <GraduationCap size={20} className="mb-4 text-blue-600" />
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Expertise Rank</h4>
                                            <p className="font-bold text-slate-800">Senior Principal</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                            <Globe className="mr-3 text-blue-600" size={20} /> Domain Specializations
                                        </h3>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic font-medium text-slate-600 leading-relaxed">
                                            {selectedCandidate.researchAreas || "Profile data transmission incomplete for this sector."}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                                            <Calendar className="mr-3 text-blue-600" size={20} /> Recent Contributions
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center group hover:border-blue-300 transition-colors">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm">Neural Network Efficiency Paper</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Published Oct 2025 • High Impact Score</p>
                                                </div>
                                                <Sparkles className="text-slate-200 group-hover:text-yellow-500 transition-colors" size={18} />
                                            </div>
                                            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center group hover:border-blue-300 transition-colors">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm">Open-Source LLM Architecture</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Repository Update • 12k Stars</p>
                                                </div>
                                                <Sparkles className="text-slate-200 group-hover:text-yellow-500 transition-colors" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <footer className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
                            <button onClick={() => setSelectedCandidate(null)} className="px-8 py-3.5 text-slate-600 font-bold hover:text-slate-900 transition-colors">Close Profile</button>
                            <button 
                                onClick={() => navigate('/recommendations', { state: { candidateId: selectedCandidate._id } })}
                                className="px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center active:scale-95"
                            >
                                Select for Interview Board
                            </button>
                        </footer>
                    </div>
                </div>
            )}
            {/* Add Candidate Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white max-w-2xl w-full rounded-[40px] shadow-2xl p-12 animate-scale-in">
                        <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-tight">Authorize New <span className="text-blue-600">Candidate</span></h2>
                        <form onSubmit={handleAddCandidate} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" value={newCandidate.name} onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})} required placeholder="e.g. Anbu" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" value={newCandidate.email} onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})} required placeholder="candidate@example.com" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Organization</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" value={newCandidate.organization} onChange={(e) => setNewCandidate({...newCandidate, organization: e.target.value})} placeholder="e.g. MIT, Stanford" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Research/Domain Areas</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" value={newCandidate.researchAreas} onChange={(e) => setNewCandidate({...newCandidate, researchAreas: e.target.value})} placeholder="e.g. Machine Learning, NLP" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Professional Bio</label>
                                <textarea className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[30px] min-h-[120px] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" value={newCandidate.bio} onChange={(e) => setNewCandidate({...newCandidate, bio: e.target.value})} placeholder="Describe candidate background..." />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Dismiss</button>
                                <button type="submit" className="flex-[2] bg-blue-600 hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Enroll Candidate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Candidates;
