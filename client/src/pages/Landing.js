import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    LogIn, Sparkles, ArrowRight, Download, Send, Search,
    Brain, Shield, BarChart3, Users, CheckCircle, Zap,
    ChevronRight, Star, BookOpen, Target, TrendingUp, MessageSquare
} from 'lucide-react';
import { getProfessionalImage, downloadImage } from '../utils/imageUtils';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);
    const [experts, setExperts] = useState([]);
    const [supportForm, setSupportForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [supportStatus, setSupportStatus] = useState('');
    const [supportLoading, setSupportLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const fetchExperts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/experts');
                const filtered = data.filter(e => e.name.toUpperCase() === "ANBU" || e.name.toUpperCase().includes("VIJI"));
                setExperts(filtered.length > 0 ? filtered : [
                    { name: "ANBU", domain: "ARTIFICIAL INTELLIGENCE", experienceYears: 5, organization: "Infosys" },
                    { name: "VIJI26", domain: "MACHINE LEARNING", experienceYears: 4, organization: "Infotech" }
                ]);
            } catch {
                setExperts([
                    { name: "ANBU", domain: "ARTIFICIAL INTELLIGENCE", experienceYears: 5, organization: "Infosys" },
                    { name: "VIJI26", domain: "MACHINE LEARNING", experienceYears: 4, organization: "Infotech" }
                ]);
            }
        };
        fetchExperts();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSupportSubmit = async (e) => {
        e.preventDefault();
        setSupportLoading(true);
        try {
            await axios.post('http://localhost:5000/api/complaints', supportForm);
            setSupportStatus('success');
            setSupportForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSupportStatus(''), 5000);
        } catch {
            setSupportStatus('error');
        } finally {
            setSupportLoading(false);
        }
    };

    const aiSteps = [
        {
            icon: <Users size={28} className="text-yellow-500" />,
            step: "01",
            title: "Candidate Registers",
            desc: "A candidate signs up and fills in their skills, research areas, education, and publications. The platform creates their AI profile."
        },
        {
            icon: <Brain size={28} className="text-yellow-500" />,
            step: "02",
            title: "AI Analyzes Profile",
            desc: "Our NLP engine uses TF-IDF vectorization to extract key competencies and create a mathematical skill fingerprint for the candidate."
        },
        {
            icon: <Target size={28} className="text-yellow-500" />,
            step: "03",
            title: "Cosine Similarity Matching",
            desc: "The AI compares the candidate's skill vector against every expert's domain vector. Experts with the highest similarity score are ranked at the top."
        },
        {
            icon: <Shield size={28} className="text-yellow-500" />,
            step: "04",
            title: "Conflict of Interest Check",
            desc: "The system auto-detects if a candidate and expert share the same organization or too much research overlap — preventing biased panels."
        },
        {
            icon: <BarChart3 size={28} className="text-yellow-500" />,
            step: "05",
            title: "Radar Chart Analysis",
            desc: "Each match shows a 5-dimension radar chart: Core Tech, Domain Depth, Research Alignment, Communication, and Experience Legacy."
        },
        {
            icon: <CheckCircle size={28} className="text-yellow-500" />,
            step: "06",
            title: "Panel is Formed",
            desc: "Admin or Recruiter reviews the AI-recommended panel and approves. The candidate can then be scheduled for their expert interview."
        }
    ];

    const features = [
        {
            icon: <Brain size={32} />,
            title: "AI Panel Formation",
            tag: "Core Feature",
            desc: "Uses Cosine Similarity + TF-IDF to mathematically match candidates to the most relevant expert interviewers. Shows a % match score for every pairing.",
            color: "from-blue-500 to-indigo-600"
        },
        {
            icon: <Shield size={32} />,
            title: "Conflict of Interest Guard",
            tag: "Unique to This Platform",
            desc: "Automatically scans for bias — if a candidate and expert share the same company or overlap in research, the system flags it before the panel is formed.",
            color: "from-red-500 to-rose-600"
        },
        {
            icon: <MessageSquare size={32} />,
            title: "AI Mock Interview Lab",
            tag: "Interview Prep",
            desc: "Generates real interview questions per domain with data on how many times each question was asked and by which company (Google, Amazon, OpenAI, etc.).",
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: <BookOpen size={32} />,
            title: "Resume Analyzer",
            tag: "Career Intelligence",
            desc: "Upload your resume PDF. Our AI extracts your skills, highlights missing keywords, and gives you a gap analysis against top industry roles.",
            color: "from-green-500 to-emerald-600"
        },
        {
            icon: <TrendingUp size={32} />,
            title: "Skill Gap Analyzer",
            tag: "Growth Tool",
            desc: "Enter your current skills and your dream job. Our AI generates a precise learning roadmap showing exactly what to study to bridge the gap.",
            color: "from-purple-500 to-violet-600"
        },
        {
            icon: <Zap size={32} />,
            title: "Real AI Chatbot",
            tag: "Powered by Llama 3.3",
            desc: "An intelligent AI Career Guide powered by Llama 3.3 70B — answers career questions, platform guidance, and personalized interview preparation tips.",
            color: "from-slate-700 to-slate-900"
        }
    ];

    const faqs = [
        { q: "How does AI select the right expert for a candidate?", a: "The AI converts both the candidate's skills and the expert's domain into mathematical vectors using TF-IDF. It then calculates the Cosine Similarity between these vectors — the higher the angle similarity, the better the match. The result is shown as a % match score." },
        { q: "How can an expert recruit candidates through this platform?", a: "Experts log in, browse the Candidates section, and use the AI Recommendation engine to see which candidates are best aligned to their domain. They can view candidate profiles, analyze their skill gaps, and initiate contact through the platform." },
        { q: "What makes this different from LinkedIn or Naukri?", a: "Traditional platforms use simple keyword search. This platform uses NLP algorithms (TF-IDF + Cosine Similarity) for semantic matching — understanding context, not just exact words. It also auto-detects interview panel bias, which no free platform offers." },
        { q: "What is the Conflict of Interest feature?", a: "If a candidate works at the same company as an expert, or their research overlaps too heavily, the AI flags this as a conflict. This ensures all expert panels are unbiased — critical for academic and enterprise hiring." },
        { q: "How do I start as a candidate?", a: "Click 'Start Now', register as a Candidate, complete your profile with skills and research areas. Then use Resume Analyzer for feedback, Mock Interview Lab for practice, and check your Job Recommendations." }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-yellow-200">

            {/* ── NAVBAR ── */}
            <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-slate-100' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tight leading-none uppercase">AI EXPERT</div>
                            <div className="bg-yellow-100 text-yellow-700 text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mt-1 inline-block">Professional Matching</div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-10">
                        <button onClick={() => scrollTo('home')} className="text-xs font-black uppercase tracking-[0.15em] text-slate-600 hover:text-yellow-600 transition-colors">Home</button>
                        <button onClick={() => scrollTo('get-started')} className="text-xs font-black uppercase tracking-[0.15em] text-slate-600 hover:text-yellow-600 transition-colors">Get Started</button>
                        <button onClick={() => scrollTo('dashboard')} className="text-xs font-black uppercase tracking-[0.15em] text-slate-600 hover:text-yellow-600 transition-colors">Dashboard</button>
                        <button onClick={() => scrollTo('support')} className="text-xs font-black uppercase tracking-[0.15em] text-slate-600 hover:text-yellow-600 transition-colors">Support</button>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center hover:translate-x-1 transition-transform">
                            <LogIn className="mr-2 w-4 h-4" /> Login
                        </Link>
                        <Link to="/register" className="bg-yellow-500 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] shadow-xl shadow-yellow-500/30 hover:bg-yellow-600 transition-all active:scale-95">
                            Start Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── SECTION 1: HOME / HERO ── */}
            <section id="home" className="relative pt-48 pb-24 lg:pt-56 lg:pb-32 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-50/50 via-transparent to-transparent">
                <div className="max-w-7xl mx-auto px-6 relative flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full mb-8">
                            <Sparkles size={12} className="mr-2" /> AI-Powered Recruitment Intelligence
                        </div>
                        <h1 className="text-6xl lg:text-[90px] font-black text-slate-900 leading-[0.85] mb-8 uppercase tracking-tighter">
                            MATCH<br />
                            <span className="text-yellow-500 underline decoration-yellow-200 decoration-8 underline-offset-4">STUNNING</span><br />
                            EXPERTISE
                        </h1>

                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
                            Our intelligent engine uses <strong className="text-slate-800">Cosine Similarity + TF-IDF</strong> to pair
                            candidate skills with expert profiles — with automatic bias detection.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <Link to="/register" className="bg-yellow-500 text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center group hover:bg-yellow-600 transition-all shadow-2xl shadow-yellow-500/40 active:scale-95">
                                Start Your Journey <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <button onClick={() => scrollTo('get-started')} className="px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] border-2 border-slate-200 text-slate-700 hover:border-yellow-500 hover:text-yellow-600 transition-all">
                                How It Works
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-10 mt-16">
                            {[['TF-IDF', 'Algorithm'], ['COI', 'Guard'], ['5D', 'Radar Analysis']].map(([val, label]) => (
                                <div key={label} className="text-left">
                                    <div className="text-3xl font-black text-slate-900">{val}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-2xl h-[500px] lg:h-[580px]">
                        <div className="absolute top-0 right-0 w-[65%] h-[75%] rounded-[60px] overflow-hidden border-[12px] border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group z-10">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200" alt="Candidate" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <button onClick={() => downloadImage("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200", 'candidate.jpg')} className="absolute top-6 right-6 p-4 bg-white/30 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black shadow-xl"><Download size={24} /></button>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10 pointer-events-none">
                                <span className="text-yellow-500 font-black text-[10px] uppercase tracking-widest mb-1">Candidate Profile</span>
                                <h3 className="text-white font-black text-3xl uppercase tracking-tighter">Candidate</h3>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-[60%] h-[70%] rounded-[60px] overflow-hidden border-[12px] border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group z-20 hover:z-30 transition-all hover:-translate-y-4">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200" alt="Expert" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <button onClick={() => downloadImage("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200", 'expert.jpg')} className="absolute top-6 right-6 p-4 bg-white/30 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black shadow-xl"><Download size={24} /></button>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10 pointer-events-none">
                                <span className="text-yellow-500 font-black text-[10px] uppercase tracking-widest mb-1">Industry Expert</span>
                                <h3 className="text-white font-black text-3xl uppercase tracking-tighter">Expert</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: GET STARTED — HOW THE AI WORKS ── */}
            <section id="get-started" className="py-32 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-4">How It Works</p>
                        <h2 className="text-6xl font-black uppercase tracking-tighter">AI Panel Formation <span className="text-yellow-500">Flow</span></h2>
                        <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">From a candidate joining the platform to the expert panel being formed — here's exactly how our AI works step by step.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                        {aiSteps.map((step, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-10 hover:bg-white/10 transition-all group">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all">
                                        {step.icon}
                                    </div>
                                    <span className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">{step.step}</span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Expert vs Candidate Role Explanation */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[40px] p-12">
                            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                                <Users size={32} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase mb-6">For Candidates</h3>
                            <ul className="space-y-4">
                                {[
                                    "Register and complete your skill profile",
                                    "Upload resume for AI-powered gap analysis",
                                    "Practice with AI Mock Interview (domain-specific questions)",
                                    "Get matched to jobs with 90%+ compatibility",
                                    "Track your applications in real-time",
                                    "Use Skill Gap Analyzer to plan your learning path"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-300 font-medium">
                                        <ChevronRight size={16} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="mt-10 inline-flex items-center bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all">
                                Join as Candidate <ArrowRight size={16} className="ml-3" />
                            </Link>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                                <Star size={32} className="text-yellow-500" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase mb-6">For Experts / Recruiters</h3>
                            <ul className="space-y-4">
                                {[
                                    "Register as Recruiter and access the Expert Database",
                                    "Browse AI-matched candidate profiles for your domain",
                                    "Use AI Panel Formation to build unbiased interview panels",
                                    "Review Conflict of Interest flags before finalizing panels",
                                    "Generate domain-specific interview questions",
                                    "Post jobs and view AI-ranked applicants"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-300 font-medium">
                                        <ChevronRight size={16} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="mt-10 inline-flex items-center bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">
                                Join as Recruiter <ArrowRight size={16} className="ml-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: FEATURES / DASHBOARD ── */}
            <section id="dashboard" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-4">Platform Features</p>
                        <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900">What Makes This <span className="text-yellow-500">Special</span></h2>
                        <p className="text-slate-500 mt-6 text-lg max-w-2xl mx-auto">Six intelligent modules working together — far beyond a simple job portal.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {features.map((f, i) => (
                            <div key={i} className="group bg-white border border-slate-100 rounded-[32px] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                                    {f.icon}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">{f.tag}</span>
                                <h3 className="text-xl font-black text-slate-900 mt-5 mb-4 uppercase tracking-tight">{f.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA to Dashboard */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[48px] p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Ready to experience it?</h3>
                            <p className="text-slate-400 font-medium max-w-xl">Register now and access your full Dashboard — AI Panel Formation, Mock Interview Lab, Resume Analyzer, and more.</p>
                        </div>
                        <div className="flex space-x-4 flex-shrink-0">
                            <Link to="/login" className="px-8 py-5 rounded-2xl border-2 border-white/20 text-white font-black uppercase tracking-widest text-xs hover:border-white/40 transition-all">Login</Link>
                            <Link to="/register" className="px-10 py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/30 flex items-center">
                                Start Free <ArrowRight size={16} className="ml-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experts Board */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h2 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-4">Live Matching</h2>
                            <h3 className="text-6xl font-black text-slate-900 uppercase">Top Experts <span className="text-yellow-500">Board</span></h3>
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search live experts..." className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-500 transition-all font-medium" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {experts.map((item, i) => (
                            <div key={i} className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <div className="h-[400px] relative overflow-hidden bg-slate-100">
                                    <img src={getProfessionalImage(item.name)} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute top-6 left-6">
                                        <span className={`text-white text-[10px] px-5 py-2 rounded-lg font-black uppercase tracking-widest ${item.status === 'Not Available' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                            {item.status || "Available"}
                                        </span>
                                    </div>
                                    <button onClick={(e) => { e.preventDefault(); downloadImage(getProfessionalImage(item.name), `${item.name.toLowerCase()}-profile.jpg`); }} className="absolute top-6 right-6 p-4 bg-white/40 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500 hover:text-white">
                                        <Download size={20} />
                                    </button>
                                </div>
                                <div className="p-10">
                                    <h4 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{item.name}</h4>
                                    <p className="text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
                                        {item.domain}
                                    </p>
                                    <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <Link to="/register" className="text-xs font-black text-slate-900 uppercase tracking-widest hover:text-yellow-600 transition-colors">View Profile</Link>
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-yellow-500 transition-colors">
                                            <Send size={18} className="-translate-y-0.5 translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: SUPPORT / FAQ ── */}
            <section id="support" className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-4">Support</p>
                        <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900">Frequently Asked <span className="text-yellow-500">Questions</span></h2>
                        <p className="text-slate-500 mt-6 text-lg">Everything you need to understand how AI Expert works.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 mt-20 items-start">
                        {/* FAQs */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8"><span className="text-yellow-500">Fast</span> Answers</h3>
                            {faqs.map((faq, i) => (
                                <div key={i} className={`border rounded-[24px] overflow-hidden transition-all ${openFaq === i ? 'border-yellow-400 shadow-xl shadow-yellow-500/10' : 'border-slate-100'}`}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-black text-slate-900 text-sm pr-8">{faq.q}</span>
                                        <ArrowRight size={18} className={`text-yellow-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-6 pb-6">
                                            <p className="text-slate-600 font-medium text-sm leading-relaxed">{faq.a}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Complaint Form */}
                        <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 relative z-10">Raise a <span className="text-yellow-500">Ticket</span></h3>
                            <p className="text-slate-500 font-medium text-sm mb-8 relative z-10">Submit system complaints or technical issues directly to the Admin panel.</p>
                            
                            {supportStatus === 'success' && (
                                <div className="bg-emerald-50 text-emerald-700 text-sm font-bold p-4 rounded-2xl mb-6 border border-emerald-200 flex items-center">
                                    <CheckCircle size={18} className="mr-2" /> Ticket submitted to Administration.
                                </div>
                            )}
                            {supportStatus === 'error' && (
                                <div className="bg-red-50 text-red-700 text-sm font-bold p-4 rounded-2xl mb-6 border border-red-200">
                                    Submission failed. Please try again.
                                </div>
                            )}

                            <form onSubmit={handleSupportSubmit} className="space-y-4 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Your Name" required
                                        value={supportForm.name} onChange={e => setSupportForm({...supportForm, name: e.target.value})}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-yellow-500 transition-all outline-none" />
                                    <input type="email" placeholder="Email Address" required
                                        value={supportForm.email} onChange={e => setSupportForm({...supportForm, email: e.target.value})}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-yellow-500 transition-all outline-none" />
                                </div>
                                <input type="text" placeholder="Issue Subject" required
                                    value={supportForm.subject} onChange={e => setSupportForm({...supportForm, subject: e.target.value})}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-yellow-500 transition-all outline-none" />
                                <textarea placeholder="Describe your issue in detail..." required rows="4"
                                    value={supportForm.message} onChange={e => setSupportForm({...supportForm, message: e.target.value})}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-yellow-500 transition-all outline-none resize-none"></textarea>
                                <button type="submit" disabled={supportLoading}
                                    className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all shadow-xl hover:shadow-yellow-500/30 active:scale-95 disabled:opacity-50 flex justify-center items-center">
                                    {supportLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Support Ticket'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-16 text-white text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <Sparkles className="text-yellow-500 w-8 h-8" />
                        <span className="text-2xl font-black uppercase tracking-tighter">AI Expert</span>
                    </div>
                    <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest leading-loose">
                        &copy; 2026 EXPERTSYNC SOLUTIONS. ALL RIGHTS RESERVED.<br />
                        <span className="text-yellow-500/50">MATCHING TALENT WITH PRECISION</span>
                    </p>
                    
                    {/* Mobile Sync Gateway - QR Code */}
                    <div className="mt-12 flex flex-col items-center animate-fade-up">
                        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-white/10 group hover:scale-105 transition-all duration-500 mb-6">
                            <div className="relative">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href.replace('localhost', '10.205.177.215'))}`} alt="Portal QR Link" className="w-32 h-32 rounded-xl object-contain bg-white p-2 shadow-inner" />
                                <div className="absolute inset-0 border-2 border-yellow-500/20 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                            Scan to Sync <span className="text-yellow-500">Mobile Portal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
