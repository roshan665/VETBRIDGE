import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle'
export type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles =
  'inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-700 text-white shadow-card hover:bg-brand-800',
  secondary: 'bg-emerald-50 text-brand-800 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100',
  outline: 'bg-surface text-ink ring-1 ring-inset ring-line hover:ring-brand-300 hover:text-brand-700',
  ghost: 'text-ink-soft hover:bg-brand-50 hover:text-brand-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export interface ButtonProps {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconRight?: LucideIcon
  loading?: boolean
  fullWidth?: boolean
  className?: string
  /** When set the button renders as a react-router <Link>. */
  to?: string
  /** When set the button renders as an anchor (same tab unless `external`). */
  href?: string
  external?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  title?: string
  'aria-label'?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  className,
  to,
  href,
  external = false,
  type = 'button',
  disabled,
  onClick,
  title,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="size-4" aria-hidden="true" />
      ) : null}
      {children}
      {IconRight ? <IconRight className="size-4" aria-hidden="true" /> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} title={title} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        title={title}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}

export default Button
