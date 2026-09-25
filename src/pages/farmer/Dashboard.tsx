import { useMemo } from 'react'
import { Activity, AlertTriangle, Bug, HeartPulse, Plus, ShieldCheck, Syringe } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import { Loading } from '@/components/common/Loading'
import { PageHeader } from '@/components/common/PageHeader'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { DiseaseRiskChart, RiskDistributionChart } from '@/components/dashboard/DiseaseRiskChart'
import { HealthScore } from '@/components/dashboard/HealthScore'
import { StatCard } from '@/components/dashboard/StatCard'

import { useAuth } from '@/context/AuthContext'
import { useAsyncData } from '@/hooks/useAsyncData'
import { firstName, formatDate, greetingForHour } from '@/lib/format'
import { vaccinationLabel, vaccinationTone } from '@/lib/status'
import {
  acknowledgeAlert,
  getAlerts,
  getDashboardStats,
  getHerdHealthTrend,
  getRiskDistribution,
  getVaccinations,
} from '@/services/api'
import type { Vaccination } from '@/types'

const vaccinationColumns: Column<Vaccination>[] = [
  {
    key: 'animalTag',
    header: 'Animal',
    render: (row) => <span className="font-medium text-ink">{row.animalTag}</span>,
  },
  {
    key: 'vaccine',
    header: 'Vaccine',
    render: (row) => (
      <div className="min-w-[10rem]">
        <p className="font-medium text-ink">{row.vaccine}</p>
        <p className="text-xs text-ink-muted">{row.protectsAgainst}</p>
      </div>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due Date',
    render: (row) => <span className="nums whitespace-nowrap">{formatDate(row.dueDate)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge tone={vaccinationTone[row.status]} size="sm">
        {vaccinationLabel[row.status]}
      </Badge>
    ),
  },
]

export default function FarmerDashboard() {
  const { user } = useAuth()

  const { data: stats, isLoading: isLoadingStats } = useAsyncData(() => getDashboardStats(), [])
  const { data: trend, isLoading: isLoadingTrend } = useAsyncData(() => getHerdHealthTrend(), [])
  const { data: riskDistribution, isLoading: isLoadingRisk } = useAsyncData(
    () => getRiskDistribution(),
    [],
  )
  const { data: alerts, setData: setAlerts } = useAsyncData(() => getAlerts(), [])
  const { data: vaccinations, isLoading: isLoadingVaccinations } = useAsyncData(
    () => getVaccinations(),
    [],
  )

  const upcomingVaccinations = useMemo(
    () =>
      (vaccinations ?? [])
        .filter((item) => item.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [vaccinations],
  )

  const activeAlerts = useMemo(
    () =>
      (alerts ?? [])
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [alerts],
  )

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId)
    setAlerts((previous) =>
      previous
        ? previous.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
        : previous,
    )
  }

  const total = stats?.totalAnimals ?? 0
  const share = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0)

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Farmer dashboard"
        title={`${greetingForHour()}, ${firstName(user?.name ?? 'Farmer')}`}
        description="Monitor your livestock health and take action before risks become critical."
        meta={
          <>
            <Badge tone="brand" dot>
              {user?.farmName ?? 'Your farm'}
            </Badge>
            <Badge tone="neutral">
              {user?.district ? `${user.district}, ${user.state ?? ''}`.trim() : 'Location not set'}
            </Badge>
            <Badge tone="info" icon={ShieldCheck}>
              {stats ? `${stats.activeAlerts} active alerts` : 'Syncing alerts'}
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" to="/farmer/animals" icon={Activity}>
              My Animals
            </Button>
            <Button icon={Plus} to="/farmer/animals/add">
              Add Animal
            </Button>
          </>
        }
      />

      <section aria-label="Herd statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoadingStats || !stats ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`stat-skeleton-${index}`}
              className="h-36 animate-pulse rounded-xl bg-brand-50"
            />
          ))
        ) : (
          <>
            <StatCard
              label="Total Animals"
              value={stats.totalAnimals}
              icon={Activity}
              tone="brand"
              caption={`Registered at ${user?.farmName ?? 'your farm'}`}
              progress={100}
            />
            <StatCard
              label="Healthy"
              value={stats.healthy}
              icon={HeartPulse}
              tone="success"
              caption={`${share(stats.healthy)}% of the herd`}
              progress={share(stats.healthy)}
              trend={{ value: '-1', direction: 'down', label: 'vs last week', positiveIsGood: true }}
            />
            <StatCard
              label="At Risk"
              value={stats.atRisk}
              icon={AlertTriangle}
              tone="warning"
              caption="Observation advised within 48 hours"
              progress={share(stats.atRisk)}
              trend={{ value: '+1', direction: 'up', label: 'vs last week', positiveIsGood: false }}
            />
            <StatCard
              label="Critical"
              value={stats.critical}
              icon={Bug}
              tone="danger"
              caption="Veterinary attention required today"
              progress={share(stats.critical)}
              trend={{ value: '+1', direction: 'up', label: 'vs last week', positiveIsGood: false }}
            />
          </>
        )}
      </section>

      <section aria-label="Livestock health overview" className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Livestock Health Overview"
            description="Herd composition over the last 7 days"
            icon={Activity}
            action={<Badge tone="neutral">7 day window</Badge>}
          />
          <CardBody>
            {isLoadingTrend || !trend ? (
              <Loading label="Loading health trend" className="h-[300px]" />
            ) : (
              <DiseaseRiskChart data={trend} height={300} />
            )}
          </CardBody>
          <CardFooter>
            <span>Status is derived from the latest recorded health entry per animal.</span>
            <span className="nums">Refreshed every 6 hours</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader
            title="Herd Health Score"
            description="Composite score from vitals, activity and treatment history"
            icon={HeartPulse}
          />
          <CardBody className="space-y-5">
            <HealthScore
              score={stats?.healthScore ?? 0}
              caption="A score above 80 indicates a stable herd. Three animals are currently pulling the score down."
            />
            <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-ink-muted">Alerts</dt>
                <dd className="nums mt-1 text-lg font-semibold text-ink">
                  {stats?.activeAlerts ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-ink-muted">Vaccines due</dt>
                <dd className="nums mt-1 text-lg font-semibold text-ink">
                  {stats?.vaccinationsDue ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-ink-muted">Species</dt>
                <dd className="nums mt-1 text-lg font-semibold text-ink">4</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </section>

      <section aria-label="Risk and alerts" className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Disease Risk Distribution"
            description="Risk grading of the current herd"
            icon={Bug}
          />
          <CardBody>
            {isLoadingRisk || !riskDistribution ? (
              <Loading label="Loading risk distribution" className="h-[240px]" />
            ) : (
              <RiskDistributionChart data={riskDistribution} height={240} />
            )}
          </CardBody>
          <CardFooter>
            <span>Risk grading uses symptoms, vitals and treatment history.</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader
            title="Recent Health Alerts"
            description="Latest flags raised by monitoring and detection"
            icon={AlertTriangle}
            action={<Badge tone="danger">{activeAlerts.length} open</Badge>}
          />
          <CardBody className="space-y-3">
            {activeAlerts.length === 0 ? (
              <Loading label="Loading alerts" className="h-32" />
            ) : (
              activeAlerts
                .slice(0, 4)
                .map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                ))
            )}
          </CardBody>
          <CardFooter>
            <span>Alerts are acknowledged per animal record.</span>
            <Button variant="outline" size="sm" to="/farmer/alerts">
              View all alerts
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section aria-label="Upcoming vaccinations and quick actions" className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Upcoming Vaccinations"
            description="Due and scheduled immunisations for your herd"
            icon={Syringe}
            action={
              <Button variant="outline" size="sm" to="/farmer/vaccinations">
                Vaccination register
              </Button>
            }
          />
          <CardBody padded={false}>
            <DataTable
              columns={vaccinationColumns}
              rows={upcomingVaccinations}
              rowKey={(row) => row.id}
              isLoading={isLoadingVaccinations}
              emptyTitle="No vaccinations scheduled"
              emptyDescription="All immunisations for this season are complete."
              footer={
                <span>
                  Showing {upcomingVaccinations.length} of {(vaccinations ?? []).length} vaccination
                  records
                </span>
              }
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" description="Common tasks for today" icon={Plus} />
          <CardBody className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
            <Button variant="outline" to="/farmer/animals/add" icon={Plus}>
              Add Animal
            </Button>
            <Button variant="outline" to="/farmer/disease-detection" icon={Bug}>
              AI Disease Check
            </Button>
            <Button variant="outline" to="/farmer/vaccinations" icon={Syringe}>
              Vaccinations
            </Button>
            <Button variant="outline" to="/farmer/alerts" icon={AlertTriangle}>
              View Alerts
            </Button>
          </CardBody>
          <CardFooter>
            <span>Need help? Call the district veterinary helpline.</span>
          </CardFooter>
        </Card>
      </section>

    </div>
  )
}
