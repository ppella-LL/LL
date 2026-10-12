import { useEffect, useMemo, useState } from 'react';
import { CloudSun, Quote, ShoppingBag, Sparkles } from 'lucide-react';
import type { RentedItem, Trip } from '@/types';

/**
 * Rotating "insight" carousel shown beside the wardrobe on the trip detail.
 * Cycles through: London weather (simulated), a playful line, photos of what
 * was picked, and traveller aphorisms. Content is deterministic per trip so
 * it doesn't jump on every render, then auto-advances on a timer.
 */

const WEATHER = [
  { icon: '🌦️', text: '13°C · light showers over the Thames', tip: 'Pack a light layer — your jacket is ready.' },
  { icon: '☀️', text: '18°C · bright over Hyde Park', tip: 'Sunglasses weather in London today.' },
  { icon: '⛅', text: '15°C · mild and cloudy in the City', tip: 'Classic London — comfortable all day.' },
  { icon: '🌧️', text: '11°C · steady rain near the Shard', tip: 'Stay dry, we picked warm pieces for you.' },
];

const LINES = [
  'Your closet travels so you don\'t have to.',
  'Freshly pressed and waiting — zero bags, zero stress.',
  'Someone in London is ironing your shirt right now.',
  'Hands free, mind free. That\'s the LuggageLess way.',
];

const APHORISMS = [
  { q: 'The world is a book, and those who do not travel read only one page.', a: 'Augustine' },
  { q: 'Travel light, live light, spread the light.', a: 'Yogi Bhajan' },
  { q: 'He who would travel happily must travel light.', a: 'Antoine de Saint-Exupéry' },
  { q: 'To travel is to live.', a: 'Hans Christian Andersen' },
  { q: 'Not all those who wander are lost.', a: 'J.R.R. Tolkien' },
];

type Slide =
  | { kind: 'weather'; icon: string; text: string; tip: string }
  | { kind: 'line'; text: string }
  | { kind: 'items'; items: RentedItem[] }
  | { kind: 'aphorism'; q: string; a: string };

// Tiny deterministic hash so a given trip always starts from the same content.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function TripInsightCarousel({ trip }: { trip: Trip }) {
  const slides = useMemo<Slide[]>(() => {
    const seed = hash(trip.id || trip.destination || 'trip');
    const rented = trip.wardrobeMode === 'rent' ? (trip.items as RentedItem[]) : [];
    const list: Slide[] = [
      { kind: 'weather', ...WEATHER[seed % WEATHER.length] },
      { kind: 'line', text: LINES[seed % LINES.length] },
    ];
    if (rented.length > 0) list.push({ kind: 'items', items: rented.slice(0, 4) });
    list.push({ kind: 'aphorism', ...APHORISMS[seed % APHORISMS.length] });
    return list;
  }, [trip]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-ink text-ink-content shadow-soft min-h-[220px] flex flex-col">
      {/* soft brand glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand/20 blur-3xl" />

      <div className="relative z-10 p-6 flex-1 flex flex-col justify-center">
        {slide.kind === 'weather' && (
          <div>
            <Badge icon={<CloudSun size={14} />} label="London now" />
            <p className="text-5xl mb-3">{slide.icon}</p>
            <p className="text-xl font-black leading-tight">{slide.text}</p>
            <p className="text-ink-content/70 font-medium mt-2">{slide.tip}</p>
          </div>
        )}

        {slide.kind === 'line' && (
          <div>
            <Badge icon={<Sparkles size={14} />} label="LuggageLess" />
            <p className="text-2xl font-black leading-snug">{slide.text}</p>
          </div>
        )}

        {slide.kind === 'items' && (
          <div>
            <Badge icon={<ShoppingBag size={14} />} label="What you picked" />
            <div className="flex gap-3 mt-1">
              {slide.items.map((it) => (
                <div key={it.id} className="flex-1 min-w-0">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white/10 mb-2">
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-bold truncate text-ink-content/80">{it.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.kind === 'aphorism' && (
          <div>
            <Badge icon={<Quote size={14} />} label="For the traveller" />
            <p className="text-2xl font-black leading-snug">“{slide.q}”</p>
            <p className="text-ink-content/60 font-bold mt-3">— {slide.a}</p>
          </div>
        )}
      </div>

      {/* dots */}
      <div className="relative z-10 flex gap-1.5 p-6 pt-0">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? 'w-6 bg-brand' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand mb-3">
      {icon} {label}
    </span>
  );
}
