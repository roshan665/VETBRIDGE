import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Headphones, LogOut, Settings, X } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'
import { dashboardLink, sidebarNavigation } from '@/lib/navigation'
import { usingMockApi } from '@/services/api'
import type { UserRole } from '@/types'

export interface SidebarProps {
  role: UserRole
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

const roleWorkspaceLabel: Record<UserRole, string> = {
  farmer: 'Farmer workspace',
  veterinarian: 'Veterinary workspace',
  admin: 'Government workspace',
}

const roleToneLabel: Record<UserRole, string> = {
  farmer: 'Farmer',
  veterinarian: 'Veterinarian',
  admin: 'Administrator',
}

const secondaryLinkClass = (isActive: boolean) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-canvas',
  )

function SidebarContent({ role, onNavigate }: { role: UserRole; onNavigate?: () => void }) {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    void signOut().then(() => {
      onNavigate?.()
      window.location.assign('/login')
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line px-4">
        <Logo to={dashboardLink[role]} />
        {onNavigate ? (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close sidebar"
            className="grid size-8 place-items-center rounded-lg text-ink-muted hover:bg-canvas lg:hidden"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 px-4 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {roleWorkspaceLabel[role]}
        </p>
      </div>

      <nav
        aria-label="Dashboard"
        className="flex-1 space-y-5 overflow-y-auto px-3 py-4 scrollbar-slim"
      >
        {sidebarNavigation[role].map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-700 text-white shadow-card'
                          : 'text-ink-soft hover:bg-brand-50 hover:text-brand-700',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'size-4 shrink-0',
                            isActive ? 'text-white' : 'text-ink-muted',
                          )}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              'nums rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                              isActive ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700',
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-line px-3 py-3">
        <NavLink to="/settings" onClick={onNavigate} className={({ isActive }) => secondaryLinkClass(isActive)}>
          <Settings className="size-4 text-ink-muted" aria-hidden="true" />
          Settings
        </NavLink>
        <NavLink to="/help" onClick={onNavigate} className={({ isActive }) => secondaryLinkClass(isActive)}>
          <Headphones className="size-4 text-ink-muted" aria-hidden="true" />
          Help &amp; Support
        </NavLink>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="size-4 text-ink-muted" aria-hidden="true" />
          Logout
        </button>
      </div>

      <div className="shrink-0 border-t border-line p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
            {initials(user?.name ?? 'JeevRaksha')}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user?.name ?? 'Guest user'}</p>
            <p className="truncate text-xs text-ink-muted">{roleToneLabel[role]}</p>
          </div>
        </div>
        {usingMockApi ? (
          <div className="mt-3">
            <Badge tone="info" size="sm" dot>
              Demo data mode
            </Badge>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/** Role aware navigation rail: fixed on desktop, drawer on mobile. */
export function Sidebar({ role, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (isMobileOpen) onCloseMobile?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">
        <SidebarContent role={role} />
      </aside>

      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="absolute inset-0 bg-ink/50"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[86%] border-r border-line bg-surface shadow-raised">
            <SidebarContent role={role} onNavigate={onCloseMobile} />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Sidebar

