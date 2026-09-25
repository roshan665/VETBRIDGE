import { useMemo, useState } from 'react'
import { AlertTriangle, Bell, BellRing, CheckCircle2 } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Card, CardBody, CardHeader } from '@/components/common/Card'
import { PageHeader } from '@/components/common/PageHeader'
import { AlertCard } from '@/components/dashboard/AlertCard'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { acknowledgeAlert, getAlerts } from '@/services/api'
import type { AlertSeverity } from '@/types'

type SeverityFilter = AlertSeverity | 'all'

const filters: Array<{ value: SeverityFilter; label: string }> = [
  { value: 'all', label: 'All alerts' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function FarmerAlerts() {
  const [severity, setSeverity] = useState<SeverityFilter>('all')
  const { data: alerts, setData, isLoading } = useAsyncData(() => getAlerts(), [])

  const records = useMemo(
    () =>
      (alerts ?? [])
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [alerts],
  )

  const visible = severity === 'all' ? records : records.filter((item) => item.severity === severity)

  const high = records.filter((item) => item.severity === 'high').length
  const medium = records.filter((item) => item.severity === 'medium').length
  const acknowledged = records.filter((item) => item.acknowledged).length

  const handleAcknowledge = async (alertId: string) => {
    await acknowledgeAlert(alertId)
    setData((previous) =>
      previous
        ? previous.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
        : previous,
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Early warning"
        title="Alerts"
        description="Disease risk, vaccination and vitals alerts raised for your herd, newest first."
        meta={<Badge tone="danger" icon={BellRing}>{records.filter((item) => !item.acknowledged).length} unacknowledged</Badge>}
      />

      <section aria-label="Alert summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Alerts" value={records.length} icon={Bell} tone="brand" caption="Last 7 days" />
        <StatCard label="High Severity" value={high} icon={AlertTriangle} tone="danger" caption="Immediate action advised" />
        <StatCard label="Medium Severity" value={medium} icon={AlertTriangle} tone="warning" caption="Review within 48 hours" />
        <StatCard label="Acknowledged" value={acknowledged} icon={CheckCircle2} tone="success" caption="Handled by the farm" />
      </section>

      <Card>
        <CardHeader
          title="Alert feed"
          description="Filter by severity and acknowledge alerts once action has been taken."
          icon={BellRing}
          action={
            <div className="flex flex-wrap gap-1.5">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSeverity(filter.value)}
                  className={
                    severity === filter.value
                      ? 'rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white'
                      : 'rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-700'
                  }
                >
                  {filter.label}
                </button>
              ))}
            </div>
          }
        />
        <CardBody className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`alert-skeleton-${index}`}
                  className="h-24 animate-pulse rounded-lg bg-brand-50"
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-canvas/50 px-5 py-10 text-center">
              <h3 className="text-sm font-semibold text-ink">No alerts for this filter</h3>
              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-ink-muted">
                Your herd has no {severity === 'all' ? '' : `${severity} severity `}alerts in the
                current window. Monitoring continues in the background.
              </p>
            </div>
          ) : (
            visible.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
            ))
          )}
        </CardBody>
      </Card>
    </div>
  )
}
