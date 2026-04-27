import { NavLink, Outlet } from 'react-router-dom';
import { CalendarCheck2, Columns3, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV = [
  { to: '/', label: 'Today', icon: CalendarCheck2 },
  { to: '/pipeline', label: 'Pipeline', icon: Columns3 },
];

export function AppShell() {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-bone-deep/70 md:bg-bone-warm md:px-5 md:py-8">
        <div className="mb-10">
          <p className="font-serif text-2xl tracking-tight text-ink">Lead Tracker</p>
          <p className="text-xs text-ink-muted mt-1">Camp Hill · Brisbane</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-ink text-bone' : 'text-ink/80 hover:bg-ink/5',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <button type="button" className="btn-primary w-full">
            <Plus className="h-4 w-4" />
            New lead
          </button>
        </div>
      </aside>

      <main className="flex-1 pb-24 md:pb-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-bone-deep/70 bg-bone/90 backdrop-blur md:hidden">
        <div className="grid grid-cols-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  isActive ? 'text-ink' : 'text-ink-muted',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-forest"
          >
            <Plus className="h-5 w-5" />
            New
          </button>
        </div>
      </nav>
    </div>
  );
}
