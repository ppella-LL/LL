import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, CheckCircle, Clock, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { StepHeader } from '@/components/ui/StepHeader';
import { ESSENTIALS_ITEMS } from '@/data/catalog';
import type { EssentialItem, StayType, Trip } from '@/types';

const STAY_TYPES: StayType[] = ['Hotel', 'Airbnb', 'Office'];

export default function TripEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, updateTrip } = useAuth();
  const original = trips.find((t) => t.id === id);

  const [draft, setDraft] = useState<Trip | null>(original ?? null);
  const [saving, setSaving] = useState(false);

  const essentialIds = useMemo(
    () => new Set((draft?.essentials ?? []).map((e) => e.id)),
    [draft],
  );

  if (!original || !draft) {
    return (
      <div className="min-h-dvh bg-surface">
        <StepHeader title="Edit trip" onBack={() => navigate('/trips')} />
        <div className="p-10 text-center text-content-faint font-bold">Trip not found.</div>
      </div>
    );
  }

  const update = (patch: Partial<Trip>) => setDraft({ ...draft, ...patch });

  const toggleExtra = (item: EssentialItem) => {
    const has = essentialIds.has(item.id);
    update({
      essentials: has
        ? draft.essentials.filter((e) => e.id !== item.id)
        : [...draft.essentials, item],
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateTrip(draft);
      navigate(`/trips/${draft.id}`, { replace: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface pb-10">
      <StepHeader title="Edit trip" onBack={() => navigate(`/trips/${draft.id}`)} />

      <main className="max-w-3xl mx-auto w-full p-6 lg:p-10 space-y-6 animate-fade-in-up">
        <Card>
          <h3 className="font-black text-lg mb-5 text-content">Trip details</h3>
          <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
            Type of stay
          </label>
          <SegmentedControl
            options={STAY_TYPES}
            value={draft.stayType}
            onChange={(t) => update({ stayType: t })}
            className="mb-5"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Check-in date"
              type="date"
              icon={<CalendarDays size={16} />}
              value={draft.checkIn}
              onChange={(e) => update({ checkIn: e.target.value })}
            />
            <Field
              label="Check-in time"
              type="time"
              icon={<Clock size={16} />}
              value={draft.checkInTime}
              onChange={(e) => update({ checkInTime: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <Field
              label="Check-out date"
              type="date"
              icon={<CalendarDays size={16} />}
              value={draft.checkOut}
              onChange={(e) => update({ checkOut: e.target.value })}
            />
          </div>
          <p className="text-xs text-content-faint font-medium mt-4">
            Need a different wardrobe? Book a new trip — you'll be able to reuse this one's wardrobe.
          </p>
        </Card>

        <Card>
          <h3 className="font-black text-lg mb-4 text-content">Travel extras</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ESSENTIALS_ITEMS.map((item) => {
              const inCart = essentialIds.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleExtra(item)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    inCart ? 'border-brand bg-brand-soft' : 'border-line bg-surface-3/50 hover:border-content-faint/50'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      inCart ? 'bg-brand text-white' : 'bg-surface-2 text-content-faint'
                    }`}
                  >
                    {inCart ? <CheckCircle size={16} /> : <Plus size={16} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-content truncate">{item.name}</span>
                    <span className="block text-xs text-brand font-black">€{item.price}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/trips/${draft.id}`)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={save} disabled={saving} className="flex-1">
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </main>
    </div>
  );
}
