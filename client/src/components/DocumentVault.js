import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, Search, Fingerprint, Eye, Sparkles } from 'lucide-react';

const DocumentVault = () => {
    const [selectedDoc, setSelectedDoc] = useState(null);

    const documents = [
        { id: 1, type: 'Resume', name: 'Vijay_Sri_Resume.pdf', candidate: 'Vijay Sri V', match: 98, status: 'pending', issues: [] },
        { id: 2, type: 'Certificate', name: 'AWS_Solutions_Arch.pdf', candidate: 'Anbu S', match: 100, status: 'verified', issues: [] },
        { id: 3, type: 'Degree', name: 'BTech_Computer_Science.pdf', candidate: 'Sarah Jen', match: 45, status: 'flagged', issues: ['Timeline Mismatch (2025 overlap)', 'University ID unverified'] },
    ];

    return (
        <div className="bg-slate-900 rounded-[40px] p-10 border border-slate-800 shadow-2xl relative overflow-hidden text-white my-8">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center mb-2">
                        <Fingerprint className="mr-3 text-emerald-400" size={32} /> Secure Document Vault
                    </h2>
                    <p className="text-slate-400 font-medium">AI-powered cryptography and verification for candidate credentials.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center mt-4 md:mt-0 backdrop-blur-md">
                    <Search size={16} className="text-slate-400 mr-2" />
                    <input type="text" placeholder="Scan Document Hash..." className="bg-transparent border-none text-white text-sm focus:outline-none w-48 placeholder-slate-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Document List */}
                <div className="col-span-1 space-y-4">
                    {documents.map(doc => (
                        <div 
                            key={doc.id} 
                            onClick={() => setSelectedDoc(doc)}
                            className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                                selectedDoc?.id === doc.id 
                                ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{doc.type}</span>
                                {doc.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                                {doc.status === 'verified' && <CheckCircle size={14} className="text-emerald-400" />}
                                {doc.status === 'flagged' && <XCircle size={14} className="text-rose-400" />}
                            </div>
                            <h3 className="font-bold text-sm mb-1">{doc.candidate}</h3>
                            <p className="text-xs text-slate-500 truncate">{doc.name}</p>
                        </div>
                    ))}
                </div>

                {/* Vault Visualizer */}
                <div className="col-span-2 bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    {!selectedDoc ? (
                        <div className="text-center opacity-50">
                            <Fingerprint size={64} className="mx-auto mb-4 text-slate-600" />
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Select Document to Initialize Scan</p>
                        </div>
                    ) : (
                        <div className="w-full animate-fade-in flex flex-col items-center">
                            {/* Holographic Document Representation */}
                            <div className="relative w-48 h-64 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg shadow-2xl mb-8 overflow-hidden group">
                                <div className={`absolute inset-0 bg-gradient-to-b opacity-20 transform translate-y-[-100%] animate-[scan_2s_ease-in-out_infinite] ${
                                    selectedDoc.status === 'flagged' ? 'from-transparent via-rose-500 to-transparent' : 'from-transparent via-emerald-500 to-transparent'
                                }`} />
                                <div className="p-4 space-y-3 opacity-30 mt-8">
                                    <div className="h-2 bg-white rounded w-3/4" />
                                    <div className="h-2 bg-white rounded w-full" />
                                    <div className="h-2 bg-white rounded w-5/6" />
                                    <div className="h-2 bg-white rounded w-1/2" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                    <Eye size={32} className="text-white" />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2">{selectedDoc.candidate} - {selectedDoc.type}</h3>
                            
                            {selectedDoc.status === 'flagged' ? (
                                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl w-full text-center">
                                    <div className="font-black text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center">
                                        <XCircle size={14} className="mr-2" /> AI Forgery Detection Flag
                                    </div>
                                    <ul className="text-xs space-y-1">
                                        {selectedDoc.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                                    </ul>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl w-full text-center">
                                    <div className="font-black text-[10px] uppercase tracking-widest mb-1 flex items-center justify-center">
                                        <Sparkles size={14} className="mr-2" /> Authenticity Verified
                                    </div>
                                    <p className="text-xs">Cryptographic hash matches source registry.</p>
                                </div>
                            )}

                            <div className="mt-6 flex space-x-4">
                                <button className="px-6 py-2 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-200 transition-all">
                                    Approve
                                </button>
                                <button className="px-6 py-2 bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-rose-700 transition-all">
                                    Reject & Notify
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    50% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
            `}</style>
        </div>
    );
};

export default DocumentVault;
