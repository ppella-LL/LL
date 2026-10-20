import { Luggage } from 'lucide-react';

export function FullScreenLoader() {
  return (
    <div className="min-h-dvh bg-black flex items-center justify-center text-[#ff6600]">
      <Luggage size={48} className="animate-pulse" />
    </div>
  );
}
