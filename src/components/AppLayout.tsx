import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';

/**
 * Shell for the primary tabs (Home / Trips / Profile): renders the page
 * plus the persistent bottom navigation. The extra bottom padding keeps
 * content clear of the fixed nav bar.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
