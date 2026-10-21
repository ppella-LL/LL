import { useNavigate } from 'react-router-dom';
import { Check, Clock, PackageCheck, Shield, Umbrella } from 'lucide-react';
import { StepHeader } from '@/components/ui/StepHeader';

const COVER = [
  {
    icon: Umbrella,
    title: 'Every shipment is insured',
    body: 'Clothes you send us are covered up to €1,500 per box from the moment our courier scans them to the moment they return to you.',
  },
  {
    icon: PackageCheck,
    title: 'Lost in transit',
    body: "If a shipment is lost, we refund the item's declared value within 14 days and cover the return shipping on your next trip — no questions asked.",
  },
  {
    icon: Shield,
    title: 'Damaged while in our care',
    body: 'If we damage one of your own garments, we repair it with a specialist partner or reimburse its declared value, your choice.',
  },
  {
    icon: Clock,
    title: 'Rented items, honest wear',
    body: 'Normal wear on rented pieces is on us. Accidental damage is capped at €15 per item; anything beyond that we simply retire the piece.',
  },
];

const HOW = [
  'Report it from your trip page within 7 days of return.',
  'Add a photo and a short note — that is all we need to start.',
  'We respond within 48 hours with a repair, replacement or refund.',
];

export default function PolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-surface">
      <StepHeader title="Lost or damaged" onBack={() => navigate(-1)} />

      <main className="max-w-4xl mx-auto w-full p-6 lg:p-10 animate-fade-in-up">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 bg-brand-soft text-brand eyebrow px-3 py-1.5 rounded-full mb-4">
            <Shield size={14} /> Peace of mind, included
          </span>
          <h1 className="display-hero text-4xl lg:text-6xl text-content">
            You're covered.
          </h1>
          <p className="text-content-soft font-medium mt-3 lg:text-lg max-w-xl">
            Travelling light shouldn't mean travelling worried. Here's our promise on
            lost or damaged clothes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {COVER.map((c) => (
            <div
              key={c.title}
              className="bg-surface-2 border border-line/70 rounded-3xl p-6 shadow-soft"
            >
              <span className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-4">
                <c.icon size={24} />
              </span>
              <h3 className="font-black text-lg text-content mb-1">{c.title}</h3>
              <p className="text-content-soft text-sm font-medium leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-ink text-ink-content rounded-3xl p-6 lg:p-8">
          <h3 className="font-black text-lg mb-5">How to file a claim</h3>
          <ol className="space-y-4">
            {HOW.map((step, i) => (
              <li key={step} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center font-black text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="text-ink-content/90 font-medium">{step}</span>
              </li>
            ))}
          </ol>
          <p className="flex items-center gap-2 text-sm text-ink-content/70 font-medium mt-5 pt-5 border-t border-white/10">
            <Check size={15} className="text-brand" /> Full terms available at checkout and in
            your account.
          </p>
        </div>
      </main>
    </div>
  );
}
