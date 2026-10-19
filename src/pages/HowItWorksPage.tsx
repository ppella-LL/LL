import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { StepHeader } from '@/components/ui/StepHeader';

const MODES = [
  {
    icon: ShoppingBag,
    tag: 'Option 1',
    title: 'Rent from catalog',
    tagline: 'Show up empty-handed.',
    body: 'Browse a curated wardrobe and build your look for the trip. Everything is cleaned, pressed and waiting in your room on arrival.',
    points: ['Premium items, max €8 each', 'Delivered to your hotel or Airbnb', 'Keep anything you love'],
    accent: true,
  },
  {
    icon: Package,
    tag: 'Option 2',
    title: 'Let us manage your clothes',
    tagline: 'Your own wardrobe, on demand.',
    body: 'Ship us your favourite pieces once. We store and care for them, then deliver exactly what you need, when and where you travel.',
    points: ['Send your items a single time', 'Stored, cleaned and tracked', 'Delivered on every trip'],
    accent: false,
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <StepHeader title="How it works" onBack={() => navigate(-1)} />

      <main className="max-w-5xl mx-auto w-full p-6 lg:p-10 animate-fade-in-up">
        <div className="text-center mb-10 lg:mb-14">
          <span className="inline-flex items-center gap-1.5 bg-brand-soft text-brand eyebrow px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Two ways to travel light
          </span>
          <h1 className="display-hero text-4xl lg:text-6xl text-content">
            Never pack
            <br />
            a bag again.
          </h1>
          <p className="text-content-soft font-medium mt-3 lg:text-lg max-w-xl mx-auto">
            Pick what fits your trip. Rent a fresh wardrobe, or let us look after your own.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {MODES.map(({ icon: Icon, tag, title, tagline, body, points, accent }) => (
            <div
              key={title}
              className={`relative overflow-hidden rounded-3xl p-7 lg:p-9 shadow-soft border ${
                accent
                  ? 'bg-surface-2 border-brand/20'
                  : 'bg-ink text-ink-content border-transparent'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  accent ? 'bg-brand-soft text-brand' : 'bg-white/10 text-ink-content'
                }`}
              >
                <Icon size={26} />
              </div>
              <p
                className={`text-[11px] font-black uppercase tracking-wider mb-2 ${
                  accent ? 'text-brand' : 'text-brand'
                }`}
              >
                {tag}
              </p>
              <h3
                className={`text-2xl lg:text-3xl font-black mb-1 ${
                  accent ? 'text-content' : 'text-ink-content'
                }`}
              >
                {title}
              </h3>
              <p className={`font-bold mb-4 ${accent ? 'text-content-soft' : 'text-ink-content/80'}`}>
                {tagline}
              </p>
              <p
                className={`text-sm lg:text-base font-medium leading-relaxed mb-6 ${
                  accent ? 'text-content-soft' : 'text-ink-content/70'
                }`}
              >
                {body}
              </p>
              <ul className="space-y-2.5">
                {points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-sm font-semibold">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        accent ? 'bg-brand text-white' : 'bg-brand text-white'
                      }`}
                    >
                      <Check size={12} />
                    </span>
                    <span className={accent ? 'text-content' : 'text-ink-content/90'}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            onClick={() => navigate(user ? '/trip/where' : '/auth')}
            className="px-8 py-4 text-lg"
          >
            {user ? 'Plan a trip' : 'Get started'} <ArrowRight size={20} />
          </Button>
        </div>
      </main>
    </div>
  );
}
