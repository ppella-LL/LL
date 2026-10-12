import { useEffect, useState } from 'react';

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Debounced live address lookup against OpenStreetMap Nominatim,
 * scoped to London. Returns results for queries longer than 2 chars.
 */
export function useLocationSearch(query: string): NominatimResult[] {
  const [results, setResults] = useState<NominatimResult[]>([]);

  useEffect(() => {
    if (query.trim().length <= 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}+London&format=json&limit=5`,
          { signal: controller.signal },
        );
        const data = (await res.json()) as NominatimResult[];
        setResults(data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Location search failed', err);
        }
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return results;
}
