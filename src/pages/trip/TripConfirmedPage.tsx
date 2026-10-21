import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, Check, MapPin, PartyPopper } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

function useCountdown(target: number) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const distance = Math.max(0, target - Date.now());
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  const seconds = Math.floor((distance % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: distance <= 0 };
}

export default function TripConfirmedPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useAuth();
  const trip = trips.find((t) => t.id === id);

  const target = trip
    ? new Date(`${trip.checkIn}T${trip.checkInTime || '14:00'}:00`).getTime()
    : Date.now();
  const cd = useCountdown(target);

  if (!trip) {
    return (
      <div className="min-h-dvh bg-surface flex flex-col items-center justify-center p-6 text-center">
        <p className="text-content-faint font-bold mb-4">Trip not found.</p>
        <Button onClick={() => navigate('/trips')}>Go to my trips</Button>
      </div>
    );
  }

  const blocks = [
    { label: 'Days', value: cd.days },
    { label: 'Hours', value: cd.hours },
    { label: 'Min', value: cd.minutes },
    { label: 'Sec', value: cd.seconds },
  ];

  return (
    <div className="relative min-h-dvh bg-black text-white overflow-hidden flex flex-col items-center justify-center p-6 text-center">
      {/* Celebratory glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="aurora aurora-1 bg-brand/40 w-[60vw] h-[60vw] -top-[20vw] left-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center mx-auto mb-6 shadow-glow">
          <PartyPopper size={30} />
        </div>
        <p className="eyebrow text-brand mb-3">Booking confirmed</p>
        <h1 className="display-hero text-5xl lg:text-6xl mb-4">You're all set.</h1>
        <p className="text-white/70 font-medium mb-8">
          Your wardrobe will be freshly pressed and waiting at{' '}
          <span className="text-white font-bold">{trip.destination}</span>.
        </p>

        {/* Delivery countdown */}
        <p className="eyebrow text-white/50 mb-3">Delivery in</p>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {blocks.map((b) => (
            <div
              key={b.label}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 backdrop-blur-sm"
            >
              <p className="display-tight text-3xl text-brand tabular-nums">
                {String(b.value).padStart(2, '0')}
              </p>
              <p className="eyebrow text-white/50 text-[10px] mt-1">{b.label}</p>
            </div>
          ))}
        </div>

        {/* Mini summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2.5 mb-8 backdrop-blur-sm">
          <p className="flex items-center gap-3 text-sm font-semibold text-white/80">
            <MapPin size={16} className="text-brand" /> {trip.stayType} · {trip.destination}
          </p>
          <p className="flex items-center gap-3 text-sm font-semibold text-white/80">
            <Calendar size={16} className="text-brand" /> {trip.checkIn} → {trip.checkOut}
          </p>
          <p className="flex items-center gap-3 text-sm font-semibold text-white/80">
            <Check size={16} className="text-brand" /> {trip.items.length} clothes
            {trip.essentials.length ? ` · ${trip.essentials.length} extras` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate(`/trips/${trip.id}`)} className="w-full rounded-full">
            Track my trip <ArrowRight size={18} />
          </Button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
