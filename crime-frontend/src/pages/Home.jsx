import { useEffect, useState } from 'react';
import API from '../services/api';
import CaseCard from '../components/CaseCard';
import Navbar from '../components/Navbar';
import { Search, SlidersHorizontal, AlertCircle, Zap } from 'lucide-react';

function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-xl animate-pulse">
      <div className="h-48 bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700/60 rounded w-full" />
        <div className="h-3 bg-gray-700/60 rounded w-2/3" />
        <div className="h-8 bg-gray-700 rounded-lg mt-4" />
      </div>
    </div>
  );
}

export default function Home() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/cases')
      .then((res) => setCases(res.data))
      .catch(() => setError('Failed to load cases. Ensure the backend is running on port 8081.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center gap-2 text-orange-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Zap className="w-3 h-3" />
            <span>India AI-Powered Investigation System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
            Unsolved{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Crime Cases
            </span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl">
            Browse active investigations across India. Submit clues. Help AI identify patterns and solve cases.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search cases by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-500
                         rounded-xl pl-10 pr-4 py-2.5 text-sm
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-400">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{filtered.length} case{filtered.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Cases Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CaseCard key={c.id} caseData={c} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-300 text-lg font-medium">No cases found</p>
            <p className="text-gray-500 text-sm mt-1">
              {search ? 'Try a different search term' : 'No cases have been added yet'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
