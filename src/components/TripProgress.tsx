import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { JOURNEY_STEPS, currentStepIndex } from '@/lib/tripStatus';
import type { Trip } from '@/types';

/** Big dynamic countdown + delivery progress bar for the trip tracking view. */
export function TripProgress({ trip }: { trip: Trip }) {
  const [, force] = useState(0);
  const stepIndex = currentStepIndex(trip);

  // Re-render every minute so the countdown stays live.
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(`${trip.checkIn}T${trip.checkInTime || '14:00'}:00`).getTime();
  const distance = target - Date.now();
  let countdown: string;
  if (Number.isNaN(target)) countdown = '—';
  else if (distance <= 0) countdown = stepIndex >= 5 ? 'Completed' : 'In progress';
  else {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    countdown = days > 0 ? `${days}d ${hours}h` : `${hours}h ${mins}m`;
  }

  const pct = Math.round((stepIndex / (JOURNEY_STEPS.length - 1)) * 100);

  return (
    <div className="bg-ink text-ink-content rounded-3xl p-6 shadow-soft">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-brand mb-1">
            {distance > 0 ? 'Delivery in' : 'Status'}
          </p>
          <p className="text-4xl font-black leading-none">{countdown}</p>
        </div>
        <p className="text-sm font-bold text-ink-content/60">
          {JOURNEY_STEPS[stepIndex].label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-6">
        <div
          className="h-full bg-brand rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>

      {/* Vertical timeline of steps */}
      <ol className="space-y-0">
        {JOURNEY_STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          const last = i === JOURNEY_STEPS.length - 1;
          return (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-colors ${
                    done
                      ? 'bg-brand text-white'
                      : active
                        ? 'bg-brand text-white ring-4 ring-brand/30'
                        : 'bg-white/10 text-ink-content/50'
                  }`}
                >
                  {done ? <Check size={13} /> : i + 1}
                </span>
                {!last && (
                  <span
                    className={`w-0.5 flex-1 min-h-[18px] ${
                      done ? 'bg-brand' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-sm font-bold pb-4 ${
                  active ? 'text-ink-content' : done ? 'text-ink-content/80' : 'text-ink-content/45'
                }`}
              >
                {step.label}
                {active && (
                  <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-brand">
                    now
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
