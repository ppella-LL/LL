import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export const COLOR_OPTIONS: { name: string; value: string }[] = [
  { name: 'Black', value: '#111827' },
  { name: 'White', value: '#f8fafc' },
  { name: 'Orange', value: '#ff6600' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#06b6d4' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Stone', value: '#78716c' },
];

interface ColorSelectProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

/** Clean dropdown colour selector (swatch + name) for signup and profile. */
export function ColorSelect({ value, onChange, label }: ColorSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = COLOR_OPTIONS.find((c) => c.value.toLowerCase() === value?.toLowerCase());

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-surface-3/60 border border-line rounded-xl text-content font-semibold hover:border-content-faint/50 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
      >
        <span className="flex items-center gap-3">
          <span
            className="w-6 h-6 rounded-full border border-line shrink-0"
            style={{ backgroundColor: current?.value || '#ff6600' }}
          />
          {current?.name || 'Choose a colour'}
        </span>
        <ChevronDown
          size={18}
          className={`text-content-faint transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 w-full mt-2 bg-surface-2 border border-line rounded-xl shadow-soft-lg overflow-hidden max-h-64 overflow-y-auto">
          {COLOR_OPTIONS.map((c) => {
            const active = c.value.toLowerCase() === value?.toLowerCase();
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  onChange(c.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-soft transition-colors text-left"
              >
                <span
                  className="w-6 h-6 rounded-full border border-line shrink-0"
                  style={{ backgroundColor: c.value }}
                />
                <span className="font-semibold text-content flex-1">{c.name}</span>
                {active && <Check size={16} className="text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
