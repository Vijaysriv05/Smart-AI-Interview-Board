import React, { useState } from 'react';
import api from '../api';
import { Upload, CheckCircle, AlertCircle, FileText, Brain } from 'lucide-react';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    React.useEffect(() => {
        const fetchLatest = async () => {
            try {
                const { data } = await api.get('/resume-analysis/latest');
                if (data) setResults(data);
            } catch (err) {
                console.error("No previous analysis found");
            }
        };
        fetchLatest();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResults(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        setAnalyzing(true);
        try {
            const { data } = await api.post('/resume-analysis', { filename: file.name });
            setResults(data);
        } catch (err) {
            console.error("Resume Analysis failed:", err.response?.data || err.message);
            alert(`Analysis failed: ${err.response?.data?.message || "Check your connection"}`);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">AI Resume Analyzer</h1>
                <p className="text-slate-500 mt-1">Upload your resume to get instant AI feedback on matching scores and skill gaps.</p>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Upload Section */}
                <div className="bg-white p-12 rounded-3xl shadow-sm border-2 border-dashed border-slate-200 text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Upload size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload your Resume</h2>
                    <p className="text-slate-400 mb-8">Supports PDF, DOCX (Max 10MB)</p>
                    
                    <input 
                        type="file" 
                        id="resume-upload" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                    />
                    <label 
                        htmlFor="resume-upload"
                        className="bg-slate-900 border border-slate-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all cursor-pointer inline-block"
                    >
                        {file ? file.name : 'Select File'}
                    </label>

                    {file && !results && !analyzing && (
                        <div className="mt-8">
                            <button 
                                onClick={handleUpload}
                                className="bg-blue-600 text-white px-12 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:scale-105 transition-all"
                            >
                                Start AI Analysis
                            </button>
                        </div>
                    )}
                </div>

                {analyzing && (
                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center animate-pulse">
                        <Brain className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-bounce" />
                        <h3 className="text-xl font-bold text-slate-800">Processing with NLP Engine...</h3>
                        <p className="text-slate-400 mt-2">Extracting keywords and calculating relevancy scores.</p>
                    </div>
                )}

                {results && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * results.score) / 100} className="text-blue-600 transition-all duration-1000" />
                                </svg>
                                <span className="absolute text-3xl font-black text-slate-800">{results.score}%</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mt-6 uppercase tracking-wider">Alignment Score</h3>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                <CheckCircle size={16} className="mr-2 text-green-500" /> Found Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.keywords.map(kw => (
                                    <span key={kw} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">{kw}</span>
                                ))}
                            </div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4 flex items-center">
                                <AlertCircle size={16} className="mr-2 text-amber-500" /> Identified Gaps
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.missing.map(kw => (
                                    <span key={kw} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">{kw}</span>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <FileText className="mr-2 text-blue-400" /> AI Recommendations
                            </h3>
                            <p className="text-slate-300 leading-relaxed italic">"{results.recommendations}"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
