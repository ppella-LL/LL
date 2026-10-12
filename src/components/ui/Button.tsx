import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const base =
  'px-6 py-4 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-soft hover:shadow-glow',
  secondary: 'bg-ink text-ink-content hover:opacity-90 shadow-soft',
  outline: 'border border-line text-content hover:bg-surface-3',
  ghost: 'text-content-soft hover:text-content hover:bg-surface-3',
  white: 'bg-surface-2 text-content border border-line hover:bg-surface-3 shadow-soft',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
