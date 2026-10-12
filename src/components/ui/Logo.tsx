import { Luggage } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 font-black tracking-tight ${className}`}>
      <Luggage className="text-[#ff6600]" size={size} />
      <span>
        Luggage<span className="text-[#ff6600]">Less</span>
      </span>
    </div>
  );
}
