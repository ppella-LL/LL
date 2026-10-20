import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, Sparkles } from 'lucide-react';
import { useTripDraft } from '@/context/TripDraftContext';
import { Button } from '@/components/ui/Button';
import { StepHeader } from '@/components/ui/StepHeader';
import { ItemTag, type TagItem } from '@/components/ItemTag';
import { ESSENTIALS_ITEMS, ESSENTIAL_CATEGORIES } from '@/data/catalog';
import type { EssentialItem } from '@/types';

export default function ExtrasPage() {
  const navigate = useNavigate();
  const { essentialsCart, toggleEssential } = useTripDraft();
  const [tagItem, setTagItem] = useState<EssentialItem | null>(null);

  const total = useMemo(
    () => essentialsCart.reduce((sum, i) => sum + i.price, 0),
    [essentialsCart],
  );
  const inCartIds = useMemo(() => new Set(essentialsCart.map((i) => i.id)), [essentialsCart]);

  // Map an essential to the generic tag shape (no cycles / garment attrs).
  const toTag = (i: EssentialItem): TagItem => ({
    id: i.id,
    name: i.name,
    price: i.price,
    image: i.img,
    desc: i.desc,
  });

  return (
    <div className="min-h-dvh bg-surface pb-28">
      <StepHeader
        title="Travel extras"
        onBack={() => navigate(-1)}
        right={
          <div className="bg-brand text-white px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-soft">
            <Sparkles size={16} /> {essentialsCart.length}
          </div>
        }
      >
        <p className="text-sm text-content-soft font-medium leading-tight pt-1 max-w-6xl mx-auto w-full">
          Add low-cost toiletries, tech and comfort items to complete your zero-luggage trip.
        </p>
      </StepHeader>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto w-full mt-2 space-y-10">
        {ESSENTIAL_CATEGORIES.map((cat) => {
          const items = ESSENTIALS_ITEMS.filter((i) => i.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id}>
              <h2 className="font-black text-lg text-content mb-4 flex items-center gap-2">
                {cat.name}
                <span className="text-content-faint font-bold text-sm">({items.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
                {items.map((item) => {
                  const inCart = inCartIds.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTagItem(item)}
                      className="group text-left flex flex-col bg-surface-2 p-3 rounded-3xl shadow-soft border border-line/70 transition-all hover:shadow-soft-lg active:scale-[0.98]"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEssential(item);
                          }}
                          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full shadow-soft flex items-center justify-center transition-all cursor-pointer ${
                            inCart
                              ? 'bg-brand text-white scale-110'
                              : 'bg-surface-2/90 text-content backdrop-blur-sm hover:bg-brand hover:text-white'
                          }`}
                          aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                        >
                          {inCart ? <CheckCircle size={18} /> : <Plus size={18} />}
                        </span>
                      </div>
                      <div className="px-1 text-center">
                        <h4 className="font-bold text-sm leading-tight mb-1 text-content">
                          {item.name}
                        </h4>
                        <p className="text-brand font-black text-base">€{item.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-line/70 p-4 pb-safe shadow-soft-lg z-20">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <div>
            <p className="text-[11px] text-content-faint uppercase font-black tracking-wider">
              Extras total · {essentialsCart.length}
            </p>
            <p className="text-2xl font-black text-content">€{total}</p>
          </div>
          <Button onClick={() => navigate('/trip/checkout')} className="px-8">
            Review order
          </Button>
        </div>
      </div>

      <ItemTag
        item={tagItem ? toTag(tagItem) : null}
        inCart={tagItem ? inCartIds.has(tagItem.id) : false}
        onClose={() => setTagItem(null)}
        onToggle={() => tagItem && toggleEssential(tagItem)}
      />
    </div>
  );
}
