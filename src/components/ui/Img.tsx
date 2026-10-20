import { useState, type ImgHTMLAttributes } from 'react';

// Neutral stock fallback shown when a remote image fails to load.
const FALLBACK =
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=70';

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Optional category-specific fallback; defaults to a neutral stock image. */
  fallback?: string;
}

/** <img> that swaps to a stock image if the source fails (point 3c). */
export function Img({ fallback = FALLBACK, src, onError, ...rest }: ImgProps) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? fallback : src}
      onError={(e) => {
        if (!failed) setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
