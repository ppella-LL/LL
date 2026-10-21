import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

/** Interactive (or read-only) 1–5 star rating. */
export function StarRating({ value, onChange, size = 22, readOnly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={readOnly ? 'cursor-default' : 'cursor-pointer active:scale-90 transition-transform'}
        >
          <Star
            size={size}
            className={n <= value ? 'fill-brand text-brand' : 'text-content-faint'}
          />
        </button>
      ))}
    </div>
  );
}
