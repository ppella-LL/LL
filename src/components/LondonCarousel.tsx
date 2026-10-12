import { useEffect, useState } from 'react';

// Stable, verified London photos (Unsplash). Cross-faded in the hero card.
const PHOTOS = [
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', // Big Ben / bus
  'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80', // Tower Bridge
  'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=80', // skyline
  'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1200&q=80', // red phone box
];

interface LondonCarouselProps {
  className?: string;
  interval?: number;
}

/** Auto-advancing cross-fade of London photos for the home hero background. */
export function LondonCarousel({ className = '', interval = 4500 }: LondonCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % PHOTOS.length), interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1500ms, 6000ms' }}
        />
      ))}
    </div>
  );
}
