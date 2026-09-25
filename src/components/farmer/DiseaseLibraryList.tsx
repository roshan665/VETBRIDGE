import { ShieldAlert, Syringe } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { riskLabel, riskTone } from '@/lib/status'
import type { DiseaseLibraryEntry } from '@/types'

export interface DiseaseLibraryListProps {
  entries: DiseaseLibraryEntry[]
}

/** Reference list of diseases with indicators and prevention guidance. */
export function DiseaseLibraryList({ entries }: DiseaseLibraryListProps) {
  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-ink">{entry.name}</h4>
            <div className="flex items-center gap-2">
              <Badge tone={riskTone[entry.severity]} size="sm">
                {riskLabel[entry.severity]} severity
              </Badge>
              {entry.reportingRequired ? (
                <Badge tone="info" size="sm" icon={ShieldAlert}>
                  Notifiable
                </Badge>
              ) : null}
            </div>
          </div>

          <p className="mt-1.5 text-xs text-ink-muted">Affects: {entry.affectedSpecies}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.keyIndicators.map((indicator) => (
              <span
                key={indicator}
                className="rounded-md bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink-soft ring-1 ring-inset ring-line"
              >
                {indicator}
              </span>
            ))}
          </div>

          <dl className="mt-3 space-y-2 border-t border-line pt-3 text-xs">
            <div>
              <dt className="font-medium text-ink">Transmission</dt>
              <dd className="mt-0.5 leading-relaxed text-ink-muted">{entry.transmission}</dd>
            </div>
            <div>
              <dt className="inline-flex items-center gap-1.5 font-medium text-ink">
                <Syringe className="size-3.5 text-brand-600" aria-hidden="true" />
                Prevention
              </dt>
              <dd className="mt-0.5 leading-relaxed text-ink-muted">{entry.prevention}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}

export default DiseaseLibraryList
