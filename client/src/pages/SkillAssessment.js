import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, Clock, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillAssessment = () => {
    const [currentStep, setCurrentStep] = useState('intro'); // intro, quiz, result
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const navigate = useNavigate();

    const questions = [
        {
            q: "What is the primary purpose of a Redux store?",
            options: ["To style components", "To manage global application state", "To connect to external databases", "To handle HTTP requests"],
            correct: 1
        },
        {
            q: "Which property is used in Flexbox to align items along the cross-axis?",
            options: ["justify-content", "align-items", "flex-direction", "display"],
            correct: 1
        },
        {
            q: "What does JSX stand for in React?",
            options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JSON Syntax XML"],
            correct: 0
        },
        {
            q: "In Node.js, what is the purpose of the package.json file?",
            options: ["To store CSS styles", "To store project metadata and dependencies", "To hold secret API keys", "To define database schemas"],
            correct: 1
        },
        {
            q: "Which hook is used to handle side effects in React functional components?",
            options: ["useState", "useContext", "useEffect", "useMemo"],
            correct: 2
        }
    ];

    useEffect(() => {
        let timer;
        if (currentStep === 'quiz' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setCurrentStep('result');
        }
        return () => clearInterval(timer);
    }, [currentStep, timeLeft]);

    const handleAnswer = (index) => {
        const isCorrect = index === questions[currentQuestion].correct;
        if (isCorrect) setScore(prev => prev + 20);
        
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setCurrentStep('result');
        }
    };

    const handleComplete = () => {
        if (score >= 60) {
            localStorage.setItem('assessmentPassed', 'true');
            navigate('/jobs');
        } else {
            setCurrentStep('intro');
            setScore(0);
            setCurrentQuestion(0);
            setTimeLeft(60);
        }
    };

    if (currentStep === 'intro') {
        return (
            <div className="min-h-screen bg-[#050B1B] text-white flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-[40px] p-10 text-center backdrop-blur-3xl">
                    <div className="w-20 h-20 bg-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_20px_50px_rgba(234,179,8,0.2)]">
                        <Zap size={40} className="text-black" />
                    </div>
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Skill Verification</h1>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">To ensure high-quality applications, all candidates must pass this quick technical check (60% required) before applying for premium roles.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-10 text-left">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Clock size={16} className="text-yellow-500 mb-2" />
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Duration</p>
                            <p className="font-bold">60 Seconds</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Award size={16} className="text-yellow-500 mb-2" />
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Threshold</p>
                            <p className="font-bold">60% Score</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setCurrentStep('quiz')}
                        className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-lg hover:bg-yellow-400 transition-all flex items-center justify-center space-x-2"
                    >
                        <span>BEGIN ASSESSMENT</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    if (currentStep === 'quiz') {
        return (
            <div className="min-h-screen bg-[#050B1B] text-white flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-yellow-500 transition-all duration-1000" style={{ width: `${(timeLeft/60)*100}%` }}></div>
                    
                    <div className="flex justify-between items-center mb-10">
                        <span className="text-xs font-black uppercase tracking-widest text-yellow-500">Question {currentQuestion + 1} of {questions.length}</span>
                        <div className="flex items-center space-x-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 font-black">
                            <Clock size={16} />
                            <span>0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-10 leading-snug">{questions[currentQuestion].q}</h2>

                    <div className="space-y-4">
                        {questions[currentQuestion].options.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full text-left p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-yellow-500/50 transition-all group flex justify-between items-center"
                            >
                                <span className="font-medium text-slate-200 group-hover:text-white">{opt}</span>
                                <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-yellow-500"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050B1B] text-white flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-[40px] p-10 text-center backdrop-blur-3xl">
                {score >= 60 ? (
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                        <CheckCircle size={40} />
                    </div>
                ) : (
                    <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                        <XCircle size={40} />
                    </div>
                )}
                
                <h1 className="text-4xl font-black mb-4 tracking-tight">
                    {score >= 60 ? "Assessment Passed!" : "Qualification Failed"}
                </h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Overall Score: <span className={score >= 60 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{score}%</span>
                    <br />
                    {score >= 60 
                        ? "You are now eligible to apply for high-visibility roles in the platform." 
                        : "Unfortunately, you didn't meet the minimum threshold of 60%."}
                </p>

                <button 
                    onClick={handleComplete}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${
                        score >= 60 
                        ? "bg-green-500 text-black hover:bg-green-400" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                    {score >= 60 ? "UNLOCK APPLICATIONS" : "RE-TAKE ASSESSMENT"}
                </button>
            </div>
        </div>
    );
};

export default SkillAssessment;
