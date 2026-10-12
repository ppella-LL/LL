import { useState } from 'react';
import { Check, HelpCircle, Plus, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface TagItem {
  id: string;
  name: string;
  price: number;
  image: string;
  desc?: string;
  style?: string;
  size?: string;
  color?: string;
  material?: string;
  brand?: string;
  /** Present for rentable garments; omitted for one-time-buy essentials. */
  cycles?: number;
}

interface ItemTagProps {
  item: TagItem | null;
  inCart: boolean;
  onClose: () => void;
  onToggle: (item: TagItem) => void;
}

/** Pop-up "tag": image + attributes (+ wear cycles for garments), add/remove. */
export function ItemTag({ item, inCart, onClose, onToggle }: ItemTagProps) {
  const [explain, setExplain] = useState(false);
  if (!item) return null;

  const rows: [string, string][] = [];
  if (item.size) rows.push(['Size', item.size]);
  if (item.color) rows.push(['Color', item.color]);
  if (item.material) rows.push(['Material', item.material]);
  if (item.brand) rows.push(['Brand', item.brand]);
  if (item.style) rows.push(['Style', item.style]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-2 rounded-3xl w-full max-w-sm shadow-soft-lg animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] bg-surface-3">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X size={18} />
          </button>
          {item.style && (
            <div className="absolute bottom-3 left-3 bg-surface-2/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-black uppercase text-content-soft shadow-soft">
              {item.style}
            </div>
          )}
        </div>

        <div className="p-5 overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-black text-xl text-content leading-tight">{item.name}</h3>
            <span className="text-brand font-black text-xl shrink-0">€{item.price}</span>
          </div>
          {item.desc && (
            <p className="text-content-soft text-sm font-medium mb-4">{item.desc}</p>
          )}

          {rows.length > 0 && (
            <dl className="divide-y divide-line/70 rounded-2xl border border-line/70 overflow-hidden mb-4">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between px-4 py-2.5">
                  <dt className="text-content-faint font-bold text-xs uppercase tracking-wider">
                    {label}
                  </dt>
                  <dd className="text-content font-bold text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Wear cycles — only for garments. */}
          {item.cycles !== undefined && (
            <div className="bg-surface-3/60 border border-line/70 rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                    <RefreshCw size={18} />
                  </span>
                  <div>
                    <p className="font-black text-content leading-none">{item.cycles} cycles</p>
                    <p className="text-xs text-content-faint font-medium mt-1">
                      travellers before you
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExplain((v) => !v)}
                  aria-label="What are cycles?"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    explain
                      ? 'bg-brand text-white'
                      : 'bg-surface-2 text-content-faint hover:text-content'
                  }`}
                >
                  <HelpCircle size={18} />
                </button>
              </div>
              {explain && (
                <p className="text-sm text-content-soft font-medium mt-3 pt-3 border-t border-line/70">
                  This garment has been worn by {item.cycles} travellers before you. Every item is
                  professionally sanitised after each use.
                </p>
              )}
            </div>
          )}

          <Button
            onClick={() => onToggle(item)}
            variant={inCart ? 'outline' : 'primary'}
            className="w-full"
          >
            {inCart ? (
              <>
                <Check size={18} /> In cart · remove
              </>
            ) : (
              <>
                <Plus size={18} /> Add to cart · €{item.price}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
