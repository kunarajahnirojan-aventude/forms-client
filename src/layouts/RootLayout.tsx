import { Outlet, NavLink } from 'react-router-dom';
import { FileText, Plus, Home } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { cn } from '@/utils';

export function RootLayout() {
  return (
    <div className='flex min-h-screen flex-col bg-slate-50 text-foreground'>
      {/* Top nav */}
      <header className='sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm'>
        <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6'>
          {/* Brand */}
          <NavLink
            to={ROUTES.SURVEYS}
            className='flex items-center gap-2.5 select-none'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1AA0]'>
              <FileText className='h-4 w-4 text-white' />
            </div>
            <span className='text-base font-semibold tracking-tight text-slate-900'>
              Surveys
            </span>
          </NavLink>

          {/* Nav links */}
          <nav className='hidden items-center gap-1 sm:flex'>
            <NavLink
              to={ROUTES.SURVEYS}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#0B1AA0]/10 text-[#0B1AA0]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              My Surveys
            </NavLink>
          </nav>

          {/* Right actions */}
          <div className='flex items-center gap-3'>
            <NavLink
              to={ROUTES.ROOT}
              title='Home'
              className='flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900'
            >
              <Home className='h-4 w-4' />
              <span className='hidden sm:inline'>Home</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
