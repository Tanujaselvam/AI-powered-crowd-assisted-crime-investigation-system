import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import {
  FolderOpen, Brain, Send, Loader2, CheckCircle,
  AlertCircle, Star, Users, Zap, Pencil, Trash2, MessageSquare, Eye
} from 'lucide-react';

// ── Cases List Panel ──────────────────────────────────────────────
function CasesPanel({ cases, loading, onRefresh }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const startEdit = (c) => {
    setEditing(c.id);
    setEditForm({ title: c.title, description: c.description, evidenceUrl: c.evidenceUrl, status: c.status });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try { await API.put(`/cases/${id}`, editForm); setEditing(null); onRefresh(); } catch {}
    setSaving(false);
  };

  const deleteCase = async (id) => {
    if (!window.confirm('Delete this case permanently?')) return;
    try { await API.delete(`/cases/${id}`); onRefresh(); } catch {}
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">All Cases</h2>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </div>
      ) : cases.length === 0 ? (
        <p className="text-gray-500 text-sm">No cases found.</p>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-blue-500/40 transition-all shadow-lg">
              {editing === c.id ? (
                <div className="space-y-3">
                  <input
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <input
                    value={editForm.evidenceUrl}
                    onChange={e => setEditForm({ ...editForm, evidenceUrl: e.target.value })}
                    placeholder="Evidence Image URL"
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="bg-gray-900 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="UNSOLVED">UNSOLVED</option>
                    <option value="SOLVED">SOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(c.id)}
                      disabled={saving}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 shrink-0">
                    <FolderOpen className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/case/${c.id}`)}>
                    <p className="text-white font-semibold text-sm truncate hover:text-blue-300 transition-colors">{c.title}</p>
                    <p className="text-gray-400 text-xs truncate">{c.description?.substring(0, 80)}...</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold shrink-0 ${
                    c.status === 'SOLVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    c.status === 'CLOSED' ? 'bg-gray-600/40 text-gray-400 border-gray-600' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>{c.status}</span>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteCase(c.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add Case Form Panel ───────────────────────────────────────────
function AddCasePanel({ onRefresh }) {
  const [form, setForm] = useState({ title: '', description: '', evidenceUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await API.post('/cases', form);
      setForm({ title: '', description: '', evidenceUrl: '' });
      setStatus('success');
      onRefresh();
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Add New Case</h2>
        <p className="text-gray-400 text-sm mt-1">Register a new unsolved case into the system</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-5 shadow-xl">
        {[
          { name: 'title', label: 'Case Title', placeholder: 'e.g. Downtown Robbery — Case #4821', type: 'text' },
          { name: 'evidenceUrl', label: 'Evidence Image URL', placeholder: 'https://...', type: 'url' },
        ].map(({ name, label, placeholder, type }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</label>
            <input
              type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
              className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Case Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Provide a detailed description of the case..." rows={4}
            className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
          />
        </div>

        <button
          type="submit" disabled={submitting || !form.title.trim() || !form.description.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {submitting ? 'Submitting...' : 'Add Case'}
        </button>

        {status === 'success' && <div className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle className="w-4 h-4" /> Case added successfully!</div>}
        {status === 'error'   && <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed to add case. Check backend connection.</div>}
      </form>
    </div>
  );
}

// ── Public Clues Panel ─────────────────────────────────────────
function PublicCluesPanel({ cases }) {
  const navigate = useNavigate();
  const [allClues, setAllClues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCase, setFilterCase] = useState('all');

  const fetchAllClues = () => {
    setLoading(true);
    // Use GET /clues (all clues) — single efficient call
    API.get('/clues')
      .then((res) => {
        // Attach caseTitle by matching caseId to cases list
        const withTitles = res.data.map(clue => ({
          ...clue,
          caseTitle: cases.find(c => c.id === clue.caseId)?.title || `Case #${clue.caseId}`,
        }));
        withTitles.sort((a, b) => (b.id || 0) - (a.id || 0));
        setAllClues(withTitles);
        console.log('[PublicClues] Loaded', withTitles.length, 'clues');
      })
      .catch((err) => {
        console.error('[PublicClues] Failed to load clues:', err);
        setAllClues([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllClues();
  }, [cases]);

  const filtered = allClues.filter(clue => {
    const matchSearch = clue.clueText?.toLowerCase().includes(search.toLowerCase());
    const matchCase = filterCase === 'all' || String(clue.caseId) === filterCase;
    return matchSearch && matchCase;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Public Clues</h2>
        <p className="text-gray-400 text-sm mt-1">All clues submitted by citizens across every case</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search clues..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-600 text-white placeholder-gray-500
                     rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
        />
        <select
          value={filterCase}
          onChange={e => setFilterCase(e.target.value)}
          className="bg-gray-900 border border-gray-600 text-gray-200 rounded-xl px-4 py-2.5 text-sm
                     focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="all">All Cases</option>
          {cases.map(c => (
            <option key={c.id} value={String(c.id)}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {filtered.length} clue{filtered.length !== 1 ? 's' : ''} found
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          {filtered.filter(c => c.isUnique).length} unique
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading clues...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center shadow-xl">
          <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No public clues submitted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((clue, i) => (
            <div key={clue.id || i}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-blue-500/40 transition-all shadow-lg">
              <div className="flex items-start gap-3">
                {clue.isUnique
                  ? <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mt-0.5 shrink-0" />
                  : <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 text-sm leading-relaxed">{clue.clueText}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">Case:</span>
                    <button
                      onClick={() => navigate(`/case/${clue.caseId}`)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate max-w-xs"
                    >
                      {clue.caseTitle}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {clue.isUnique && (
                    <span className="text-xs bg-emerald-500/20 text-green-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                      Unique
                    </span>
                  )}
                  {clue.relevanceScore != null && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                      clue.relevanceScore >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : clue.relevanceScore >= 50
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-gray-600/40 text-gray-400 border-gray-600'
                    }`}>
                      {clue.relevanceScore}% relevance
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Insights Panel ─────────────────────────────────────────────
function InsightsPanel({ cases }) {
  const [allClues, setAllClues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cases.length === 0) return;
    setLoading(true);
    Promise.all(cases.map((c) => API.get(`/clues/unique/${c.id}`).catch(() => ({ data: [] }))))
      .then((results) => {
        setAllClues(results.flatMap((r, i) => r.data.map((clue) => ({ ...clue, caseTitle: cases[i]?.title }))));
      })
      .finally(() => setLoading(false));
  }, [cases]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">AI Insights</h2>
        <p className="text-gray-400 text-sm mt-1">AI-filtered unique clues across all cases</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Analyzing clues...</div>
      ) : allClues.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center shadow-xl">
          <Brain className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No AI clues available yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allClues.map((clue, i) => (
            <div key={clue.id || i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3 hover:border-purple-500/40 transition-all shadow-lg">
              <Star className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0 fill-yellow-400" />
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-sm">{clue.clueText}</p>
                {clue.caseTitle && <p className="text-gray-500 text-xs mt-1">Case: {clue.caseTitle}</p>}
              </div>
              <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full shrink-0 font-semibold">AI Verified</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Police Dashboard ─────────────────────────────────────────
export default function PoliceDashboard() {
  const [active, setActive] = useState('#cases');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalClues, setTotalClues] = useState(0);

  const fetchCases = () => {
    API.get('/cases')
      .then((res) => setCases(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCases(); }, []);

  useEffect(() => {
    API.get('/clues')
      .then(res => setTotalClues(res.data.length))
      .catch(() => {});
  }, [cases]);

  const renderPanel = () => {
    if (active === '#cases')    return <CasesPanel cases={cases} loading={loading} onRefresh={fetchCases} />;
    if (active === '#add')      return <AddCasePanel onRefresh={fetchCases} />;
    if (active === '#insights') return <InsightsPanel cases={cases} />;
    if (active === '#clues')    return <PublicCluesPanel cases={cases} />;
    return null;
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />
      <div className="flex">
        <Sidebar active={active} setActive={setActive} />
        <main className="flex-1 p-6 sm:p-8 overflow-auto animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FolderOpen}    label="Total Cases"  value={cases.length}                                   color="red" />
            <StatCard icon={Users}         label="Unsolved"     value={cases.filter(c => c.status === 'UNSOLVED').length} color="blue" />
            <StatCard icon={MessageSquare} label="Public Clues" value={totalClues}                                     color="purple" />
            <StatCard icon={Zap}           label="Solved"       value={cases.filter(c => c.status === 'SOLVED').length} color="emerald" />
          </div>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
