import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, Star, Send, Brain, Users, AlertTriangle,
  Loader2, CheckCircle, AlertCircle, Zap, TrendingUp, ShieldAlert, MessageSquare, MapPin
} from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=80';

const INDIAN_IMAGES = [
  'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1200&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
];

function extractLocation(title = '') {
  const parts = title.split(/[,—–-]/);
  const last = parts[parts.length - 1]?.trim();
  return last && last.length < 30 ? last : 'India';
}

function InsightBadge({ score }) {
  if (score >= 80) return <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">High Insight</span>;
  if (score >= 50) return <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-full font-semibold">Medium Insight</span>;
  return <span className="text-xs bg-gray-600/40 text-gray-400 border border-gray-600 px-2.5 py-0.5 rounded-full font-semibold">Low Insight</span>;
}

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [caseData, setCaseData]     = useState(null);
  const [aiClues, setAiClues]       = useState([]);
  const [allClues, setAllClues]     = useState([]);
  const [text, setText]             = useState('');
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg]   = useState(null);
  const [caseError, setCaseError]   = useState(null);

  const fetchClues = useCallback(() => {
    API.get(`/clues/unique/${id}`)
      .then(res => {
        console.log('[CaseDetails] clues fetched:', res.data);
        setAllClues(res.data);
        setAiClues(res.data);
      })
      .catch(() => { setAllClues([]); setAiClues([]); });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    setCaseError(null);
    API.get(`/cases/${id}`)
      .then(res => setCaseData(res.data))
      .catch(() => setCaseError('Case not found or backend is offline.'))
      .finally(() => setLoading(false));
    fetchClues();
  }, [id, fetchClues]);

  const submitClue = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      await API.post('/clues', { caseId: Number(id), userId: auth?.id ?? 1, clueText: text.trim() });
      setText('');
      setSubmitMsg({ type: 'success', text: 'Clue submitted! Thank you for your contribution.' });
      fetchClues();
      setTimeout(() => setSubmitMsg(null), 4000);
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message || '';
      if (err.response?.status === 409 || serverMsg.toLowerCase().includes('duplicate')) {
        setSubmitMsg({ type: 'duplicate', text: 'This clue is too similar to an existing one. Please provide new information.' });
      } else {
        setSubmitMsg({ type: 'error', text: 'Failed to submit clue. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackImg = INDIAN_IMAGES[(Number(id) - 1) % INDIAN_IMAGES.length];
  const location = extractLocation(caseData?.title);

  if (loading) {
    return (
      <div className="min-h-screen grid-bg">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-sm font-mono">Loading case data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (caseError || !caseData) {
    return (
      <div className="min-h-screen grid-bg">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-3 bg-gray-800 rounded-2xl p-10 shadow-xl border border-gray-700">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <p className="text-white font-semibold">{caseError || 'Case not found'}</p>
            <p className="text-gray-400 text-sm">Make sure your Spring Boot backend is running on port 8081</p>
            <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300 text-sm font-medium underline">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-72 sm:h-96 shadow-2xl">
          <img
            src={caseData.evidenceUrl || fallbackImg}
            alt={caseData.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = fallbackImg; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full pulse-red" /> UNSOLVED
              </span>
              <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-orange-400 text-xs font-medium px-3 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> {location}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
              {caseData.title}
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Case Overview */}
            <section className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Case Overview
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {caseData.description || 'No description available.'}
              </p>
            </section>

            {/* AI Highlighted Clues */}
            <section className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-1">
                <Brain className="w-5 h-5 text-purple-400" /> AI Highlighted Clues
              </h2>
              <p className="text-gray-500 text-xs mb-5">Unique patterns identified by the AI engine</p>

              {aiClues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No AI clues identified yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiClues.map((clue, i) => (
                    <div key={clue.id || i}
                      className="flex items-start gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-200">
                      <Star className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0 fill-yellow-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-200 text-sm leading-relaxed">{clue.clueText}</p>
                      </div>
                      <InsightBadge score={clue.relevanceScore ?? 75} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Public Contributions */}
            <section className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-1">
                <MessageSquare className="w-5 h-5 text-blue-400" /> Public Contributions
              </h2>
              <p className="text-gray-500 text-xs mb-5">
                {allClues.length} clue{allClues.length !== 1 ? 's' : ''} submitted by the community
              </p>

              {allClues.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <MessageSquare className="w-7 h-7 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No clues yet — be the first to contribute!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {allClues.map((clue, i) => (
                    <div key={clue.id || i}
                      className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 hover:border-blue-500/40 transition-all">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-400 text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed flex-1">{clue.clueText}</p>
                      {clue.isUnique && (
                        <span className="text-xs bg-emerald-500/20 text-green-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shrink-0 font-semibold">
                          Unique
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Submit Clue */}
            <section className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-1">
                <Users className="w-5 h-5 text-blue-400" /> Submit a Clue
              </h2>
              <p className="text-gray-500 text-xs mb-5">Your contribution may help solve this case</p>

              {auth?.role === 'ADMIN' ? (
                <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-xl px-4 py-3">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Admins manage cases from Police HQ. Clue submission is for citizens.
                </div>
              ) : (
                <>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitClue()}
                      placeholder="Describe what you know about this case..."
                      className="flex-1 bg-gray-900 border border-gray-600 text-white placeholder-gray-500
                                 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500
                                 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                    <button
                      onClick={submitClue}
                      disabled={submitting || !text.trim()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shrink-0 shadow-md"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span className="hidden sm:inline">Submit</span>
                    </button>
                  </div>

                  {submitMsg?.type === 'success' && (
                    <div className="flex items-center gap-2 mt-3 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" /> {submitMsg.text}
                    </div>
                  )}
                  {submitMsg?.type === 'duplicate' && (
                    <div className="flex items-center gap-2 mt-3 text-yellow-400 text-sm">
                      <AlertCircle className="w-4 h-4" /> {submitMsg.text}
                    </div>
                  )}
                  {submitMsg?.type === 'error' && (
                    <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" /> {submitMsg.text}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-700">
              <h3 className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">Case Intelligence</h3>
              <div className="space-y-4">
                {[
                  { icon: <Zap className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-500/10 border-blue-500/20', label: 'AI Clues Found', value: aiClues.length, cls: 'text-white text-lg font-bold' },
                  { icon: <MessageSquare className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-500/10 border-blue-500/20', label: 'Public Clues', value: allClues.length, cls: 'text-white text-lg font-bold' },
                  { icon: <TrendingUp className="w-4 h-4 text-purple-400" />, bg: 'bg-purple-500/10 border-purple-500/20', label: 'Case Status', value: 'Under Investigation', cls: 'text-red-400 text-sm font-bold' },
                ].map(({ icon, bg, label, value, cls }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`p-2 ${bg} rounded-lg border`}>{icon}</div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className={cls}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-700">
              <h3 className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-3">AI Analysis</h3>
              <div className="space-y-3">
                {[['Pattern Recognition', 72], ['Clue Correlation', 58], ['Threat Assessment', 85]].map(([item, pct]) => (
                  <div key={item} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{item}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-gray-400 w-6 text-right">{pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
