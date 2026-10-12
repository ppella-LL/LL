import { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Thin banner shown only when the app runs on the local mock backend
 * (no Supabase credentials). Makes it obvious that data lives in this
 * browser only. Dismissible per session.
 */
export function MockModeBanner() {
  const { mock } = useAuth();
  const [hidden, setHidden] = useState(false);

  if (!mock || hidden) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
      <FlaskConical size={14} />
      <span>Test mode · data saved in this browser only</span>
      <button
        onClick={() => setHidden(true)}
        aria-label="Dismiss test mode notice"
        className="ml-1 hover:opacity-70"
      >
        <X size={14} />
      </button>
    </div>
  );
}
