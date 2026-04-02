export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-4 hover:border-blue-500/40 transition-all duration-200 shadow-lg">
      <div className={`p-3 rounded-lg border ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}
