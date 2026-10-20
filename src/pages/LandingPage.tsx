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

  // A logged-in visitor landing here goes straight to the app.
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-dvh bg-black text-white lg:grid lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative overflow-hidden min-h-[42vh] lg:min-h-dvh flex flex-col justify-between p-6 lg:p-10">
        <LondonCarousel />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-black/85" />
        <div className="relative z-10 flex items-center gap-2 text-2xl font-black">
          <Luggage className="text-brand" size={28} />
          <span>
            Luggage<span className="text-brand">Less</span>
          </span>
        </div>
        <div className="relative z-10 hidden lg:flex items-center gap-2 text-white/60 eyebrow">
          <Sparkles size={14} className="text-brand" /> Trusted by frequent travellers
        </div>
      </div>

      {/* Content panel */}
      <div className="relative flex flex-col justify-center px-6 py-10 lg:p-14 max-w-xl mx-auto w-full">
        <p className="eyebrow text-brand mb-4">London · Zero luggage</p>
        <h1 className="display-hero text-6xl lg:text-7xl mb-6">
          Travel
          <br />
          light.
          <br />
          <span className="text-brand">Zero</span> bags.
        </h1>
        <p className="text-lg text-white/60 font-medium mb-8 leading-relaxed max-w-md">
          Your personal wardrobe waiting freshly pressed at your hotel room. Never check a bag
          again.
        </p>

        <Button
          onClick={() => navigate('/auth')}
          className="w-full sm:w-auto sm:self-start px-10 py-5 text-lg rounded-full"
        >
          Start your journey <ArrowRight size={20} />
        </Button>

        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="eyebrow text-white mb-5 flex items-center gap-2 text-sm">
            <Sparkles size={16} className="text-brand" /> How it works
          </h3>
          <ul className="space-y-4 text-sm font-medium text-white/70">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3 items-start">
                <span className="bg-brand/20 text-brand rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 font-black">
                  {i + 1}
                </span>
                <span>
                  <strong className="text-white block mb-0.5">{step.title}</strong>
                  {step.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
