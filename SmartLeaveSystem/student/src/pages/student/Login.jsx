import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogIn, Mail, Lock, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden font-sans">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px] animate-blob mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[130px] animate-blob animation-delay-4000 mix-blend-screen"></div>
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[1px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10 perspective-1000">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)] transition-shadow duration-500 overflow-hidden relative">

                    {/* Glass shine effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                            <GraduationCap className="w-10 h-10 text-white transform -rotate-3" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200 tracking-tight mb-2">Student Login</h2>
                        <p className="text-blue-200/70 font-medium tracking-wide text-sm uppercase">Smart Leave Portal</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-200 px-4 py-3 rounded-xl mb-6 text-sm text-center flex items-center justify-center gap-2 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-blue-400 transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-xl text-blue-50 placeholder-blue-200/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-slate-900/60 transition-all duration-300 shadow-inner"
                                placeholder="Student Email"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-blue-400 transition-colors">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-xl text-blue-50 placeholder-blue-200/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:bg-slate-900/60 transition-all duration-300 shadow-inner"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-[1px] group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                <div className="relative flex items-center justify-center w-full h-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                                    <span className="font-bold text-white tracking-wide text-[15px]">
                                        {isLoading ? 'Authenticating...' : 'Sign In'}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center relative z-10 flex flex-col gap-3">
                        <p className="text-sm text-blue-200/60 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline underline-offset-4">
                                Sign up now
                            </Link>
                        </p>
                        <Link to="/" className="text-sm text-blue-400/60 hover:text-blue-300 transition-colors duration-200">
                            Back to portal selection
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
