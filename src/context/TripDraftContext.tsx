import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CatalogItem,
  EssentialItem,
  RentedItem,
  ShippedItem,
  Trip,
  TripDraft,
  WardrobeMode,
} from '@/types';

const INITIAL_DRAFT: TripDraft = {
  checkIn: '',
  checkInTime: '14:00',
  checkOut: '',
  destination: 'London, UK',
  stayType: 'Hotel',
  lat: 51.5074,
  lon: -0.1278,
};

interface TripDraftContextValue {
  draft: TripDraft;
  setDraft: (patch: Partial<TripDraft>) => void;
  wardrobeMode: WardrobeMode | null;
  setWardrobeMode: (mode: WardrobeMode | null) => void;
  cart: CatalogItem[];
  toggleCartItem: (item: CatalogItem) => void;
  shippedItems: ShippedItem[];
  addShippedItem: (item: ShippedItem) => void;
  essentialsCart: EssentialItem[];
  toggleEssential: (item: EssentialItem) => void;
  /** Prefill the wardrobe from a past trip (reuse feature). */
  loadWardrobeFromTrip: (trip: Trip) => void;
  reset: () => void;
}

const TripDraftContext = createContext<TripDraftContextValue | null>(null);

export function TripDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<TripDraft>(INITIAL_DRAFT);
  const [wardrobeMode, setWardrobeMode] = useState<WardrobeMode | null>(null);
  const [cart, setCart] = useState<CatalogItem[]>([]);
  const [shippedItems, setShippedItems] = useState<ShippedItem[]>([]);
  const [essentialsCart, setEssentialsCart] = useState<EssentialItem[]>([]);

  const setDraft = useCallback((patch: Partial<TripDraft>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleCartItem = useCallback((item: CatalogItem) => {
    setCart((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
    );
  }, []);

  const addShippedItem = useCallback((item: ShippedItem) => {
    setShippedItems((prev) => [...prev, item]);
  }, []);

  const toggleEssential = useCallback((item: EssentialItem) => {
    setEssentialsCart((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
    );
  }, []);

  const loadWardrobeFromTrip = useCallback((trip: Trip) => {
    setWardrobeMode(trip.wardrobeMode);
    if (trip.wardrobeMode === 'rent') {
      // Strip the per-trip "purchased" flag back to plain catalog items.
      const items = (trip.items as RentedItem[]).map(
        ({ purchased: _purchased, ...rest }) => rest as CatalogItem,
      );
      setCart(items);
      setShippedItems([]);
    } else {
      setShippedItems(trip.items as ShippedItem[]);
      setCart([]);
    }
    setEssentialsCart(trip.essentials ?? []);
  }, []);

  const reset = useCallback(() => {
    setDraftState(INITIAL_DRAFT);
    setWardrobeMode(null);
    setCart([]);
    setShippedItems([]);
    setEssentialsCart([]);
  }, []);

  const value = useMemo<TripDraftContextValue>(
    () => ({
      draft,
      setDraft,
      wardrobeMode,
      setWardrobeMode,
      cart,
      toggleCartItem,
      shippedItems,
      addShippedItem,
      essentialsCart,
      toggleEssential,
      loadWardrobeFromTrip,
      reset,
    }),
    [
      draft,
      setDraft,
      wardrobeMode,
      cart,
      toggleCartItem,
      shippedItems,
      addShippedItem,
      essentialsCart,
      toggleEssential,
      loadWardrobeFromTrip,
      reset,
    ],
  );

  return <TripDraftContext.Provider value={value}>{children}</TripDraftContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTripDraft(): TripDraftContextValue {
  const ctx = useContext(TripDraftContext);
  if (!ctx) throw new Error('useTripDraft must be used within TripDraftProvider');
  return ctx;
}
