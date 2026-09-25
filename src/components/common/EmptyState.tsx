import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export default EmptyState
