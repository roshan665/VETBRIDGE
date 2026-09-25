import { ArrowRight, Landmark, Stethoscope, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/common/Button'

interface RoleCard {
  icon: LucideIcon
  role: string
  headline: string
  description: string
  capabilities: string[]
  cta: { label: string; to: string }
}

const roleCards: RoleCard[] = [
  {
    icon: Users,
    role: 'Farmer',
    headline: 'Your animals, your records',
    description: 'Monitor animals, detect health risks and manage preventive care.',
    capabilities: [
      'Animal registry with health history',
      'AI symptom check and risk grading',
      'Vaccination and treatment reminders',
      'Alert feed with recommended actions',
    ],
    cta: { label: 'Open farmer dashboard', to: '/farmer/dashboard' },
  },
  {
    icon: Stethoscope,
    role: 'Veterinarian',
    headline: 'Clinical command centre',
    description: 'Review cases, diagnose diseases and manage treatments.',
    capabilities: [
      'Assigned patient list with risk levels',
      'Pending diagnosis queue and lab samples',
      'Treatment plans and dosage records',
      'Today\'s field visits and video calls',
    ],
    cta: { label: 'Open veterinary dashboard', to: '/veterinarian/dashboard' },
  },
  {
    icon: Landmark,
    role: 'Government',
    headline: 'District level intelligence',
    description: 'Monitor disease patterns, outbreaks and regional livestock health.',
    capabilities: [
      'Regional disease risk and outbreak log',
      'Farm and veterinarian registries',
      'Vaccination coverage analytics',
      'State level trend and compliance reports',
    ],
    cta: { label: 'Open government dashboard', to: '/admin/dashboard' },
  },
]

/** Role based platform overview. */
export function RoleSection() {
  return (
    <section id="roles" className="border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            Role based platform
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            One platform, three connected workspaces
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Access and permissions are scoped to the role, while the underlying animal health
            record stays shared across the network.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {roleCards.map((card) => (
            <article
              key={card.role}
              className="flex flex-col rounded-xl border border-line bg-surface p-6 shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                  <card.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-ink">{card.role}</h3>
              </div>

              <p className="mt-4 text-sm font-medium text-ink">{card.headline}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{card.description}</p>

              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {card.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-2 text-xs text-ink-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-400" />
                    {capability}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-2">
                <Button to={card.cta.to} variant="outline" size="sm" iconRight={ArrowRight}>
                  {card.cta.label}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RoleSection
