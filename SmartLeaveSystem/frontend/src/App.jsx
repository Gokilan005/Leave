import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Redirect to their default dashboard or home
    }

    return children;
};

function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    user ? (
                        user.role === 'student' ? <Navigate to="/student-dashboard" /> : <Navigate to="/faculty-dashboard" />
                    ) : (
                        <Home />
                    )
                } />
                <Route path="/student-login" element={user ? <Navigate to="/" /> : <Login type="student" />} />
                <Route path="/staff-login" element={user ? <Navigate to="/" /> : <Login type="staff" />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

                {/* Legacy login route redirect */}
                <Route path="/login" element={<Navigate to="/" />} />

                <Route
                    path="/student-dashboard"
                    element={
                        <PrivateRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/faculty-dashboard"
                    element={
                        <PrivateRoute allowedRoles={['hod', 'advisor', 'admin']}>
                            <FacultyDashboard />
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
            </Routes>
        </Router>
    );
}

export default App;
