import { CATALOG_ITEMS } from './catalog';
import type { CatalogItem } from '@/types';

export interface Outfit {
  id: string;
  name: string;
  tagline: string;
  itemIds: string[];
}

// Curated outfits referencing stable catalog item ids (format: `${category}-${index}`).
export const OUTFITS: Outfit[] = [
  { id: 'business', name: 'The Boardroom', tagline: 'Sharp for meetings', itemIds: ['shirt-0', 'trousers-1', 'jacket-2', 'shoes-0'] },
  { id: 'weekend', name: 'City Weekend', tagline: 'Relaxed & easy', itemIds: ['top-1', 'trousers-3', 'sweater-0', 'shoes-2'] },
  { id: 'evening', name: 'Evening Out', tagline: 'Dinner-ready', itemIds: ['shirt-4', 'trousers-2', 'jacket-0', 'shoes-1'] },
  { id: 'layered', name: 'Layered Up', tagline: 'For chilly London', itemIds: ['top-0', 'sweater-2', 'jacket-3', 'trousers-0'] },
];

/** Resolve an outfit's item ids to actual catalog items (skips missing). */
export function outfitItems(outfit: Outfit): CatalogItem[] {
  return outfit.itemIds
    .map((id) => CATALOG_ITEMS.find((i) => i.id === id))
    .filter((i): i is CatalogItem => Boolean(i));
}

export function outfitTotal(outfit: Outfit): number {
  return outfitItems(outfit).reduce((s, i) => s + i.price, 0);
}
