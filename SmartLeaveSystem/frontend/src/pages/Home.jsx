import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 font-sans">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Smart Leave System
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Select your portal to continue
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Student Portal */}
                    <Link to="/student-login" className="group">
                        <div className="bg-slate-800 border border-slate-700 p-10 rounded-3xl flex flex-col items-center justify-center text-center transition-all group-hover:bg-slate-750 group-hover:border-blue-500/50 group-hover:-translate-y-2 shadow-xl">
                            <div className="w-20 h-20 rounded-2xl bg-blue-600 mb-6 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Student Portal</h2>
                            <p className="text-slate-400">Apply for leaves and track your requests</p>
                        </div>
                    </Link>

                    {/* Staff Portal */}
                    <Link to="/staff-login" className="group">
                        <div className="bg-slate-800 border border-slate-700 p-10 rounded-3xl flex flex-col items-center justify-center text-center transition-all group-hover:bg-slate-750 group-hover:border-indigo-500/50 group-hover:-translate-y-2 shadow-xl">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-600 mb-6 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Staff Portal</h2>
                            <p className="text-slate-400">Review and authorize departmental leaves</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
