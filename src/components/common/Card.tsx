import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export interface CardProps {
  children: ReactNode
  className?: string
}

/** Base surface: thin border, subtle shadow, rounded-xl. */
export function Card({ children, className }: CardProps) {
  return (
    <section className={cn('rounded-xl border border-line bg-surface shadow-card', className)}>
      {children}
    </section>
  )
}

export interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  icon?: LucideIcon
  className?: string
}

export function CardHeader({ title, description, action, icon: Icon, className }: CardHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {description ? <p className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

export interface CardBodyProps {
  children: ReactNode
  className?: string
  padded?: boolean
}

export function CardBody({ children, className, padded = true }: CardBodyProps) {
  return <div className={cn(padded && 'p-5', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <footer
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 text-xs text-ink-muted',
        className,
      )}
    >
      {children}
    </footer>
  )
}

export default Card
