import type { ReactNode } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export type StatTone = 'brand' | 'success' | 'warning' | 'danger' | 'info'

const toneStyles: Record<StatTone, { chip: string; value: string; bar: string }> = {
  brand: { chip: 'bg-brand-50 text-brand-700 ring-brand-100', value: 'text-ink', bar: 'bg-brand-600' },
  success: {
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    value: 'text-emerald-700',
    bar: 'bg-emerald-600',
  },
  warning: {
    chip: 'bg-amber-50 text-amber-700 ring-amber-100',
    value: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  danger: { chip: 'bg-red-50 text-red-700 ring-red-100', value: 'text-red-700', bar: 'bg-red-600' },
  info: { chip: 'bg-blue-50 text-blue-700 ring-blue-100', value: 'text-blue-700', bar: 'bg-blue-600' },
}

export interface StatTrend {
  value: string
  direction: 'up' | 'down' | 'flat'
  label?: string
  /** When false, an upward trend is treated as bad (e.g. critical cases). */
  positiveIsGood?: boolean
}

export interface StatCardProps {
  label: string
  value: ReactNode
  icon?: LucideIcon
  tone?: StatTone
  caption?: string
  trend?: StatTrend
  /** 0-100, renders a thin progress bar under the value. */
  progress?: number
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  caption,
  trend,
  progress,
  className,
}: StatCardProps) {
  const styles = toneStyles[tone]
  const trendGood =
    trend === undefined
      ? true
      : trend.direction === 'flat'
        ? true
        : (trend.direction === 'up') === (trend.positiveIsGood ?? true)

  const TrendIcon =
    trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-raised',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
        {Icon ? (
          <span
            className={cn('grid size-9 place-items-center rounded-lg ring-1 ring-inset', styles.chip)}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <p className={cn('mt-3 text-2xl font-semibold nums sm:text-3xl', styles.value)}>{value}</p>

      {caption ? <p className="mt-1 text-xs leading-relaxed text-ink-muted">{caption}</p> : null}

      {typeof progress === 'number' ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className={cn('h-full rounded-full', styles.bar)}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}

      {trend ? (
        <p
          className={cn(
            'mt-3 inline-flex items-center gap-1.5 text-xs font-medium',
            trendGood ? 'text-emerald-700' : 'text-red-700',
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          {trend.value}
          {trend.label ? <span className="font-normal text-ink-muted">{trend.label}</span> : null}
        </p>
      ) : null}
    </div>
  )
}

export default StatCard
