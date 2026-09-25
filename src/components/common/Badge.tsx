import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type BadgeSize = 'sm' | 'md'

const toneStyles: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const dotStyles: Record<BadgeTone, string> = {
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  size?: BadgeSize
  icon?: LucideIcon
  dot?: boolean
  className?: string
}

export function Badge({
  children,
  tone = 'neutral',
  size = 'sm',
  icon: Icon,
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset',
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
    >
      {dot ? <span className={cn('size-1.5 rounded-full', dotStyles[tone])} /> : null}
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export default Badge
