import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Shield, User, Lock, Eye, EyeOff, Mail,
  Loader2, AlertCircle, CheckCircle, UserPlus, Zap
} from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.name.trim())     return 'Full name is required.';
    if (!form.username.trim()) return 'Username is required.';
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!form.email.includes('@')) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => {
        login({ ...res.data });
        navigate('/', { replace: true });
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name',     label: 'Full Name',       placeholder: 'e.g. John Doe',         type: 'text',     icon: User },
    { name: 'username', label: 'Username',         placeholder: 'e.g. johndoe',          type: 'text',     icon: User },
    { name: 'email',    label: 'Email Address',    placeholder: 'you@example.com',       type: 'email',    icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-navy-950 grid-bg flex items-center justify-center px-4 py-10">
      {/* Glow blobs */}
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
          <p className="text-slate-500 text-sm mt-1">Create your citizen account</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Info banner */}
          <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-xl px-4 py-3 mb-6">
            <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Citizen accounts can browse cases, view details, and submit clues to help investigations.
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <p className="text-white font-bold text-lg">Account Created!</p>
              <p className="text-slate-400 text-sm">Welcome, {form.name}. Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Text fields */}
              {fields.map(({ name, label, placeholder, type, icon: Icon }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      autoComplete={name}
                      className="w-full bg-navy-900 border border-blue-500/20 text-slate-200 placeholder-slate-600
                                 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50
                                 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className="w-full bg-navy-900 border border-blue-500/20 text-slate-200 placeholder-slate-600
                               rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500/50
                               focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={`w-full bg-navy-900 border text-slate-200 placeholder-slate-600
                               rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all
                               ${form.confirm && form.confirm !== form.password
                                 ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
                                 : 'border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/30'}`}
                  />
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl px-4 py-3">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600
                           hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed
                           text-white font-semibold py-3 rounded-xl transition-all duration-200 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Login link */}
          {!success && (
            <p className="text-center text-slate-500 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
