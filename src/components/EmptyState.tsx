/**
 * EmptyState – Illustrated empty state shown before a search is run.
 */
import { motion } from 'motion/react';
import { Compass, MapPin, Building2, TrendingUp } from 'lucide-react';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated icon cluster */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Compass className="w-10 h-10 text-indigo-400" />
        </div>

        {/* Floating mini-icons */}
        {[
          { icon: MapPin,    delay: 0,    angle: -40, dist: 44, color: 'text-violet-400' },
          { icon: Building2, delay: 0.5,  angle: 40,  dist: 44, color: 'text-purple-400' },
          { icon: TrendingUp, delay: 1,   angle: 0,   dist: 50, color: 'text-indigo-300' },
        ].map(({ icon: Icon, delay, angle, dist, color }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
            className={`absolute w-7 h-7 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center ${color}`}
            style={{
              top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * dist}px - 14px)`,
              left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * dist}px - 14px)`,
            }}
          >
            <Icon className="w-3.5 h-3.5" />
          </motion.div>
        ))}
      </div>

      <h3 className="text-base font-bold text-zinc-200 mb-2">Ready to Find Your Neighborhood</h3>
      <p className="text-[12px] text-zinc-500 max-w-[220px] leading-relaxed mb-8">
        Configure your budget and preferences, then click <span className="text-indigo-400 font-semibold">Find My Neighborhood</span> to get AI-powered recommendations grounded in real Chicago data.
      </p>

      {/* Feature pills */}
      <div className="space-y-2 w-full max-w-[240px]">
        {[
          '📊 22 Chicago neighborhoods analyzed',
          '🗺️ Live OpenStreetMap amenity data',
          '🤖 Gemini 2.0 Flash AI reasoning',
          '📍 Evidence-backed recommendations',
        ].map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-zinc-500"
          >
            {text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
