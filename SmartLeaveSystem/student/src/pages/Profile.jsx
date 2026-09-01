import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ArrowLeft, Mail, Phone, Building, Hash, ShieldCheck, User as UserIcon, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        department: user?.department || ''
    });

    const handleBack = () => {
        if (user?.role === 'student') {
            navigate('/student-dashboard');
        } else {
            navigate('/faculty-dashboard');
        }
    };

    if (!user) return null;

    const isStudent = user.role === 'student';

    const handleSave = async () => {
        try {
            const token = Cookies.get('student_token') || localStorage.getItem('student_token') || Cookies.get('token');
            const { data } = await axios.put('http://localhost:5001/api/auth/update', editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(data);
            Cookies.set('student_user', JSON.stringify(data), { expires: 30 });
            localStorage.setItem('student_user', JSON.stringify(data));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar */}
            <nav className={`text-white px-6 py-4 flex justify-between items-center shadow-md z-20 ${isStudent ? 'bg-blue-600' : 'bg-indigo-900'}`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">My Profile</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={logout}
                        className={`p-2 ml-2 rounded-lg transition-colors group ${isStudent ? 'bg-blue-700 hover:bg-rose-600 text-blue-100 font-medium' : 'bg-indigo-800 hover:bg-rose-600 text-indigo-200'}`}
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-white" />
                    </button>
                </div>
            </nav>

            <main className="flex-1 max-w-3xl w-full mx-auto p-6 mt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header Banner */}
                    <div className={`h-32 relative ${isStudent ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'}`}>
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 rounded-lg transition-colors group bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-sm"
                                    title="Edit Profile"
                                >
                                    <Edit2 className="w-5 h-5 text-white" />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm({ name: user.name, phone: user.phone || '', email: user.email, department: user.department });
                                        }}
                                        className="p-2 rounded-lg transition-colors group bg-white/20 hover:bg-rose-500/90 backdrop-blur-sm shadow-sm"
                                        title="Cancel"
                                    >
                                        <XCircle className="w-5 h-5 text-white" />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="p-2 rounded-lg transition-colors group bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                                        title="Save Changes"
                                    >
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="px-8 pb-8 flex flex-col items-center relative -mt-16">
                        {/* Profile Avatar */}
                        <div className={`w-32 h-32 rounded-full border-4 border-white flex items-center justify-center font-bold text-5xl shadow-md ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-700'}`}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-slate-800">{user.name}</h2>
                        <span className={`px-3 py-1 mt-2 text-sm font-semibold uppercase tracking-wider rounded-full ${isStudent ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {user.role === 'hod' ? 'HOD' : user.role}
                        </span>

                        {/* Details Grid */}
                        <div className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Name */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                                <div className={`p-3 rounded-lg ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-slate-800 font-medium">{user.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* ID */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className={`p-3 rounded-lg ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <Hash className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {isStudent ? 'Roll Number' : 'Staff ID'}
                                    </p>
                                    <p className="text-slate-800 font-medium">{user._id?.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Department */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className={`p-3 rounded-lg ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <Building className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.department}
                                            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                            className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors uppercase"
                                        />
                                    ) : (
                                        <p className="text-slate-800 font-medium uppercase">{user.department}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                                <div className={`p-3 rounded-lg ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email ID</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-slate-800 font-medium truncate">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                                <div className={`p-3 rounded-lg ${isStudent ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <p className="text-slate-800 font-medium">{user.phone || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
