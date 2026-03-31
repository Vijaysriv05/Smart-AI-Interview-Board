import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Candidate');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await register(name, email, password, role);
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
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                {/* Logo */}
                <div className="flex items-center space-x-3 relative z-10">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <Sparkles className="text-black w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-white text-xl font-black tracking-tight uppercase">AI Expert</div>
                        <div className="text-yellow-500/60 text-[9px] font-black uppercase tracking-[0.3em]">Neural Verification</div>
                    </div>
                </div>

                {/* Main copy */}
                <div className="relative z-10">
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                        JOIN THE<br />
                        <span className="text-blue-500">INTELLIGENT</span><br />
                        NETWORK
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                        Whether you're a Candidate preparing for success or an Admin building the perfect interview panel, our AI adapts to your mission.
                    </p>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <ShieldCheck className="text-emerald-400 mb-3" size={24} />
                            <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Protection</div>
                            <div className="text-white font-bold text-sm">Automated Conflict of Interest Guard</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <Sparkles className="text-yellow-400 mb-3" size={24} />
                            <div className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1">Intelligence</div>
                            <div className="text-white font-bold text-sm">Semantic Matching Algorithm V2</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md my-auto">
                    {/* Mobile logo */}
                    <div className="flex items-center space-x-3 mb-12 lg:hidden">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Expert</div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Create<br /><span className="text-blue-500">Account</span></h2>
                        <p className="text-slate-500 font-medium mt-3">Enter your details to generate your neural profile.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl mb-8 text-sm font-semibold flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text" required value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPass ? 'text' : 'password'} required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Select Designation</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Candidate', 'Recruiter', 'Admin'].map(r => (
                                    <button
                                        key={r} type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                                            role === r
                                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                        }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center group mt-4 border border-blue-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Initialize Profile <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                        Already verified?{' '}
                        <Link to="/login" className="text-blue-600 font-black hover:text-blue-700 transition-colors">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
