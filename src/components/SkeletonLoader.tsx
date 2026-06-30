/**
 * SkeletonLoader – Animated skeleton placeholders for the recommendations panel.
 */
export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-white/5 overflow-hidden">
          {/* Header skeleton */}
          <div className="p-5 bg-white/[0.02] border-b border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-5 w-36 rounded" />
                <div className="skeleton h-2.5 w-48 rounded" />
              </div>
              <div className="skeleton h-8 w-20 rounded-lg" />
            </div>
            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
            {/* Confidence bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <div className="skeleton h-2.5 w-20 rounded" />
                <div className="skeleton h-2.5 w-8 rounded" />
              </div>
              <div className="skeleton h-1.5 w-full rounded-full" />
            </div>
          </div>
          {/* Amenities skeleton */}
          <div className="px-5 py-4 bg-black/20 border-b border-white/5">
            <div className="skeleton h-2.5 w-28 rounded mb-3" />
            <div className="grid grid-cols-5 gap-1.5">
              {[0,1,2,3,4].map(j => (
                <div key={j} className="skeleton h-8 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Expand button skeleton */}
          <div className="px-5 py-3">
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-3 py-4 text-zinc-600">
        <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs font-medium animate-pulse">Running grounded AI analysis…</span>
      </div>
    </div>
  );
}
