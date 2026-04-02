import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Brain, Shield, ChevronRight, MessageSquare } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Cases',         hash: '#cases' },
  { icon: PlusCircle,      label: 'Add Case',       hash: '#add' },
  { icon: Brain,           label: 'AI Insights',    hash: '#insights' },
  { icon: MessageSquare,   label: 'Public Clues',   hash: '#clues' },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="bg-gray-900 border-r border-gray-700 w-64 min-h-screen flex flex-col p-4 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <Shield className="w-6 h-6 text-blue-400" />
        <div>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Police HQ</p>
          <p className="text-sm font-bold text-white">Control Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, hash }) => {
          const isActive = active === hash;
          return (
            <button
              key={hash}
              onClick={() => setActive(hash)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-2"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
