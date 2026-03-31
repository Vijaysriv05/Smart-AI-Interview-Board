import React, { useState, useEffect } from 'react';
import api from '../api';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/auth/users');
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/auth/users/${id}/status`, { status });
            // Refresh list
            fetchUsers();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating user status.");
        }
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">User Access Control</h1>
                <p className="text-slate-500 mt-1">Review and approve access for Recruiters and Candidates.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-indigo-500" /> Platform Users
                    </h3>
                </div>
                
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading user database...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Current Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-8 text-slate-400">No users found.</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                                                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'Candidate' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {user.status === 'Approved' && <><CheckCircle size={16} className="text-green-500 mr-1.5" /> <span className="text-green-700 font-medium">Approved</span></>}
                                                    {user.status === 'Pending' && <><Clock size={16} className="text-amber-500 mr-1.5" /> <span className="text-amber-700 font-medium">Pending</span></>}
                                                    {user.status === 'Denied' && <><XCircle size={16} className="text-red-500 mr-1.5" /> <span className="text-red-700 font-medium">Denied</span></>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role !== 'Admin' && (
                                                    <div className="flex space-x-2">
                                                        {user.status !== 'Approved' && (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(user._id, 'Approved')}
                                                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg text-xs font-bold transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {user.status !== 'Denied' && (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(user._id, 'Denied')}
                                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors"
                                                            >
                                                                Deny
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {user.role === 'Admin' && <span className="text-xs text-slate-400 italic">No actions needed</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
