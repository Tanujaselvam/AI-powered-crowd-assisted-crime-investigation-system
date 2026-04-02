import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Activity, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard' },
    ...(auth?.role === 'ADMIN' ? [{ to: '/police', label: 'Police HQ' }] : []),
  ];

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full pulse-red" />
          </div>
          <span className="font-bold text-lg tracking-wider">
            <span className="text-blue-400">CRIME</span>
            <span className="text-white">INTEL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === to
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-medium">
            <Activity className="w-3 h-3" />
            <span>AI ACTIVE</span>
          </div>

          {auth && (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 bg-gray-800 border border-gray-600 hover:border-blue-500/50
                           px-3 py-1.5 rounded-xl text-sm transition-all"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  auth.role === 'ADMIN' ? 'bg-purple-600/30 text-purple-300' : 'bg-blue-600/30 text-blue-300'
                }`}>
                  {auth.name?.[0]?.toUpperCase() ?? <User className="w-3 h-3" />}
                </div>
                <span className="text-white font-medium">{auth.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                  auth.role === 'ADMIN' ? 'bg-purple-600/20 text-purple-300' : 'bg-blue-600/20 text-blue-300'
                }`}>
                  {auth.role}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-gray-800 border border-gray-600 rounded-xl py-1 shadow-2xl">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-700 px-4 py-3 flex flex-col gap-2 bg-gray-900">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === to ? 'bg-blue-600/20 text-blue-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
          {auth && (
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
