import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  meta?: ReactNode
  className?: string
}

/** Consistent page title block used at the top of every dashboard screen. */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">{description}</p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 sm:gap-3">{actions}</div> : null}
    </header>
  )
}

export default PageHeader
