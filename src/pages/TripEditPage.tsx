import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Clock,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Img } from '@/components/ui/Img';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { StepHeader } from '@/components/ui/StepHeader';
import {
  CATALOG_ITEMS,
  CATEGORIES,
  ESSENTIALS_ITEMS,
  ESSENTIAL_CATEGORIES,
  STYLES,
} from '@/data/catalog';
import type {
  EssentialItem,
  RentedItem,
  ShippedItem,
  StayType,
  Trip,
} from '@/types';

const STAY_TYPES: StayType[] = ['Hotel', 'Airbnb', 'Office'];
const EMPTY_SHIP = { size: '', color: '', material: '', brand: '' };

export default function TripEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, updateTrip } = useAuth();
  const original = trips.find((t) => t.id === id);

  const [draft, setDraft] = useState<Trip | null>(original ?? null);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<'wardrobe' | 'essentials' | null>(null);

  // Catalog editing state (rent) / shipped item form (ship).
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [activeStyle, setActiveStyle] = useState<string>('All');
  const [newShip, setNewShip] = useState(EMPTY_SHIP);

  const essentialIds = useMemo(
    () => new Set((draft?.essentials ?? []).map((e) => e.id)),
    [draft],
  );
  const wardrobeIds = useMemo(
    () => new Set((draft?.items ?? []).map((i) => i.id)),
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
    update({
      essentials: essentialIds.has(item.id)
        ? draft.essentials.filter((e) => e.id !== item.id)
        : [...draft.essentials, item],
    });
  };

  // Rent: toggle a catalog item in the wardrobe (preserve purchased flag shape).
  const toggleWardrobe = (item: RentedItem | (typeof CATALOG_ITEMS)[number]) => {
    const items = draft.items as RentedItem[];
    if (wardrobeIds.has(item.id)) {
      update({ items: items.filter((i) => i.id !== item.id) });
    } else {
      update({ items: [...items, { ...item, purchased: false }] });
    }
  };

  // Ship: add / remove a manually described item.
  const addShipItem = (e: FormEvent) => {
    e.preventDefault();
    const items = draft.items as ShippedItem[];
    update({ items: [...items, { id: Date.now().toString(), ...newShip }] });
    setNewShip(EMPTY_SHIP);
  };
  const removeShipItem = (itemId: string) => {
    update({ items: (draft.items as ShippedItem[]).filter((i) => i.id !== itemId) });
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

  const filteredCatalog = CATALOG_ITEMS.filter(
    (i) => i.category === activeCategory && (activeStyle === 'All' || i.style === activeStyle),
  );
  const isRent = draft.wardrobeMode === 'rent';

  return (
    <div className="min-h-dvh bg-surface pb-10">
      <StepHeader title="Edit trip" onBack={() => navigate(`/trips/${draft.id}`)} />

      <main className="max-w-3xl mx-auto w-full p-6 lg:p-10 space-y-6 animate-fade-in-up">
        {/* Summary / details */}
        <Card>
          <h3 className="font-black text-lg mb-5 text-content">Trip details</h3>
          <label className="block eyebrow text-content-faint mb-2">Type of stay</label>
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
        </Card>

        {/* Wardrobe (collapsible) */}
        <Card className="p-0 overflow-hidden">
          <button
            onClick={() => setOpen(open === 'wardrobe' ? null : 'wardrobe')}
            className="w-full flex items-center gap-3 p-5 text-left"
          >
            <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              {isRent ? <ShoppingBag size={18} /> : <Package size={18} />}
            </span>
            <span className="flex-1">
              <span className="block font-black text-content">Wardrobe</span>
              <span className="block text-sm text-content-soft font-medium">
                {draft.items.length} {draft.items.length === 1 ? 'item' : 'items'} ·{' '}
                {isRent ? 'rented' : 'shipped'}
              </span>
            </span>
            <ChevronDown
              size={20}
              className={`text-content-faint transition-transform ${open === 'wardrobe' ? 'rotate-180' : ''}`}
            />
          </button>

          {open === 'wardrobe' && (
            <div className="px-5 pb-5 border-t border-line/70 pt-5">
              {isRent ? (
                <>
                  <div className="flex overflow-x-auto gap-2 no-scrollbar mb-3">
                    {STYLES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setActiveStyle(s)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold text-xs border transition-colors ${
                          activeStyle === s
                            ? 'bg-ink text-ink-content border-transparent'
                            : 'bg-surface-2 text-content-soft border-line'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex overflow-x-auto gap-2 no-scrollbar mb-4">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveCategory(c.id)}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${
                          activeCategory === c.id
                            ? 'bg-brand text-white'
                            : 'bg-surface-3 text-content-soft'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                    {filteredCatalog.map((item) => {
                      const inCart = wardrobeIds.has(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleWardrobe(item)}
                          className="relative flex flex-col bg-surface-3/50 rounded-xl overflow-hidden border border-line/70"
                        >
                          <div className="relative aspect-[4/5] bg-surface-3">
                            <Img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <span
                              className={`absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-soft ${
                                inCart ? 'bg-brand text-white' : 'bg-surface-2/90 text-content'
                              }`}
                            >
                              {inCart ? <CheckCircle size={15} /> : <Plus size={15} />}
                            </span>
                          </div>
                          <span className="p-1.5 text-left">
                            <span className="block text-[11px] font-bold text-content truncate">
                              {item.name}
                            </span>
                            <span className="block text-brand font-black text-xs">€{item.price}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <form onSubmit={addShipItem} className="grid grid-cols-2 gap-3 mb-4">
                    <Input
                      label="Size"
                      value={newShip.size}
                      onChange={(e) => setNewShip({ ...newShip, size: e.target.value })}
                      placeholder="M"
                      required
                      className="mb-0"
                    />
                    <Input
                      label="Color"
                      value={newShip.color}
                      onChange={(e) => setNewShip({ ...newShip, color: e.target.value })}
                      placeholder="Navy"
                      required
                      className="mb-0"
                    />
                    <Input
                      label="Material"
                      value={newShip.material}
                      onChange={(e) => setNewShip({ ...newShip, material: e.target.value })}
                      placeholder="Wool"
                      required
                      className="mb-0"
                    />
                    <Input
                      label="Brand"
                      value={newShip.brand}
                      onChange={(e) => setNewShip({ ...newShip, brand: e.target.value })}
                      placeholder="Boss"
                      className="mb-0"
                    />
                    <Button type="submit" variant="outline" className="col-span-2">
                      <Plus size={16} /> Add item
                    </Button>
                  </form>
                  <div className="space-y-2">
                    {(draft.items as ShippedItem[]).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-surface-3/60 p-3 rounded-xl border border-line/70"
                      >
                        <span className="min-w-0">
                          <span className="block font-bold text-sm capitalize text-content truncate">
                            {item.color} {item.material}
                          </span>
                          <span className="block text-xs text-content-faint">
                            Size {item.size} {item.brand ? `• ${item.brand}` : ''}
                          </span>
                        </span>
                        <button
                          onClick={() => removeShipItem(item.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Essentials (collapsible) */}
        <Card className="p-0 overflow-hidden">
          <button
            onClick={() => setOpen(open === 'essentials' ? null : 'essentials')}
            className="w-full flex items-center gap-3 p-5 text-left"
          >
            <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </span>
            <span className="flex-1">
              <span className="block font-black text-content">Essentials</span>
              <span className="block text-sm text-content-soft font-medium">
                {draft.essentials.length} added
              </span>
            </span>
            <ChevronDown
              size={20}
              className={`text-content-faint transition-transform ${open === 'essentials' ? 'rotate-180' : ''}`}
            />
          </button>

          {open === 'essentials' && (
            <div className="px-5 pb-5 border-t border-line/70 pt-5 space-y-6 max-h-96 overflow-y-auto">
              {ESSENTIAL_CATEGORIES.map((cat) => {
                const items = ESSENTIALS_ITEMS.filter((i) => i.category === cat.id);
                if (items.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h4 className="eyebrow text-content-faint mb-3">{cat.name}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {items.map((item) => {
                        const inCart = essentialIds.has(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleExtra(item)}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                              inCart
                                ? 'border-brand bg-brand-soft'
                                : 'border-line bg-surface-3/50 hover:border-content-faint/50'
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
                              <span className="block text-xs font-bold text-content truncate">
                                {item.name}
                              </span>
                              <span className="block text-xs text-brand font-black">
                                €{item.price}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
