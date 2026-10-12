import type { Trip } from '@/types';

export interface JourneyStep {
  key: string;
  label: string;
}

/** The wardrobe journey, in order. */
export const JOURNEY_STEPS: JourneyStep[] = [
  { key: 'prepared', label: 'Wardrobe prepared' },
  { key: 'packed', label: 'Wardrobe packed' },
  { key: 'shipped', label: 'Wardrobe shipped' },
  { key: 'delivered', label: 'Wardrobe delivered' },
  { key: 'in_use', label: 'In use' },
  { key: 'collected', label: 'Wardrobe collected' },
];

/**
 * Derive the current journey step index purely from the trip dates (option A).
 * Timeline is time-based, so it advances on its own without a backend:
 *   - well before check-in  -> prepared/packed/shipped (ramp up over 3 days)
 *   - at/after check-in      -> delivered, then in use during the stay
 *   - after check-out        -> collected
 */
export function currentStepIndex(trip: Trip): number {
  const now = Date.now();
  const checkIn = new Date(`${trip.checkIn}T${trip.checkInTime || '14:00'}:00`).getTime();
  const checkOut = new Date(`${trip.checkOut}T12:00:00`).getTime();

  if (Number.isNaN(checkIn)) return 0;

  // After check-out -> collected (last step).
  if (!Number.isNaN(checkOut) && now >= checkOut) return 5;
  // During the stay -> in use.
  if (now >= checkIn) return 4;

  // Before check-in: ramp prepared -> delivered over the final 3 days.
  const msToCheckIn = checkIn - now;
  const day = 24 * 60 * 60 * 1000;
  if (msToCheckIn <= 0.5 * day) return 3; // delivered (same day)
  if (msToCheckIn <= 1 * day) return 2; // shipped
  if (msToCheckIn <= 2 * day) return 1; // packed
  return 0; // prepared
}
