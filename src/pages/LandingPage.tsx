import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Luggage, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LondonCarousel } from '@/components/LondonCarousel';

const STEPS = [
  { title: 'Book your trip', body: 'Tell us your hotel and dates in London.' },
  {
    title: 'Curate your closet',
    body: 'Rent stylish items for €8 max, or ship us your own favorites.',
  },
  {
    title: 'Arrive light',
    body: 'Walk into your room to find your clothes waiting in the closet.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="relative min-h-dvh bg-black text-white overflow-hidden flex flex-col">
      {/* Layer 0: dynamic London photos, dimmed and tinted */}
      <LondonCarousel className="opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />

      {/* Layer 1: animated orange aurora + cyber grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="aurora aurora-1 bg-brand/40 w-[55vw] h-[55vw] -top-[15vw] -left-[10vw]" />
        <div className="aurora aurora-2 bg-brand/30 w-[45vw] h-[45vw] bottom-[-15vw] right-[-10vw]" />
        <div className="absolute inset-0 cyber-grid" />
      </div>

      {/* Nav */}
      <header className="relative z-10 p-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-black">
          <Luggage className="text-brand" size={28} />
          <span>
            Luggage<span className="text-brand">Less</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-sm font-bold text-white/70 hover:text-white transition-colors"
        >
          Log in
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 py-10 max-w-3xl mx-auto w-full">
        <p className="eyebrow text-brand mb-5 rise-in" style={{ animationDelay: '0.05s' }}>
          <Sparkles size={13} className="inline mb-0.5 mr-1" /> London · Zero luggage
        </p>

        <h1
          className="display-hero neon-text text-6xl sm:text-7xl lg:text-8xl rise-in"
          style={{ animationDelay: '0.15s' }}
        >
          Travel light.
          <br />
          <span className="text-brand">Zero</span> bags.
        </h1>

        <p
          className="text-lg lg:text-xl text-white/70 font-medium mt-6 mb-9 leading-relaxed max-w-xl rise-in"
          style={{ animationDelay: '0.3s' }}
        >
          Your personal wardrobe, freshly pressed and waiting in your room.
          Never check a bag again.
        </p>

        <div className="rise-in" style={{ animationDelay: '0.45s' }}>
          <Button
            onClick={() => navigate('/auth')}
            className="px-12 py-5 text-lg rounded-full glow-pulse"
          >
            Start your journey <ArrowRight size={20} />
          </Button>
        </div>

        {/* How it works — glass cards */}
        <div
          className="grid sm:grid-cols-3 gap-4 mt-16 w-full rise-in"
          style={{ animationDelay: '0.6s' }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="text-left p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-brand/40 transition-colors"
            >
              <span className="inline-flex bg-brand/20 text-brand rounded-full w-7 h-7 items-center justify-center font-black mb-3">
                {i + 1}
              </span>
              <strong className="block text-white text-sm mb-1">{step.title}</strong>
              <span className="block text-white/60 text-sm font-medium leading-snug">
                {step.body}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
