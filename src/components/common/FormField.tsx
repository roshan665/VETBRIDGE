import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'number' | 'date'
  placeholder?: string
  error?: string
  hint?: string
  icon?: LucideIcon
  autoComplete?: string
  required?: boolean
  disabled?: boolean
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal'
}

export interface TextareaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  error?: string
  hint?: string
}

export function TextareaField({ label, value, onChange, placeholder, rows = 4, error, hint }: TextareaFieldProps) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn('w-full resize-y rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 transition-colors focus:outline-none', error ? controlError : controlOk, 'focus:border-brand-500')}
      />
    </FieldShell>
  )
}

export interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  hint?: string
  autoComplete?: string
  required?: boolean
  disabled?: boolean
}

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  )
}

const controlBase =
  'h-11 w-full rounded-lg border bg-surface text-sm text-ink placeholder:text-ink-muted/70 transition-colors disabled:cursor-not-allowed disabled:bg-canvas'
const controlOk = 'border-line focus:border-brand-500'
const controlError = 'border-red-400 focus:border-red-500'

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  icon: Icon,
  autoComplete,
  required,
  disabled,
  inputMode,
}: TextFieldProps) {
  const id = useId()

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            controlBase,
            error ? controlError : controlOk,
            'px-3.5',
            Icon && 'pl-9.5',
          )}
        />
      </div>
    </FieldShell>
  )
}

export interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  required,
  disabled,
}: SelectFieldProps) {
  const id = useId()

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlBase, error ? controlError : controlOk, 'px-3 pr-8')}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder = 'Enter password',
  error,
  hint,
  autoComplete = 'current-password',
  required,
  disabled,
}: PasswordFieldProps) {
  const id = useId()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(controlBase, error ? controlError : controlOk, 'px-3.5 pr-11')}
        />
        <button
          type="button"
          onClick={() => setIsVisible((previous) => !previous)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          {isVisible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </FieldShell>
  )
}
