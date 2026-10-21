import type { CatalogItem, EssentialCategory, EssentialItem } from '@/types';

export interface Category {
  id: string;
  name: string;
  img: string;
}

export const CATEGORIES: Category[] = [
  { id: 'shirt', name: 'Shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?auto=format&fit=crop&w=400&q=80' },
  { id: 'trousers', name: 'Trousers', img: 'https://images.unsplash.com/photo-1624378439575-d1ead6bb22b1?auto=format&fit=crop&w=400&q=80' },
  { id: 'jacket', name: 'Jackets', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80' },
  { id: 'sweater', name: 'Sweaters', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80' },
  { id: 'top', name: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80' },
  { id: 'shoes', name: 'Shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80' },
];

export const STYLES = ['All', 'Business', 'Casual', 'Sporty', 'Elegant'] as const;
export type Style = (typeof STYLES)[number];

/**
 * Deterministic pseudo-random generator (mulberry32).
 * Produces a stable catalog on every load so prices/styles never "jump"
 * between renders and the cart stays consistent.
 */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ITEMS_PER_CATEGORY = 15;

const COLORS = ['Navy', 'Black', 'White', 'Grey', 'Beige', 'Olive', 'Burgundy', 'Blue'];
const BRANDS = ['Atelier', 'Nord', 'Hugo', 'Boss', 'Lacoste', 'Uniqlo', 'COS', 'Zegna'];
const MATERIAL_BY_CATEGORY: Record<string, string[]> = {
  shirt: ['Cotton', 'Linen', 'Oxford cotton'],
  trousers: ['Wool', 'Chino cotton', 'Linen blend'],
  jacket: ['Wool', 'Technical nylon', 'Cotton twill'],
  sweater: ['Merino wool', 'Cashmere blend', 'Lambswool'],
  top: ['Cotton', 'Modal', 'Jersey'],
  shoes: ['Leather', 'Suede', 'Canvas'],
};
const SIZES_BY_CATEGORY: Record<string, string[]> = {
  shirt: ['S', 'M', 'L', 'XL'],
  trousers: ['46', '48', '50', '52'],
  jacket: ['46', '48', '50', '52'],
  sweater: ['S', 'M', 'L', 'XL'],
  top: ['S', 'M', 'L', 'XL'],
  shoes: ['40', '41', '42', '43', '44'],
};

const pick = <T,>(arr: T[], r: number): T => arr[Math.floor(r * arr.length)];

export const CATALOG_ITEMS: CatalogItem[] = CATEGORIES.flatMap((cat, catIndex) => {
  const rand = seeded(catIndex * 1000 + 7);
  return Array.from({ length: ITEMS_PER_CATEGORY }).map((_, i) => {
    const singular = cat.name.endsWith('s') ? cat.name.slice(0, -1) : cat.name;
    // Styles excluding 'All' (index 0).
    const style = STYLES[1 + Math.floor(rand() * (STYLES.length - 1))];
    const price = Math.floor(rand() * 5) + 3; // €3 to €7
    const material = pick(MATERIAL_BY_CATEGORY[cat.id] ?? ['Cotton'], rand());
    const color = pick(COLORS, rand());
    const brand = pick(BRANDS, rand());
    const size = pick(SIZES_BY_CATEGORY[cat.id] ?? ['M'], rand());
    const cycles = Math.floor(rand() * 41); // 0–40 travellers before
    const rating = Math.round((4 + rand()) * 10) / 10; // 4.0–5.0
    const ratingCount = 8 + Math.floor(rand() * 180); // 8–187 reviews
    return {
      id: `${cat.id}-${i}`,
      category: cat.id,
      style,
      name: `${brand} ${singular} ${String(i + 1).padStart(2, '0')}`,
      price,
      image: cat.img,
      desc: `${material} ${singular.toLowerCase()}, perfect for your trip.`,
      size,
      color,
      material,
      brand,
      cycles,
      rating,
      ratingCount,
    };
  });
});

export const ESSENTIAL_CATEGORIES: { id: EssentialCategory; name: string }[] = [
  { id: 'wellness', name: 'Wellness' },
  { id: 'hygiene', name: 'Hygiene' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'wear', name: 'Wear' },
];

export const ESSENTIALS_ITEMS: EssentialItem[] = [
  // Wellness (creams, skincare)
  { id: 'ess-skincare', category: 'wellness', name: 'Skincare Minis', price: 8, desc: 'Travel-size moisturiser, serum and cleanser.', img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-handcream', category: 'wellness', name: 'Hand Cream', price: 3, desc: 'Nourishing cream for dry travel skin.', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-lipbalm', category: 'wellness', name: 'Lip Balm', price: 2, desc: 'SPF lip balm for flights and sun.', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-sunscreen', category: 'wellness', name: 'Mini Sunscreen', price: 5, desc: 'SPF 50 travel-size sunscreen.', img: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=400&q=80' },

  // Hygiene (toothbrush, shampoo, razor)
  { id: 'ess-toothbrush', category: 'hygiene', name: 'Travel Toothbrush', price: 2, desc: 'Folding toothbrush with cap.', img: 'https://images.unsplash.com/photo-1606240212879-165fb4f455bc?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-toothpaste', category: 'hygiene', name: 'Mini Toothpaste', price: 1, desc: 'Cabin-friendly fluoride toothpaste.', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-shampoo', category: 'hygiene', name: 'Shampoo & Body', price: 4, desc: '2-in-1 travel shampoo and body wash.', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-razor', category: 'hygiene', name: 'Razor Kit', price: 3, desc: 'Razor with two spare blades.', img: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-deodorant', category: 'hygiene', name: 'Deodorant', price: 3, desc: '24h travel-size deodorant.', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-comb', category: 'hygiene', name: 'Comb & Mirror', price: 2, desc: 'Pocket comb with folding mirror.', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80' },

  // Electronics (adapters, chargers, cables)
  { id: 'ess-adapter', category: 'electronics', name: 'UK Travel Adapter', price: 6, desc: 'Type-G adapter for the UK.', img: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-multicharger', category: 'electronics', name: 'Multi-Charger', price: 8, desc: '3-port USB fast charger.', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-usbc', category: 'electronics', name: 'USB-C Cable', price: 4, desc: 'Braided 1m USB-C cable.', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-powerbank', category: 'electronics', name: 'Power Bank', price: 8, desc: '10,000mAh slim power bank.', img: 'https://images.unsplash.com/photo-1609592806596-b43bada2f4bb?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-earbuds', category: 'electronics', name: 'Earbuds', price: 8, desc: 'Wireless earbuds with case.', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80' },

  // Wear (belts, sunglasses)
  { id: 'ess-sunglasses', category: 'wear', name: 'Sunglasses', price: 5, desc: 'UV400 classic sunglasses.', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-belt', category: 'wear', name: 'Leather Belt', price: 6, desc: 'Reversible black/brown belt.', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-socks', category: 'wear', name: 'Sock 3-Pack', price: 4, desc: 'Comfort cotton socks, 3 pairs.', img: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-cap', category: 'wear', name: 'Cap', price: 5, desc: 'Adjustable cotton cap.', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80' },
  { id: 'ess-scarf', category: 'wear', name: 'Scarf', price: 6, desc: 'Lightweight travel scarf.', img: 'https://images.unsplash.com/photo-1457545195570-67f207084966?auto=format&fit=crop&w=400&q=80' },
];

export const STORAGE_FEE = 49;
