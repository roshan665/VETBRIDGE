import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Headphones, LogOut, Menu, Settings } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'
import { alertPath, roleLabels } from '@/lib/navigation'

/**
 * Application shell: fixed sidebar on desktop, drawer on mobile, sticky header
 * with role context, alert shortcut and account menu.
 */
export function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const role = user?.role ?? 'farmer'
  const contextLine = user?.farmName ?? user?.organization ?? user?.district ?? 'Livestock health'

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleSignOut = () => {
    setIsUserMenuOpen(false)
    void signOut().then(() => navigate('/login'))
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        role={role}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur-sm">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-canvas lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">JeevRaksha</p>
              <p className="truncate text-xs text-ink-muted">{contextLine}</p>
            </div>

            <Badge tone="brand" className="hidden sm:inline-flex">
              {roleLabels[role]} access
            </Badge>

            <Link
              to={alertPath[role]}
              aria-label="View alerts"
              className="relative grid size-10 shrink-0 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-canvas hover:text-brand-700"
            >
              <Bell className="size-4" aria-hidden="true" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500 ring-2 ring-surface" />
            </Link>

            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((previous) => !previous)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5 text-left transition-colors hover:bg-canvas"
              >
                <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-800">
                  {initials(user?.name ?? 'JeevRaksha')}
                </span>
                <span className="hidden max-w-[9rem] truncate text-sm font-medium text-ink sm:block">
                  {user?.name ?? 'Guest'}
                </span>
                <ChevronDown
                  className={cn(
                    'size-4 text-ink-muted transition-transform',
                    isUserMenuOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>

              {isUserMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-raised"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{user?.name ?? 'Guest'}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {user?.email ?? 'Not signed in'}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-canvas"
                    >
                      <Settings className="size-4 text-ink-muted" aria-hidden="true" />
                      Settings
                    </Link>
                    <Link
                      to="/help"
                      onClick={() => setIsUserMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-canvas"
                    >
                      <Headphones className="size-4 text-ink-muted" aria-hidden="true" />
                      Help &amp; Support
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="size-4 text-ink-muted" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-line px-4 py-6 text-xs text-ink-muted sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>JeevRaksha &middot; Livestock Health Intelligence &middot; SIH-26128</p>
            <p>Evaluation build &middot; temporary data until the FastAPI service is connected</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AppLayout
