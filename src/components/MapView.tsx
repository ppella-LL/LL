import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@/context/ThemeContext';

interface MapViewProps {
  lat: number;
  lon: number;
  /** Disable interaction (used for small preview maps in lists). */
  interactive?: boolean;
  zoom?: number;
  className?: string;
}

// Standard OpenStreetMap raster tiles — fully free, no API key, most reliable.
// There is no dark OSM theme, so dark mode applies a CSS filter (see className).
const OSM_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '© OpenStreetMap contributors';

// Branded orange pin as a divIcon (crisp, theme-independent).
const pinIcon = L.divIcon({
  className: 'll-pin',
  html: `
    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg"
         style="filter: drop-shadow(0 6px 10px rgba(0,0,0,0.3));">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 29 17 29s17-17 17-29C34 7.6 26.4 0 17 0z" fill="#ff6600"/>
      <circle cx="17" cy="17" r="6.5" fill="white"/>
    </svg>`,
  iconSize: [34, 46],
  iconAnchor: [17, 46],
});

/** Reliable raster map (Leaflet + Carto tiles, no API key, no WebGL/worker). */
export function MapView({
  lat,
  lon,
  interactive = true,
  zoom = 13,
  className = '',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { resolved } = useTheme();

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      attributionControl: true,
    });

    tileRef.current = L.tileLayer(OSM_TILES, {
      attribution: ATTRIBUTION,
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map);

    markerRef.current = L.marker([lat, lon], { icon: pinIcon }).addTo(map);

    // Fix the classic "grey map" by invalidating size once laid out.
    const t1 = window.setTimeout(() => map.invalidateSize(), 100);
    const t2 = window.setTimeout(() => map.invalidateSize(), 400);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    mapRef.current = map;

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when coordinates change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([lat, lon], zoom, { duration: 0.8 });
    markerRef.current?.setLatLng([lat, lon]);
  }, [lat, lon, zoom]);

  // Dark mode: tint the (light) OSM tiles via a CSS class (see index.css).
  return (
    <div
      ref={containerRef}
      className={`bg-surface-3 ${resolved === 'dark' ? 'map-dark' : ''} ${className}`}
    />
  );
}
