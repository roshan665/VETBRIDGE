import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'

import { Button } from '@/components/common/Button'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/cn'
import { publicNavigation } from '@/lib/navigation'

export interface NavbarProps {
  className?: string
}

/** Public marketing navigation used on landing, login and register screens. */
export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-sm',
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {publicNavigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button to="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button to="/register" variant="primary" size="sm" iconRight={ArrowRight}>
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-canvas lg:hidden"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((previous) => !previous)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {publicNavigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button to="/login" variant="outline" size="md" fullWidth>
                Login
              </Button>
              <Button to="/register" variant="primary" size="md" fullWidth iconRight={ArrowRight}>
                Get Started
              </Button>
            </div>
            <Link
              to="/farmer/dashboard"
              className="mt-2 text-center text-xs font-medium text-ink-muted underline"
            >
              Explore the platform dashboards
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
