import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building,
  Calendar,
  Check,
  Clock,
  Lock,
  MapPin,
  Package,
  Pencil,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Img } from '@/components/ui/Img';
import { MapView } from '@/components/MapView';
import { TripProgress } from '@/components/TripProgress';
import { TripInsightCarousel } from '@/components/TripInsightCarousel';
import { StepHeader } from '@/components/ui/StepHeader';
import { currentStepIndex } from '@/lib/tripStatus';
import type { RentedItem, ShippedItem } from '@/types';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, deleteTrip, updateTrip } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <div className="min-h-dvh bg-surface">
        <StepHeader title="Trip" onBack={() => navigate('/trips')} />
        <div className="p-10 text-center text-content-faint font-bold">Trip not found.</div>
      </div>
    );
  }

  const rented = trip.wardrobeMode === 'rent' ? (trip.items as RentedItem[]) : [];
  const shipped = trip.wardrobeMode === 'ship' ? (trip.items as ShippedItem[]) : [];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      navigate('/trips', { replace: true });
    } finally {
      setDeleting(false);
    }
  };

  // Buying is available only once the trip has ended (wardrobe collected).
  const tripEnded = currentStepIndex(trip) >= 5;
  const canBuy = trip.wardrobeMode === 'rent' && rented.length > 0;

  const buyItem = async (item: RentedItem) => {
    setBuying(item.id);
    try {
      const items = rented.map((i) => (i.id === item.id ? { ...i, purchased: true } : i));
      await updateTrip({ ...trip, items });
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="min-h-dvh bg-surface pb-10">
      <StepHeader
        title={trip.destination}
        onBack={() => navigate('/trips')}
        right={
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/trips/${trip.id}/edit`)}
              className="p-2 rounded-full text-content hover:bg-surface-3 transition-colors"
              aria-label="Edit trip"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
              aria-label="Delete trip"
            >
              <Trash2 size={18} />
            </button>
          </div>
        }
      />

      <main className="max-w-5xl mx-auto w-full p-6 lg:p-10 space-y-6 animate-fade-in-up">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          {/* Map + info */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-soft-lg h-56 lg:h-80">
              <MapView lat={Number(trip.lat)} lon={Number(trip.lon)} className="absolute inset-0" />
              <div className="absolute bottom-4 left-4 right-4 lg:max-w-xs flex items-center gap-3 bg-surface-2/90 backdrop-blur-md border border-line/60 px-4 py-3 rounded-2xl shadow-soft-lg pointer-events-none">
                <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-content-faint">
                    Destination
                  </span>
                  <span className="block font-black text-content truncate">{trip.destination}</span>
                </span>
              </div>
            </div>

            {/* Dynamic tracking: countdown + wardrobe journey timeline */}
            <TripProgress trip={trip} />

            <Card>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-semibold text-content-soft">
                <Info icon={Calendar} label="Check-in" value={`${trip.checkIn} · ${trip.checkInTime}`} />
                <Info icon={Calendar} label="Check-out" value={trip.checkOut} />
                <Info icon={Building} label="Stay" value={trip.stayType} />
                <Info icon={Clock} label="Status" value={trip.status} />
              </div>
            </Card>
          </div>

          {/* Wardrobe + rotating insights */}
          <div className="space-y-6">
          <Card>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-content">
              {trip.wardrobeMode === 'rent' ? (
                <ShoppingBag size={18} className="text-brand" />
              ) : (
                <Package size={18} className="text-brand" />
              )}
              {trip.wardrobeMode === 'rent' ? 'Rented wardrobe' : 'Your shipped items'}
            </h3>

            <div className="space-y-3">
              {rented.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-surface-3/60 p-2.5 rounded-xl border border-line/70">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-11 h-11 rounded-lg object-cover bg-surface-3" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate text-content">{item.name}</p>
                    <p className="text-xs text-content-faint">{item.style}</p>
                  </div>
                  <span className="font-black text-brand text-sm">€{item.price}</span>
                </div>
              ))}
              {shipped.map((item) => (
                <div key={item.id} className="bg-surface-3/60 p-3 rounded-xl border border-line/70">
                  <p className="font-bold text-sm capitalize text-content">
                    {item.color} {item.material}
                  </p>
                  <p className="text-xs text-content-faint mt-0.5">
                    Size: {item.size} {item.brand ? `• ${item.brand}` : ''}
                  </p>
                </div>
              ))}
            </div>

            {trip.essentials?.length > 0 && (
              <>
                <h4 className="font-black text-xs uppercase tracking-wider text-content-faint mt-6 mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-brand" /> Extras
                </h4>
                <div className="space-y-2">
                  {trip.essentials.map((e) => (
                    <div key={e.id} className="flex justify-between text-sm font-medium">
                      <span className="text-content-soft">{e.name}</span>
                      <span className="font-bold text-content">€{e.price}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button variant="outline" onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                <Pencil size={16} /> Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConfirming(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-red-500/20"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </Card>

          <TripInsightCarousel trip={trip} />
          </div>
        </div>

        {/* Buy your wardrobe — only for rented wardrobes */}
        {canBuy && (
          <section className="mt-6">
            {!tripEnded ? (
              // Banner explaining it's not buyable yet.
              <div className="flex items-start gap-4 bg-surface-2 border border-line/70 rounded-3xl p-5 shadow-soft">
                <span className="w-11 h-11 rounded-xl bg-surface-3 text-content-faint flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </span>
                <div>
                  <h3 className="font-black text-content">Keep what you love</h3>
                  <p className="text-content-soft text-sm font-medium mt-1">
                    After your trip ends, you'll be able to buy any rented item you fell for —
                    right here. We'll unlock it once the wardrobe is collected.
                  </p>
                </div>
              </div>
            ) : (
              <Card>
                <h3 className="font-black text-lg mb-1 flex items-center gap-2 text-content">
                  <ShoppingBag size={18} className="text-brand" /> Buy your wardrobe
                </h3>
                <p className="text-content-soft text-sm font-medium mb-4">
                  Loved something on this trip? Make it yours.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {rented.map((item) => {
                    const buyPrice = item.price * 3;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-surface-3/60 p-2.5 rounded-xl border border-line/70"
                      >
                        <Img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-surface-3 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm truncate text-content">{item.name}</p>
                          <p className="text-xs text-content-faint">{item.style}</p>
                        </div>
                        {item.purchased ? (
                          <span className="text-xs font-black text-green-600 bg-green-500/10 px-3 py-2 rounded-full border border-green-500/20 flex items-center gap-1 shrink-0">
                            <Check size={13} /> Owned
                          </span>
                        ) : (
                          <Button
                            onClick={() => buyItem(item)}
                            disabled={buying === item.id}
                            className="px-4 py-2 text-sm rounded-full shrink-0"
                          >
                            {buying === item.id ? '…' : `Buy €${buyPrice}`}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </section>
        )}
      </main>

      {/* Delete confirmation */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setConfirming(false)}>
          <div
            className="bg-surface-2 rounded-3xl p-6 w-full max-w-sm shadow-soft-lg animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="font-black text-xl text-content mb-1">Delete this trip?</h3>
            <p className="text-content-soft font-medium text-sm mb-6">
              This permanently removes {trip.destination} and its wardrobe. This can't be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setConfirming(false)} className="flex-1">
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

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-content-faint mt-0.5 shrink-0" />
      <span>
        <span className="block text-[10px] font-black uppercase tracking-wider text-content-faint">
          {label}
        </span>
        <span className="block text-content font-bold">{value}</span>
      </span>
    </div>
  );
}
