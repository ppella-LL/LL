import { useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { STOCK_AVATARS, generatedAvatar } from '@/data/avatars';

interface AvatarPickerProps {
  open: boolean;
  current?: string;
  /** Used to offer a freshly generated illustrated avatar as an option. */
  name: string;
  favoriteColor?: string;
  onClose: () => void;
  onSelect: (url: string) => void;
}

/** Choose a profile picture from curated stock photos or a generated avatar. */
export function AvatarPicker({
  open,
  current,
  name,
  favoriteColor,
  onClose,
  onSelect,
}: AvatarPickerProps) {
  const generated = generatedAvatar(name, favoriteColor);
  const options = [generated, ...STOCK_AVATARS];
  const [picked, setPicked] = useState<string>(current || generated);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-2 rounded-3xl p-6 w-full max-w-md shadow-soft-lg animate-fade-in-up max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-xl text-content">Choose a photo</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-content-faint hover:bg-surface-3"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-1">
          {options.map((url, i) => {
            const active = picked === url;
            return (
              <button
                key={url}
                onClick={() => setPicked(url)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  active ? 'border-brand scale-105' : 'border-transparent hover:border-line'
                }`}
              >
                <Img src={url} alt="" className="w-full h-full object-cover bg-surface-3" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-black/50 text-white rounded-md p-0.5">
                    <Sparkles size={12} />
                  </span>
                )}
                {active && (
                  <span className="absolute inset-0 bg-brand/25 flex items-center justify-center">
                    <span className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center">
                      <Check size={16} />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => {
            onSelect(picked);
            onClose();
          }}
          className="w-full mt-5"
        >
          Use this photo
        </Button>
      </div>
    </div>
  );
}
