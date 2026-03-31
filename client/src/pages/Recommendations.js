import React, { useState, useEffect } from 'react';
import api from '../api';
import SynergyRings from '../components/SynergyRings';
import { useLocation } from 'react-router-dom';
import { 
    Search, AlertTriangle, ShieldCheck, ChevronRight, 
    BrainCircuit, Info, Users, Sparkles, Download 
} from 'lucide-react';
import { getProfessionalImage, downloadImage } from '../utils/imageUtils';
import { 
    Chart as ChartJS, 
    RadialLinearScale, 
    PointElement, 
    LineElement, 
    Filler, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ArcElement);

const Recommendations = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const { data } = await api.get('/candidates');
                setCandidates(data);
                
                // Auto-select if passed from Candidates directory
                if (location.state?.candidateId && data.some(c => c._id === location.state.candidateId)) {
                    const candidateToSelect = data.find(c => c._id === location.state.candidateId);
                    if (candidateToSelect) {
                        handleSelectCandidate(candidateToSelect);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch candidates", err);
            }
        };
        fetchCandidates();
    }, [location.state]);

    const handleSelectCandidate = async (candidate) => {
        setSelectedCandidate(candidate._id);
        setLoading(true);
        try {
            const { data } = await api.get(`/recommendations/${candidate._id}`);
            setResults(data);
        } catch (err) {
            console.error("Matching engine error", err);
        } finally {
            setLoading(false);
        }
    };

    const getRadarData = (rec) => ({
        labels: ['Core Tech', 'Domain Depth', 'Research', 'Comms', 'Legacy'],
        datasets: [{
            label: 'Expert Alignment',
            data: [rec.factors.tech, rec.factors.domain, rec.factors.research, rec.factors.comms, rec.factors.legacy],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        }]
    });

    const filteredCandidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 h-full bg-slate-50 flex flex-col overflow-hidden">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                        <Sparkles className="mr-3 text-blue-600" /> AI Panel Formation
                    </h1>
                    <p className="text-slate-500 mt-1">Intelligent expert matching for the interview process.</p>
                </div>
                <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-400 uppercase tracking-widest">
                    AI Match Engine <span className="text-green-500 ml-2">Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
                {/* Left Sidebar: Candidates */}
                <div className="col-span-1 border border-slate-200 bg-white rounded-2xl p-6 overflow-y-auto shadow-sm flex flex-col">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                        <Users size={16} className="mr-2" /> Candidates
                    </h2>
                    
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text"
                            placeholder="Find name..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3 flex-1">
                        {filteredCandidates.length === 0 ? (
                            <div className="text-center py-10 text-xs font-bold text-slate-400 uppercase">Empty State</div>
                        ) : (
                        filteredCandidates.map(candidate => (
                            <div 
                                key={candidate._id}
                                onClick={() => handleSelectCandidate(candidate)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                    selectedCandidate === candidate._id 
                                    ? 'bg-blue-600 border-blue-600 shadow-lg text-white' 
                                    : 'bg-slate-50 border-transparent hover:border-blue-200 text-slate-800'
                                }`}
                            >
                                <h3 className="font-bold text-sm leading-none mb-1">{candidate.name}</h3>
                                <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${selectedCandidate === candidate._id ? 'text-blue-100/70' : 'text-slate-400'}`}>
                                    {candidate.researchAreas || "Profile Pending"}
                                </p>
                            </div>
                        )))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 border border-slate-200 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
                    {!selectedCandidate ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-fade-in">
                            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8">
                                <BrainCircuit size={48} className="text-blue-600 opacity-30" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Initialize Match Analysis</h2>
                            <p className="text-slate-500 font-medium max-w-sm mb-12">Select a candidate from the directory to identify the most compatible expert panel based on domain expertise and experience.</p>
                            <div className="flex items-center space-x-12 grayscale opacity-40">
                                <Users size={32} />
                                <ChevronRight size={32} />
                                <ShieldCheck size={32} />
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 animate-pulse">
                            <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-6" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aggregating Expertise...</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
                            <div className="animate-fade-up">
                                <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center uppercase italic border-b border-slate-200 pb-4">
                                    Recommended Panelists
                                    <span className="ml-4 bg-emerald-100 text-emerald-600 text-[10px] px-3 py-1 rounded-full font-bold">
                                        {results.length} AUTHORITIES IDENTIFIED
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 gap-8">
                                    {results.map((rec, index) => (
                                        <div key={index} className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8 transition-all hover:shadow-xl ${rec.conflict.hasConflict ? 'border-red-100 bg-red-50/10' : ''}`}>
                                            
                                            <div className="flex-shrink-0 w-48 h-48 relative mx-auto lg:mx-0">
                                                <SynergyRings score={rec.score} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm relative group">
                                                            <img 
                                                                src={getProfessionalImage(rec.expert.name)} 
                                                                alt={rec.expert.name} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                            <button 
                                                                onClick={() => downloadImage(getProfessionalImage(rec.expert.name), `${rec.expert.name}-expert.jpg`)}
                                                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Download size={14} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-slate-900">{rec.expert.name}</h3>
                                                            <p className="text-slate-500 font-semibold text-xs mt-1 uppercase tracking-widest">{rec.expert.organization || 'Research Authority'}</p>
                                                        </div>
                                                    </div>
                                                    {rec.conflict.hasConflict ? (
                                                        <div className="bg-red-50 text-red-600 text-[10px] font-bold px-4 py-2 rounded-xl flex items-center border border-red-100">
                                                            <AlertTriangle size={14} className="mr-2" /> Conflict Identified
                                                        </div>
                                                    ) : (
                                                        <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-4 py-2 rounded-xl flex items-center border border-emerald-100">
                                                            <ShieldCheck size={14} className="mr-2" /> Verified Direct Match
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <div className="h-40 flex justify-center">
                                                        <Radar 
                                                            data={getRadarData(rec)} 
                                                            options={{ 
                                                                scales: { r: { min: 0, max: 100, ticks: { display: false } } },
                                                                plugins: { legend: { display: false } }
                                                            }} 
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                                            <Info size={14} className="mr-2" /> Match Analysis Reason
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {rec.explanation.map((reason, idx) => (
                                                                <li key={idx} className="flex items-start text-xs font-medium text-slate-600">
                                                                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0" />
                                                                    {reason}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
