/**
 * Recommendations – Full rich recommendation cards.
 * Displays all required fields: amenities, grounding evidence, pros/cons, confidence score.
 */
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, MapPin, ShieldCheck, ShieldAlert, ShieldX,
         Train, ShoppingCart, Building2, Pill, GraduationCap, CheckCircle2,
         XCircle, Star, ChevronDown, ChevronUp, Database, Map, Info } from 'lucide-react';
import { useState } from 'react';
import type { Recommendation } from '../data/types.ts';

interface RecommendationsProps {
  items: Recommendation[];
  osmSource: 'live' | 'fallback';
  aiPowered: boolean;
  totalCandidates: number;
}

const RANK_CONFIG = [
  { label: '🥇 Top Pick', badge: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/30', glow: 'shadow-amber-500/10' },
  { label: '🥈 Runner Up', badge: 'from-zinc-500/20 to-zinc-600/10', border: 'border-zinc-500/30', glow: '' },
  { label: '🥉 Third Pick', badge: 'from-orange-600/20 to-amber-700/10', border: 'border-orange-600/30', glow: '' },
];

const CRIME_CONFIG = {
  Low:    { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  Medium: { icon: ShieldAlert,  color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20'  },
  High:   { icon: ShieldX,     color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20'        },
};

const AMENITY_CONFIG = [
  { key: 'hasTransit' as const,  label: 'Transit',  Icon: Train          },
  { key: 'hasGrocery' as const,  label: 'Grocery',  Icon: ShoppingCart   },
  { key: 'hasHospital' as const, label: 'Hospital', Icon: Building2      },
  { key: 'hasPharmacy' as const, label: 'Pharmacy', Icon: Pill           },
  { key: 'hasSchool' as const,   label: 'School',   Icon: GraduationCap  },
];

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 80 ? 'from-emerald-500 to-teal-400' 
               : score >= 60 ? 'from-yellow-500 to-amber-400' 
               : 'from-red-500 to-orange-400';
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">AI Confidence</span>
        <span className="text-xs font-bold text-white font-mono">{score}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function AmenityBadge({ available, label, Icon }: { key?: any; available: boolean; label: string; Icon: any }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${
      available
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
    }`}>
      <Icon className="w-3 h-3" />
      <span>{label}</span>
      {available
        ? <CheckCircle2 className="w-3 h-3 ml-auto" />
        : <XCircle className="w-3 h-3 ml-auto opacity-50" />}
    </div>
  );
}

function RecommendationCard({ item, idx }: { key?: any; item: Recommendation; idx: number }) {
  const [expanded, setExpanded] = useState(idx === 0);
  const rank = RANK_CONFIG[idx] || RANK_CONFIG[2];
  const crime = CRIME_CONFIG[item.crimeRate as keyof typeof CRIME_CONFIG] || CRIME_CONFIG.Medium;
  const CrimeIcon = crime.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.12, duration: 0.4 }}
      className={`rounded-2xl border overflow-hidden ${rank.border} ${idx === 0 ? 'shadow-xl ' + rank.glow : ''}`}
    >
      {/* Header gradient */}
      <div className={`bg-gradient-to-br ${rank.badge} p-5 border-b ${rank.border}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{rank.label}</div>
            <h3 id={`rec-${idx}-name`} className="text-lg font-bold text-white truncate">{item.name}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{item.whySelected}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-black text-white font-mono">${item.avgRent?.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">/ month</div>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-black/30 rounded-xl p-2.5 text-center border border-white/5">
            <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Livability</div>
            <div className="text-sm font-black text-white mt-0.5">{item.livabilityScore}<span className="text-[10px] text-zinc-500">/100</span></div>
          </div>
          <div className="bg-black/30 rounded-xl p-2.5 text-center border border-white/5">
            <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Transit</div>
            <div className="text-sm font-black text-white mt-0.5">{item.transitScore}<span className="text-[10px] text-zinc-500">/100</span></div>
          </div>
          <div className="bg-black/30 rounded-xl p-2.5 text-center border border-white/5">
            <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Walk</div>
            <div className="text-sm font-black text-white mt-0.5">{item.walkScore}<span className="text-[10px] text-zinc-500">/100</span></div>
          </div>
        </div>

        {/* Crime + Confidence */}
        <div className="flex items-center gap-3 mt-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${crime.bg}`}>
            <CrimeIcon className={`w-3.5 h-3.5 ${crime.color}`} />
            <span className={crime.color}>{item.crimeRate} Crime</span>
          </div>
          <div className="flex-1">
            <ConfidenceBar score={item.confidenceScore} />
          </div>
        </div>
      </div>

      {/* Amenities grid */}
      <div className="px-5 py-4 bg-black/20 border-b border-white/5">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold mb-2">Nearby Amenities</div>
        <div className="grid grid-cols-5 gap-1.5">
          {AMENITY_CONFIG.map(({ key, label, Icon }) => (
            <AmenityBadge key={key} available={!!item[key]} label={label} Icon={Icon} />
          ))}
        </div>
      </div>

      {/* Expandable details */}
      <div className="bg-zinc-950/50">
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between px-5 py-3 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
          id={`rec-${idx}-expand`}
        >
          <span className="font-semibold uppercase tracking-wider">Full Analysis</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4">
                {/* AI Reasoning */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">AI Reasoning</span>
                  </div>
                  <p className="text-[12px] text-zinc-300 leading-relaxed">{item.reasoning}</p>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold mb-2">Pros</div>
                    <ul className="space-y-1.5">
                      {(item.pros || []).map((pro, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] text-red-500 uppercase tracking-wider font-semibold mb-2">Cons</div>
                    <ul className="space-y-1.5">
                      {(item.cons || []).map((con, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                          <XCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Grounding Evidence */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Grounding Evidence</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 shrink-0 mt-0.5">
                        <Database className="w-2.5 h-2.5 text-blue-400" />
                        <span className="text-[9px] text-blue-400 font-bold uppercase">Dataset</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{item.housingEvidence}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 shrink-0 mt-0.5">
                        <Map className="w-2.5 h-2.5 text-green-400" />
                        <span className="text-[9px] text-green-400 font-bold uppercase">OSM</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{item.osmEvidence}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Recommendations({ items, osmSource, aiPowered, totalCandidates }: RecommendationsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Source badge */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${aiPowered ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-yellow-500'} animate-pulse`} />
          <span className="text-[10px] text-zinc-500">{aiPowered ? 'Gemini 2.0 Flash' : 'Smart Analysis Engine'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
            osmSource === 'live'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-zinc-700/50 border-zinc-600 text-zinc-500'
          }`}>
            {osmSource === 'live' ? '● OSM Live' : '◎ OSM Fallback'}
          </div>
        </div>
      </div>

      {/* Cards */}
      {items.map((item, idx) => (
        <RecommendationCard key={item.name + idx} item={item} idx={idx} />
      ))}

      {/* Summary footer */}
      <div className="p-4 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 border border-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Analysis Summary</div>
            <div className="text-[11px] text-zinc-300">
              Analyzed {totalCandidates} qualifying neighborhoods · Recommended top 3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
