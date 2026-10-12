import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', value, onChange, ...rest }: InputProps) {
  const isReadOnly = value !== undefined && !onChange;
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        readOnly={isReadOnly}
        className="w-full px-4 py-3.5 bg-surface-3/60 border border-line rounded-xl text-content placeholder:text-content-faint focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 focus:bg-surface-2 transition-all text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:border-content-faint/50"
        {...rest}
      />
    </div>
  );
}
