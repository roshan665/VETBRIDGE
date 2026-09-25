import { Link } from 'react-router-dom'
import { Mail, MapPin, PhoneCall } from 'lucide-react'

import { Logo } from '@/components/layout/Logo'

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Dashboard', to: '/login' },
]

const resourceLinks = [
  { label: 'Disease Library', href: '#features' },
  { label: 'Prevention', href: '#how-it-works' },
  { label: 'Vaccination', href: '#roles' },
]

export function Footer() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Livestock health intelligence for early disease detection, preventive care and
              veterinary coordination.
            </p>
          </div>

          <nav aria-label="Product">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) =>
                link.to ? (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                    >
                      {link.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-brand-600" aria-hidden="true" />
                support@vetbridge.in
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="size-4 text-brand-600" aria-hidden="true" />
                1800-123-2477 (toll free)
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                Department of Animal Husbandry, Bhopal, Madhya Pradesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} VETBRIDGE &middot; Livestock Health Intelligence. All
            rights reserved.
          </p>
          <p className="text-xs text-ink-muted">
            Smart India Hackathon 2026 &middot; Problem statement SIH-26128
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
