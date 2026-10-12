import type { InputHTMLAttributes, ReactNode } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

/**
 * Labeled input with an optional leading icon. Modern, theme-aware styling
 * shared by the trip-planning forms (incl. date/time pickers).
 */
export function Field({ label, icon, className = '', ...rest }: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-faint pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`w-full ${
            icon ? 'pl-11' : 'pl-4'
          } pr-4 py-3.5 bg-surface-3/60 border border-line rounded-xl text-content placeholder:text-content-faint focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 focus:bg-surface-2 transition-all text-base font-semibold [color-scheme:light] dark:[color-scheme:dark]`}
          {...rest}
        />
      </div>
    </div>
  );
}
