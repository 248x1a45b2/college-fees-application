import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuthScreen: React.FC = () => {
  const { login, registerStudent, students } = useCollegeFees();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [identifier, setIdentifier] = useState('24CS089');
  const [password, setPassword] = useState('password123');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regYear, setRegYear] = useState(3);
  const [regSection, setRegSection] = useState('A');
  const [regParentName, setRegParentName] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regHostel, setRegHostel] = useState(true);
  const [regBus, setRegBus] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your Roll Number, Email, or Admin ID');
      return;
    }

    const success = login(selectedRole, identifier);
    if (!success) {
      setError('Invalid credentials. Please verify your details.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regRoll.trim() || !regEmail.trim() || !regPhone.trim()) {
      setError('Please fill in all required academic and contact fields.');
      return;
    }

    try {
      registerStudent({
        name: regName,
        rollNumber: regRoll.toUpperCase(),
        email: regEmail,
        phone: regPhone,
        branch: regBranch,
        year: Number(regYear),
        section: regSection,
        parentName: regParentName || `${regName}'s Guardian`,
        parentPhone: regParentPhone || regPhone,
        hostelResident: regHostel,
        busUser: regBus,
        address: 'Knowledge City, Hyderabad'
      });

      setSuccessMsg('Registration successful! Launching your student fee dashboard...');
      setTimeout(() => {
        login('student', regRoll);
      }, 800);
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  const setDemoCredentials = (role: UserRole, id: string) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword('demoPass2026');
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-start p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* College Logo Header */}
      <div className="text-center pt-2 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          College Fees Manager
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Apex Institute of Technology & Sciences
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm max-w-md mx-auto w-full">
        {/* Sign In vs Register Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setSelectedRole('student');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: LOGIN */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Radio Pill */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Select Portal Access:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('student');
                    setIdentifier('24CS089');
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    selectedRole === 'student'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setIdentifier('admin@college.edu');
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    selectedRole === 'admin'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin / Accounts</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {selectedRole === 'student' ? 'Student Roll Number or Email' : 'Admin Official Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'e.g. 24CS089' : 'admin@college.edu'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Sign In to {selectedRole === 'student' ? 'Student Portal' : 'Admin Console'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Demo Selector */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                Quick Test Accounts:
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('student', '24CS089')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Rahul Indla (24CS089)
                    </span>
                    <span className="text-[10px] text-slate-500">CSE 3rd Year · Pending Fees</span>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Select</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin', 'admin@apex')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      College Accounts Officer
                    </span>
                    <span className="text-[10px] text-slate-500">Full administrative access</span>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Select</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Tab 2: REGISTRATION */
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Srikant Reddy"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={regRoll}
                  onChange={(e) => setRegRoll(e.target.value)}
                  placeholder="e.g. 26CS112"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Section *
                </label>
                <select
                  value={regSection}
                  onChange={(e) => setRegSection(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Branch *
                </label>
                <select
                  value={regBranch}
                  onChange={(e) => setRegBranch(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                  <option value="Information Technology">IT</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year *
                </label>
                <select
                  value={regYear}
                  onChange={(e) => setRegYear(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value={1}>1st Year (B.Tech)</option>
                  <option value={2}>2nd Year (B.Tech)</option>
                  <option value={3}>3rd Year (B.Tech)</option>
                  <option value={4}>4th Year (B.Tech)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Hostel / Bus Amenities */}
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                College Services Enrollment:
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regHostel}
                  onChange={(e) => setRegHostel(e.target.checked)}
                  className="rounded-xs text-blue-600 focus:ring-blue-500"
                />
                <span>Campus Hostel & Mess Facility (₹42,000/yr)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regBus}
                  onChange={(e) => setRegBus(e.target.checked)}
                  className="rounded-xs text-blue-600 focus:ring-blue-500"
                />
                <span>College Bus Transport Facility (₹18,000/yr)</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Complete Registration & Setup Fees</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
