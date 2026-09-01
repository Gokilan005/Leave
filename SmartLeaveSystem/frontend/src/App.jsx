import React from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Bell, Sparkles } from 'lucide-react';

function App() {
  const studentUrl = import.meta.env.VITE_STUDENT_URL || 'http://localhost:3002';
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3001';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-600/20 blur-[130px] pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 max-w-6xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Smart Leave System</h1>
            <p className="text-xs text-slate-400">Automated Notification Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 w-full text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Instant Email & Multi-Channel Notifications
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          Select Your Portal
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-12 text-base">
          Submit and track student leave requests in real-time or manage departmental approvals and faculty reviews.
        </p>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 text-left">
          {/* Student Portal Card */}
          <a
            href={studentUrl}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Student Portal</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Apply for medical or academic leaves, check approval status, and receive real-time email notifications.
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Open Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>

          {/* Admin / Faculty Portal Card */}
          <a
            href={adminUrl}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Faculty & Admin Portal</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                HOD, Advisor, and Admin dashboard for reviewing requests, student histories, and managing departments.
              </p>
            </div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Open Faculty Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 max-w-6xl mx-auto w-full text-center text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} Smart Leave System. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
