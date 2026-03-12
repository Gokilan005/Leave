import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { ShieldCheck, LogOut, Search, Clock, Check, CheckCircle, X, XCircle, Bell, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        fetchLeaves();

        const socket = io('http://localhost:5002');

        socket.on('newLeaveRequest', (newLeave) => {
            // Add notification
            const notif = {
                id: Date.now(),
                message: `${newLeave.student.name} requested leave for ${newLeave.date}`,
                createdAt: new Date()
            };
            setNotifications(prev => [notif, ...prev]);

            // Update list
            setLeaves(prev => [newLeave, ...prev]);

            // Play sound via Browser API if allowed (Audio)
            try {
                const audio = new Audio('/notification.mp3'); // Need to map this if exists, or optional
                audio.play().catch(e => console.log('Audio play blocked', e));
            } catch (e) { }
        });

        socket.on('leaveStatusUpdated', (updatedLeave) => {
            setLeaves(prev => prev.map(l => l._id === updatedLeave._id ? updatedLeave : l));
        });

        return () => socket.disconnect();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = Cookies.get('token');
            const { data } = await axios.get('http://localhost:5002/api/leaves', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Sort: Pending first, then by date descending
            const sorted = data.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setLeaves(sorted);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = Cookies.get('token');
            await axios.put(`http://localhost:5002/api/leaves/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Socket will update the UI automatically but we can also optimistically update
            setLeaves(prev => prev.map(l => l._id === id ? { ...l, status } : l));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredLeaves = leaves.filter(leave =>
        leave.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const completedCount = leaves.filter(l => l.status !== 'pending').length;
    const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">
                            {user?.role === 'hod' ? 'HOD Portal' : user?.role === 'advisor' ? 'Advisor Portal' : 'Faculty Portal'}
                        </h1>
                        <p className="text-xs text-indigo-300 font-medium tracking-wider uppercase">{user?.department} Department</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 relative text-indigo-200 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-indigo-900"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 transform origin-top-right transition-all">
                                <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-sm">Recent Alerts</h3>
                                    <button onClick={() => setNotifications([])} className="text-xs text-indigo-600 hover:underline">Clear all</button>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-sm text-slate-500 text-center">No new notifications</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="p-3 border-b border-slate-50 hover:bg-slate-50/50 text-sm">
                                                <p>{n.message}</p>
                                                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-indigo-700/50 hidden sm:block"></div>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 focus:outline-none bg-indigo-800/40 hover:bg-indigo-700/60 px-2 py-1.5 rounded-full border border-indigo-700/50 transition-colors"
                        >
                            <div className="text-right hidden sm:block pl-2">
                                <p className="font-medium text-sm text-white">{user?.name}</p>
                                <p className="text-xs text-indigo-300 uppercase leading-tight tracking-wider">{user?.role}</p>
                            </div>
                            <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-indigo-400 overflow-hidden ${!user?.profileImage ? 'bg-indigo-500' : 'bg-white'}`}>
                                {user?.profileImage ? (
                                    <img src={`http://localhost:5002${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 z-50 transform origin-top-right transition-all">
                                <div className="p-2 flex flex-col gap-1">
                                    <Link
                                        to="/profile"
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                                    >
                                        <UserIcon className="w-5 h-5 pointer-events-none" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
                                    >
                                        <LogOut className="w-5 h-5 pointer-events-none" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col h-full">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{pendingCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Completed Approvals</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{completedCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Rejected Approvals</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{rejectedCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-rose-500" />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by student name or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-full min-h-[4rem] pl-10 pr-4 rounded-xl border-none outline-none shadow-sm text-slate-700 bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                </div>

                {/* Requests List */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800">Leave Applications</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                                    <th className="px-6 py-3 font-medium">Student</th>
                                    <th className="px-6 py-3 font-medium">Leave Period</th>
                                    <th className="px-6 py-3 font-medium w-1/3">Reason</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Approved By</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No leave requests match your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeaves.map(leave => (
                                        <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">{leave.student.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">Applied: {new Date(leave.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 text-slate-800">
                                                    {(!leave.endDate || leave.date === leave.endDate)
                                                        ? new Date(leave.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                                                        : `${new Date(leave.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(leave.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 line-clamp-2">{leave.reason}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                          ${leave.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                          ${leave.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                          ${leave.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' : ''}
                        `}>
                                                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-medium text-sm">
                                                {leave.status !== 'pending' && leave.approvedBy ? (
                                                    leave.approvedBy.role === 'hod' ? 'HOD' : leave.approvedBy.role.charAt(0).toUpperCase() + leave.approvedBy.role.slice(1)
                                                ) : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {leave.status === 'pending' ? (
                                                    <div className="flex justify-end gap-2 opacity-100">
                                                        <button
                                                            onClick={() => handleStatusUpdate(leave._id, 'approved')}
                                                            className="p-1.5 bg-emerald-100 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-500"
                                                            title="Approve"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                                                            className="p-1.5 bg-rose-100 hover:bg-rose-500 hover:text-white text-rose-600 rounded-lg transition-colors border border-rose-200 hover:border-rose-500"
                                                            title="Reject"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium px-2">Decision Final</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyDashboard;
