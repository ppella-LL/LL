import type { CatalogItem, Profile } from '@/types';

// Which profile measurement applies to each catalog category.
const CATEGORY_FIELD: Record<string, keyof Pick<Profile, 'shirt' | 'trousers' | 'shoes'>> = {
  shirt: 'shirt',
  top: 'shirt',
  sweater: 'shirt',
  jacket: 'trousers', // jackets sized like trousers (numeric) in this catalog
  trousers: 'trousers',
  shoes: 'shoes',
};

function norm(v: string): string {
  return v.trim().toUpperCase();
}

/**
 * Does this catalog item match the user's profile size?
 * Returns true/false, or null when we can't tell (no profile value).
 */
export function matchesUserSize(item: CatalogItem, profile?: Profile | null): boolean | null {
  if (!profile) return null;
  const field = CATEGORY_FIELD[item.category];
  if (!field) return null;
  const mine = profile[field];
  if (!mine) return null;
  return norm(mine) === norm(item.size);
}
