import { useMemo } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  Crosshair,
  MapPin,
  Stethoscope,
  Video,
} from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import { Loading } from '@/components/common/Loading'
import { PageHeader } from '@/components/common/PageHeader'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { DiseaseRiskChart, RiskDistributionChart } from '@/components/dashboard/DiseaseRiskChart'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAuth } from '@/context/AuthContext'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatPercent, formatRelativeTime, titleCase } from '@/lib/format'
import { caseLabel, caseTone, riskLabel, riskTone, scheduleTone } from '@/lib/status'
import {
  acknowledgeAlert,
  getCriticalAlerts,
  getPendingDiagnoses,
  getSchedule,
  getVetCaseTrend,
  getVetCases,
  getVetPatientRisk,
  getVeterinarianStats,
} from '@/services/api'
import type { VetCase } from '@/types'

const caseColumns: Column<VetCase>[] = [
  {
    key: 'animalTag',
    header: 'Case',
    render: (row) => (
      <div className="min-w-[9rem]">
        <p className="font-medium text-ink">{row.animalTag}</p>
        <p className="text-xs text-ink-muted">{row.animalName}</p>
      </div>
    ),
  },
  {
    key: 'ownerName',
    header: 'Owner / Farm',
    hideOnMobile: true,
    render: (row) => (
      <div className="min-w-[10rem]">
        <p>{row.ownerName}</p>
        <p className="text-xs text-ink-muted">
          {row.farmName} · {row.district}
        </p>
      </div>
    ),
  },
  {
    key: 'provisionalDiagnosis',
    header: 'Provisional diagnosis',
    render: (row) => <span className="min-w-[12rem] inline-block">{row.provisionalDiagnosis}</span>,
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
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge tone={caseTone[row.status]} size="sm">
        {caseLabel[row.status]}
      </Badge>
    ),
  },
  {
    key: 'reportedAt',
    header: 'Reported',
    hideOnMobile: true,
    render: (row) => <span className="text-xs">{formatRelativeTime(row.reportedAt)}</span>,
  },
]

export default function VeterinarianDashboard() {
  const { user } = useAuth()

  const { data: stats } = useAsyncData(() => getVeterinarianStats(), [])
  const { data: caseTrend, isLoading: isLoadingTrend } = useAsyncData(() => getVetCaseTrend(), [])
  const { data: patientRisk, isLoading: isLoadingRisk } = useAsyncData(
    () => getVetPatientRisk(),
    [],
  )
  const { data: cases, isLoading: isLoadingCases } = useAsyncData(() => getVetCases(), [])
  const { data: pending } = useAsyncData(() => getPendingDiagnoses(), [])
  const { data: schedule } = useAsyncData(() => getSchedule(), [])
  const { data: alerts, setData: setAlerts } = useAsyncData(() => getCriticalAlerts(), [])

  const highRiskCases = useMemo(
    () =>
      (cases ?? [])
        .filter((item) => item.status === 'awaiting-review' || item.riskLevel === 'high')
        .slice(0, 6),
    [cases],
  )

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId)
    setAlerts((previous) =>
      previous
        ? previous.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
        : previous,
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Veterinary workspace"
        title="Veterinary Command Center"
        description="Assigned caseload, pending diagnoses, today's schedule and critical surveillance alerts."
        meta={
          <>
            <Badge tone="brand" icon={Stethoscope}>
              {user?.designation ?? 'Veterinary Officer'}
            </Badge>
            <Badge tone="neutral">
              {user?.district ? `${user.district}, ${user.state ?? ''}`.trim() : 'District not set'}
            </Badge>
            <Badge tone="info" icon={ClipboardList}>
              {stats ? `${stats.pendingDiagnoses} pending diagnoses` : 'Syncing queue'}
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" to="/veterinarian/diagnosis" icon={Crosshair}>
              Review queue
            </Button>
            <Button to="/veterinarian/patients" icon={Stethoscope}>
              Patient list
            </Button>
          </>
        }
      />

      <section aria-label="Veterinary statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Assigned Animals"
          value={stats?.assignedAnimals ?? '—'}
          icon={Stethoscope}
          tone="brand"
          caption="Under active supervision"
        />
        <StatCard
          label="High Risk Cases"
          value={stats?.highRiskCases ?? '—'}
          icon={AlertTriangle}
          tone="danger"
          caption="Require clinical review"
        />
        <StatCard
          label="Pending Diagnoses"
          value={stats?.pendingDiagnoses ?? '—'}
          icon={ClipboardList}
          tone="warning"
          caption="Awaiting verification"
        />
        <StatCard
          label="Today's Appointments"
          value={stats?.appointmentsToday ?? '—'}
          icon={CalendarDays}
          tone="info"
          caption="Field visits and video calls"
        />
      </section>

      <section aria-label="Patient risk overview" className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Patient Risk Overview"
            description="Caseload composition over the last 7 days"
            icon={Stethoscope}
            action={<Badge tone="neutral">{stats?.assignedAnimals ?? 0} animals</Badge>}
          />
          <CardBody>
            {isLoadingTrend || !caseTrend ? (
              <Loading label="Loading caseload trend" className="h-[300px]" />
            ) : (
              <DiseaseRiskChart data={caseTrend} height={300} />
            )}
          </CardBody>
          <CardFooter>
            <span>Reflects every animal assigned to this veterinary officer.</span>
            <span className="nums">Response time {stats?.avgResponseHours ?? '—'} h</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader
            title="Caseload Risk Split"
            description="Animals grouped by current risk grading"
            icon={AlertTriangle}
          />
          <CardBody>
            {isLoadingRisk || !patientRisk ? (
              <Loading label="Loading risk split" className="h-[240px]" />
            ) : (
              <RiskDistributionChart data={patientRisk} height={220} />
            )}
          </CardBody>
          <CardFooter>
            <span>Vaccination coverage {stats?.vaccinationCoverage ?? '—'}%</span>
          </CardFooter>
        </Card>
      </section>

      <section aria-label="Cases" className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent Cases"
            description="Newest reported cases with provisional diagnosis"
            icon={ClipboardList}
            action={
              <Button variant="outline" size="sm" to="/veterinarian/patients">
                All patients
              </Button>
            }
          />
          <CardBody padded={false}>
            <DataTable
              columns={caseColumns}
              rows={highRiskCases}
              rowKey={(row) => row.id}
              isLoading={isLoadingCases}
              emptyTitle="No open cases"
              emptyDescription="Newly reported cases will appear here for triage."
              emptyIcon={ClipboardList}
              footer={<span>Cases needing review are listed first</span>}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Critical Alerts"
            description="Surveillance signals requiring attention"
            icon={AlertTriangle}
            action={<Badge tone="danger">{alerts?.filter((a) => !a.acknowledged).length ?? 0}</Badge>}
          />
          <CardBody className="space-y-3">
            {(alerts ?? []).length === 0 ? (
              <Loading label="Loading alerts" className="h-32" />
            ) : (
              (alerts ?? [])
                .slice(0, 3)
                .map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                ))
            )}
          </CardBody>
          <CardFooter>
            <Button variant="outline" size="sm" to="/veterinarian/alerts">
              All alerts
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section aria-label="Queue and schedule" className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Pending Diagnoses"
            description="Cases submitted by farmers awaiting clinical validation"
            icon={Crosshair}
            action={
              <Button variant="outline" size="sm" to="/veterinarian/diagnosis">
                Open queue
              </Button>
            }
          />
          <CardBody className="space-y-3">
            {(pending ?? []).length === 0 ? <Loading label="Loading diagnosis queue" /> : null}
            {(pending ?? []).slice(0, 4).map((item) => (
              <article key={item.id} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {item.animalTag}
                      <span className="ml-2 text-xs font-normal text-ink-muted">
                        {item.animalName}
                      </span>
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {item.farmName} · {item.district}
                    </p>
                  </div>
                  <Badge tone={riskTone[item.riskLevel]} size="sm">
                    {riskLabel[item.riskLevel]} risk
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
                  <span className="font-medium text-ink">{item.suggestedDisease}</span>
                  <span className="nums">Confidence {formatPercent(item.confidence * 100)}</span>
                  {item.labSampleSent ? (
                    <Badge tone="info" size="sm">
                      Lab sample sent
                    </Badge>
                  ) : (
                    <Badge tone="neutral" size="sm">
                      Sample pending
                    </Badge>
                  )}
                  <span className="text-ink-muted">{formatRelativeTime(item.submittedAt)}</span>
                </div>
              </article>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Today's Schedule"
            description="Field visits, sample collection and video consultations"
            icon={CalendarDays}
            action={<Badge tone="info">{schedule?.length ?? 0} appointments</Badge>}
          />
          <CardBody padded={false}>
            <ul className="divide-y divide-line">
              {(schedule ?? []).length === 0 ? <Loading label="Loading schedule" /> : null}
              {(schedule ?? []).map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="nums w-12 shrink-0 pt-0.5 text-sm font-semibold text-ink">
                    {item.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink">{item.animalTag}</p>
                      <Badge tone={scheduleTone[item.status]} size="sm">
                        {titleCase(item.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">{item.purpose}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                      {item.type === 'video-call' ? (
                        <Video className="size-3.5" aria-hidden="true" />
                      ) : (
                        <MapPin className="size-3.5" aria-hidden="true" />
                      )}
                      {item.location} · {item.ownerName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
          <CardFooter>
            <span>Reminders are sent to the farmer 2 hours before a visit.</span>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
