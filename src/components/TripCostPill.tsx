import { useTripDraft } from '@/context/TripDraftContext';

/** Compact running-total pill for the trip-planning flow header. */
export function TripCostPill() {
  const { tripTotal } = useTripDraft();
  if (tripTotal <= 0) return null;
  return (
    <span className="inline-flex items-baseline gap-1 bg-ink text-ink-content px-3 py-1.5 rounded-full shadow-soft">
      <span className="eyebrow opacity-60 text-[10px]">Trip</span>
      <span className="font-black text-sm">€{tripTotal}</span>
    </span>
  );
}
