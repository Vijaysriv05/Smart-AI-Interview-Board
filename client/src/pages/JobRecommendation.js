import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Target, Search, MapPin, Briefcase, Landmark, ExternalLink, Sparkles, Trash2, Plus, Timer, CheckCircle, XCircle, AlertTriangle, Brain, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// ── DYNAMIC QUESTION POOL ─────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  { q: "What does API stand for?", opts: ["Application Programming Interface", "Advanced Program Integration", "Automated Processing Interface", "Application Protocol Index"], a: 0 },
  { q: "Which data structure uses LIFO ordering?", opts: ["Queue", "Stack", "Linked List", "Heap"], a: 1 },
  { q: "What is the time complexity of Binary Search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], a: 1 },
  { q: "Which HTTP verb is used to update an existing resource?", opts: ["GET", "POST", "PUT", "DELETE"], a: 2 },
  { q: "What does SQL stand for?", opts: ["Structured Query Language", "Simple Question Language", "Sequential Query Logic", "Server Query Layer"], a: 0 },
  { q: "In React, which hook runs after every render?", opts: ["useState", "useEffect", "useCallback", "useRef"], a: 1 },
  { q: "What does CSS stand for?", opts: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Color Style Script"], a: 1 },
  { q: "Which Git command stages changes?", opts: ["git commit", "git push", "git add", "git merge"], a: 2 },
  { q: "What is the output of typeof null in JavaScript?", opts: ["null", "undefined", "object", "boolean"], a: 2 },
  { q: "Which protocol secures data over the internet?", opts: ["HTTP", "FTP", "SMTP", "HTTPS"], a: 3 },
  { q: "What does DOM stand for?", opts: ["Document Object Model", "Data Object Management", "Dynamic Output Module", "Desktop Object Map"], a: 0 },
  { q: "In Big O, which is the fastest complexity?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], a: 2 },
  { q: "Which keyword declares a constant in JavaScript?", opts: ["var", "let", "const", "static"], a: 2 },
  { q: "What does JSON stand for?", opts: ["JavaScript Object Notation", "Java Source Object Network", "JSON Static Object Node", "Java Serial Output Name"], a: 0 },
  { q: "Which layer handles IP addresses in networking?", opts: ["Physical", "Data Link", "Network", "Transport"], a: 2 },
];

const PASS_THRESHOLD = 3;  // 3 out of 5 correct = PASS
const TIME_PER_Q = 60;     // seconds per question

// ── UTILITY ───────────────────────────────────────────────────────────────────
function getRandomQuestions() {
  return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
}

// ── ASSESSMENT MODAL ──────────────────────────────────────────────────────────
function AssessmentModal({ job, onPass, onClose }) {
  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const timerRef = useRef(null);

  // Generate fresh questions each time modal opens
  useEffect(() => { setQuestions(getRandomQuestions()); }, []);

  const submitAnswer = useCallback((ans) => {
    clearInterval(timerRef.current);
    const newAnswers = [...answers, ans];
    setAnswers(newAnswers);
    if (currentQ < 4) {
      setTimeout(() => {
        setCurrentQ(p => p + 1);
        setSelected(null);
        setTimeLeft(TIME_PER_Q);
      }, 600);
    } else {
      setPhase('result');
    }
  }, [answers, currentQ]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'quiz') return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { submitAnswer(null); return TIME_PER_Q; } // null = timed out
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentQ, submitAnswer]);

  const score = answers.filter((a, i) => a === questions[i]?.a).length;
  const passed = score >= PASS_THRESHOLD;

  const timerColor = timeLeft > 20 ? '#22c55e' : timeLeft > 10 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 24;
  const dashOffset = circumference * (1 - timeLeft / TIME_PER_Q);

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div className="p-14 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">
              Skill Gate <span className="text-blue-600">Assessment</span>
            </h2>
            <p className="text-slate-500 font-medium mb-4 leading-relaxed">
              Before applying for <strong className="text-slate-800">{job?.title}</strong> at{' '}
              <strong className="text-slate-800">{job?.company}</strong>, you need to pass a quick 5-question technical screening.
            </p>
            <div className="flex justify-center gap-8 my-8 p-6 bg-slate-50 rounded-3xl">
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600">5</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Questions</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-amber-500">{TIME_PER_Q}s</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Per Question</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-600">{PASS_THRESHOLD}/5</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">To Pass</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-700 transition-colors">Cancel</button>
              <button onClick={() => setPhase('quiz')} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 transition-all active:scale-95">
                Start Assessment <Zap size={14} className="inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && questions.length > 0 && (
          <div className="p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Question {currentQ + 1} of 5</p>
                <div className="flex gap-1.5">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className={`h-1.5 w-10 rounded-full transition-all ${i < currentQ ? 'bg-blue-600' : i === currentQ ? 'bg-blue-400 animate-pulse' : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
              {/* SVG Countdown Timer */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" width="56" height="56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke={timerColor} strokeWidth="4"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
                </svg>
                <span className="text-sm font-black" style={{ color: timerColor }}>{timeLeft}</span>
              </div>
            </div>

            {/* Question */}
            <h3 className="text-2xl font-black text-slate-900 mb-8 leading-snug">
              {questions[currentQ].q}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQ].opts.map((opt, i) => (
                <button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => { setSelected(i); submitAnswer(i); }}
                  className={`w-full p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all active:scale-95 ${
                    selected === null
                      ? 'border-slate-100 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                      : selected === i
                        ? i === questions[currentQ].a
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-red-400 bg-red-50 text-red-700'
                        : i === questions[currentQ].a
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-100 bg-slate-50 text-slate-400 opacity-50'
                  }`}
                >
                  <span className="font-black text-blue-500 mr-3">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && (
          <div className="p-14 text-center">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {passed
                ? <CheckCircle className="w-12 h-12 text-emerald-500" />
                : <XCircle className="w-12 h-12 text-red-500" />
              }
            </div>
            <h2 className={`text-5xl font-black uppercase tracking-tighter mb-2 ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
              {passed ? 'You Passed!' : 'Not Quite!'}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">
              Score: {score} / 5 Correct &nbsp;·&nbsp; {passed ? '🎉 Unlocked to Apply' : `Need ${PASS_THRESHOLD} to Pass`}
            </p>

            {/* Score bar */}
            <div className="bg-slate-100 h-3 rounded-full mb-10 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${passed ? 'bg-emerald-500' : 'bg-red-400'}`}
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>

            {/* Review */}
            <div className="space-y-2 mb-10 text-left">
              {questions.map((q, i) => {
                const correct = answers[i] === q.a;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold ${correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {correct ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span className="flex-1 truncate">{q.q}</span>
                    {!correct && <span className="text-[10px] opacity-70">Correct: {q.opts[q.a]}</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-700 transition-colors">Close</button>
              {passed
                ? <button onClick={onPass} className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">
                    Submit Application <ExternalLink size={14} className="inline ml-1" />
                  </button>
                : <button onClick={() => { setPhase('intro'); setCurrentQ(0); setAnswers([]); setSelected(null); setTimeLeft(TIME_PER_Q); setQuestions(getRandomQuestions()); }} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">
                    Retry Assessment <Brain size={14} className="inline ml-1" />
                  </button>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const JobRecommendation = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', tags: '', match: 90, description: '' });
  const [allApplications, setAllApplications] = useState([]);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // Assessment gate state
  const [assessmentJob, setAssessmentJob] = useState(null); // which job triggered the gate

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data); setFilteredJobs(data);
      } catch (err) { console.error("Failed to fetch jobs"); }
      finally { setLoading(false); }
    };
    const fetchApplications = async () => {
      if (user?.role === 'Admin' || user?.role === 'Recruiter') {
        try { const { data } = await api.get('/applications/all'); setAllApplications(data); }
        catch (err) { console.error("Failed to fetch applications"); }
      }
    };
    fetchJobs(); fetchApplications();
  }, [user]);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  // Triggered when "Apply Now" is clicked
  const handleApplyClick = (job) => {
    if (user?.role !== 'Candidate') return; // admins/recruiters don't need the gate
    setAssessmentJob(job);
  };

  // Called after the candidate passes the assessment
  const handleAssessmentPass = async () => {
    try {
      await api.post('/applications', { jobId: assessmentJob._id || assessmentJob.id });
      setAssessmentJob(null);
      setShowSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Remove this job opportunity?')) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter(j => (j._id || j.id) !== id));
        setFilteredJobs(filteredJobs.filter(j => (j._id || j.id) !== id));
      } catch { alert("Failed to delete job."); }
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newJob, tags: newJob.tags.split(',').map(t => t.trim()).filter(Boolean) };
      const { data } = await api.post('/jobs', payload);
      setJobs([data, ...jobs]); setFilteredJobs([data, ...filteredJobs]);
      setShowAddModal(false);
      setNewJob({ title: '', company: '', location: '', salary: '', tags: '', match: 90, description: '' });
    } catch { alert("Failed to add job."); }
  };

  const handleStatusUpdate = async (appId, newStatus, interviewDate = null) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus, interviewDate });
      setAllApplications(allApplications.map(a => a._id === appId ? { ...a, status: newStatus, interviewDate } : a));
    } catch (err) { console.error("Status update error", err); }
  };

  return (
    <div className="p-8 h-full bg-slate-50 overflow-y-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center"><Target className="mr-3 text-blue-600" /> Job Matcher</h1>
          <p className="text-slate-500 mt-1 font-medium">Personalized career opportunities synced with your technical expertise.</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {(user?.role === 'Admin' || user?.role === 'Recruiter') && (
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center whitespace-nowrap">
              <Plus className="mr-2" size={18} /> Add Job
            </button>
          )}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search roles or tags..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </header>

      {/* Candidate gate banner */}
      {user?.role === 'Candidate' && (
        <div className="flex items-center gap-4 mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <p className="text-amber-800 font-bold text-sm">
            Each job requires a <span className="text-amber-600">5-question timed assessment</span> (60s/question, 3/5 to pass) before your application is submitted.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Matching with live database...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job._id || job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center md:items-start group">
              <div className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center bg-blue-50 rounded-2xl p-4 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <div className={`text-2xl font-bold ${job.match >= 90 ? 'text-blue-600' : 'text-slate-400'} group-hover:text-white`}>{job.match}%</div>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">Match</span>
              </div>
              <div className="flex-1 text-center md:text-left min-w-0">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm font-semibold text-slate-500">
                      <span className="flex items-center"><Landmark size={14} className="mr-1.5 text-blue-500" /> {job.company}</span>
                      <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-blue-500" /> {job.location}</span>
                      <span className="flex items-center text-emerald-600"><Briefcase size={14} className="mr-1.5" /> {job.salary}</span>
                      {user?.role === 'Admin' && (
                        <button onClick={e => handleDelete(e, job._id || job.id)} className="ml-2 text-red-500 hover:text-red-700 transition-colors p-1"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {user?.role === 'Candidate' ? (
                      <button onClick={() => handleApplyClick(job)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center transition-all active:scale-95 whitespace-nowrap">
                        Apply Now <ExternalLink size={16} className="ml-2" />
                      </button>
                    ) : (
                      <div className="text-xs text-slate-400 font-bold italic px-4 py-2 bg-slate-50 rounded-lg">Recruiter/Admin view</div>
                    )}
                    {(user?.role === 'Admin' || user?.role === 'Recruiter') && (
                      <button onClick={async () => { try { const { data } = await api.get('/applications/all'); setAllApplications(data); setSelectedJobForApplicants(job); } catch { alert("Failed to pull applicant data."); } }}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center transition-all active:scale-95 whitespace-nowrap">
                        Manage Applicants <Plus size={16} className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
                  {(job.tags || []).map(tag => <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-slate-200">{tag}</span>)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Target className="mx-auto w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No matching roles found</h3>
            <p className="text-slate-400 max-w-sm mx-auto mt-2 font-medium">Try different keywords or update your profile.</p>
          </div>
        )}
      </div>

      {/* Assessment Gate Modal */}
      {assessmentJob && (
        <AssessmentModal
          job={assessmentJob}
          onPass={handleAssessmentPass}
          onClose={() => setAssessmentJob(null)}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6"><Sparkles className="w-10 h-10 text-emerald-600" /></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">Your profile has been shared with the hiring team. Track your status in the Application Tracker.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowSuccess(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg">Continue Browsing</button>
              <Link to="/applications" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-xl font-bold transition-all text-center block">View My Status</Link>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm text-left">
          <div className="bg-white max-w-2xl w-full rounded-[40px] shadow-2xl p-12">
            <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Publish New <span className="text-blue-600">Requisition</span></h2>
            <form onSubmit={handleAddJob} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Job Title</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required placeholder="e.g. Senior Dev" /></div>
                <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} required placeholder="e.g. TechCorp" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} required placeholder="e.g. Remote" /></div>
                <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Salary Range</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} placeholder="e.g. $100k - $150k" /></div>
              </div>
              <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Job Description</label><textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold min-h-[100px]" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required placeholder="Enter job summary and requirements..." /></div>
              <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tags (comma separated)</label><input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" value={newJob.tags} onChange={e => setNewJob({...newJob, tags: e.target.value})} placeholder="React, Node.js, AI" /></div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] bg-blue-600 hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Post Job Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Applicants Modal */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm text-left">
          <div className="bg-white max-w-4xl w-full rounded-[40px] shadow-2xl p-12 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Master <span className="text-blue-600">Applicant Queue</span></h2>
                <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">For: {selectedJobForApplicants.title}</p>
              </div>
              <button onClick={() => setSelectedJobForApplicants(null)} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {allApplications.filter(a => (a.job?._id || a.job)?.toString() === selectedJobForApplicants._id?.toString()).length === 0 ? (
                <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[30px]">No candidates have applied yet.</div>
              ) : (
                allApplications.filter(a => (a.job?._id || a.job)?.toString() === selectedJobForApplicants._id?.toString()).map(app => (
                  <div key={app._id} className="bg-slate-50 p-8 rounded-[30px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl italic uppercase">{app.candidate?.name?.[0] || 'C'}</div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 uppercase italic">{app.candidate?.name || 'Candidate Name'}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{app.candidate?.email}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-600' : app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' : app.status === 'Waiting List' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{app.status}</span>
                          {app.interviewDate && <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase">Interview: {new Date(app.interviewDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="date" className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm" onChange={e => handleStatusUpdate(app._id, app.status, e.target.value)} value={app.interviewDate ? app.interviewDate.split('T')[0] : ""} />
                      {['Shortlisted', 'Waiting List', 'Selected'].map(s => (
                        <button key={s} onClick={() => handleStatusUpdate(app._id, s)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${app.status === s ? (s==='Shortlisted' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : s==='Waiting List' ? 'bg-amber-500 text-white shadow-xl' : 'bg-emerald-500 text-white shadow-xl') : 'bg-white text-slate-400 hover:text-blue-600 border border-slate-100'}`}>{s === 'Waiting List' ? 'Waitlist' : s}</button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRecommendation;
