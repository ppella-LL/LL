import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, History, Package, ShoppingBag, X } from 'lucide-react';
import { useTripDraft } from '@/context/TripDraftContext';
import { useAuth } from '@/context/AuthContext';
import { StepHeader } from '@/components/ui/StepHeader';

export default function ServicePage() {
  const navigate = useNavigate();
  const { draft, setWardrobeMode, loadWardrobeFromTrip } = useTripDraft();
  const { trips } = useAuth();
  const [picking, setPicking] = useState(false);

  const options = [
    {
      mode: 'rent' as const,
      to: '/trip/rent',
      icon: ShoppingBag,
      title: 'Rent from catalog',
      body: `Browse premium items for max €8/trip. Delivered fresh to your ${draft.stayType.toLowerCase()}.`,
      cta: 'Explore collection',
      accent: true,
    },
    {
      mode: 'ship' as const,
      to: '/trip/ship',
      icon: Package,
      title: 'Ship your clothes',
      body: 'Send us your personal items once. We store, clean, and deliver them when you arrive.',
      cta: 'Set up storage',
      accent: false,
    },
  ];

  return (
    <div className="min-h-dvh bg-surface">
      <StepHeader title="Choose service" onBack={() => navigate('/trip/where')} />

      <main className="max-w-5xl mx-auto w-full p-6 lg:p-10">
        <div className="text-center mb-8 lg:mb-12">
          <p className="eyebrow text-brand mb-3">Step 2 · Your wardrobe</p>
          <h1 className="display-hero text-4xl lg:text-6xl text-content">
            How will you dress?
          </h1>
          <p className="text-content-soft font-medium mt-3 lg:text-lg">
            Pick the service that fits this trip. You can mix and match next time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-7">
          {options.map(({ mode, to, icon: Icon, title, body, cta, accent }) => (
            <button
              key={mode}
              onClick={() => {
                setWardrobeMode(mode);
                navigate(to);
              }}
              className={`group text-left relative overflow-hidden rounded-3xl p-7 lg:p-9 border-2 transition-all active:scale-[0.99] shadow-soft hover:shadow-soft-lg ${
                accent
                  ? 'bg-surface-2 border-transparent hover:border-brand'
                  : 'bg-ink text-ink-content border-transparent hover:border-content-faint/40'
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-48 h-48 rounded-bl-full transition-transform duration-500 group-hover:scale-110 ${
                  accent ? 'bg-brand-soft' : 'bg-white/5'
                }`}
              />
              <div
                className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  accent ? 'bg-brand-soft text-brand' : 'bg-white/10 text-ink-content'
                }`}
              >
                <Icon size={30} />
              </div>
              <h3
                className={`relative text-2xl lg:text-3xl font-black mb-2 ${
                  accent ? 'text-content' : 'text-ink-content'
                }`}
              >
                {title}
              </h3>
              <p
                className={`relative text-sm lg:text-base font-medium leading-relaxed mb-5 max-w-sm ${
                  accent ? 'text-content-soft' : 'text-ink-content/70'
                }`}
              >
                {body}
              </p>
              <span
                className={`relative inline-flex items-center gap-1.5 font-bold text-sm ${
                  accent ? 'text-brand' : 'text-ink-content'
                }`}
              >
                {cta}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </button>
          ))}
        </div>

        {/* Reuse a previous wardrobe (only when past trips exist) */}
        {trips.length > 0 && (
          <button
            onClick={() => setPicking(true)}
            className="mt-5 lg:mt-7 w-full flex items-center gap-4 bg-surface-2 border border-line/70 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all active:scale-[0.99] text-left"
          >
            <span className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <History size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-black text-content">Reuse a previous wardrobe</span>
              <span className="block text-sm text-content-soft font-medium">
                Pack the same way as a past trip in one tap
              </span>
            </span>
            <ArrowRight size={20} className="text-content-faint" />
          </button>
        )}
      </main>

      {picking && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setPicking(false)}
        >
          <div
            className="bg-surface-2 rounded-3xl p-6 w-full max-w-md shadow-soft-lg animate-fade-in-up max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-xl text-content">Reuse a wardrobe</h3>
              <button
                onClick={() => setPicking(false)}
                className="p-1.5 rounded-full text-content-faint hover:bg-surface-3"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    loadWardrobeFromTrip(t);
                    setPicking(false);
                    navigate('/trip/extras');
                  }}
                  className="w-full flex items-center justify-between gap-3 bg-surface-3/60 border border-line/70 rounded-xl p-4 hover:border-brand transition-colors text-left"
                >
                  <span className="min-w-0">
                    <span className="block font-bold text-content truncate">{t.destination}</span>
                    <span className="block text-xs text-content-faint font-medium">
                      {t.wardrobeMode} · {t.items?.length || 0} clothes
                      {t.essentials?.length ? ` · +${t.essentials.length} extras` : ''}
                    </span>
                  </span>
                  <ArrowRight size={18} className="text-brand shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
