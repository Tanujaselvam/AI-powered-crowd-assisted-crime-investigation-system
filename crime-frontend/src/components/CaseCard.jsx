import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

// Indian-context fallback images (urban streets, traffic, CCTV scenes)
const INDIAN_IMAGES = [
  'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80', // Indian street
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', // India city
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80', // Indian traffic
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', // Delhi street
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80', // Indian urban
  'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80', // India night
];

const FALLBACK_IMG = INDIAN_IMAGES[0];

// Extract location from title (e.g. "ATM Robbery at MG Road, Bangalore" → "Bangalore")
function extractLocation(title = '') {
  const parts = title.split(/[,—–-]/);
  const last = parts[parts.length - 1]?.trim();
  return last && last.length < 30 ? last : 'India';
}

export default function CaseCard({ caseData }) {
  const navigate = useNavigate();
  const { id, title, description, evidenceUrl } = caseData;

  // Pick a consistent fallback based on case id
  const fallback = INDIAN_IMAGES[(id - 1) % INDIAN_IMAGES.length];
  const location = extractLocation(title);

  return (
    <div
      className="case-card bg-slate-800 rounded-2xl overflow-hidden cursor-pointer
                 border border-slate-700 shadow-xl
                 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-orange-500/10 hover:border-orange-500/30
                 transition-all duration-300 animate-slide-up group"
      onClick={() => navigate(`/case/${id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={evidenceUrl || fallback}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = fallback; }}
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent" />

        {/* UNSOLVED badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          <span className="w-1.5 h-1.5 bg-white rounded-full pulse-red" />
          UNSOLVED
        </div>

        {/* Case ID */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-gray-300 text-xs font-mono px-2 py-0.5 rounded-md">
          #{String(id).padStart(3, '0')}
        </div>

        {/* Location pill on image bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-base leading-tight line-clamp-1 mb-2">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
          {description || 'No description available for this case.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Active Investigation</span>
          </div>

          <button
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500
                       text-white text-xs font-semibold px-4 py-2 rounded-lg
                       transition-all duration-200 group/btn shadow-md"
            onClick={(e) => { e.stopPropagation(); navigate(`/case/${id}`); }}
          >
            View Details
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
