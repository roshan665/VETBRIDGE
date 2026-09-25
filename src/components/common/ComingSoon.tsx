import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Card, CardBody, CardHeader } from '@/components/common/Card'

export interface ComingSoonProps {
  title: string
  description: string
  icon?: LucideIcon
  /** Capabilities already planned / in build for this module. */
  plannedFeatures: string[]
  /** Backend work this module will depend on. */
  dataSources?: string[]
  /** Live modules the user can use right now. */
  relatedLinks?: Array<{ label: string; to: string }>
}

/**
 * Professional placeholder for modules that are not built yet, so no route is
 * ever broken or blank.
 */
export function ComingSoon({
  title,
  description,
  icon: Icon = Clock,
  plannedFeatures,
  dataSources,
  relatedLinks,
}: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title={`${title} - module in development`}
          description={description}
          icon={Icon}
          action={
            <Badge tone="info" icon={Clock}>
              Planned
            </Badge>
          }
        />
        <CardBody className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-ink">What this module will deliver</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {plannedFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {dataSources && dataSources.length > 0 ? (
            <div className="rounded-lg border border-line bg-canvas/60 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Backend contracts reserved for this screen
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <li key={source}>
                    <code className="rounded-md bg-surface px-2 py-1 text-xs text-brand-700 ring-1 ring-inset ring-line">
                      {source}
                    </code>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                These endpoints are already declared in <code>src/services/api.ts</code>. The screen
                starts returning live data as soon as the FastAPI service is connected - no UI
                refactor required.
              </p>
            </div>
          ) : null}
        </CardBody>
      </Card>

      {relatedLinks && relatedLinks.length > 0 ? (
        <Card>
          <CardHeader
            title="Available right now"
            description="These modules are already functional with the current dataset."
          />
          <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {link.label}
                <ArrowRight
                  className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </CardBody>
        </Card>
      ) : null}
    </div>
  )
}

export default ComingSoon
