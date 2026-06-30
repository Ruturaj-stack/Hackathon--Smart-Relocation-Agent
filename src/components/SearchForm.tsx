/**
 * SearchForm – Enhanced search control panel.
 * Includes: budget, radius, max crime level, and all 5 amenity preferences.
 */
import React, { useState } from 'react';
import { Search, Train, ShoppingCart, Building2, Pill, GraduationCap, Shield, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import type { SearchPrefs } from '../data/types.ts';

interface SearchFormProps {
  onSearch: (prefs: SearchPrefs) => void;
  loading: boolean;
}

const CRIME_LEVELS = [
  { value: 'Any', label: 'Any', color: 'text-zinc-400' },
  { value: 'Medium', label: '≤ Medium', color: 'text-yellow-400' },
  { value: 'Low', label: 'Low Only', color: 'text-emerald-400' },
] as const;

const AMENITY_OPTIONS = [
  { key: 'train' as const,    label: 'Transit',   icon: Train,        desc: 'Subway / L train access' },
  { key: 'grocery' as const,  label: 'Grocery',   icon: ShoppingCart, desc: 'Supermarkets nearby' },
  { key: 'hospital' as const, label: 'Hospital',  icon: Building2,    desc: 'Medical facilities' },
  { key: 'pharmacy' as const, label: 'Pharmacy',  icon: Pill,         desc: 'Drug stores nearby' },
  { key: 'school' as const,   label: 'Schools',   icon: GraduationCap, desc: 'K-12 schools' },
];

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [budget, setBudget] = useState(2000);
  const [radius, setRadius] = useState(2000);
  const [maxCrimeLevel, setMaxCrimeLevel] = useState<'Any' | 'Low' | 'Medium'>('Any');
  const [amenities, setAmenities] = useState({
    train: true,
    grocery: true,
    hospital: false,
    pharmacy: false,
    school: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ budget, radius, maxCrimeLevel, amenities });
  };

  const toggleAmenity = (key: keyof typeof amenities) => {
    setAmenities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Budget Slider */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Monthly Budget</label>
          <span className="text-sm font-bold text-indigo-400 font-mono">${budget.toLocaleString()}<span className="text-[10px] text-zinc-600 font-normal">/mo</span></span>
        </div>
        <input
          id="budget-slider"
          type="range"
          min="800"
          max="5000"
          step="50"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>$800</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Search Radius */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Sliders className="w-3 h-3" /> Search Radius
          </label>
          <span className="text-sm font-bold text-purple-400 font-mono">{(radius / 1000).toFixed(1)}<span className="text-[10px] text-zinc-600 font-normal"> km</span></span>
        </div>
        <input
          id="radius-slider"
          type="range"
          min="500"
          max="5000"
          step="250"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>0.5 km</span>
          <span>5 km</span>
        </div>
      </div>

      {/* Crime Level Filter */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
          <Shield className="w-3 h-3" /> Max Crime Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CRIME_LEVELS.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              id={`crime-${value.toLowerCase()}`}
              onClick={() => setMaxCrimeLevel(value)}
              className={`py-2 text-center rounded-lg text-[11px] font-semibold transition-all border ${
                maxCrimeLevel === value
                  ? `bg-white/10 border-white/20 ${color}`
                  : 'bg-zinc-900 border-white/5 text-zinc-600 hover:border-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenity Preferences */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Required Amenities</label>
        <div className="grid grid-cols-1 gap-2">
          {AMENITY_OPTIONS.map(({ key, label, icon: Icon, desc }) => (
            <button
              key={key}
              type="button"
              id={`amenity-${key}`}
              onClick={() => toggleAmenity(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${
                amenities[key]
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10'
              }`}
            >
              <div className={`p-1.5 rounded-md ${amenities[key] ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">{label}</div>
                <div className="text-[9px] text-zinc-600 truncate">{desc}</div>
              </div>
              <div className={`w-4 h-4 rounded border flex items-center justify-center text-[8px] font-bold transition-all ${
                amenities[key] ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-700'
              }`}>
                {amenities[key] && '✓'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        id="search-submit-btn"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Analyzing Market...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Find My Neighborhood</span>
          </>
        )}
      </motion.button>
    </form>
  );
}
