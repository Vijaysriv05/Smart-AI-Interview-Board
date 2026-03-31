import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { ShieldAlert, CheckCircle2, Search, MessageSquare, Send, User, Calendar, Clock, Inbox, Mail, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminComplaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [responseMsg, setResponseMsg] = useState('');
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: '', message: '' });
    const [ticketSubmitting, setTicketSubmitting] = useState(false);

    useEffect(() => {
        fetchComplaints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchComplaints = async () => {
        try {
            const apiPath = user?.role === 'Admin' ? '/complaints' : '/complaints/me';
            const { data } = await api.get(apiPath);
            setComplaints(data);
        } catch (err) {
            console.error("Failed to fetch complaints", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        if (!responseMsg.trim()) return;
        try {
            const { data } = await api.put(`/complaints/${selectedComplaint._id}/respond`, { adminResponse: responseMsg });
            setComplaints(complaints.map(c => c._id === data._id ? data : c));
            setSelectedComplaint(data);
            setResponseMsg('');
        } catch (error) {
            console.error(error);
            alert("Failed to send response");
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setTicketSubmitting(true);
        try {
            const { data } = await api.post('/complaints', { 
                ...newTicket, 
                name: user?.name, 
                email: user?.email 
            });
            setComplaints([data.complaint, ...complaints]);
            setShowNewTicket(false);
            setNewTicket({ subject: '', message: '' });
            setSelectedComplaint(data.complaint);
        } catch (error) {
            console.error("Failed to create ticket", error);
            alert("Error creating ticket");
        } finally {
            setTicketSubmitting(false);
        }
    };

    const filtered = complaints.filter(c => c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-8 lg:p-12 h-full flex flex-col bg-slate-50 overflow-y-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center uppercase tracking-tighter">
                        <ShieldAlert className="mr-3 text-red-500" size={32} /> Support Center
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and resolve user issues and ecosystem complaints.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search tickets by subject or name..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {user?.role !== 'Admin' && (
                        <button 
                            onClick={() => setShowNewTicket(true)}
                            className="bg-yellow-500 text-slate-900 font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl ml-4 shadow-xl shadow-yellow-500/30 hover:bg-yellow-400 transition-all absolute right-0 top-1/2 -translate-y-1/2 translate-x-[110%]"
                        >
                            + New Ticket
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[500px]">
                {/* Left side: Ticket List */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-y-auto max-h-[700px]">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                        <Inbox size={16} className="mr-2" /> Active Tickets ({filtered.length})
                    </h2>
                    
                    {loading ? (
                        <div className="py-20 text-center text-slate-400">Loading tickets...</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium">No tickets found.</div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(ticket => (
                                <div 
                                    key={ticket._id} 
                                    onClick={() => setSelectedComplaint(ticket)}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                                        selectedComplaint?._id === ticket._id 
                                        ? 'bg-blue-50 border-blue-500 shadow-md' 
                                        : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-sm leading-tight max-w-[70%] truncate ${selectedComplaint?._id === ticket._id ? 'text-blue-900' : 'text-slate-800'}`}>
                                            {ticket.subject}
                                        </h3>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                                            ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-400 font-medium mt-3 whitespace-nowrap overflow-hidden text-ellipsis">
                                        <User size={12} className="mr-1" /> {ticket.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side: Ticket Details */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] shadow-sm flex flex-col overflow-hidden relative">
                    {!selectedComplaint ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-50">
                            <MessageSquare size={64} className="text-slate-300 mb-6" />
                            <h2 className="text-xl font-bold text-slate-800">No Ticket Selected</h2>
                            <p className="text-slate-500 font-medium max-w-sm mt-2">Select a ticket from the left queue to view details and provide an administrative response.</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full max-h-[700px]">
                            {/* Ticket Header */}
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedComplaint.subject}</h2>
                                </div>
                                <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                                    <div className="flex items-center"><User size={16} className="mr-2 text-blue-500" /> {selectedComplaint.name}</div>
                                    <div className="flex items-center"><Mail size={16} className="mr-2 text-blue-500" /> {selectedComplaint.email}</div>
                                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-blue-500" /> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</div>
                                    <div className="flex items-center"><Clock size={16} className="mr-2 text-blue-500" /> {new Date(selectedComplaint.createdAt).toLocaleTimeString()}</div>
                                </div>
                            </div>
                            
                            {/* Message Thread */}
                            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-white custom-scrollbar">
                                {/* Initial Complaint */}
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2 flex items-center">
                                        <User size={12} className="mr-1" /> User Message
                                    </h4>
                                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[24px] rounded-tl-none font-medium text-slate-700 leading-relaxed shadow-sm">
                                        {selectedComplaint.message}
                                    </div>
                                </div>
                                
                                {/* Admin Response if exists or waiting */}
                                {selectedComplaint.status === 'Resolved' ? (
                                    <div className="flex flex-col items-end">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 mr-2 flex items-center">
                                            <ShieldAlert size={12} className="mr-1" /> Admin Resolution
                                        </h4>
                                        <div className="bg-blue-600 text-white border border-blue-500 p-6 rounded-[24px] rounded-tr-none font-medium leading-relaxed shadow-[0_10px_30px_rgba(37,99,235,0.2)] max-w-[85%]">
                                            <div className="flex items-center font-bold mb-2 opacity-80 text-xs">
                                                <CheckCircle2 size={16} className="mr-2" /> Resolved officially
                                            </div>
                                            {selectedComplaint.adminResponse}
                                        </div>
                                    </div>
                                ) : user?.role === 'Admin' ? (
                                    <div className="pt-4 border-t border-slate-100 flex flex-col items-end w-full animate-fade-in">
                                         <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-3 mr-2 w-full text-right">
                                            Action Required
                                        </h4>
                                        <form onSubmit={handleRespond} className="w-full relative">
                                            <textarea 
                                                value={responseMsg}
                                                onChange={(e) => setResponseMsg(e.target.value)}
                                                placeholder="Write the official administrative resolution here..."
                                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-[24px] p-6 pr-20 font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 min-h-[160px] resize-none transition-all shadow-inner"
                                                required
                                            ></textarea>
                                            <button 
                                                type="submit" 
                                                className="absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 text-amber-600 border border-amber-200 p-6 rounded-2xl font-bold flex items-center justify-center text-sm">
                                        <Clock size={16} className="mr-2" /> Action Pending from Administration
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Modal */}
            {showNewTicket && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-12 animate-scale-in">
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Open a Ticket</h3>
                                <p className="text-slate-500 font-medium text-sm mt-1">Found a bug? Describe the issue directly to the admin.</p>
                            </div>
                            <button onClick={() => setShowNewTicket(false)} className="p-4 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900">
                                <X size={24} />
                            </button>
                        </header>
                        
                        <form onSubmit={handleCreateTicket} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                                <input type="text" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-semibold focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder:text-slate-300" placeholder="e.g. Broken connection on Mock Lab" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Description</label>
                                <textarea value={newTicket.message} onChange={e => setNewTicket({...newTicket, message: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-5 font-semibold focus:ring-2 focus:ring-yellow-500 outline-none transition-all resize-none min-h-[160px] placeholder:text-slate-300" placeholder="Describe the steps to reproduce..."></textarea>
                            </div>
                            <button type="submit" disabled={ticketSubmitting} className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-5 rounded-[24px] shadow-2xl shadow-slate-900/20 hover:bg-yellow-500 hover:text-slate-900 hover:shadow-yellow-500/30 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center">
                                {ticketSubmitting ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Submit Directly to Admin"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminComplaints;
