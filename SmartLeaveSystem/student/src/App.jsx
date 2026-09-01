import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import StudentLogin from './pages/student/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading, logout } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-sans text-slate-600">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20 text-2xl font-bold">
                        !
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-slate-300 text-sm mb-4">
                        You are currently logged in as <span className="font-semibold text-rose-400 uppercase">{user.role}</span> ({user.email}), which does not have permission to access the Student Portal.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => logout()}
                            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-rose-600/20"
                        >
                            Log Out & Sign In as Student
                        </button>
                        <a
                            href="http://localhost:3001"
                            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl transition duration-200 text-center"
                        >
                            Go to Faculty / Admin Portal (Port 3001)
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Generic Login redirects to Student login style */}
                <Route path="/login" element={user ? <Navigate to="/" /> : <StudentLogin />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

                {/* Dashboard as home */}
                <Route path="/" element={
                    user ? (
                        <Navigate to="/student-dashboard" />
                    ) : (
                        <Navigate to="/login" />
                    )
                } />

                <Route
                    path="/student-dashboard"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
