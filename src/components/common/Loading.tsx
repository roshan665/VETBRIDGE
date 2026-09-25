import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('size-5 animate-spin text-brand-600', className)} aria-hidden="true" />
  )
}

export interface LoadingProps {
  label?: string
  className?: string
}

/** Block level loader used while a page section is fetching data. */
export function Loading({ label = 'Loading data', className }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center justify-center gap-3 px-6 py-12 text-sm text-ink-muted', className)}
    >
      <Spinner />
      {label}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-brand-50', className)} />
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={`skeleton-line-${index}`}
          className={cn('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

export interface SkeletonRowsProps {
  rows?: number
  columns?: number
}

/** Table placeholder so tables keep their layout while loading. */
export function SkeletonRows({ rows = 5, columns = 4 }: SkeletonRowsProps) {
  return (
    <div className="space-y-3 p-5" role="status" aria-live="polite">
      <span className="sr-only">Loading records</span>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`skeleton-row-${rowIndex}`} className="flex items-center gap-4">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton
              key={`skeleton-cell-${rowIndex}-${columnIndex}`}
              className={cn('h-4', columnIndex === 0 ? 'w-1/4' : 'flex-1')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Loading
