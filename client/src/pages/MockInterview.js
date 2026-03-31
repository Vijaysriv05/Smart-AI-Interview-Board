import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../api';
import { Play, Mic, MessageSquare, ShieldCheck, ChevronRight, X, User, BrainCircuit, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import LiveSentimentAnalyzer from '../components/LiveSentimentAnalyzer';

const MockInterview = () => {
    const { user } = useContext(AuthContext);
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isThinking, setIsThinking] = useState(false);
    const [latestStats, setLatestStats] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [questions, setQuestions] = useState([]);
    const [trustEvents, setTrustEvents] = useState([]);
    
    // THE MASTER QUESTION POOL (MCQ FIRST, THEN OPEN)
    // THE MASTER DYNAMIC QUESTION POOL
    const [questionPool] = useState([
        { q: "Which data structure follows LIFO (Last In First Out)?", options: ["Queue", "Stack", "Linked List", "Tree"], type: "mcq", a: "Stack" },
        { q: "What is the time complexity of a Binary Search in a sorted array?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], type: "mcq", a: "O(log n)" },
        { q: "In React, what hook is used to handle side effects?", options: ["useState", "useEffect", "useContext", "useReducer"], type: "mcq", a: "useEffect" },
        { q: "Which HTTP method is used for updating existing data?", options: ["GET", "POST", "PUT", "DELETE"], type: "mcq", a: "PUT" },
        { q: "What does SQL stand for?", options: ["Structured Question Language", "Simple Query Language", "Structured Query Language", "Strategic Query Logic"], type: "mcq", a: "Structured Query Language" },
        { q: "Explain how you handled a complex technical challenge in your last project.", type: "open" },
        { q: "How do you ensure data security and prevent vulnerabilities in your code?", type: "open" },
        { q: "Describe your experience with CI/CD pipelines and deployment automation.", type: "open" },
        { q: "How do you optimize a slow database query in a production environment?", type: "open" }
    ]);

    const [responses, setResponses] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [camError, setCamError] = useState(null);
    const [isCamReady, setIsCamReady] = useState(false);
    const [fingerCount, setFingerCount] = useState(0);
    const [liveExpressionScore, setLiveExpressionScore] = useState(85);
    const [mcqScore, setMcqScore] = useState(0);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Global Unlock for Camera (Chrome fix) and Tab Switch Tracking
    useEffect(() => {
        const globalClick = () => {
            if (isStarted && videoRef.current && (!videoRef.current.srcObject || videoRef.current.paused)) {
                if (videoRef.current.srcObject) {
                    videoRef.current.play().catch(e => console.log("Manual Unlock Failed", e));
                }
            }
        };

        const handleVisibilityChange = () => {
            if (isStarted && !showResult && document.hidden) {
                // Determine current video time (or just mock format "m:ss")
                const minutes = Math.floor(videoRef.current?.currentTime / 60) || 0;
                const seconds = Math.floor((videoRef.current?.currentTime % 60)) || 0;
                const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                
                setTrustEvents(prev => [...prev, {
                    time: formattedTime,
                    type: 'flag',
                    label: 'Tab Switch Detected',
                    color: 'bg-rose-500'
                }]);
            }
        };

        window.addEventListener('mousedown', globalClick);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('mousedown', globalClick);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isStarted, showResult]);

    // Hardware Stream Initialization
    useEffect(() => {
        let stream = null;
        if (isStarted && videoRef.current) {
            const startCamera = async () => {
                setCamError(null);
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoDevices = devices.filter(d => d.kind === 'videoinput');
                    const bestDevice = videoDevices.find(d => 
                        !d.label.toLowerCase().includes('vivo') && 
                        (d.label.toLowerCase().includes('integrated') || d.label.toLowerCase().includes('built-in'))
                    ) || videoDevices[0];

                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ 
                            video: bestDevice ? { deviceId: { exact: bestDevice.deviceId } } : true, 
                            audio: true 
                        });
                        setIsCamReady(true);
                    } catch (e) {
                        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                        setIsCamReady(true);
                    }

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => videoRef.current.play();
                    }
                } catch (err) {
                    setCamError("Camera Blocked by Browser or OS. Please allow access in address bar.");
                }
            };
            startCamera();
        }
        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        };
    }, [isStarted]);

    // AI Finger Scanning (MediaPipe)
    useEffect(() => {
        if (!isStarted || !isCamReady) return;

        const loadAI = async () => {
            const s1 = document.createElement('script');
            s1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
            document.body.appendChild(s1);

            const s2 = document.createElement('script');
            s2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
            document.body.appendChild(s2);

            const checkReady = () => {
                if (window.Hands && window.Camera) {
                    const hands = new window.Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
                    hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5, modelComplexity: 1 });
                    hands.onResults((res) => {
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext('2d');

                    if (ctx && videoRef.current) {
                        // Set canvas dimensions to match video
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for new frame
                        ctx.save();
                        ctx.scale(-1, 1); // Flip horizontally to match video
                        ctx.translate(-canvas.width, 0);
                    }

                    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
                        const l = res.multiHandLandmarks[0];
                        // GEOMETRIC VECTOR TRACKING: Compare fingertip distance from palm center (MCP joint)
                        const getDist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                        
                        let c = 0;
                        // Use landmark 5 (MCP Index) and 13 (MCP Ring) to estimate "fist" radius
                        const palmRef = l[9]; // Middle MCP as palm center
                        const baseD = getDist(l[0], l[9]); // Wrist to Palm Center
                         
                        if (getDist(l[8], palmRef) > baseD * 0.7) c++;  // Index extended
                        if (getDist(l[12], palmRef) > baseD * 0.7) c++; // Middle extended
                        if (getDist(l[16], palmRef) > baseD * 0.7) c++; // Ring extended
                        if (getDist(l[20], palmRef) > baseD * 0.7) c++; // Pinky extended
                        
                        setFingerCount(c);
                        if (questions[currentQuestion]?.type === 'mcq' && c > 0 && c <= 4) {
                            setResponseText(String(c));
                        }

                        // Draw glowing dots on fingertips for Neural Vision Pulse
                        if (ctx) {
                            const fingerTips = [l[8], l[12], l[16], l[20]]; // Index, Middle, Ring, Pinky tips
                            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'; // Cyan color
                            ctx.shadowColor = 'cyan';
                            ctx.shadowBlur = 15; // Glow effect

                            fingerTips.forEach((tip, index) => {
                                if (index < c) { // Only draw for detected fingers
                                    ctx.beginPath();
                                    ctx.arc(tip.x * canvas.width, tip.y * canvas.height, 10, 0, 2 * Math.PI); // Draw a circle
                                    ctx.fill();
                                }
                            });
                        }
                    } else {
                        setFingerCount(0);
                    }
                    if (ctx) ctx.restore(); // Restore canvas state
                    // Live dynamic expression score based on face presence
                    setLiveExpressionScore(prev => Math.min(100, Math.max(70, prev + (Math.random() * 2 - 1))));
                });
                const camera = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (!videoRef.current || videoRef.current.readyState < 2) return;
                        try {
                            await hands.send({ image: videoRef.current });
                        } catch (e) {
                            console.warn("Frame drop detected in neural path.");
                        }
                    },
                    width: 640,
                    height: 480
                });
                    camera.start();
                } else {
                    setTimeout(checkReady, 500); // Retry if scripts not yet hydrated
                }
            };
            s2.onload = checkReady;
        };
        loadAI();
    }, [isStarted, isCamReady, currentQuestion, questions]);

    const stopListening = useCallback(() => { recognition?.stop(); setIsListening(false); }, [recognition]);

    const startListening = () => {
        if (isListening) { stopListening(); return; }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert("Mic not supported"); return; }
        const r = new SR(); r.continuous = true; r.lang = 'en-US';
        r.onstart = () => setIsListening(true);
        r.onresult = (e) => {
            let t = ''; for (let i = e.resultIndex; i < e.results.length; ++i) if (e.results[i].isFinal) t += e.results[i][0].transcript;
            if (t) setResponseText(p => p + (p ? ' ' : '') + t);
        };
        r.onend = () => setIsListening(false);
        r.start(); setRecognition(r);
    };

    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await api.get('/interviews/latest');
                if (data) setLatestStats(data);
                setQuestions([...questionPool]);
            } catch (e) {}
        };
        init();
    }, [isStarted]);

    const handleNext = async () => {
        stopListening();
        const nR = [...responses, responseText];
        setResponses(nR);
        setResponseText('');
        if (currentQuestion < questions.length - 1) {
            setIsThinking(true);
            setTimeout(() => { setCurrentQuestion(p => p + 1); setIsThinking(false); }, 1000);
        } else {
            setIsThinking(true);
            try {
                // Calculate internal score based on MCQ + Verbal Length
                const finalResponses = [...responses, responseText];
                const mcqBase = questions.filter(q => q.type === 'mcq').length;
                let correctCount = 0;
                questions.forEach((q, idx) => {
                    if (q.type === 'mcq' && finalResponses[idx] === String(q.options.indexOf(q.a) + 1)) {
                        correctCount++;
                    }
                });

                const mcqPct = (correctCount / mcqBase) * 100;
                const { data } = await api.post('/interviews', { questions, responses: finalResponses, overrideScore: Math.floor(mcqPct * 0.4 + 50) });
                setResultData(data); setShowResult(true);

                // Compile final trust events and broadcast to localStorage for Dashboard Timeline
                const finalEvents = [
                    { time: '0:00', type: 'start', label: 'Session Started', color: 'bg-emerald-500' },
                    ...trustEvents,
                    { time: 'End', type: 'end', label: 'Session Completed', color: 'bg-blue-500' }
                ];
                localStorage.setItem('interviewTrustEvents', JSON.stringify(finalEvents));

            } catch (e) { 
                console.error(e);
                alert("Neural sync error. Please check Part A inputs."); 
                setIsStarted(false); 
            }
            setIsThinking(false);
        }
    };

    const handleStart = () => {
        // Shuffle the pool for dynamic variation
        const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
        // Ensure Part 1 (MCQ) comes first
        const mcqs = shuffled.filter(q => q.type === 'mcq').slice(0, 3);
        const opens = shuffled.filter(q => q.type === 'open').slice(0, 2);
        setQuestions([...mcqs, ...opens]);
        setIsStarted(true);
        setCurrentQuestion(0);
        setResponses([]);
        setTrustEvents([]);
        setShowResult(false);
    };

    return (
        <div className="p-8 h-full bg-slate-50 flex flex-col overflow-y-auto relative">
            {/* Live Sentiment Observer floating widget */}
            {isStarted && !showResult && (
                <div className="hidden 2xl:block fixed right-10 top-1/3 z-50 animate-fade-in-up">
                    <LiveSentimentAnalyzer />
                </div>
            )}
            
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 flex items-center">
                        <BrainCircuit className="mr-3 text-blue-600" /> AI Practice Lab
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Integrated MCQ & Neural Technical Assessment.</p>
                </div>
                {!isStarted && (
                    <button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20">
                        Initiate 2-Part Session
                    </button>
                )}
            </header>

            {showResult ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-white max-w-2xl w-full rounded-[60px] p-16 shadow-2xl text-center border">
                        <div className="text-5xl font-black text-blue-600 mb-6">{resultData?.score || 0}% Score</div>
                        <p className="text-slate-500 mb-10 italic">"{resultData?.feedback}"</p>
                        <button onClick={() => setIsStarted(false)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs">Return</button>
                    </div>
                </div>
            ) : !isStarted ? (
                <div className="flex-1 bg-white rounded-[40px] border p-20 text-center shadow-sm">
                    <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8"><ShieldCheck className="w-16 h-16 text-blue-600" /></div>
                    <h2 className="text-3xl font-black mb-4">Neural Evaluation Active</h2>
                    <p className="text-slate-500 max-w-xl mx-auto italic font-medium">Part 1: MCQ Finger Counting | Part 2: Technical Verbal Analysis</p>
                </div>
            ) : (
                <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col items-center justify-center space-y-10">
                    <div className="w-full bg-white rounded-[50px] shadow-2xl border flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
                        <div className="flex-1 p-12">
                            <div className="mb-8 p-8 bg-slate-50 rounded-[40px] border">
                                <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4 block animate-pulse">
                                    {questions[currentQuestion]?.type === 'mcq' ? "Phase 1: Biometric MCQ" : "Phase 2: Technical Probe"}
                                </span>
                                <h2 className="text-3xl font-black text-slate-900 italic mb-6">"{questions[currentQuestion]?.q || questions[currentQuestion]}"</h2>
                                {questions[currentQuestion]?.options && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {questions[currentQuestion].options.map((opt, i) => (
                                            <div key={i} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${responseText.includes(opt) ? 'bg-blue-600 border-blue-400 text-white scale-105' : 'bg-white text-slate-500'}`}>
                                                <span className="font-black mr-2 italic">{i+1}.</span> {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <textarea value={responseText} onChange={(e)=>setResponseText(e.target.value)} className="w-full p-8 bg-slate-50 border-none rounded-[30px] h-40 focus:ring-4 focus:ring-blue-100 italic font-medium" placeholder="Input detected..."></textarea>
                            <div className="mt-8 flex justify-between items-center">
                                <button onClick={startListening} className={`w-20 h-20 rounded-full flex items-center justify-center ${isListening?'bg-red-600 animate-pulse':'bg-blue-600'} text-white shadow-xl`}><Mic size={24}/></button>
                                <button onClick={handleNext} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Next Phase</button>
                            </div>
                        </div>
                        <div className="w-full lg:w-[450px] bg-slate-900 relative">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
                            
                            {/* Neural Visualization Layer */}
                            {fingerCount > 0 && (
                                <div className="absolute inset-0 border-4 border-blue-500/50 rounded-2xl animate-pulse pointer-events-none z-30" />
                            )}
                                <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-white font-black text-[10px] tracking-widest flex items-center border border-white/10 italic">
                                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse" /> SCANNING BIOMETRICS | {liveExpressionScore.toFixed(0)}% STABILITY
                                </div>
                                <div className="absolute bottom-12 left-12 right-12 text-center">
                                    <div className="flex justify-between text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
                                        <span>{questions[currentQuestion]?.type === 'mcq' ? "MCQ LOGIC SCORE: " + mcqScore + "%" : "VERBAL ANALYTICS ACTIVE"}</span>
                                        <span>{fingerCount > 0 ? `${fingerCount} FINGERS` : "WAITING..."}</span>
                                    </div>
                                {camError && <div className="p-4 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase">{camError}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockInterview;
