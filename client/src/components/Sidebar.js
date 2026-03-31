import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, UserPlus, BrainCircuit, LogOut, 
    Shield, MessageSquare, FileSearch, Play, 
    Target, TrendingUp, Clock, ShieldAlert
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    let navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/profile', icon: <UserPlus size={20} />, label: 'My Profile' }
    ];

    if (user?.role === 'Admin' || user?.role === 'Recruiter') {
        navItems.push(
            { path: '/candidates', icon: <Users size={20} />, label: 'Candidates' },
            { path: '/experts', icon: <UserPlus size={20} />, label: 'Experts Database' },
            { path: '/recommendations', icon: <BrainCircuit size={20} />, label: 'AI Recommend' }
        );
    }

    if (user?.role === 'Admin') {
        navItems.push({ path: '/users', icon: <Shield size={20} />, label: 'User Access' });
    }

    if (user?.role === 'Candidate') {
        navItems.push(
            { path: '/resume-analyzer', icon: <FileSearch size={20} />, label: 'Resume Analyzer' },
            { path: '/mock-interview', icon: <Play size={20} />, label: 'Mock Interview' },
            { path: '/jobs', icon: <Target size={20} />, label: 'Job Matcher' },
            { path: '/skill-gap', icon: <TrendingUp size={20} />, label: 'Skill Gap' },
            { path: '/applications', icon: <Clock size={20} />, label: 'App Tracker' }
        );
    }

    navItems.push({ 
        path: '/feedback', 
        icon: <MessageSquare size={20} />, 
        label: user?.role === 'Admin' ? 'View Feedback' : 'Give Feedback' 
    });

    navItems.push({
        path: '/complaints',
        icon: <ShieldAlert size={20} />,
        label: user?.role === 'Admin' ? 'Support Center' : 'My Support Tickets'
    });

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col shadow-2xl z-10 border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center space-x-3 text-white">
                    <BrainCircuit className="w-8 h-8 text-blue-500" />
                    <div>
                        <h2 className="text-xl font-bold leading-tight">AI Recruiter</h2>
                        <p className="text-xs text-blue-400 font-medium">Enterprise Edition</p>
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-b border-slate-800 bg-slate-800/30">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Logged in as</p>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-slate-400">{user?.role}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-medium' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={logout}
                    className="flex w-full items-center space-x-3 py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
