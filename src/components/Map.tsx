/**
 * Map component — Interactive Leaflet map with color-coded neighborhood markers.
 * Gold = top pick, Silver = #2, Bronze = #3, Indigo = other neighborhoods.
 */
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Neighborhood } from '../data/types.ts';
import type { Recommendation } from '../data/types.ts';

// Fix Leaflet default icon paths (Vite bundler issue)
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/** Create SVG pin icon with custom fill color */
function createPinIcon(fillColor: string, pulse = false) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="28" height="38">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 30 12 30s12-21 12-30C28 5.373 22.627 0 16 0z"
            fill="${fillColor}" filter="url(#shadow)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <circle cx="16" cy="12" r="5" fill="rgba(255,255,255,0.9)"/>
    </svg>
  `;
  return L.divIcon({
    className: pulse ? 'marker-pulse' : '',
    html: svg,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -40],
  });
}

const ICONS = {
  gold:   createPinIcon('#f59e0b', true),
  silver: createPinIcon('#94a3b8'),
  bronze: createPinIcon('#d97706'),
  blue:   createPinIcon('#6366f1'),
  grey:   createPinIcon('#52525b'),
};

function getRankIcon(idx: number) {
  if (idx === 0) return ICONS.gold;
  if (idx === 1) return ICONS.silver;
  if (idx === 2) return ICONS.bronze;
  return ICONS.blue;
}

/** Auto-fit map view to show all recommendation markers */
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
    } else {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [positions, map]);
  return null;
}

interface MapProps {
  neighborhoods: Neighborhood[];
  recommendations: Recommendation[];
  center: [number, number];
  radius: number;
}

function AmenityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[11px]">
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ color: '#f9fafb', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function Map({ neighborhoods, recommendations, center, radius }: MapProps) {
  // Build lookup for which neighborhoods are recommended and their rank
  const recMap = new globalThis.Map<string, { rank: number; rec: Recommendation }>();
  recommendations.forEach((rec, idx) => {
    recMap.set(rec.name, { rank: idx, rec });
  });

  // Recommended neighborhood coordinates for FitBounds
  const recPositions: [number, number][] = recommendations
    .map(rec => {
      const n = neighborhoods.find(nb => nb.name === rec.name);
      return n ? [n.lat, n.lng] as [number, number] : null;
    })
    .filter((p): p is [number, number] => p !== null);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ background: '#09090b' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-dark"
        />

        {/* Fit to recommended neighborhoods when they change */}
        {recPositions.length > 0 && <FitBounds positions={recPositions} />}

        {/* Radius circle around top recommendation */}
        {recPositions[0] && radius > 0 && (
          <Circle
            center={recPositions[0]}
            radius={radius}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.04,
              weight: 1,
              dashArray: '5, 8',
            }}
          />
        )}

        {/* Neighborhood markers */}
        {neighborhoods.map((n) => {
          const recInfo = recMap.get(n.name);
          const isRec = recInfo !== undefined;
          const rank = recInfo?.rank ?? -1;
          const rec = recInfo?.rec;
          const icon = isRec ? getRankIcon(rank) : ICONS.grey;

          return (
            <Marker key={n.id} position={[n.lat, n.lng]} icon={icon}>
              <Popup minWidth={220} maxWidth={260}>
                <div style={{ padding: '16px', minWidth: '220px', fontFamily: 'Inter, sans-serif' }}>
                  {/* Rank badge */}
                  {isRec && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      marginBottom: '10px',
                      padding: '3px 10px', borderRadius: '20px',
                      background: rank === 0 ? 'rgba(245,158,11,0.2)' : rank === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(217,119,6,0.2)',
                      border: `1px solid ${rank === 0 ? 'rgba(245,158,11,0.4)' : rank === 1 ? 'rgba(148,163,184,0.4)' : 'rgba(217,119,6,0.4)'}`,
                      fontSize: '10px', fontWeight: 700, color: '#f9fafb',
                    }}>
                      {rank === 0 ? '🥇 Top Pick' : rank === 1 ? '🥈 Runner Up' : '🥉 Third Pick'}
                    </div>
                  )}

                  {/* Name */}
                  <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#f9fafb' }}>
                    {n.name}
                  </h3>

                  {/* Metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <AmenityRow label="Avg Rent" value={`$${n.avgRent?.toLocaleString()}/mo`} />
                    <AmenityRow label="Livability" value={`${n.livabilityScore}/100`} />
                    <AmenityRow label="Transit Score" value={`${n.transitScore}/100`} />
                    <AmenityRow label="Crime" value={n.crimeRate} />
                    {rec && <AmenityRow label="Confidence" value={`${rec.confidenceScore}%`} />}
                  </div>

                  {/* Description */}
                  <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#9ca3af', lineHeight: '1.5' }}>
                    {n.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 space-y-2 shadow-2xl">
        <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Map Legend</div>
        {[
          { color: '#f59e0b', label: '🥇 Top Pick' },
          { color: '#94a3b8', label: '🥈 Runner Up' },
          { color: '#d97706', label: '🥉 Third Pick' },
          { color: '#6366f1', label: 'Candidate' },
          { color: '#52525b', label: 'Other' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px] text-zinc-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
