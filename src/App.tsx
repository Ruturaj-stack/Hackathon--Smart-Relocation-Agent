/**
 * HomeWise AI – Main Application
 * 
 * Smart Chicago Relocation Agent powered by:
 *  - Static housing metrics dataset (22 neighborhoods)
 *  - Live OpenStreetMap amenity data (with fallback)
 *  - Gemini 2.0 Flash AI reasoning
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Activity, AlertCircle, X, Database, Cpu, Map as MapIcon } from 'lucide-react';

import SearchForm from './components/SearchForm.tsx';
import MapComponent from './components/Map.tsx';
import Recommendations from './components/Recommendations.tsx';
import SkeletonLoader from './components/SkeletonLoader.tsx';
import EmptyState from './components/EmptyState.tsx';
import AuthStatus from './components/AuthStatus.tsx';

import CHICAGO_HOUSING_DATA from './data/chicago-housing.ts';
import type { Neighborhood, SearchPrefs, Recommendation } from './data/types.ts';

interface SearchResult {
  recommendations: Recommendation[];
  metadata: {
    totalCandidates: number;
    analyzedNeighborhoods: number;
    osmSource: 'live' | 'fallback';
    aiPowered: boolean;
    datasetVersion: string;
  };
}

export default function App() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(CHICAGO_HOUSING_DATA);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.8781, -87.6298]);
  const [searchRadius, setSearchRadius] = useState(2000);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Preload neighborhoods from server (or use embedded data if server unavailable)
  useEffect(() => {
    axios.get('/api/neighborhoods')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setNeighborhoods(res.data);
        }
      })
      .catch(() => {
        // Use embedded CHICAGO_HOUSING_DATA as fallback (already set as default)
        console.info('Using embedded Chicago housing dataset.');
      });
  }, []);

  const handleSearch = async (prefs: SearchPrefs) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchRadius(prefs.radius);
    setSearchResult(null);

    try {
      const res = await axios.post('/api/search', prefs);
      const result: SearchResult = res.data;
      setSearchResult(result);

      // Center map on top recommendation
      if (result.recommendations.length > 0) {
        const topRec = result.recommendations[0];
        const neighborhoodData = neighborhoods.find(n => n.name === topRec.name);
        if (neighborhoodData) {
          setMapCenter([neighborhoodData.lat, neighborhoodData.lng]);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Search failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = searchResult?.recommendations || [];
  const metadata = searchResult?.metadata;

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-[#fafafa] font-sans overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-[320px] shrink-0 border-r border-white/[0.06] flex flex-col bg-zinc-950 z-20">

        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-white/[0.05]">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Home className="text-white w-5 h-5" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-base leading-none">HomeWise AI</div>
            <div className="text-[10px] text-zinc-600 mt-0.5">Chicago Relocation Agent</div>
          </div>
        </div>

        {/* Search form */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Search Parameters</div>
            <SearchForm onSearch={handleSearch} loading={loading} />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
                <button onClick={() => setError(null)} className="shrink-0 hover:text-red-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status indicators */}
          <div className="space-y-2 pb-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">System Status</div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[11px] text-zinc-400">Gemini 2.0 Flash Active</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <Database className="w-3 h-3 text-blue-400" />
              <span className="text-[11px] text-zinc-400">{neighborhoods.length} Neighborhoods Loaded</span>
            </div>

            {metadata && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]"
              >
                <MapIcon className={`w-3 h-3 ${metadata.osmSource === 'live' ? 'text-green-400' : 'text-yellow-400'}`} />
                <span className="text-[11px] text-zinc-400">
                  OSM: {metadata.osmSource === 'live' ? 'Live Data' : 'Fallback Dataset'}
                </span>
              </motion.div>
            )}

            {metadata && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]"
              >
                <Cpu className={`w-3 h-3 ${metadata.aiPowered ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span className="text-[11px] text-zinc-400">
                  {metadata.aiPowered ? 'Gemini AI Reasoning' : 'Smart Fallback Logic'}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Auth */}
        <div className="p-4 border-t border-white/[0.05] bg-black/20">
          <AuthStatus />
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="h-14 border-b border-white/[0.05] flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md z-10 shrink-0">
          <div>
            <h1 className="text-base font-bold tracking-tight">Chicago Neighborhood Analysis</h1>
            <p className="text-[11px] text-zinc-500">Grounded AI agent · Housing + OpenStreetMap data fusion</p>
          </div>
          <div className="flex items-center gap-3">
            {metadata && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
              >
                <Activity className="w-3 h-3 text-indigo-400" />
                <span className="text-[11px] text-indigo-300 font-semibold">
                  {metadata.analyzedNeighborhoods}/{metadata.totalCandidates} Analyzed
                </span>
              </motion.div>
            )}
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">

          {/* Map panel */}
          <div className="flex-1 relative overflow-hidden">
            <MapComponent
              neighborhoods={neighborhoods}
              recommendations={recommendations}
              center={mapCenter}
              radius={searchRadius}
            />

            {/* OSM data overlay */}
            <div className="absolute top-4 right-4 z-[1000] bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 w-44 shadow-2xl">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3">Data Sources</div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Housing DB</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">OSM Amenities</span>
                  <span className={`font-medium ${metadata?.osmSource === 'live' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {metadata?.osmSource === 'live' ? 'Live' : 'Fallback'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Gemini AI</span>
                  <span className={`font-medium ${metadata?.aiPowered ? 'text-indigo-400' : 'text-zinc-500'}`}>
                    {metadata?.aiPowered ? 'Active' : 'Offline'}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                    style={{ width: loading ? '65%' : recommendations.length > 0 ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations panel */}
          <div className="w-[400px] shrink-0 border-l border-white/[0.06] bg-zinc-950 flex flex-col">
            <div className="p-5 border-b border-white/[0.05] shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold tracking-wider uppercase">
                  Grounded AI
                </div>
                <span className="text-[11px] text-zinc-600 italic">No hallucination</span>
              </div>
              <h2 className="text-sm font-bold text-zinc-100">Recommended Neighborhoods</h2>
              {metadata && (
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {metadata.totalCandidates} candidates found · Showing top {recommendations.length}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SkeletonLoader />
                  </motion.div>
                ) : recommendations.length > 0 ? (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Recommendations
                      items={recommendations}
                      osmSource={metadata?.osmSource || 'fallback'}
                      aiPowered={metadata?.aiPowered || false}
                      totalCandidates={metadata?.totalCandidates || 0}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {hasSearched && !loading ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
                          <AlertCircle className="w-6 h-6 text-zinc-600" />
                        </div>
                        <p className="text-sm font-semibold text-zinc-400 mb-1">No neighborhoods found</p>
                        <p className="text-[12px] text-zinc-600 max-w-[200px]">
                          Try increasing your budget or relaxing the crime level filter.
                        </p>
                      </div>
                    ) : (
                      <EmptyState />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
