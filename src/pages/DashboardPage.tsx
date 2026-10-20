import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Calendar, MapPin, PlaneTakeoff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { LondonCarousel } from '@/components/LondonCarousel';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, trips } = useAuth();
  const firstName = profile?.name?.split(' ')[0] || 'Traveler';
  const nextTrip = trips[0];

  const stats = (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
      <button
        onClick={() => navigate('/trips')}
        className="text-left bg-ink text-ink-content rounded-3xl p-6 shadow-soft active:scale-[0.98] transition-transform flex flex-col"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-auto">
          <Calendar size={18} />
        </div>
        <p className="display-tight text-5xl text-brand mt-6">{trips.length}</p>
        <p className="eyebrow opacity-60 mt-2">Upcoming trips</p>
      </button>

      <button
        onClick={() => nextTrip && navigate('/trips')}
        className="text-left bg-surface-2 border border-line/70 rounded-3xl p-6 shadow-soft active:scale-[0.98] transition-transform flex flex-col"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center mb-auto">
          <PlaneTakeoff size={18} />
        </div>
        {nextTrip ? (
          <>
            <p className="display-tight text-2xl text-content truncate mt-6">
              {nextTrip.destination}
            </p>
            <p className="eyebrow text-content-faint mt-2">Next · {nextTrip.checkIn || 'TBD'}</p>
          </>
        ) : (
          <>
            <p className="display-tight text-2xl text-content mt-6">No trips yet</p>
            <p className="eyebrow text-content-faint mt-2">Plan your first</p>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="bg-surface">
      <header className="px-6 lg:px-10 pt-6 pb-2 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Logo size={24} className="text-xl text-content" />
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-brand transition-all bg-surface-3"
          aria-label="Open profile"
        >
          <img
            src={profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </header>

      <main className="px-6 lg:px-10 pt-4 max-w-6xl mx-auto w-full animate-fade-in-up">
        <div className="mb-8">
          <p className="eyebrow text-content-faint mb-2">Welcome back</p>
          <h1 className="display-tight text-4xl lg:text-5xl text-content">
            Hi, {firstName}.
          </h1>
        </div>

        {/* Desktop: hero (wide) + stats column. Mobile: stacked. */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
          {/* Full-bleed photographic hero + oversized uppercase lockup (Nike),
              rounded + airy (Airbnb). */}
          <button
            onClick={() => navigate('/trip/where')}
            className="group relative w-full text-left rounded-3xl overflow-hidden shadow-soft-lg min-h-[340px] lg:min-h-[480px] flex flex-col justify-end active:scale-[0.99] transition-transform"
          >
            <LondonCarousel />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 p-6 lg:p-9">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white eyebrow px-3 py-1.5 rounded-full border border-white/20 mb-5">
                <MapPin size={12} /> London · Available now
              </div>
              <h2 className="display-hero text-white text-5xl lg:text-7xl mb-3">
                Plan a
                <br />
                trip
              </h2>
              <p className="text-white/80 text-sm lg:text-base font-medium mb-6 max-w-md">
                Book a wardrobe waiting at your room. Zero luggage guaranteed.
              </p>
              <span className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-glow group-hover:bg-brand-dark transition-colors">
                Start now
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </span>
            </div>
          </button>

          {stats}
        </div>
      </main>
    </div>
  );
}
