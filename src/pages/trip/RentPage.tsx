import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle, Plus, ShoppingBag } from 'lucide-react';
import { useTripDraft } from '@/context/TripDraftContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { StepHeader } from '@/components/ui/StepHeader';
import { CartDrawer } from '@/components/CartDrawer';
import { ItemTag } from '@/components/ItemTag';
import { CATALOG_ITEMS, CATEGORIES, STYLES } from '@/data/catalog';
import { OUTFITS, outfitItems, outfitTotal } from '@/data/outfits';
import { matchesUserSize } from '@/lib/sizing';
import { Img } from '@/components/ui/Img';
import type { CatalogItem } from '@/types';

export default function RentPage() {
  const navigate = useNavigate();
  const { cart, toggleCartItem } = useTripDraft();
  const { profile } = useAuth();

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [activeStyle, setActiveStyle] = useState<string>('All');
  const [onlyMySize, setOnlyMySize] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [tagItem, setTagItem] = useState<CatalogItem | null>(null);

  const filteredItems = useMemo(
    () =>
      CATALOG_ITEMS.filter(
        (i) =>
          i.category === activeCategory &&
          (activeStyle === 'All' || i.style === activeStyle) &&
          (!onlyMySize || matchesUserSize(i, profile) === true),
      ),
    [activeCategory, activeStyle, onlyMySize, profile],
  );

  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price, 0), [cart]);
  const cartIds = useMemo(() => new Set(cart.map((i) => i.id)), [cart]);

  // Add every item of an outfit that isn't already in the cart.
  const addOutfit = (ids: string[]) => {
    const inCart = new Set(cart.map((i) => i.id));
    outfitItems({ id: '', name: '', tagline: '', itemIds: ids }).forEach((it) => {
      if (!inCart.has(it.id)) toggleCartItem(it);
    });
  };

  return (
    <div className="min-h-dvh bg-surface pb-28">
      <StepHeader
        title="Catalog"
        onBack={() => navigate('/trip/service')}
        right={
          <button
            onClick={() => setCartOpen(true)}
            className="bg-brand text-white px-3.5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-soft active:scale-95 transition-transform"
            aria-label="Open cart"
          >
            <ShoppingBag size={16} /> {cart.length}
          </button>
        }
      >
        <div className="space-y-3 pb-1 pt-4 max-w-6xl mx-auto w-full">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setActiveStyle(style)}
                className={`px-4 py-1.5 rounded-lg whitespace-nowrap font-bold text-xs transition-colors border ${
                  activeStyle === style
                    ? 'bg-ink text-ink-content border-transparent'
                    : 'bg-surface-2 text-content-soft border-line hover:border-content-faint/50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-brand text-white'
                    : 'bg-surface-3 text-content-soft hover:text-content'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Only my size filter */}
          <button
            onClick={() => setOnlyMySize((v) => !v)}
            className={`self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs transition-colors border ${
              onlyMySize
                ? 'bg-brand text-white border-transparent'
                : 'bg-surface-2 text-content-soft border-line hover:border-content-faint/50'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                onlyMySize ? 'bg-white text-brand' : 'border border-content-faint'
              }`}
            >
              {onlyMySize && <Check size={11} />}
            </span>
            Only my size
          </button>
        </div>
      </StepHeader>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto w-full">
        {/* Recommended outfits */}
        {!onlyMySize && (
          <section className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="display-tight text-xl text-content">Recommended outfits</h2>
              <span className="eyebrow text-content-faint">Tap to add the set</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
              {OUTFITS.map((outfit) => {
                const items = outfitItems(outfit);
                if (items.length === 0) return null;
                return (
                  <div
                    key={outfit.id}
                    className="shrink-0 w-64 bg-surface-2 border border-line/70 rounded-3xl p-3 shadow-soft"
                  >
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {items.slice(0, 4).map((it) => (
                        <div key={it.id} className="aspect-square rounded-xl overflow-hidden bg-surface-3">
                          <Img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="px-1">
                      <p className="font-black text-content leading-tight">{outfit.name}</p>
                      <p className="text-xs text-content-soft font-medium mb-3">{outfit.tagline}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-brand font-black">€{outfitTotal(outfit)}</span>
                        <Button
                          onClick={() => addOutfit(outfit.itemIds)}
                          className="px-4 py-2 text-sm rounded-full"
                        >
                          Add outfit
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {onlyMySize && filteredItems.length === 0 && (
          <div className="text-center py-16 text-content-faint font-bold">
            No items in your size here. Try another category or turn off the filter.
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {filteredItems.map((item) => {
            const inCart = cartIds.has(item.id);
            const sizeOk = matchesUserSize(item, profile);
            return (
              <button
                key={item.id}
                onClick={() => setTagItem(item)}
                className="group text-left flex flex-col bg-surface-2 p-2.5 rounded-3xl shadow-soft border border-line/70 transition-all hover:shadow-soft-lg active:scale-[0.98]"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-surface-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCartItem(item);
                    }}
                    className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full shadow-soft flex items-center justify-center transition-all cursor-pointer ${
                      inCart
                        ? 'bg-brand text-white scale-110'
                        : 'bg-surface-2/90 text-content backdrop-blur-sm hover:bg-brand hover:text-white'
                    }`}
                    aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                  >
                    {inCart ? <CheckCircle size={18} /> : <Plus size={18} />}
                  </span>
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    <span className="bg-surface-2/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-black uppercase text-content-soft shadow-soft">
                      {item.style}
                    </span>
                    {sizeOk === true && (
                      <span className="bg-brand text-white px-2 py-1 rounded-md text-[9px] font-black uppercase shadow-soft inline-flex items-center gap-1">
                        <Check size={10} /> Your size
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-1 pb-1">
                  <h4 className="font-bold text-sm leading-tight mb-1 truncate text-content">
                    {item.name}
                  </h4>
                  <p className="text-brand font-black text-base">€{item.price}</p>
                </div>
              </button>
            );
          })}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-content-faint font-bold">
            No items found for this style.
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-line/70 p-4 pb-safe shadow-soft-lg z-20">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <button
            onClick={() => setCartOpen(true)}
            disabled={cart.length === 0}
            className="text-left disabled:opacity-60"
          >
            <p className="text-[11px] text-content-faint uppercase font-black tracking-wider">
              Total · {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </p>
            <p className="text-2xl font-black text-content flex items-center gap-2">
              €{cartTotal}
              {cart.length > 0 && (
                <span className="text-xs font-bold text-brand underline underline-offset-2">
                  view cart
                </span>
              )}
            </p>
          </button>
          <Button
            onClick={() => navigate('/trip/extras')}
            disabled={cart.length === 0}
            className="px-8"
          >
            Next <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={toggleCartItem}
        onCheckout={() => {
          setCartOpen(false);
          navigate('/trip/extras');
        }}
      />

      <ItemTag
        item={tagItem}
        inCart={tagItem ? cartIds.has(tagItem.id) : false}
        sizeMatch={
          tagItem
            ? matchesUserSize(tagItem, profile) === true
              ? 'match'
              : matchesUserSize(tagItem, profile) === false
                ? 'off'
                : undefined
            : undefined
        }
        onClose={() => setTagItem(null)}
        onToggle={() => tagItem && toggleCartItem(tagItem)}
      />
    </div>
  );
}
