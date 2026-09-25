import { useMemo, useState } from 'react'
import { Pill, Stethoscope } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import { SelectField } from '@/components/common/FormField'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatDate } from '@/lib/format'
import { treatmentTone } from '@/lib/status'
import { getTreatments } from '@/services/api'
import type { Treatment, TreatmentStatus } from '@/types'
import { titleCase } from '@/lib/format'

const statusOptions = [
  { value: 'all', label: 'All treatments' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
]

const columns: Column<Treatment>[] = [
  {
    key: 'animalTag',
    header: 'Animal',
    render: (row) => <span className="font-medium text-ink">{row.animalTag}</span>,
  },
  {
    key: 'diagnosis',
    header: 'Diagnosis',
    render: (row) => (
      <div className="min-w-[12rem]">
        <p className="font-medium text-ink">{row.diagnosis}</p>
        <p className="text-xs text-ink-muted">{row.medicine}</p>
      </div>
    ),
  },
  {
    key: 'dosage',
    header: 'Dosage',
    hideOnMobile: true,
    render: (row) => (
      <div>
        <p>{row.dosage}</p>
        <p className="text-xs text-ink-muted">{row.durationDays} days</p>
      </div>
    ),
  },
  {
    key: 'startedOn',
    header: 'Started',
    hideOnMobile: true,
    render: (row) => <span className="nums whitespace-nowrap">{formatDate(row.startedOn)}</span>,
  },
  {
    key: 'veterinarian',
    header: 'Veterinarian',
    hideOnMobile: true,
    render: (row) => <span className="text-xs">{row.veterinarian}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <div className="space-y-1">
        <Badge tone={treatmentTone[row.status]} size="sm">
          {titleCase(row.status)}
        </Badge>
        {row.outcome ? (
          <p className="text-[11px] text-ink-muted">{titleCase(row.outcome)}</p>
        ) : null}
      </div>
    ),
  },
]

export default function FarmerTreatments() {
  const [status, setStatus] = useState<TreatmentStatus | 'all'>('all')
  const { data: treatments, isLoading } = useAsyncData(() => getTreatments(), [])

  const rows = useMemo(() => {
    const records = treatments ?? []
    return status === 'all' ? records : records.filter((item) => item.status === status)
  }, [treatments, status])

  const ongoing = (treatments ?? []).filter((item) => item.status === 'ongoing').length
  const scheduled = (treatments ?? []).filter((item) => item.status === 'scheduled').length
  const completed = (treatments ?? []).filter((item) => item.status === 'completed').length
  const recovered = (treatments ?? []).filter((item) => item.outcome === 'recovered').length

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Clinical records"
        title="Treatments"
        description="Every treatment course prescribed for the herd, with dosage, duration and outcome."
        actions={<Badge tone="brand" icon={Stethoscope}>{ongoing} ongoing</Badge>}
      />

      <section aria-label="Treatment summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ongoing" value={ongoing} icon={Pill} tone="warning" caption="Under active medication" />
        <StatCard label="Scheduled" value={scheduled} icon={Pill} tone="info" caption="Starting within 48 hours" />
        <StatCard label="Completed" value={completed} icon={Pill} tone="success" caption="Closed treatment courses" />
        <StatCard label="Recovered" value={recovered} icon={Pill} tone="brand" caption="Outcome recorded as recovered" />
      </section>

      <Card>
        <CardHeader
          title="Treatment register"
          description="Diagnosis, medicine and dosage recorded by the treating veterinarian."
          icon={Pill}
          action={
            <div className="w-44">
              <SelectField
                label="Filter"
                value={status}
                onChange={(value) => setStatus(value as TreatmentStatus | 'all')}
                options={statusOptions}
              />
            </div>
          }
        />
        <CardBody padded={false}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No treatment records"
            emptyDescription="Treatments prescribed by the veterinarian will appear here."
            emptyIcon={Pill}
            footer={<span>Showing {rows.length} treatment records</span>}
          />
        </CardBody>
        <CardFooter>
          <span>Withdrawal periods are tracked for milk and meat safety.</span>
        </CardFooter>
      </Card>
    </div>
  )
}
