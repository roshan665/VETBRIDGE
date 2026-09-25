import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

export interface LogoProps {
  /** Where the logo links to. */
  to?: string
  /** Shows the "Livestock Health Intelligence" tagline. */
  showTagline?: boolean
  className?: string
  tone?: 'light' | 'dark'
}

const PRODUCT_NAME = 'VETBRIDGE'
const PRODUCT_TAGLINE = 'Livestock Health Intelligence'

export function Logo({ to = '/', showTagline = true, className, tone = 'dark' }: LogoProps) {
  return (
    <Link to={to} className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-800 text-brand-50 shadow-card">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none">
          <path
            d="M12 3l7 2.6v5.6c0 4.7-2.6 8.4-7 10.2-4.4-1.8-7-5.5-7-10.2V5.6L12 3z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M12 3l7 2.6v5.6c0 4.7-2.6 8.4-7 10.2-4.4-1.8-7-5.5-7-10.2V5.6L12 3z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.2v7.2M8.6 11.6h6.8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            'block truncate text-base font-semibold',
            tone === 'light' ? 'text-white' : 'text-ink',
          )}
        >
          {PRODUCT_NAME}
        </span>
        {showTagline ? (
          <span
            className={cn(
              'block truncate text-[11px] font-medium tracking-wide',
              tone === 'light' ? 'text-brand-100' : 'text-ink-muted',
            )}
          >
            {PRODUCT_TAGLINE}
          </span>
        ) : (
          <span className="sr-only">{PRODUCT_TAGLINE}</span>
        )}
      </span>
    </Link>
  )
}

export default Logo
