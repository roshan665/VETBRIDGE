import { cn } from '@/lib/cn'
import { scoreLabel, scoreTone } from '@/lib/status'

export interface HealthScoreProps {
  /** 0 - 100 composite livestock health score. */
  score: number
  label?: string
  caption?: string
  className?: string
  /** Optional score dimensions displayed as accessible progress bars. */
  breakdown?: Array<{ label: string; score: number }>
}

const ringStyles = {
  success: { stroke: '#1b6849', text: 'text-emerald-700' },
  warning: { stroke: '#b45309', text: 'text-amber-700' },
  danger: { stroke: '#b91c1c', text: 'text-red-700' },
  brand: { stroke: '#2c7f5e', text: 'text-brand-700' },
  info: { stroke: '#1d4ed8', text: 'text-blue-700' },
  neutral: { stroke: '#64748b', text: 'text-slate-600' },
} as const

/** Circular health score dial (pure SVG, no extra chart dependency). */
export function HealthScore({ score, label = 'Herd Health Score', caption, className, breakdown }: HealthScoreProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const tone = scoreTone(clamped)
  const styles = ringStyles[tone]

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dash = (clamped / 100) * circumference

  return (
    <div className={cn('flex items-center gap-5', className)}>
      <div className="relative size-[124px] shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" role="img" aria-label={`${label}: ${clamped} out of 100`}>
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e9e4" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={styles.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className={cn('text-2xl font-semibold nums', styles.text)}>{clamped}</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">
            / 100
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className={cn('mt-0.5 text-xs font-medium', styles.text)}>{scoreLabel(clamped)}</p>
        {caption ? (
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{caption}</p>
        ) : null}
        {breakdown?.length ? (
          <div className="mt-4 grid w-full max-w-sm gap-3">
            {breakdown.map((item) => {
              const value = Math.min(100, Math.max(0, item.score))
              return (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-ink-muted">{item.label}</span>
                    <span className="font-semibold text-ink nums">{value}%</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={item.label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                  >
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default HealthScore
