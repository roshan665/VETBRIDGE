import { useMemo } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  ChevronRight,
  CircleCheck,
  MapPinned,
  Radar,
  ShieldAlert,
  Stethoscope,
  Syringe,
} from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardHeader } from '@/components/common/Card'
import { Loading } from '@/components/common/Loading'
import { PageHeader } from '@/components/common/PageHeader'
import {
  CoverageBarChart,
  DiseaseTrendChart,
  HealthCoverageChart,
} from '@/components/dashboard/DiseaseRiskChart'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatRelativeTime, titleCase } from '@/lib/format'
import { riskLabel, riskTone } from '@/lib/status'
import {
  getAdminStats,
  getDistrictCoverage,
  getDistrictRisks,
  getHealthCoverage,
  getMonthlyDiseaseTrend,
  getOutbreakAlerts,
} from '@/services/api'

export default function AdminDashboard() {
  const { data: stats } = useAsyncData(() => getAdminStats(), [])
  const { data: districts } = useAsyncData(() => getDistrictRisks(), [])
  const { data: trends } = useAsyncData(() => getMonthlyDiseaseTrend(), [])
  const { data: healthCoverage } = useAsyncData(() => getHealthCoverage(), [])
  const { data: districtCoverage } = useAsyncData(() => getDistrictCoverage(), [])
  const { data: outbreaks } = useAsyncData(() => getOutbreakAlerts(), [])

  const highRiskDistricts = useMemo(
    () => (districts ?? []).filter((district) => district.riskLevel === 'high'),
    [districts],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Government command centre"
        title="Livestock Health Intelligence"
        description="Monitor regional disease patterns, active alerts and preventive care coverage across the state."
        meta={<Badge tone="brand" dot>Live surveillance view</Badge>}
        actions={<Button variant="outline" icon={Radar}>Refresh intelligence</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Network statistics">
        <StatCard label="Animals monitored" value={stats?.animalsMonitored ?? '—'} icon={Activity} tone="brand" caption="Across registered farms" progress={86} />
        <StatCard label="Active disease alerts" value={stats?.activeAlerts ?? '—'} icon={ShieldAlert} tone="danger" caption="Require district review" trend={{ value: '6 new today', direction: 'up', positiveIsGood: false }} />
        <StatCard label="High risk regions" value={stats?.highRiskRegions ?? '—'} icon={MapPinned} tone="warning" caption="Prioritised for inspection" />
        <StatCard label="Registered farms" value={stats?.registeredFarms ?? '—'} icon={Building2} tone="info" caption="Network participation" progress={92} />


      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader title="Regional disease risk" description="Active risk signals by district" icon={MapPinned} action={<Button to="/admin/map" variant="ghost" size="sm" iconRight={ChevronRight}>Open GIS map</Button>} />
          <CardBody>
            {districts ? <RegionalRisk districts={districts} /> : <Loading label="Loading district risk" />}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Livestock health coverage" description="Statewide monitoring and vaccination reach" icon={Syringe} />
          <CardBody>{healthCoverage ? <HealthCoverageChart data={healthCoverage} height={220} /> : <Loading label="Loading coverage" />}</CardBody>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader title="Disease trends" description="Reported indicators over the last 12 months" icon={Activity} action={<Badge tone="neutral">Monthly</Badge>} />
          <CardBody>{trends ? <DiseaseTrendChart data={trends} height={300} /> : <Loading label="Loading disease trends" />}</CardBody>
        </Card>
        <Card>
          <CardHeader title="District coverage" description="Vaccination coverage by district" icon={CircleCheck} />
          <CardBody>{districtCoverage ? <CoverageBarChart data={districtCoverage} height={300} /> : <Loading label="Loading district coverage" />}</CardBody>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="High risk districts" description="Districts requiring coordinated intervention" icon={AlertTriangle} action={<Badge tone="danger">{highRiskDistricts.length} priority</Badge>} />
          <CardBody padded={false}>
            <ul className="divide-y divide-line">
              {(highRiskDistricts.length ? highRiskDistricts : districts ?? []).slice(0, 5).map((district) => (
                <li key={district.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600"><MapPinned className="size-4" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{district.district}</p><p className="text-xs text-ink-muted">{district.state} · {district.activeAlerts} active alerts</p></div>
                  <Badge tone={riskTone[district.riskLevel]} size="sm">{riskLabel[district.riskLevel]}</Badge>
                </li>
              ))}
            </ul>
          </CardBody>
          <div className="border-t border-line px-5 py-3"><Button to="/admin/disease-monitoring" variant="ghost" size="sm" iconRight={ArrowUpRight}>View all disease monitoring</Button></div>
        </Card>
        <Card>
          <CardHeader title="Recent outbreak alerts" description="Latest events from the surveillance network" icon={ShieldAlert} action={<Badge tone="danger">{outbreaks?.length ?? 0} events</Badge>} />
          <CardBody padded={false}>
            <ul className="divide-y divide-line">
              {(outbreaks ?? []).slice(0, 4).map((outbreak) => (
                <li key={outbreak.id} className="px-5 py-3.5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-ink">{outbreak.disease}</p><p className="mt-1 text-xs text-ink-muted">{outbreak.district} · {outbreak.affectedAreaKm} km affected</p></div><Badge tone={outbreak.status === 'active' ? 'danger' : outbreak.status === 'monitoring' ? 'warning' : 'success'} size="sm">{titleCase(outbreak.status)}</Badge></div><p className="mt-2 text-xs text-ink-soft">{outbreak.animalsAffected} animals affected · {formatRelativeTime(outbreak.reportedOn)}</p></li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader title="Network operations" description="Cross-sector activity requiring attention" icon={Stethoscope} />
        <CardBody className="grid gap-3 sm:grid-cols-3">
          <NetworkMetric label="Veterinarians on duty" value={stats?.veterinarians ?? 0} detail="Available for field response" icon={Stethoscope} />
          <NetworkMetric label="Vaccination coverage" value={`${stats?.vaccinationCoverage ?? 0}%`} detail="Across registered farms" icon={Syringe} />
          <NetworkMetric label="Outbreaks contained" value={stats?.outbreaksContained ?? 0} detail="Resolved in the current period" icon={CircleCheck} />
        </CardBody>
      </Card>
    </div>
  )
}

function RegionalRisk({ districts }: { districts: Awaited<ReturnType<typeof getDistrictRisks>> }) {
  return <div className="relative overflow-hidden rounded-xl border border-line bg-[#f3f7f3] p-4"><div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#d7e4d9 1px, transparent 1px), linear-gradient(90deg, #d7e4d9 1px, transparent 1px)', backgroundSize: '32px 32px' }} /><div className="relative grid min-h-[220px] grid-cols-2 gap-3 sm:grid-cols-3">{districts.slice(0, 9).map((district) => <div key={district.id} className="rounded-lg border border-white/80 bg-surface/90 p-3 shadow-sm"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-semibold text-ink">{district.district}</p><span className={`size-2 rounded-full ${district.riskLevel === 'high' ? 'bg-red-500' : district.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} /></div><p className="mt-3 text-lg font-semibold text-ink">{district.activeAlerts}</p><p className="text-[11px] text-ink-muted">active alerts</p><p className="mt-2 text-[11px] text-ink-soft">{district.vaccinationCoverage}% vaccinated</p></div>)}</div><p className="relative mt-3 text-[11px] text-ink-muted">Geographic view placeholder · Leaflet GIS integration reserved for the next phase.</p></div>
}

function NetworkMetric({ label, value, detail, icon: Icon }: { label: string; value: number | string; detail: string; icon: typeof Stethoscope }) {
  return <div className="rounded-lg border border-line bg-canvas/50 p-4"><div className="flex items-center gap-2 text-xs font-medium text-ink-muted"><Icon className="size-4 text-brand-600" aria-hidden="true" />{label}</div><p className="nums mt-2 text-2xl font-semibold text-ink">{value}</p><p className="mt-1 text-xs text-ink-muted">{detail}</p></div>
}

