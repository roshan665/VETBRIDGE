import { Bell, Bug, Check, Scale, Siren, Syringe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/format'
import { severityTone } from '@/lib/status'
import type { Alert, AlertCategory } from '@/types'

const categoryIcons: Record<AlertCategory, LucideIcon> = {
  disease: Bug,
  vaccination: Syringe,
  weight: Scale,
  vitals: Siren,
  outbreak: Bell,
}

const severityBarStyles = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
} as const

const severityLabel = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' } as const

export interface AlertCardProps {
  alert: Alert
  onAcknowledge?: (alertId: string) => void
  className?: string
}

/** Single alert row used on the dashboards and the alerts feed. */
export function AlertCard({ alert, onAcknowledge, className }: AlertCardProps) {
  const Icon = categoryIcons[alert.category]

  return (
    <article
      className={cn(
        'flex gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-brand-200',
        className,
      )}
    >
      <span className={cn('mt-1 w-1 shrink-0 rounded-full', severityBarStyles[alert.severity])} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={severityTone[alert.severity]} size="sm">
            {severityLabel[alert.severity]}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Icon className="size-3.5" aria-hidden="true" />
            {alert.category}
          </span>
          <span className="text-xs text-ink-muted">· {formatRelativeTime(alert.createdAt)}</span>
        </div>

        <h4 className="mt-2 text-sm font-semibold text-ink">{alert.title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{alert.message}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          {alert.animalTag ? (
            <span className="rounded-md bg-canvas px-2 py-0.5 font-medium text-ink-soft ring-1 ring-inset ring-line">
              {alert.animalTag}
            </span>
          ) : null}
          {alert.location ? <span>{alert.location}</span> : null}
        </div>

        {onAcknowledge ? (
          <div className="mt-3">
            {alert.acknowledged ? (
              <Badge tone="neutral" icon={Check} size="sm">
                Acknowledged
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                icon={Check}
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default AlertCard
