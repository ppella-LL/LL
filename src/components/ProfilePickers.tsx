import { Check } from 'lucide-react';
import { BodyFigure } from '@/components/BodyFigure';
import type { BodyType, Gender } from '@/types';

const BODY_TYPES: { id: BodyType; label: string }[] = [
  { id: 'slim', label: 'Slim' },
  { id: 'regular', label: 'Regular' },
  { id: 'athletic', label: 'Athletic' },
  { id: 'full', label: 'Full' },
];

export function BodyTypePicker({
  value,
  gender,
  onChange,
}: {
  value?: BodyType;
  gender?: Gender;
  onChange: (t: BodyType) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {BODY_TYPES.map((b) => {
        const active = value === b.id;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onChange(b.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
              active
                ? 'border-brand bg-brand-soft'
                : 'border-line bg-surface-3/50 hover:border-content-faint/50'
            }`}
          >
            <span
              className={`h-16 w-10 flex items-end justify-center ${
                active ? 'text-brand' : 'text-content-faint'
              }`}
            >
              <BodyFigure type={b.id} gender={gender} active={active} />
            </span>
            <span
              className={`text-[11px] font-bold ${active ? 'text-brand' : 'text-content-soft'}`}
            >
              {b.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// A compact, pleasant palette for "favourite colour".
const COLORS = [
  '#111827', '#ffffff', '#ff6600', '#ef4444', '#f59e0b', '#eab308',
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#f43f5e', '#78716c', '#a3a3a3',
];

export function ColorPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {COLORS.map((c) => {
        const active = value?.toLowerCase() === c.toLowerCase();
        const isLight = ['#ffffff', '#eab308', '#f59e0b', '#a3a3a3'].includes(c);
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-label={`Select colour ${c}`}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              active ? 'ring-2 ring-offset-2 ring-brand ring-offset-surface-2 scale-110' : 'hover:scale-105'
            }`}
            style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid rgb(var(--line))' : 'none' }}
          >
            {active && <Check size={16} className={isLight ? 'text-black' : 'text-white'} />}
          </button>
        );
      })}
    </div>
  );
}
