import { MapPin, Radar, ShieldAlert, Siren, Target } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Loading'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatRelativeTime } from '@/lib/format'
import { getFeaturedOutbreak } from '@/services/api'

/**
 * Early warning showcase. The alert payload is already fetched through the API
 * layer, so switching to FastAPI later requires no change here.
 */
export function EarlyWarning() {
  const { data: outbreak, isLoading } = useAsyncData(() => getFeaturedOutbreak(), [])

  return (
    <section id="early-warning" className="border-b border-line bg-brand-900 text-brand-50">
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 grid-pattern-dense opacity-70"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-50 ring-1 ring-inset ring-white/15">
              <Siren className="size-3.5" aria-hidden="true" />
              Early warning system
            </span>

            <h2 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">
              Disease Risk Detected
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100">
              Every reported symptom, movement and vaccination record feeds a district level risk
              engine. When a threshold is crossed, farmers and veterinary officers are alerted with
              the exact location and the action required.
            </p>

            {isLoading || !outbreak ? (
              <div className="mt-8 space-y-3">
                <Skeleton className="h-16 w-full bg-white/10" />
                <Skeleton className="h-16 w-full bg-white/10" />
              </div>
            ) : (
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-brand-100">
                    Location
                  </dt>
                  <dd className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <MapPin className="size-4 text-brand-200" aria-hidden="true" />
                    {outbreak.district} District
                  </dd>
                  <dd className="mt-0.5 text-xs text-brand-100">{outbreak.state}</dd>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-brand-100">
                    Disease
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{outbreak.disease}</dd>
                  <dd className="mt-0.5 text-xs text-brand-100">
                    Reported {formatRelativeTime(outbreak.reportedOn)}
                  </dd>
                </div>

                <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-red-100">Risk</dt>
                  <dd className="mt-1 flex items-center gap-2">
                    <Badge tone="danger" icon={ShieldAlert}>
                      HIGH
                    </Badge>
                    <span className="nums text-xs text-red-50">
                      {outbreak.confirmedCases} confirmed cases
                    </span>
                  </dd>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-brand-100">
                    Affected Area
                  </dt>
                  <dd className="nums mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <Target className="size-4 text-brand-200" aria-hidden="true" />
                    {outbreak.affectedAreaKm} km radius
                  </dd>
                  <dd className="nums mt-0.5 text-xs text-brand-100">
                    {outbreak.animalsAffected} animals under observation
                  </dd>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-4 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-brand-100">
                    Recommended Action
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-white">
                    {outbreak.recommendedAction}
                  </dd>
                  <dd className="mt-3">
                    <Button to="/login" variant="secondary" size="sm">
                      Sign in to view live alerts
                    </Button>
                  </dd>
                </div>
              </dl>
            )}
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <Radar className="size-4 text-brand-200" aria-hidden="true" />
                  Outbreak proximity
                </p>
                <Badge tone="danger" size="sm" dot>
                  Active surveillance
                </Badge>
              </div>

              <div className="relative mx-auto mt-6 aspect-square w-full max-w-xs">
                {[0, 1, 2].map((ring) => (
                  <span
                    key={ring}
                    className="absolute rounded-full border border-white/15"
                    style={{ inset: `${ring * 16}%` }}
                  />
                ))}
                <span className="absolute inset-[38%] rounded-full border border-brand-300/50 bg-brand-500/25" />
                <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                <span className="absolute left-[62%] top-[34%] size-2.5 rounded-full bg-red-400" />
                <span className="absolute left-[30%] top-[58%] size-2.5 rounded-full bg-amber-300" />
                <span className="absolute left-[46%] top-[74%] size-2.5 rounded-full bg-emerald-300" />
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-medium text-brand-100">
                  Your farm
                </span>
              </div>

              <ul className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
                <li>
                  <p className="nums text-lg font-semibold text-white">25</p>
                  <p className="text-[11px] uppercase tracking-wide text-brand-100">km radius</p>
                </li>
                <li>
                  <p className="nums text-lg font-semibold text-white">6</p>
                  <p className="text-[11px] uppercase tracking-wide text-brand-100">confirmed</p>
                </li>
                <li>
                  <p className="nums text-lg font-semibold text-white">42</p>
                  <p className="text-[11px] uppercase tracking-wide text-brand-100">monitored</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EarlyWarning
