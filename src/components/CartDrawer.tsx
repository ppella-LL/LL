import { ShoppingBag, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CatalogItem } from '@/types';

interface CartDrawerProps {
  open: boolean;
  items: CatalogItem[];
  onClose: () => void;
  onRemove: (item: CatalogItem) => void;
  onCheckout: () => void;
}

/** Slide-in cart: review and remove selected wardrobe items before continuing. */
export function CartDrawer({ open, items, onClose, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel: full-width sheet on mobile, right drawer on desktop */}
      <aside
        className={`fixed z-50 bg-surface-2 shadow-soft-lg flex flex-col transition-transform duration-300
          inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl
          sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:max-h-none sm:rounded-none sm:rounded-l-3xl
          ${open ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}`}
      >
        <header className="flex items-center justify-between p-5 border-b border-line/70">
          <h3 className="font-black text-lg text-content flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand" /> Your cart ({items.length})
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-content-faint hover:bg-surface-3 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-content-faint font-bold">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-50" />
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-surface-3/60 p-2.5 rounded-xl border border-line/70"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-14 h-14 rounded-lg object-cover bg-surface-3 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate text-content">{item.name}</p>
                  <p className="text-xs text-content-faint">{item.style}</p>
                  <p className="text-brand font-black text-sm mt-0.5">€{item.price}</p>
                </div>
                <button
                  onClick={() => onRemove(item)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <footer className="p-5 border-t border-line/70">
          <div className="flex justify-between items-center mb-4">
            <span className="text-content-faint font-black uppercase text-[11px] tracking-wider">
              Total
            </span>
            <span className="text-2xl font-black text-content">€{total}</span>
          </div>
          <Button onClick={onCheckout} disabled={items.length === 0} className="w-full">
            Continue
          </Button>
        </footer>
      </aside>
    </>
  );
}
