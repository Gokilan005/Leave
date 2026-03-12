import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ArrowLeft, Mail, Phone, Building, Hash, ShieldCheck, User as UserIcon, Edit2, CheckCircle, XCircle, Camera, Calendar, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Profile = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        department: user?.department || '',
        rollNo: user?.rollNo || '',
        section: user?.section || '',
        year: user?.year || '1'
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
            const token = Cookies.get('token');
            const { data } = await axios.put('http://localhost:5001/api/auth/update', editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(data);
            Cookies.set('user', JSON.stringify(data), { expires: 30 });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Error response status:', error.response?.status);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        setIsUploading(true);
        try {
            const token = Cookies.get('token');
            const { data } = await axios.post('http://localhost:5001/api/auth/upload-profile-picture', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update local user state immediately with new profile info
            // Ensure if we use a relative URL, we prepend the backend URL for the image tags, but currently React does not prepend it
            // So we'll fetch from backend explicitly in next step
            setUser(data.user);
            Cookies.set('user', JSON.stringify(data.user), { expires: 30 });
            alert('Profile picture updated!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const imageUrl = user?.profileImage ? `http://localhost:5001${user.profileImage}` : null;

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
                                            setEditForm({
                                                name: user.name,
                                                phone: user.phone || '',
                                                email: user.email,
                                                department: user.department,
                                                rollNo: user.rollNo || '',
                                                section: user.section || '',
                                                year: user.year || '1'
                                            });
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
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-full border-4 border-white flex items-center justify-center font-bold text-5xl shadow-md overflow-hidden bg-white ${!imageUrl && isStudent ? 'bg-blue-100 text-blue-600' : ''} ${!imageUrl && !isStudent ? 'bg-indigo-100 text-indigo-700' : ''}`}>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>

                            {/* Hover overlay for upload */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Camera className="w-8 h-8 text-white mb-1" />
                                <span className="text-white text-xs font-medium">
                                    {isUploading ? 'Uploading...' : 'Change'}
                                </span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/jpeg, image/jpg, image/png, image/webp"
                                className="hidden"
                            />
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-slate-800">{user?.name}</h2>
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
                                <div className="w-full">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {isStudent ? 'Roll Number' : 'Staff ID'}
                                    </p>
                                    {isEditing && isStudent ? (
                                        <input
                                            type="text"
                                            value={editForm.rollNo}
                                            onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
                                            className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors uppercase"
                                            placeholder="Enter Roll Number"
                                        />
                                    ) : (
                                        <p className="text-slate-800 font-medium uppercase">{isStudent ? (user.rollNo || 'N/A') : user._id?.substring(0, 8).toUpperCase()}</p>
                                    )}
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

                            {/* Year - Student Only */}
                            {isStudent && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}>
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="w-full">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Year of Study</p>
                                        {isEditing ? (
                                            <select
                                                value={editForm.year}
                                                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                                className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                                            >
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                        ) : (
                                            <p className="text-slate-800 font-medium">{user.year ? `${user.year}nd Year` : 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Section - Student Only */}
                            {isStudent && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}>
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div className="w-full">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Section</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.section}
                                                onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                                                className="w-full bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors uppercase"
                                                placeholder="e.g. A"
                                            />
                                        ) : (
                                            <p className="text-slate-800 font-medium uppercase">{user.section || 'N/A'}</p>
                                        )}
                                    </div>
                                </div>
                            )}

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
