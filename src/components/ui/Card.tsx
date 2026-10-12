import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-2 rounded-2xl p-6 shadow-soft border border-line/70 ${
        onClick
          ? 'cursor-pointer transition-all duration-200 active:scale-[0.985] hover:shadow-soft-lg'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
