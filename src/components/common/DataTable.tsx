import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import { EmptyState } from '@/components/common/EmptyState'
import { SkeletonRows } from '@/components/common/Loading'

export interface Column<T> {
  key: string
  header: ReactNode
  render?: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  /** Hides the column on small screens to avoid horizontal overflow. */
  hideOnMobile?: boolean
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: LucideIcon
  emptyAction?: ReactNode
  onRowClick?: (row: T) => void
  maxHeight?: string
  footer?: ReactNode
}

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

/** Generic, responsive table. Pages only describe columns and rows. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyIcon,
  emptyAction,
  onRowClick,
  maxHeight,
  footer,
}: DataTableProps<T>) {
  if (isLoading) {
    return <SkeletonRows rows={5} columns={Math.min(columns.length, 5)} />
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        action={emptyAction}
      />
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-slim" style={maxHeight ? { maxHeight } : undefined}>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/70">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted',
                  alignStyles[column.align ?? 'left'],
                  column.hideOnMobile && 'hidden md:table-cell',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'transition-colors',
                onRowClick ? 'cursor-pointer hover:bg-brand-50/60' : 'hover:bg-canvas/60',
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-3 align-middle text-ink-soft',
                    alignStyles[column.align ?? 'left'],
                    column.hideOnMobile && 'hidden md:table-cell',
                    column.className,
                  )}
                >
                  {column.render
                    ? column.render(row)
                    : String((row as unknown as Record<string, unknown>)[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footer ? (
        <div className="border-t border-line px-4 py-3 text-xs text-ink-muted">{footer}</div>
      ) : null}
    </div>
  )
}

export default DataTable
