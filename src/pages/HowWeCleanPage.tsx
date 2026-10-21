import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Droplets,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wind,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StepHeader } from '@/components/ui/StepHeader';

const STEPS = [
  {
    icon: ScanLine,
    title: 'Inspect & tag',
    body: 'Every item is checked for quality on return and retired the moment it shows wear. Each garment carries a traceable ID and cycle count.',
  },
  {
    icon: Thermometer,
    title: 'Deep sanitise',
    body: 'Washed at 60°C with hospital-grade, hypoallergenic detergent that neutralises 99.9% of bacteria while protecting fabric and colour.',
  },
  {
    icon: Wind,
    title: 'Ozone & steam',
    body: 'A dry ozone cabinet plus professional steam press removes odours and allergens, then finishes every piece crisp and ready to wear.',
  },
  {
    icon: Droplets,
    title: 'Seal & deliver',
    body: 'Items are vacuum-sealed in recyclable packaging and only opened in your room — so what you wear is untouched since sanitising.',
  },
];

const CERTS = ['OEKO-TEX® Standard 100', 'ISO 9001 Quality', 'Hygiene-Tested Certified'];

export default function HowWeCleanPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-surface">
      <StepHeader title="How we clean" onBack={() => navigate(-1)} />

      <main className="max-w-4xl mx-auto w-full p-6 lg:p-10 animate-fade-in-up">
        <div className="text-center mb-10 lg:mb-14">
          <span className="inline-flex items-center gap-1.5 bg-brand-soft text-brand eyebrow px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> Freshly pressed, every time
          </span>
          <h1 className="display-hero text-4xl lg:text-6xl text-content">
            Cleaner than
            <br />
            your own closet.
          </h1>
          <p className="text-content-soft font-medium mt-3 lg:text-lg max-w-xl mx-auto">
            Four steps, zero compromises. Here's exactly what happens between one
            traveller and the next.
          </p>
        </div>

        {/* Steps */}
        <ol className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="relative bg-surface-2 border border-line/70 rounded-3xl p-6 shadow-soft"
            >
              <span className="absolute top-5 right-6 display-tight text-5xl text-brand/15">
                {i + 1}
              </span>
              <span className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-4">
                <s.icon size={24} />
              </span>
              <h3 className="font-black text-lg text-content mb-1">{s.title}</h3>
              <p className="text-content-soft text-sm font-medium leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* Certifications */}
        <div className="mt-8 bg-ink text-ink-content rounded-3xl p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={20} className="text-brand" />
            <h3 className="font-black text-lg">Certified & accountable</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {CERTS.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm font-bold"
              >
                <ShieldCheck size={15} className="text-brand" /> {c}
              </span>
            ))}
          </div>
          <p className="text-ink-content/70 text-sm font-medium mt-5">
            Independent labs audit our process quarterly. Every garment's full cleaning
            history is available on request.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate('/how-it-works')} variant="outline" className="rounded-full">
            See how it works <ArrowRight size={18} />
          </Button>
        </div>
      </main>
    </div>
  );
}
