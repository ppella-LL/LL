import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, HelpCircle, MapPin } from 'lucide-react';
import { useTripDraft } from '@/context/TripDraftContext';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { StepHeader } from '@/components/ui/StepHeader';
import { AddressSearch } from '@/components/AddressSearch';
import { MapView } from '@/components/MapView';
import type { StayType } from '@/types';

const STAY_TYPES: StayType[] = ['Hotel', 'Airbnb', 'Office'];

export default function WherePage() {
  const navigate = useNavigate();
  const { draft, setDraft } = useTripDraft();
  const canContinue = Boolean(draft.checkIn && draft.checkOut);

  const form = (
    <div className="space-y-6">
      <AddressSearch
        onSelect={(loc) => setDraft({ destination: loc.name, lat: loc.lat, lon: loc.lon })}
      />

      <div>
        <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
          Type of stay
        </label>
        <SegmentedControl
          options={STAY_TYPES}
          value={draft.stayType}
          onChange={(t) => setDraft({ stayType: t })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Check-in date"
          type="date"
          icon={<CalendarDays size={16} />}
          value={draft.checkIn}
          onChange={(e) => setDraft({ checkIn: e.target.value })}
        />
        <Field
          label="Check-in time"
          type="time"
          icon={<Clock size={16} />}
          value={draft.checkInTime}
          onChange={(e) => setDraft({ checkInTime: e.target.value })}
        />
      </div>

      <Field
        label="Check-out date"
        type="date"
        icon={<CalendarDays size={16} />}
        value={draft.checkOut}
        onChange={(e) => setDraft({ checkOut: e.target.value })}
      />
    </div>
  );

  const destinationChip = (
    <div className="flex items-center gap-3 bg-surface-2/90 backdrop-blur-md border border-line/60 px-4 py-3 rounded-2xl shadow-soft-lg">
      <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
        <MapPin size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-wider text-content-faint">
          Destination
        </span>
        <span className="block font-black text-content truncate leading-tight">
          {draft.destination}
        </span>
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <StepHeader
        title="Where to?"
        onBack={() => navigate('/dashboard')}
        right={
          <button
            onClick={() => navigate('/how-it-works')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-content-soft hover:text-brand transition-colors px-2 py-1 rounded-lg"
          >
            <HelpCircle size={16} /> <span className="hidden sm:inline">How it works</span>
          </button>
        }
      />

      {/* ===== Desktop: two columns (map + form). Mobile: stacked. ===== */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="hidden lg:block mb-7">
          <p className="eyebrow text-brand mb-2">Step 1 · Destination</p>
          <h1 className="display-tight text-4xl text-content">Plan your London stay</h1>
          <p className="text-content-soft font-medium mt-2">
            Pick where you'll be and when — we'll have your wardrobe ready.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Map panel */}
          <div className="relative rounded-3xl overflow-hidden shadow-soft-lg h-56 sm:h-72 lg:h-[560px] bg-surface-3">
            <MapView lat={Number(draft.lat)} lon={Number(draft.lon)} className="absolute inset-0" />
            <div className="absolute bottom-4 left-4 right-4 lg:left-6 lg:right-auto lg:max-w-sm pointer-events-none">
              {destinationChip}
            </div>
          </div>

          {/* Form panel */}
          <div className="lg:bg-surface-2 lg:border lg:border-line/70 lg:rounded-3xl lg:shadow-soft lg:p-7">
            {form}
            <Button
              className="w-full mt-8 py-4 text-lg"
              disabled={!canContinue}
              onClick={() => navigate('/trip/service')}
            >
              Continue to wardrobe <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
