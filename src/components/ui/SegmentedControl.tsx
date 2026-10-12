interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Pill-style segmented toggle (iOS-like), theme-aware. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div className={`flex gap-1 p-1 bg-surface-3 rounded-xl ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
            value === opt
              ? 'bg-surface-2 shadow-soft text-content'
              : 'text-content-soft hover:text-content'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
