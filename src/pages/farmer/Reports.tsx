import { useMemo, useState } from 'react'
import { AlertTriangle, Download, FileText, HeartPulse, Info, Syringe } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { DiseaseRiskChart } from '@/components/dashboard/DiseaseRiskChart'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAuth } from '@/context/AuthContext'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatAge, formatDate } from '@/lib/format'
import { healthLabel, healthTone, riskLabel, riskTone } from '@/lib/status'
import { getAnimals, getDashboardStats, getHerdHealthTrend } from '@/services/api'
import type { Animal } from '@/types'

const reportCatalogue = [
  {
    id: 'rep-herd',
    title: 'Herd health summary',
    description: 'Animal wise health score, risk grading and latest vitals.',
    coverage: 'Last 30 days',
  },
  {
    id: 'rep-vacc',
    title: 'Vaccination compliance',
    description: 'Coverage against the FMD, HS, BQ and PPR schedule for the farm.',
    coverage: 'Current season',
  },
  {
    id: 'rep-treat',
    title: 'Treatment outcomes',
    description: 'Diagnosis, medicine, dosage and recovery outcome per animal.',
    coverage: 'Last 90 days',
  },
  {
    id: 'rep-risk',
    title: 'Disease risk register',
    description: 'Risk alerts raised, acknowledgement status and recommended action.',
    coverage: 'Last 7 days',
  },
]

const attentionColumns: Column<Animal>[] = [
  {
    key: 'tag',
    header: 'Animal',
    render: (row) => (
      <div className="min-w-[8rem]">
        <p className="font-medium text-ink">{row.tag}</p>
        <p className="text-xs text-ink-muted">{row.name}</p>
      </div>
    ),
  },
  { key: 'breed', header: 'Breed', hideOnMobile: true },
  {
    key: 'ageMonths',
    header: 'Age',
    hideOnMobile: true,
    render: (row) => <span className="nums">{formatAge(row.ageMonths)}</span>,
  },
  {
    key: 'healthScore',
    header: 'Score',
    render: (row) => <span className="nums font-medium text-ink">{row.healthScore}</span>,
  },
  {
    key: 'riskLevel',
    header: 'Risk',
    render: (row) => (
      <Badge tone={riskTone[row.riskLevel]} size="sm">
        {riskLabel[row.riskLevel]}
      </Badge>
    ),
  },
  {
    key: 'healthStatus',
    header: 'Status',
    render: (row) => (
      <Badge tone={healthTone[row.healthStatus]} size="sm">
        {healthLabel[row.healthStatus]}
      </Badge>
    ),
  },
  {
    key: 'lastCheckup',
    header: 'Last checkup',
    hideOnMobile: true,
    render: (row) => <span className="nums">{formatDate(row.lastCheckup)}</span>,
  },
]

export default function FarmerReports() {
  const { user } = useAuth()
  const [requestedReport, setRequestedReport] = useState<string | null>(null)

  const { data: stats } = useAsyncData(() => getDashboardStats(), [])
  const { data: trend, isLoading: isLoadingTrend } = useAsyncData(() => getHerdHealthTrend(), [])
  const { data: animals, isLoading: isLoadingAnimals } = useAsyncData(() => getAnimals(), [])

  const attention = useMemo(
    () =>
      (animals ?? [])
        .filter((animal) => animal.riskLevel !== 'low' || animal.healthStatus !== 'healthy')
        .sort((a, b) => a.healthScore - b.healthScore),
    [animals],
  )

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Farm level health, vaccination and treatment reports for records, subsidy claims and veterinary audits."
        meta={
          <Badge tone="brand" dot>
            {user?.farmName ?? 'Your farm'}
          </Badge>
        }
        actions={
          <Button icon={Download} onClick={() => setRequestedReport('Monthly herd health summary')}>
            Download monthly report
          </Button>
        }
      />

      <section aria-label="Report summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Animals Covered"
          value={stats?.totalAnimals ?? '—'}
          icon={FileText}
          tone="brand"
          caption="Included in farm reports"
        />
        <StatCard
          label="Herd Health Score"
          value={stats?.healthScore ?? '—'}
          icon={HeartPulse}
          tone="success"
          caption="Average across the herd"
        />
        <StatCard
          label="Vaccinations Due"
          value={stats?.vaccinationsDue ?? '—'}
          icon={Syringe}
          tone="warning"
          caption="Pending immunisations"
        />
        <StatCard
          label="Open Alerts"
          value={stats?.activeAlerts ?? '—'}
          icon={AlertTriangle}
          tone="danger"
          caption="Unresolved risk alerts"
        />
      </section>

      <Card>
        <CardHeader
          title="Herd health trend"
          description="Healthy, at-risk and critical animals over the last 7 days"
          icon={HeartPulse}
          action={<Badge tone="neutral">7 day window</Badge>}
        />
        <CardBody>
          {isLoadingTrend || !trend ? (
            <div className="h-[300px] animate-pulse rounded-lg bg-brand-50" />
          ) : (
            <DiseaseRiskChart data={trend} variant="line" height={300} />
          )}
        </CardBody>
      </Card>

      {requestedReport ? (
        <p className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-800">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">{requestedReport}</strong> queued. PDF rendering is
            served by the FastAPI reporting module and will be enabled with the backend release.
          </span>
        </p>
      ) : null}

      <section aria-label="Report catalogue" className="grid gap-4 lg:grid-cols-2">
        {reportCatalogue.map((report) => (
          <Card key={report.id}>
            <CardBody className="flex h-full flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{report.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                    {report.description}
                  </p>
                </div>
                <Badge tone="neutral" size="sm">
                  {report.coverage}
                </Badge>
              </div>
              <div className="mt-auto">
                <Button
                  size="sm"
                  variant="outline"
                  icon={Download}
                  onClick={() => setRequestedReport(report.title)}
                >
                  Generate report
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader
          title="Animals requiring attention"
          description="Lowest health scores and elevated risk gradings."
          icon={AlertTriangle}
          action={<Badge tone="warning">{attention.length} animals</Badge>}
        />
        <CardBody padded={false}>
          <DataTable
            columns={attentionColumns}
            rows={attention}
            rowKey={(row) => row.id}
            isLoading={isLoadingAnimals}
            emptyTitle="No animals need attention"
            emptyDescription="Every animal is currently healthy with a low risk grading."
            emptyIcon={HeartPulse}
            footer={<span>Sorted by health score, lowest first</span>}
          />
        </CardBody>
        <CardFooter>
          <span>Reports can be shared with the assigned veterinary officer.</span>
        </CardFooter>
      </Card>
    </div>
  )
}
