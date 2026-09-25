import { CheckCircle2, ShieldCheck } from 'lucide-react'

import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/cn'

export interface AuthSnapshotRow {
  label: string
  value: string
  progress: number
  tone: 'success' | 'warning' | 'danger'
}

export interface AuthVisualProps {
  title: string
  description: string
  highlights: string[]
  snapshot: AuthSnapshotRow[]
  footnote?: string
}

const barTone: Record<AuthSnapshotRow['tone'], string> = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
}

/** Left hand visual column shared by the login and register screens. */
export function AuthVisual({ title, description, highlights, snapshot, footnote }: AuthVisualProps) {
  return (
    <aside className="relative hidden overflow-hidden bg-brand-900 lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute inset-0 grid-pattern-dense opacity-70"
        aria-hidden="true"
      />

      <div className="relative px-10 pt-10">
        <Logo tone="light" />
      </div>

      <div className="relative px-10 py-10">
        <h2 className="max-w-sm text-2xl font-semibold leading-snug text-white">{title}</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-100">{description}</p>

        <ul className="mt-6 space-y-2.5">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-sm text-brand-50">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-8 max-w-md rounded-xl border border-white/15 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Herd health snapshot</p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-100">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Live
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {snapshot.map((row) => (
              <li key={row.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-100">{row.label}</span>
                  <span className="nums font-semibold text-white">{row.value}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn('h-full rounded-full', barTone[row.tone])}
                    style={{ width: `${Math.min(100, Math.max(0, row.progress))}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative px-10 pb-10">
        <p className="inline-flex items-start gap-2 text-xs leading-relaxed text-brand-100">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {footnote ??
            'Role based access control. Livestock records are visible only to the owner, the assigned veterinarian and authorised surveillance officers.'}
        </p>
      </div>
    </aside>
  )
}

export default AuthVisual
