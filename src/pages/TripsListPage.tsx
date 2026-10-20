import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Building,
  Calendar,
  Check,
  Eye,
  MapPin,
  Pencil,
  PlaneTakeoff,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { MapView } from '@/components/MapView';
import { LondonCarousel } from '@/components/LondonCarousel';
import type { RentedItem } from '@/types';

export default function TripsListPage() {
  const navigate = useNavigate();
  const { trips, deleteTrip } = useAuth();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmTrip = trips.find((t) => t.id === confirmId) ?? null;

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteTrip(confirmId);
      setConfirmId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-surface">
      <header className="px-6 lg:px-10 pt-8 pb-2 max-w-6xl mx-auto w-full">
        <p className="eyebrow text-brand mb-2">Your journeys</p>
        <h1 className="display-hero text-4xl lg:text-5xl text-content">Your trips</h1>
        <p className="text-content-soft font-medium mt-2">
          {trips.length > 0
            ? `${trips.length} upcoming ${trips.length === 1 ? 'trip' : 'trips'}`
            : 'Your next adventures will show up here'}
        </p>
      </header>

      <main className="px-6 lg:px-10 pt-4 max-w-6xl mx-auto w-full animate-fade-in-up">
        {trips.length === 0 ? (
          <EmptyState onPlan={() => navigate('/trip/where')} />
        ) : (
          <div
            className={`grid gap-6 ${
              trips.length === 1
                ? 'grid-cols-1'
                : trips.length === 2
                  ? 'sm:grid-cols-2'
                  : 'sm:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {trips.map((trip) => {
              const lat = Number(trip.lat || 51.5074);
              const lon = Number(trip.lon || -0.1278);
              const rentedItems =
                trip.wardrobeMode === 'rent' ? (trip.items as RentedItem[]) : [];
              const ownedCount = rentedItems.filter((i) => i.purchased).length;

              // A lone trip spans the full width, so lay it out horizontally
              // (map beside details) instead of a tall, half-empty column.
              const wide = trips.length === 1;

              return (
                <Card
                  key={trip.id}
                  className={`p-0 overflow-hidden ${wide ? 'md:grid md:grid-cols-2' : ''}`}
                >
                  {/* Map side (with destination overlay when wide) */}
                  <div
                    className={`relative ${
                      wide ? 'min-h-[260px] md:min-h-full' : 'h-40 border-b border-line/70'
                    }`}
                  >
                    <MapView lat={lat} lon={lon} interactive={false} zoom={12} className="absolute inset-0" />
                    {wide && (
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
                        <div className="bg-surface-2/90 backdrop-blur-md border border-line/60 px-4 py-2.5 rounded-xl shadow-soft">
                          <div className="text-brand font-black text-[10px] uppercase tracking-widest">
                            {trip.status}
                          </div>
                          <div className="font-black text-content leading-tight">
                            {trip.destination}
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-ink text-ink-content rounded-full flex items-center justify-center shrink-0 shadow-soft">
                          <PlaneTakeoff size={18} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details side */}
                  <div className={wide ? '' : ''}>
                    {!wide && (
                      <div className="bg-ink text-ink-content p-5 flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-brand font-black text-xs uppercase tracking-widest mb-1">
                            {trip.status}
                          </div>
                          <div className="font-black text-xl truncate max-w-[220px] leading-tight">
                            {trip.destination}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20 relative z-10">
                          <PlaneTakeoff size={20} />
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand/20 rounded-full blur-2xl" />
                      </div>
                    )}

                    <div className="p-5 space-y-4">
                    {trip.checkIn && (
                      <div className="flex justify-between items-center bg-brand-soft p-3.5 rounded-xl border border-brand/20">
                        <span className="font-black text-sm text-brand uppercase tracking-wider">
                          Delivery in
                        </span>
                        <CountdownTimer targetDate={`${trip.checkIn}T${trip.checkInTime}:00`} />
                      </div>
                    )}
                    <div className="space-y-2 text-sm font-semibold text-content-soft">
                      <p className="flex items-center gap-3">
                        <Calendar size={18} className="text-content-faint" /> {trip.checkIn} to{' '}
                        {trip.checkOut}
                      </p>
                      <p className="flex items-center gap-3">
                        <Building size={18} className="text-content-faint" /> {trip.stayType}{' '}
                        delivery at {trip.checkInTime}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-line flex flex-wrap gap-2">
                      <span className="uppercase text-[10px] font-black text-ink-content bg-ink px-3 py-1.5 rounded-full">
                        {trip.wardrobeMode}
                      </span>
                      <span className="uppercase text-[10px] font-black text-content bg-surface-3 px-3 py-1.5 rounded-full border border-line">
                        {trip.items?.length || 0} clothes
                      </span>
                      {trip.essentials?.length > 0 && (
                        <span className="uppercase text-[10px] font-black text-brand bg-brand-soft border border-brand/20 px-3 py-1.5 rounded-full">
                          +{trip.essentials.length} extras
                        </span>
                      )}
                    </div>

                    {/* Actions: view / edit / delete */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        className="py-2.5 text-sm"
                      >
                        <Eye size={16} /> View
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/trips/${trip.id}/edit`)}
                        className="py-2.5 text-sm"
                      >
                        <Pencil size={16} /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setConfirmId(trip.id)}
                        className="py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-red-500/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    {ownedCount > 0 && (
                      <div className="pt-4 border-t border-dashed border-line flex items-center gap-2 text-sm font-bold text-green-600">
                        <Check size={15} /> {ownedCount} item{ownedCount > 1 ? 's' : ''} owned
                      </div>
                    )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      {confirmTrip && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="bg-surface-2 rounded-3xl p-6 w-full max-w-sm shadow-soft-lg animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="font-black text-xl text-content mb-1">Delete this trip?</h3>
            <p className="text-content-soft font-medium text-sm mb-6">
              This permanently removes {confirmTrip.destination} and its wardrobe. This can't be
              undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirmId(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 shadow-none"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Rich empty state: a London hero that invites planning the first trip. */
function EmptyState({ onPlan }: { onPlan: () => void }) {
  return (
    <button
      onClick={onPlan}
      className="group relative w-full text-left rounded-3xl overflow-hidden shadow-soft-lg min-h-[380px] lg:min-h-[460px] flex flex-col justify-end active:scale-[0.99] transition-transform"
    >
      <LondonCarousel />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* floating plane badge */}
      <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
        <PlaneTakeoff size={26} />
      </div>

      <div className="relative z-10 p-7 lg:p-10">
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white eyebrow px-3 py-1.5 rounded-full border border-white/20 mb-4">
          <MapPin size={12} /> No trips yet
        </div>
        <h2 className="display-hero text-white text-4xl lg:text-6xl mb-3">
          Your closet
          <br />
          waits in London.
        </h2>
        <p className="text-white/80 text-sm lg:text-base font-medium mb-6 max-w-md">
          Plan your first trip and we'll have a fresh wardrobe ready at your room. Zero luggage.
        </p>
        <span className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3.5 rounded-xl shadow-glow group-hover:bg-brand-dark transition-colors">
          Plan a trip
          <ArrowUpRight
            size={18}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </span>
      </div>
    </button>
  );
}
