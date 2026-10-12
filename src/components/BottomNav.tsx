import { Home, Luggage, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/trips', label: 'Trips', icon: Luggage },
  { to: '/profile', label: 'Profile', icon: User },
];

/**
 * Fixed bottom tab bar — the primary navigation for the logged-in app.
 * Modern mobile pattern: persistent tabs instead of back-arrow hopping.
 */
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line/70 bg-surface/85 backdrop-blur-xl pb-safe">
      <div className="max-w-md mx-auto flex items-stretch justify-around px-2 pt-1.5">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="group flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                    isActive ? 'bg-brand-soft text-brand' : 'text-content-faint group-hover:text-content'
                  }`}
                >
                  <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span
                  className={`text-[10px] font-bold tracking-wide transition-colors ${
                    isActive ? 'text-brand' : 'text-content-faint group-hover:text-content'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
