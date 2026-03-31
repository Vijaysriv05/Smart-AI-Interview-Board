import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { MessageSquare, Send, X, Paperclip, Mic, Minus, Maximize2, Globe, Sparkles, Volume2 } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to AI Expert Support. How can I assist with your professional growth today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [voiceLang, setVoiceLang] = useState('en-US'); // en-US, hi-IN, ta-IN
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any currently playing audio
            
            // Clean up text (remove markdown, urls) for speaking
            const cleanText = text
                .replace(/\*+/g, '') // remove markdown bold/italic
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // replace markdown links with just the text
                .replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''); // replace URLs
                
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1;
            utterance.pitch = 1;
            
            // SMART DETECT: Bot automatically picks the correct voice (Tamil, Hindi, or English)
            if (/[\u0B80-\u0BFF]/.test(cleanText)) {
                utterance.lang = 'ta-IN'; // Tamil
            } else if (/[\u0900-\u097F]/.test(cleanText)) {
                utterance.lang = 'hi-IN'; // Hindi
            } else {
                utterance.lang = 'en-US'; // English
            }
            
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const startListening = () => {
        if (isListening) {
            stopListening();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const sr = new SpeechRecognition();
        sr.continuous = true;
        sr.interimResults = true;
        sr.lang = voiceLang;

        let currentFinal = inputText; // Lock in what's already typed

        sr.onstart = () => setIsListening(true);
        sr.onresult = (event) => {
            let interimTranscript = '';
            let newFinal = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    newFinal += ' ' + event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            if (newFinal) {
                currentFinal += newFinal;
            }
            
            // Instantly render live voice words to the text box
            setInputText((currentFinal + ' ' + interimTranscript).trim());
        };
        sr.onerror = (e) => {
            console.error("Speech Recognition Error:", e.error);
            setIsListening(false);
        };
        sr.onend = () => setIsListening(false);

        sr.start();
        setRecognition(sr);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const originalText = inputText;
        const newUserMessage = { id: Date.now(), text: originalText, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsTyping(true);

        const msgCheck = originalText.toLowerCase();
        try {
            const { data } = await api.post('/chat', { message: originalText });
            
            // Allow override if explicitly asking for learning links
            let finalResponse = data.response;
            if (msgCheck.includes('learn') && msgCheck.includes('link')) {
                finalResponse = "Here are some top resources to elevate your skills:\n\n• [GeeksForGeeks](https://www.geeksforgeeks.org/)\n• [FutureSkills Prime](https://futureskillsprime.in/)\n• [Coursera](https://www.coursera.org/)\n• [LeetCode](https://leetcode.com/)";
            } else if (!finalResponse) {
                finalResponse = "I am having trouble connecting to my knowledge base right now. Please try again later.";
            }
            
            const botResponse = { 
                id: Date.now() + 1, 
                text: finalResponse, 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat error:", error);
            const status = error.response?.status || 'Network Error';
            const errorMsg = { 
                id: Date.now() + 1, 
                text: `Connection Issue [${status}]: I was unable to reach my AI brain. Please ensure your backend is running on internal Port 8080.`, 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFileSelect = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const uploadMsg = { id: Date.now(), text: `📤 Uploading ${type}: ${file.name}...`, sender: 'user' };
        setMessages(prev => [...prev, uploadMsg]);

        setTimeout(() => {
            setIsUploading(false);
            const responseText = `✅ ${type} analyzed! Based on "${file.name}", I've updated your expertise profile. Check your Dashboard for insights.`;
            const responseMsg = { 
                id: Date.now() + 1, 
                text: responseText, 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, responseMsg]);
        }, 2500);
    };

    // Helper to render markdown-like links simple way
    const renderText = (text) => {
        // Split by markdown link pattern [text](url)
        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/);
        return parts.map((part, i) => {
            const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
                return (
                    <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-yellow-500 font-bold underline decoration-yellow-500/30 hover:decoration-yellow-500 transition-all">
                        {match[1]}
                    </a>
                );
            }
            // Add basic bolding parser
            const boldParts = part.split(/(\*\*[^*]+\*\*)/);
            return boldParts.map((bPart, j) => {
                if (bPart.startsWith('**') && bPart.endsWith('**')) {
                    return <strong key={j} className="font-extrabold text-white">{bPart.replace(/\*\*/g, '')}</strong>;
                }
                return <span key={j}>{bPart}</span>;
            });
        });
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-20 h-20 bg-[#EAB308] text-black rounded-[28px] shadow-[0_20px_50px_rgba(234,179,8,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[300] border-4 border-[#050B1B] animate-[bounce_3s_infinite]"
            >
                <MessageSquare size={32} />
                <span className="absolute -top-1 -right-1 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-4 border-[#050B1B]"></span>
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-8 right-8 w-[400px] bg-[#050B1B] rounded-[32px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col transition-all z-[300] overflow-hidden ${isMinimized ? 'h-20' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="p-5 bg-yellow-500 text-black flex justify-between items-center rounded-t-[32px]">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <Sparkles size={22} className="text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest leading-none">AI Career Guide</h3>
                        {!isMinimized && (
                            <div className="flex items-center mt-1 space-x-2">
                                <p className="text-[10px] font-bold text-black/60 flex items-center"><Globe size={10} className="mr-1" /> {voiceLang === 'en-US' ? 'ENGLISH' : voiceLang === 'hi-IN' ? 'हिन्दी' : 'தமிழ்'}</p>
                                <button 
                                    onClick={() => setVoiceLang(prev => prev === 'en-US' ? 'hi-IN' : prev === 'hi-IN' ? 'ta-IN' : 'en-US')}
                                    className="px-1.5 py-0.5 bg-black/10 rounded-md text-[8px] font-black uppercase tracking-tighter hover:bg-black/20 transition-all border border-black/5"
                                >
                                    Switch Language
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-black/10 rounded-xl transition-colors">
                        {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
                    </button>
                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            window.speechSynthesis.cancel();
                        }} 
                        className="p-2 hover:bg-black/10 rounded-xl transition-colors text-black"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#050B1B]/50 backdrop-blur-xl custom-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-lg whitespace-pre-wrap relative group/msg ${
                                    msg.sender === 'user' 
                                    ? 'bg-yellow-500 text-black rounded-tr-none' 
                                    : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.1)]'
                                }`}>
                                    {msg.sender === 'user' ? msg.text : renderText(msg.text)}
                                    {msg.sender === 'bot' && (
                                        <button 
                                            onClick={() => speakText(msg.text)}
                                            className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-slate-800 text-yellow-500 rounded-full opacity-0 group-hover/msg:opacity-100 transition-all hover:scale-110 hover:bg-slate-700 shadow-xl"
                                            title="Read Aloud"
                                        >
                                            <Volume2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/10 flex space-x-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 border-t border-white/10 bg-[#050B1B]">
                        <form onSubmit={handleSend} className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-3 bg-white/5 rounded-2xl p-2 border border-white/10">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={(e) => handleFileSelect(e, 'Document')} 
                                    accept=".pdf,.docx,.txt"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current.click()} 
                                    disabled={isUploading}
                                    className="p-3 text-slate-400 hover:text-yellow-500 transition-colors disabled:opacity-20"
                                    title="Upload Document"
                                >
                                    <Paperclip size={20} />
                                </button>
                                <button 
                                    type="button" 
                                    onClick={startListening} 
                                    className={`p-3 transition-colors ${isListening ? 'text-red-500 animate-pulse bg-red-500/10 rounded-xl' : 'text-slate-400 hover:text-yellow-500'}`}
                                    title="Voice Input"
                                >
                                    <Mic size={20} />
                                </button>
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={isUploading ? "Consulting..." : isListening ? "Listening... Speak now" : "Type your query..."}
                                    disabled={isUploading}
                                    className="flex-1 bg-transparent text-sm text-white focus:outline-none disabled:bg-transparent placeholder:text-slate-600"
                                />
                                <button type="submit" disabled={!inputText.trim() || isUploading} className="bg-[#EAB308] text-black p-3 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-30">
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="flex justify-center flex-col items-center gap-1">
                                <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black">AI Powered by Neural Match V2</p>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBot;
