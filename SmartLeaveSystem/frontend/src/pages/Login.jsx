import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = ({ type = 'student' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('password123'); // Default for testing
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const allowedRoles = type === 'student' ? ['student'] : ['advisor', 'hod', 'admin'];
        const result = await login(email, password, allowedRoles);
        if (!result.success) {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 font-sans">
            <div className="w-full max-w-md relative">
                {/* Back Button */}
                <Link 
                    to="/" 
                    className="absolute -top-12 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" /> 
                    Back
                </Link>

                <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${type === 'student' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white uppercase italic tracking-tight">
                            {type === 'staff' ? 'Staff Login' : 'Student Login'}
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm uppercase font-bold tracking-widest">
                            Secure Portal Access
                        </p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest transition-all ${type === 'student' ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'} disabled:opacity-50`}
                        >
                            {isLoading ? 'Verifying...' : 'Login'}
                        </button>
                    </form>

                    {type === 'student' && (
                        <div className="mt-8 text-center pt-6 border-t border-slate-700">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-blue-500 font-bold hover:underline">
                                    Register Now
                                </Link>
                            </p>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Login;
