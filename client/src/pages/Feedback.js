import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Star, Send, Shield, User, Clock, Sparkles, Trash2 } from 'lucide-react';

const Feedback = () => {
    const { user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user?.role === 'Admin') {
            fetchFeedbacks();
        }
    }, [user]);

    const fetchFeedbacks = async () => {
        try {
            const { data } = await api.get('/feedback');
            setFeedbacks(data);
        } catch (error) {
            console.error("Error fetching feedbacks", error);
        }
    };

    const handleDeleteFeedback = async (id) => {
        if (window.confirm('Remove this feedback entry from the database?')) {
            try {
                await api.delete(`/feedback/${id}`);
                setFeedbacks(feedbacks.filter(f => f._id !== id));
            } catch (error) {
                console.error("Error deleting feedback:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/feedback', { content, rating });
            setSuccess(true);
            setContent('');
            setRating(5);
        } catch (error) {
            alert("Error submitting feedback");
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'Admin') {
        return (
            <div className="p-8 h-full bg-slate-50 overflow-y-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                            <MessageSquare className="mr-3 text-indigo-600" /> User Feedback
                        </h1>
                        <p className="text-slate-500 mt-1">Review feedback and sentiment from platform users.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {feedbacks.length === 0 ? (
                        <div className="col-span-full py-20 bg-white rounded-2xl border border-slate-200 text-center font-medium text-slate-400">No feedback entries found in the system.</div>
                    ) : (
                        feedbacks.map(f => (
                            <div key={f._id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col relative group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                            {f.userRole === 'Candidate' ? <User size={18} /> : <Shield size={18} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{f.userName}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold flex items-center mt-0.5 uppercase tracking-widest leading-none">
                                                <Clock size={10} className="mr-1" /> {new Date(f.createdAt).toLocaleDateString()} &bull; {f.userRole}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex space-x-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={`${i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteFeedback(f._id)}
                                            className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                            title="Delete Feedback"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed font-medium">
                                    "{f.content}"
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-12 border border-slate-200">
                {success ? (
                    <div className="text-center py-10 animate-fade-up">
                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Sparkles size={40} className="text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Feedback Received!</h2>
                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">We appreciate your insights and contribution to our professional ecosystem.</p>
                        <button 
                            onClick={() => setSuccess(false)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                        >
                            Return to Portal
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-10 animate-fade-up text-left">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Platform Feedback</h1>
                            <p className="text-slate-400 font-medium">Help us evolve the expert recruitment ecosystem.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-6 text-center uppercase tracking-widest">Rate Your Experience</label>
                            <div className="flex justify-center space-x-4">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button 
                                        key={num}
                                        type="button"
                                        onClick={() => setRating(num)}
                                        className={`w-14 h-14 rounded-2xl border-2 font-bold transition-all flex flex-col items-center justify-center ${
                                            rating === num 
                                            ? 'border-blue-600 bg-blue-600 text-white scale-105 shadow-lg shadow-blue-500/20' 
                                            : 'border-slate-100 text-slate-400 bg-slate-50 hover:border-blue-300'
                                        }`}
                                    >
                                        <span className="text-lg">{num}</span>
                                        <Star size={10} className={rating === num ? 'fill-white' : 'fill-none'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest">Detailed Suggestions</label>
                            <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows="5"
                                placeholder="..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                        >
                            <Send size={18} />
                            <span>{loading ? 'Transmitting...' : 'Submit Feedback'}</span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;
