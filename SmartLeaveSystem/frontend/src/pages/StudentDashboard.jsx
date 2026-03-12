import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    Send,
    User as UserIcon,
    LogOut,
    Plus,
    X,
    Bell
} from 'lucide-react';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [formData, setFormData] = useState({ date: '', endDate: '', reason: '' });
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        fetchLeaves();

        const socket = io(`${API_BASE_URL}`);
        socket.on('leaveStatusUpdated', (updatedLeave) => {
            if (updatedLeave.student._id === user._id || updatedLeave.student === user._id) {
                setLeaves(prev => prev.map(l => l._id === updatedLeave._id ? updatedLeave : l));
            }
        });

        return () => socket.disconnect();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = Cookies.get('token');
            const { data } = await axios.get(`${API_BASE_URL}/api/leaves`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            await axios.post(`${API_BASE_URL}/api/leaves`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowApplyModal(false);
            setFormData({ date: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            console.error('Error applying leave:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-rose-500" />;
            default: return <Clock className="w-5 h-5 text-amber-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
            rejected: "bg-rose-100 text-rose-700 border-rose-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200"
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} flex items-center gap-1 w-max`}>
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const totalLeaves = Array.isArray(leaves) ? leaves.length : 0;
    const approvedLeaves = Array.isArray(leaves) ? leaves.filter(l => l.status === 'approved').length : 0;
    const rejectedLeaves = Array.isArray(leaves) ? leaves.filter(l => l.status === 'rejected').length : 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-800">Student Portal</h1>
                </div>
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 focus:outline-none bg-slate-50 hover:bg-slate-100 px-2 py-1.5 rounded-full border border-slate-200 transition-colors"
                    >
                        <div className="text-right hidden sm:block pl-2">
                            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                            <p className="text-xs text-slate-500 uppercase">{user?.department}</p>
                        </div>
                            <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-blue-400 overflow-hidden ${!user?.profileImage ? 'bg-blue-500' : 'bg-white'}`}>
                                {user?.profileImage ? (
                                    <img src={`${API_BASE_URL}${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all">
                            <div className="p-2 flex flex-col gap-1">
                                <Link
                                    to="/profile"
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors font-medium"
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
            </nav>

            <main className="max-w-5xl mx-auto p-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-2">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Applications</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{totalLeaves}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Approved Requests</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{approvedLeaves}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Rejected Requests</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{rejectedLeaves}</p>
                        </div>
                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-rose-500" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-8 pt-4 border-t border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">My Leave Requests</h2>
                        <p className="text-slate-500 text-sm">Track the status of your applications</p>
                    </div>
                    <button
                        onClick={() => setShowApplyModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Apply Leave
                    </button>
                </div>

                {/* Leave Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leaves.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200 border-dashed">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-700">No leave requests found</h3>
                            <p className="text-slate-500 text-sm mt-1">You haven't applied for any leaves yet.</p>
                        </div>
                    ) : (
                        leaves.map(leave => (
                            <div key={leave._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-1 h-full ${leave.status === 'approved' ? 'bg-emerald-500' :
                                    leave.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                                    }`} />

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Leave Period</p>
                                        <p className="text-base font-bold text-slate-800">
                                            {(!leave.endDate || leave.date === leave.endDate)
                                                ? new Date(leave.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : `${new Date(leave.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(leave.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                                        </p>
                                    </div>
                                    {getStatusBadge(leave.status)}
                                </div>

                                {leave.status !== 'pending' && leave.approvedBy && (
                                    <div className="mb-3">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                                            {leave.status === 'approved' ? 'Approved By' : 'Rejected By'}
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            {leave.approvedBy.name}
                                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md capitalize font-semibold border border-slate-200">
                                                {leave.approvedBy.role === 'hod' ? 'HOD' : leave.approvedBy.role}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Reason</p>
                                    <p className="text-slate-700 text-sm line-clamp-2">{leave.reason}</p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs text-slate-400">
                                        Applied on: {new Date(leave.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Apply for Leave</h3>
                            <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="Briefly describe why you need leave..."
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowApplyModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
