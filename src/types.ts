// Shared domain types for LuggageLess.

export type Gender = 'Male' | 'Female' | 'Other';
export type SizeStandard = 'EU' | 'US' | 'UK' | 'CN';
export type StayType = 'Hotel' | 'Airbnb' | 'Office';
export type WardrobeMode = 'rent' | 'ship';

export type BodyType = 'slim' | 'regular' | 'athletic' | 'full';
export type Language = 'English' | 'Italiano' | 'Français' | 'Español';

export interface Profile {
  /** Full name kept for backward compatibility / display fallback. */
  name: string;
  email: string;
  gender: Gender;
  sizeStandard: SizeStandard;
  shirt: string;
  trousers: string;
  shoes: string;
  avatar: string;
  createdAt: string;
  /** Optional fields (added later) — kept optional for backward compatibility. */
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  /** Home address — collected on first shipment, reused afterwards. */
  address?: string;
  favoriteColor?: string;
  bodyType?: BodyType;
  language?: Language;
}

export interface CatalogItem {
  id: string;
  category: string;
  style: string;
  name: string;
  price: number;
  image: string;
  desc: string;
  /** Enriched attributes shown on the item detail "tag". */
  size: string;
  color: string;
  material: string;
  brand: string;
  /** How many travellers wore this item before (simulated). */
  cycles: number;
  /** Average star rating (mock), 0–5 with one decimal. */
  rating: number;
  /** Number of ratings behind the average (mock). */
  ratingCount: number;
}

export type EssentialCategory = 'wellness' | 'hygiene' | 'electronics' | 'wear';

export interface EssentialItem {
  id: string;
  name: string;
  price: number;
  img: string;
  category: EssentialCategory;
  desc: string;
}

/** A clothing item the user ships to the service (ship mode). */
export interface ShippedItem {
  id: string;
  size: string;
  color: string;
  material: string;
  brand: string;
}

/** A rented catalog item attached to a trip, with purchase state. */
export interface RentedItem extends CatalogItem {
  purchased: boolean;
}

export interface Trip {
  id: string;
  destination: string;
  stayType: StayType;
  checkIn: string;
  checkInTime: string;
  checkOut: string;
  lat: number;
  lon: number;
  wardrobeMode: WardrobeMode;
  items: RentedItem[] | ShippedItem[];
  essentials: EssentialItem[];
  status: string;
  createdAt: string;
  /** Post-trip review: overall wardrobe rating (1–5) + per-item ratings. */
  wardrobeRating?: number;
  itemRatings?: Record<string, number>;
}

/** Draft trip being built across the planning steps. */
export interface TripDraft {
  checkIn: string;
  checkInTime: string;
  checkOut: string;
  destination: string;
  stayType: StayType;
  lat: number;
  lon: number;
}
