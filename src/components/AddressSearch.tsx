import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useLocationSearch, type NominatimResult } from '@/hooks/useLocationSearch';

interface AddressSearchProps {
  label?: string;
  onSelect: (loc: { name: string; lat: number; lon: number }) => void;
}

/** Debounced live address search (OpenStreetMap) with a dropdown of results. */
export function AddressSearch({ label = 'Hotel / Airbnb in London', onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const results = useLocationSearch(query);

  const pick = (loc: NominatimResult) => {
    onSelect({
      name: loc.display_name.split(',')[0],
      lat: Number(loc.lat),
      lon: Number(loc.lon),
    });
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="relative z-20">
      <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search live addresses…"
          className="w-full pl-11 pr-4 py-3.5 bg-surface-2 border border-line rounded-xl text-content placeholder:text-content-faint focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-base font-semibold shadow-soft"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-faint" />
      </div>

      {open && query.length > 2 && (
        <div className="absolute w-full mt-2 bg-surface-2 border border-line shadow-soft-lg rounded-xl overflow-hidden max-h-72 overflow-y-auto z-30">
          {results.length > 0 ? (
            results.map((loc, idx) => (
              <button
                type="button"
                key={idx}
                className="w-full text-left p-4 border-b border-line/60 last:border-0 hover:bg-brand-soft transition-colors flex items-start gap-3"
                onClick={() => pick(loc)}
              >
                <MapPin size={16} className="text-brand shrink-0 mt-0.5" />
                <span>
                  <span className="block font-bold text-content text-sm">
                    {loc.display_name.split(',')[0]}
                  </span>
                  <span className="block text-xs text-content-faint mt-0.5 truncate">
                    {loc.display_name}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-content-faint text-sm font-medium text-center">
              Searching real London addresses…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
