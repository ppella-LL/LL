import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';

/**
 * Shell for the primary tabs (Home / Trips / Profile): renders the page
 * plus the persistent bottom navigation.
 *
 * The page content area reserves space for the fixed BottomNav via padding,
 * but the shell itself does NOT force an extra min-height floor — that avoids
 * stacking 100vh + nav clearance and producing unwanted scroll on short pages.
 */
export function AppLayout() {
  return (
    <div className="bg-surface">
      <div className="pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
