import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface StepHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
  children?: ReactNode;
}

/** Sticky top bar with a back arrow, used across the trip-planning steps. */
export function StepHeader({ title, onBack, right, children }: StepHeaderProps) {
  return (
    <header className="px-4 py-3 flex flex-col border-b border-line/70 sticky top-0 bg-surface/80 backdrop-blur-xl z-20">
      <div className="flex items-center">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="p-2 mr-2 -ml-2 rounded-full text-content hover:bg-surface-3 transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <h2 className="font-black text-lg flex-1 text-content">{title}</h2>
        {right}
      </div>
      {children}
    </header>
  );
}
