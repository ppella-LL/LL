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
        className="text-left bg-ink text-ink-content rounded-2xl p-5 shadow-soft active:scale-[0.98] transition-transform"
      >
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-5">
          <Calendar size={18} />
        </div>
        <p className="text-3xl font-black leading-none mb-1">{trips.length}</p>
        <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">
          Upcoming trips
        </p>
      </button>

      <button
        onClick={() => nextTrip && navigate('/trips')}
        className="text-left bg-surface-2 border border-line/70 rounded-2xl p-5 shadow-soft active:scale-[0.98] transition-transform"
      >
        <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center mb-5">
          <PlaneTakeoff size={18} />
        </div>
        {nextTrip ? (
          <>
            <p className="text-lg font-black leading-tight text-content truncate">
              {nextTrip.destination}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-content-faint mt-1">
              Next · {nextTrip.checkIn || 'TBD'}
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-black leading-tight text-content">No trips yet</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-content-faint mt-1">
              Plan your first
            </p>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
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
        <div className="mb-7">
          <p className="text-content-faint font-bold text-sm uppercase tracking-wider mb-1">
            Welcome back
          </p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-content leading-none">
            Hi, {firstName}.
          </h1>
        </div>

        {/* Desktop: hero (wide) + stats column. Mobile: stacked. */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
          {/* C — travel hero with scrolling London photos */}
          <button
            onClick={() => navigate('/trip/where')}
            className="group relative w-full text-left rounded-3xl overflow-hidden shadow-soft-lg min-h-[300px] lg:min-h-[440px] flex flex-col justify-end active:scale-[0.99] transition-transform"
          >
            <LondonCarousel />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 p-6 lg:p-8">
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20 mb-4">
                <MapPin size={13} /> London · Available now
              </div>
              <h2 className="text-white text-4xl lg:text-6xl font-black tracking-tight mb-2 leading-none">
                Plan a trip
              </h2>
              <p className="text-white/80 text-sm lg:text-base font-medium mb-5 max-w-md">
                Book a wardrobe waiting at your room. Zero luggage guaranteed.
              </p>
              <span className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-5 py-3 rounded-xl shadow-glow group-hover:bg-brand-dark transition-colors">
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
