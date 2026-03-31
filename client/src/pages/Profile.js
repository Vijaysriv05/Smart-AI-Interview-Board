import React, { useState, useContext, useEffect } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { User, Briefcase, GraduationCap, Save, Sparkles, Mail, ShieldCheck, BookOpen, Building, Award } from 'lucide-react';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Pre-populate with what we know
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        education: '',
        skills: '',
        publications: '',
        researchAreas: '',
        patents: '',
        experienceYears: 0,
        organization: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/auth/profile');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    education: data.education || '',
                    skills: data.skills || '',
                    publications: data.publications || '',
                    researchAreas: data.researchAreas || '',
                    patents: data.patents || '',
                    experienceYears: data.experienceYears || 0,
                    organization: data.organization || '',
                    bio: data.bio || ''
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        
        try {
            const { data } = await api.put('/auth/profile', formData);
            
            // Sync local storage / context if necessary
            const updatedUser = { ...user, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            setSuccessMessage("Profile data saved and synced successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save profile", error);
            alert(error.response?.data?.message || "Error saving profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto bg-slate-50">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center">
                        <User className="mr-3 text-blue-600" /> Professional Identity
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Manage your digital persona and expertise metadata for the AI matching engine.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">Authority Level</span>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`w-1.5 h-4 rounded-full ${i <= 4 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        ))}
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10 pb-20">
                {successMessage && (
                    <div className="bg-emerald-50 text-emerald-700 px-8 py-5 rounded-[30px] border border-emerald-100 flex items-center font-black uppercase tracking-widest text-xs animate-fade-in shadow-xl shadow-emerald-500/10">
                        <Save className="w-5 h-5 mr-3" /> {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Perspective Column: Core Identity */}
                    <div className="lg:col-span-1 space-y-10">
                        <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                                <Sparkles size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl mb-8 flex items-center justify-center text-3xl font-black shadow-2xl">
                                    {formData.name?.charAt(0) || user?.name?.charAt(0) || '?'}
                                </div>
                                <h3 className="text-2xl font-black mb-2">{formData.name || user?.name || 'Anonymous User'}</h3>
                                <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-8">{user?.role || 'Guest'}</p>
                                
                                <div className="space-y-4 pt-8 border-t border-white/10">
                                    <div className="flex items-center space-x-3 text-slate-400">
                                        <Mail size={16} />
                                        <span className="text-xs font-bold truncate">{formData.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-slate-400">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Verified Account</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">System Sync</h4>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                Your profile is currently being indexed by the recommendation neural network. Complete all fields to increase match accuracy by up to 40%.
                            </p>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Syncing...' : 'Update Records'}
                            </button>
                        </div>
                    </div>

                    {/* Logic Column: Detailed Metadata */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white rounded-[40px] p-12 border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-12 flex items-center">
                                <BookOpen className="mr-3" size={18} /> Deep Expertise Details
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Full Identity Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>

                                {user?.role === 'Candidate' && (
                                    <>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center"><GraduationCap size={12} className="mr-2" /> Academic Pedigree</label>
                                            <input 
                                                type="text" 
                                                name="education"
                                                value={formData.education}
                                                onChange={handleChange}
                                                placeholder="e.g. PhD in Neural Networks, MIT"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Technical Logic Stack (Comma separated)</label>
                                            <input 
                                                type="text" 
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="PyTorch, Transformer Architectures, Rust, CUDA"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center"><Building size={12} className="mr-2" /> Current Organization</label>
                                    <input 
                                        type="text" 
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center"><Briefcase size={12} className="mr-2" /> Industry Vintage (Years)</label>
                                    <input 
                                        type="number" 
                                        name="experienceYears"
                                        value={formData.experienceYears}
                                        onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Specialized Research Domains</label>
                                    <input 
                                        type="text" 
                                        name="researchAreas"
                                        value={formData.researchAreas}
                                        onChange={handleChange}
                                        placeholder="Generative AI, Cyber-Physical Systems, HRI"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center"><Award size={12} className="mr-2" /> Patents & Intellectual Property</label>
                                    <input 
                                        type="text" 
                                        name="patents"
                                        value={formData.patents}
                                        onChange={handleChange}
                                        placeholder="USPTO #928374, WIPO PCT/US2023/..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Notable Publications</label>
                                    <textarea 
                                        name="publications"
                                        value={formData.publications}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Nature Machine Intelligence (2025), ICLR Best Paper..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 italic">Professional Narrative / Bio</label>
                                    <textarea 
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Articulate your technical vision and leadership philosophy..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900 italic"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 rounded-[40px] p-10 border border-red-200 shadow-xl shadow-red-500/5">
                    <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-12 flex items-center">
                        Danger Zone / Authoritative Control
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white p-8 rounded-3xl border border-red-100 flex flex-col justify-between">
                            <div>
                                <h5 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-2">Delete Account</h5>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">Permanently remove your identity and all associated professional metadata from the AI Expert cloud.</p>
                            </div>
                            <button 
                                onClick={async () => {
                                    if(window.confirm("CRITICAL: Are you absolutely sure? This will wipe your entire career profile from our neural network.")) {
                                        try {
                                            await api.delete('/auth/profile');
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('userInfo');
                                            window.location.href = '/login';
                                        } catch (e) {
                                            alert("Failed to initiate account wipe.");
                                        }
                                    }
                                }}
                                className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                            >
                                Vaporize Account
                            </button>
                        </div>

                        {user?.role === 'Admin' && (
                            <div className="bg-white p-8 rounded-3xl border border-red-100 flex flex-col justify-between">
                                <div>
                                    <h5 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-2">Global System Reset</h5>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">ADMIN PRIVILEGE: Terminate all active platform records including experts, candidates, and job match telemetry.</p>
                                </div>
                                <button 
                                    onClick={async () => {
                                        if(window.confirm("GLOBAL OVERRIDE: Clear all system databases? This action is irreversible.")) {
                                            try {
                                                await api.post('/admin/reset-system');
                                                alert("System database has been purged.");
                                                window.location.reload();
                                            } catch (e) {
                                                alert("System reset failed. Access denied.");
                                            }
                                        }
                                    }}
                                    className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all border border-red-600/30"
                                >
                                    Purge Global System
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
