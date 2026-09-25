import { Landmark, Stethoscope, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import type { UserRole } from '@/types'

interface RoleOption {
  role: UserRole
  label: string
  description: string
  icon: LucideIcon
}

export const roleOptions: RoleOption[] = [
  {
    role: 'farmer',
    label: 'Farmer',
    description: 'Monitor animals and preventive care',
    icon: Users,
  },
  {
    role: 'veterinarian',
    label: 'Veterinarian',
    description: 'Diagnose cases and manage treatment',
    icon: Stethoscope,
  },
  {
    role: 'admin',
    label: 'Government',
    description: 'Track outbreaks and regional health',
    icon: Landmark,
  },
]

export interface RoleSelectorProps {
  value: UserRole
  onChange: (role: UserRole) => void
  /** stacked = login style, cards = register style */
  variant?: 'stacked' | 'cards'
  error?: string
}

/** Role picker shared by the login and registration forms. */
export function RoleSelector({ value, onChange, variant = 'stacked', error }: RoleSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">Select your role</legend>

      <div
        className={cn(
          'mt-2 gap-2',
          variant === 'stacked' ? 'grid grid-cols-3' : 'grid sm:grid-cols-3',
        )}
      >
        {roleOptions.map((option) => {
          const isActive = option.role === value
          return (
            <label
              key={option.role}
              className={cn(
                'cursor-pointer rounded-lg border p-3 transition-colors',
                isActive
                  ? 'border-brand-600 bg-brand-50 ring-1 ring-inset ring-brand-200'
                  : 'border-line bg-surface hover:border-brand-200',
              )}
            >
              <input
                type="radio"
                name="role"
                value={option.role}
                checked={isActive}
                onChange={() => onChange(option.role)}
                className="sr-only"
              />
              <span className="flex items-center gap-2">
                <option.icon
                  className={cn('size-4', isActive ? 'text-brand-700' : 'text-ink-muted')}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-brand-800' : 'text-ink',
                  )}
                >
                  {option.label}
                </span>
              </span>
              {variant === 'cards' ? (
                <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">
                  {option.description}
                </span>
              ) : null}
            </label>
          )
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

export default RoleSelector
