import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTripDraft } from '@/context/TripDraftContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { StepHeader } from '@/components/ui/StepHeader';
import { STORAGE_FEE } from '@/data/catalog';
import type { RentedItem, ShippedItem, Trip } from '@/types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { addTrip } = useAuth();
  const { draft, wardrobeMode, cart, shippedItems, essentialsCart, reset } = useTripDraft();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const wardrobeTotal = useMemo(
    () => (wardrobeMode === 'rent' ? cart.reduce((s, i) => s + i.price, 0) : STORAGE_FEE),
    [wardrobeMode, cart],
  );
  const essentialsTotal = useMemo(
    () => essentialsCart.reduce((s, i) => s + i.price, 0),
    [essentialsCart],
  );
  const finalTotal = wardrobeTotal + essentialsTotal;

  const completeCheckout = async () => {
    if (!wardrobeMode) return;
    setBusy(true);
    setError('');

    const items: RentedItem[] | ShippedItem[] =
      wardrobeMode === 'rent'
        ? cart.map((i) => ({ ...i, purchased: false }))
        : shippedItems;

    const newTrip: Omit<Trip, 'id'> = {
      destination: draft.destination,
      stayType: draft.stayType,
      checkIn: draft.checkIn,
      checkInTime: draft.checkInTime,
      checkOut: draft.checkOut,
      lat: draft.lat,
      lon: draft.lon,
      wardrobeMode,
      items,
      essentials: essentialsCart,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    try {
      await addTrip(newTrip);
      reset();
      navigate('/trips', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-10">
      <StepHeader title="Checkout" onBack={() => navigate('/trip/extras')} />

      <main className="max-w-5xl mx-auto w-full p-6 lg:p-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Summary */}
          <Card className="overflow-hidden p-0">
            <div className="p-6 bg-ink text-ink-content">
              <h3 className="font-black text-xl mb-4 text-brand">Trip summary</h3>
              <div className="space-y-3 text-sm font-semibold">
                <p className="flex justify-between gap-4">
                  <span className="text-ink-content/60">Destination</span>
                  <span className="text-right">{draft.destination}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-ink-content/60">Dates</span>
                  <span className="text-right">
                    {draft.checkIn} to {draft.checkOut}
                  </span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-ink-content/60">Delivery</span>
                  <span className="text-right">
                    {draft.stayType} by {draft.checkInTime}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-black text-lg mb-4 border-b border-line pb-3 flex items-center justify-between text-content">
                Wardrobe ({wardrobeMode})
                <span className="text-sm font-bold text-content-faint">€{wardrobeTotal}</span>
              </h3>
              <div className="space-y-3 mb-6">
                {wardrobeMode === 'rent'
                  ? cart.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm font-medium">
                        <span className="truncate pr-4 text-content-soft">{i.name}</span>
                        <span className="font-bold text-content">€{i.price}</span>
                      </div>
                    ))
                  : shippedItems.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm font-medium">
                        <span className="capitalize text-content-soft">
                          {i.color} {i.material}
                        </span>
                        <span className="text-content-faint">Included</span>
                      </div>
                    ))}
              </div>

              {essentialsCart.length > 0 && (
                <>
                  <h3 className="font-black text-lg mb-4 border-b border-line pb-3 flex items-center justify-between text-content">
                    Extras
                    <span className="text-sm font-bold text-content-faint">€{essentialsTotal}</span>
                  </h3>
                  <div className="space-y-3 mb-6">
                    {essentialsCart.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm font-medium">
                        <span className="truncate pr-4 text-content-soft">{i.name}</span>
                        <span className="font-bold text-content">€{i.price}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-4 border-t-2 border-content font-black text-2xl mt-4 text-content">
                <span>Total</span>
                <span className="text-brand">€{finalTotal}</span>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card className="lg:sticky lg:top-24">
            <h3 className="font-black text-xl mb-5 text-content">Payment</h3>
            <Input label="Card number" placeholder="•••• •••• •••• ••••" className="mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry" placeholder="MM/YY" />
              <Input label="CVC" type="password" placeholder="•••" />
            </div>
            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm font-bold mt-4 border border-red-500/20">
                {error}
              </div>
            )}
            <Button onClick={completeCheckout} disabled={busy} className="w-full mt-6 py-4 text-lg">
              {busy ? 'Processing…' : `Pay €${finalTotal}`}
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
