import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/cn'

export type ModalSize = 'sm' | 'md' | 'lg'

const sizeStyles: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-3xl',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-ink/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'w-full max-h-[92vh] overflow-hidden rounded-t-2xl border border-line bg-surface shadow-raised sm:rounded-xl',
          sizeStyles[size],
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 scrollbar-slim">{children}</div>

        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-canvas/60 px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  )
}

export default Modal
