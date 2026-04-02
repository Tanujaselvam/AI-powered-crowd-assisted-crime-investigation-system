import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Shield, User, Lock, Eye, EyeOff, Loader2, AlertCircle, Zap } from 'lucide-react';

// Mock credentials for offline/demo mode
const MOCK_USERS = {
  user: { username: 'user', password: 'user123', role: 'USER', name: 'John Doe' },
  admin: { username: 'admin', password: 'admin123', role: 'ADMIN', name: 'Officer Smith' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('USER'); // 'USER' | 'ADMIN'
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Try real backend first
      const res = await API.post('/auth/login', { ...form, role: tab });
      login({ ...res.data, role: tab });
      navigate(tab === 'ADMIN' ? '/police' : '/', { replace: true });
    } catch {
      // Backend offline — validate against mock credentials
      const mockKey = tab === 'ADMIN' ? 'admin' : 'user';
      const mock = MOCK_USERS[mockKey];
      if (form.username === mock.username && form.password === mock.password) {
        login({ id: mockKey === 'admin' ? 0 : 1, name: mock.name, role: mock.role, username: mock.username });
        navigate(tab === 'ADMIN' ? '/police' : '/', { replace: true });
      } else {
        setError('Invalid credentials. Try: ' + mock.username + ' / ' + mock.password);
      }
    } finally {
      setLoading(false);
    }
  };

  const hints = {
    USER: { username: 'user', password: 'user123' },
    ADMIN: { username: 'admin', password: 'admin123' },
  };

  return (
    <div className="min-h-screen bg-navy-950 grid-bg flex items-center justify-center px-4">
      {/* Background glow blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-4 relative">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full pulse-red" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            <span className="text-blue-400">CRIME</span>INTEL
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-Powered Investigation System</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Role Tabs */}
          <div className="flex bg-navy-900 rounded-xl p-1 mb-7 border border-blue-500/10">
            {[
              { role: 'USER', label: 'Citizen Login', icon: User },
              { role: 'ADMIN', label: 'Admin Login', icon: Shield },
            ].map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                onClick={() => { setTab(role); setForm({ username: '', password: '' }); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === role
                    ? role === 'ADMIN'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Role description */}
          <div className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-6 text-xs border ${
            tab === 'ADMIN'
              ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
          }`}>
            <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {tab === 'ADMIN'
              ? 'Admin access: Add/edit/delete cases, view AI insights, manage all contributions.'
              : 'Citizen access: Browse cases, view details, and submit clues to help investigations.'}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder={hints[tab].username}
                  autoComplete="username"
                  className="w-full bg-navy-900 border border-blue-500/20 text-slate-200 placeholder-slate-600
                             rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50
                             focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-navy-900 border border-blue-500/20 text-slate-200 placeholder-slate-600
                             rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500/50
                             focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl px-4 py-3">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 ${
                tab === 'ADMIN'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Authenticating...' : `Sign in as ${tab === 'ADMIN' ? 'Admin' : 'Citizen'}`}
            </button>
          </form>

          {/* Demo hint */}
          <p className="text-center text-slate-600 text-xs mt-5">
            Demo — use <span className="text-slate-400 font-mono">{hints[tab].username}</span> / <span className="text-slate-400 font-mono">{hints[tab].password}</span>
          </p>

          {/* Register link — only for citizen tab */}
          {tab === 'USER' && (
            <p className="text-center text-slate-500 text-sm mt-3">
              New here?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create a citizen account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
