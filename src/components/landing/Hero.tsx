import { Activity, ChevronRight, ShieldCheck, Sparkles, Thermometer, Syringe } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'

interface LivestockRow {
  tag: string
  name: string
  status: 'Healthy' | 'At risk' | 'Critical'
  score: number
  tone: 'success' | 'warning' | 'danger'
}

const herdRows: LivestockRow[] = [
  { tag: 'COW-1038', name: 'Nandini', status: 'Healthy', score: 91, tone: 'success' },
  { tag: 'COW-1042', name: 'Ganga', status: 'At risk', score: 68, tone: 'warning' },
  { tag: 'BUF-2036', name: 'Dhara', status: 'Critical', score: 38, tone: 'danger' },
]

const barTone: Record<LivestockRow['tone'], string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

/** Landing hero: product positioning on the left, a CSS-based product visual on the right. */
export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-line bg-surface">
      <div
        className="pointer-events-none absolute inset-0 grid-pattern opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand-100/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <Badge tone="brand" icon={Sparkles}>
            AI-POWERED LIVESTOCK HEALTH
          </Badge>

          <h1 className="mt-5 text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-5xl">
            Smarter Livestock Health.
            <span className="block text-brand-700">Earlier Disease Detection.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            An intelligent platform for early disease detection, preventive care, veterinary
            coordination and livestock health monitoring.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/register" size="lg" iconRight={ChevronRight}>
              Get Started
            </Button>
            <Button href="#features" variant="outline" size="lg">
              Explore Platform
            </Button>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Detection
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">Risk flagged in 12 hours</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Coverage
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">Cattle, buffalo, goat, sheep</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Response
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">Vet dispatch &amp; alerts</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-4 rounded-3xl border border-line bg-canvas/70"
            aria-hidden="true"
          />

          <div className="relative rounded-2xl border border-line bg-surface p-5 shadow-raised">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <p className="text-sm font-semibold text-ink">Live herd monitoring</p>
              </div>
              <Badge tone="success" size="sm" dot>
                24/7 active
              </Badge>
            </div>

            <ul className="mt-4 space-y-3">
              {herdRows.map((row) => (
                <li key={row.tag} className="rounded-lg border border-line bg-canvas/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-medium text-ink">
                      {row.name}
                      <span className="ml-2 rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-medium text-ink-soft ring-1 ring-inset ring-line">
                        {row.tag}
                      </span>
                    </p>
                    <Badge tone={row.tone} size="sm">
                      {row.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className={`h-full rounded-full ${barTone[row.tone]}`}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span className="nums text-[11px] font-medium text-ink-muted">{row.score}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-lg border border-line p-3">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-ink">
                  <Activity className="size-3.5 text-brand-600" aria-hidden="true" />
                  Herd activity index
                </p>
                <span className="nums text-xs font-medium text-brand-700">+6.4%</span>
              </div>
              <svg
                viewBox="0 0 240 56"
                className="mt-2 h-14 w-full"
                role="img"
                aria-label="Herd activity index rising over the last 7 days"
              >
                <polyline
                  points="0,44 34,38 68,46 102,30 136,34 170,22 204,26 240,14"
                  fill="none"
                  stroke="#2c7f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <polyline
                  points="0,54 34,52 68,53 102,47 136,50 170,44 204,46 240,40"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                <span>Healthy herd</span>
                <span>At-risk trend</span>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-32 hidden items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-raised xl:flex">
            <ShieldCheck className="size-4 text-amber-600" aria-hidden="true" />
            <span className="text-xs font-medium text-ink">AI flagged: Lumpy Skin risk</span>
          </div>

          <div className="absolute -right-4 bottom-28 hidden items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-raised xl:flex">
            <Syringe className="size-4 text-brand-600" aria-hidden="true" />
            <span className="text-xs font-medium text-ink">FMD booster due in 4 days</span>
          </div>

          <div className="absolute -bottom-4 left-6 hidden items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-raised xl:flex">
            <Thermometer className="size-4 text-blue-600" aria-hidden="true" />
            <span className="text-xs font-medium text-ink">Avg temperature 38.6 °C</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
