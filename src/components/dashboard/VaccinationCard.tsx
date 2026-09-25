import { CalendarDays, Syringe } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { vaccinationLabel, vaccinationTone } from '@/lib/status'
import type { Vaccination, VaccinationStatus } from '@/types'

export interface VaccinationCardProps {
  vaccination: Vaccination
  className?: string
}

/** Compact card for a single vaccination record. */
export function VaccinationCard({ vaccination, className }: VaccinationCardProps) {
  return (
    <article
      className={cn(
        'flex items-start gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-brand-200',
        className,
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
        <Syringe className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-ink">{vaccination.vaccine}</h4>
          <Badge tone={vaccinationTone[vaccination.status]} size="sm">
            {vaccinationLabel[vaccination.status]}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-ink-muted">{vaccination.protectsAgainst}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
          <span className="rounded-md bg-canvas px-2 py-0.5 font-medium text-ink-soft ring-1 ring-inset ring-line">
            {vaccination.animalTag}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Due {formatDate(vaccination.dueDate)}
          </span>
        </div>
      </div>
    </article>
  )
}

const summaryOrder: VaccinationStatus[] = ['due-soon', 'overdue', 'upcoming', 'completed']

const summaryTone: Record<VaccinationStatus, string> = {
  'due-soon': 'text-amber-700',
  overdue: 'text-red-700',
  upcoming: 'text-blue-700',
  completed: 'text-emerald-700',
}

export interface VaccinationSummaryProps {
  vaccinations: Vaccination[]
  className?: string
}

/** Counts of vaccinations grouped by status. */
export function VaccinationSummary({ vaccinations, className }: VaccinationSummaryProps) {
  const counts = summaryOrder.map((status) => ({
    status,
    count: vaccinations.filter((item) => item.status === status).length,
  }))

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}>
      {counts.map((entry) => (
        <div key={entry.status} className="rounded-lg border border-line bg-canvas/60 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {vaccinationLabel[entry.status]}
          </p>
          <p className={cn('mt-1 text-xl font-semibold nums', summaryTone[entry.status])}>
            {entry.count}
          </p>
        </div>
      ))}
    </div>
  )
}

export default VaccinationCard
