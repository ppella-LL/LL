import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, CheckCircle, Home, Package } from 'lucide-react';
import { useTripDraft } from '@/context/TripDraftContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepHeader } from '@/components/ui/StepHeader';
import { STORAGE_FEE } from '@/data/catalog';

const EMPTY = { size: '', color: '', material: '', brand: '' };

export default function ShipPage() {
  const navigate = useNavigate();
  const { shippedItems, addShippedItem } = useTripDraft();
  const { profile, saveProfile } = useAuth();
  const [newItem, setNewItem] = useState(EMPTY);
  const [address, setAddress] = useState(profile?.address ?? '');

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    addShippedItem({ id: Date.now().toString(), ...newItem });
    setNewItem(EMPTY);
  };

  const goNext = async () => {
    // Persist the pickup address to the profile so it's reused next time.
    if (profile && address.trim() && address.trim() !== (profile.address ?? '')) {
      try {
        await saveProfile({ ...profile, address: address.trim() });
      } catch {
        /* non-blocking */
      }
    }
    navigate('/trip/extras');
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      <StepHeader title="Inventory setup" onBack={() => navigate('/trip/service')} />

      <main className="max-w-6xl mx-auto w-full p-6 lg:p-10">
        <div className="hidden lg:block mb-6">
          <h1 className="text-3xl font-black tracking-tight text-content">Ship your wardrobe</h1>
          <p className="text-content-soft font-medium mt-1">
            Catalog each item once — we store, clean, and deliver it on arrival.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Left: how-to + add form */}
          <div className="space-y-6">
            <div className="bg-brand-soft border border-brand/20 rounded-2xl p-5">
              <h3 className="font-black text-brand mb-3 flex items-center gap-2">
                <Package size={18} /> How to ship
              </h3>
              <ul className="text-sm text-content-soft space-y-2 font-medium">
                {[
                  'Take a clear picture of each item.',
                  'Fill details below for our inventory system.',
                  'Print the FedEx label provided after checkout.',
                ].map((text) => (
                  <li key={text} className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <form
              onSubmit={handleAdd}
              className="bg-surface-2 p-6 rounded-2xl shadow-soft border border-line/70"
            >
              <div className="w-full h-36 border-2 border-dashed border-line rounded-xl mb-6 flex flex-col items-center justify-center text-content-faint bg-surface-3/50 cursor-pointer hover:bg-surface-3 hover:border-brand transition-colors group">
                <Camera size={32} className="mb-2 group-hover:text-brand transition-colors" />
                <span className="text-sm font-bold group-hover:text-brand transition-colors">
                  Tap to upload photo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Size"
                  value={newItem.size}
                  onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                  placeholder="e.g. M, 32"
                  required
                />
                <Input
                  label="Color"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                  placeholder="e.g. Navy"
                  required
                />
                <Input
                  label="Material"
                  value={newItem.material}
                  onChange={(e) => setNewItem({ ...newItem, material: e.target.value })}
                  placeholder="e.g. Wool"
                  required
                />
                <Input
                  label="Brand (opt)"
                  value={newItem.brand}
                  onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                  placeholder="e.g. Boss"
                />
              </div>

              <Button type="submit" variant="outline" className="w-full mt-2">
                Add to box
              </Button>
            </form>

            <div className="bg-surface-2 p-6 rounded-2xl shadow-soft border border-line/70">
              <h3 className="font-black text-base mb-4 flex items-center gap-2 text-content">
                <Home size={18} className="text-brand" /> Pickup address
              </h3>
              <Input
                label="Where should we collect your box?"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, number, city, postcode"
                className="mb-0"
              />
              <p className="text-xs text-content-faint font-medium mt-2">
                Saved to your profile for next time.
              </p>
            </div>
          </div>

          {/* Right: items in box */}
          <div>
            <h3 className="font-black mb-4 uppercase text-xs tracking-wider text-content-faint">
              Items in box ({shippedItems.length})
            </h3>
            {shippedItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line p-10 text-center text-content-faint font-medium bg-surface-2/50">
                <Package size={28} className="mx-auto mb-3 opacity-60" />
                Add your first item to build the box.
              </div>
            ) : (
              <div className="space-y-3">
                {shippedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-2 p-4 rounded-xl border border-line/70 shadow-soft flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold capitalize text-content">
                        {item.color} {item.material}
                      </p>
                      <p className="text-xs text-content-faint font-medium mt-0.5">
                        Size: {item.size} {item.brand ? `• ${item.brand}` : ''}
                      </p>
                    </div>
                    <CheckCircle className="text-brand" size={20} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-line/70 p-4 pb-safe shadow-soft-lg z-20">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <div>
            <p className="text-[11px] text-content-faint uppercase font-black tracking-wider">
              Storage fee
            </p>
            <p className="text-2xl font-black text-content">
              €{STORAGE_FEE}
              <span className="text-sm text-content-faint font-medium">/mo</span>
            </p>
          </div>
          <Button onClick={goNext} disabled={shippedItems.length === 0} className="px-8">
            Next <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
