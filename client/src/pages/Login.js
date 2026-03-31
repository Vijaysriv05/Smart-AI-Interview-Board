import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');
        setForgotLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (res.ok) {
                setForgotSuccess(data.message);
                setForgotEmail('');
            } else {
                setForgotError(data.message);
            }
        } catch (err) {
            setForgotError('Network error. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left — Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-16 relative overflow-hidden">
                {/* background decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                {/* Logo */}
                <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <Sparkles className="text-white w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-white text-xl font-black tracking-tight uppercase">AI Expert</div>
                        <div className="text-yellow-500/60 text-[9px] font-black uppercase tracking-[0.3em]">Professional Matching</div>
                    </div>
                </div>

                {/* Main copy */}
                <div className="relative z-10">
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                        INTELLIGENT<br />
                        <span className="text-yellow-500">PANEL</span><br />
                        FORMATION
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                        Our AI uses Cosine Similarity and TF-IDF to match candidates with the most relevant expert interviewers — automatically.
                    </p>

                    <div className="flex items-center gap-8 mt-12">
                        {[['TF-IDF', 'Algorithm'], ['AI', 'Matching'], ['COI', 'Guard']].map(([v, l]) => (
                            <div key={l}>
                                <div className="text-2xl font-black text-white">{v}</div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom badge */}
                <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Core Active — 2026</span>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center space-x-3 mb-12 lg:hidden">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Expert</div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Welcome<br /><span className="text-yellow-500">Back</span></h2>
                        <p className="text-slate-500 font-medium mt-3">Sign in to access your intelligence dashboard.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl mb-8 text-sm font-semibold flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPass ? 'text' : 'password'} required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[10px] font-black text-yellow-600 uppercase tracking-widest hover:text-yellow-700 transition-colors">
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-slate-900 hover:bg-yellow-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center group mt-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In to Dashboard <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-yellow-600 font-black hover:text-yellow-700 transition-colors">Create one free</Link>
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                    <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl p-8 relative">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Reset <span className="text-yellow-500">Access</span></h3>
                        <p className="text-sm font-medium text-slate-500 mb-6">Enter your registered email to receive a temporary password.</p>
                        
                        {forgotError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-xs font-bold">{forgotError}</div>
                        )}
                        {forgotSuccess && (
                            <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-xs font-bold">{forgotSuccess}</div>
                        )}

                        <form onSubmit={handleForgotPassword}>
                            <div className="relative mb-6">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email" required value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all text-sm"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button type="button" onClick={() => { setShowForgotPassword(false); setForgotSuccess(''); setForgotError(''); }} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={forgotLoading} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-yellow-500 transition-colors flex justify-center items-center">
                                    {forgotLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Email'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
