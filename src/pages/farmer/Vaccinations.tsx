import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Syringe } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import { SelectField } from '@/components/common/FormField'
import { PageHeader } from '@/components/common/PageHeader'
import { VaccinationSummary } from '@/components/dashboard/VaccinationCard'
import { useAuth } from '@/context/AuthContext'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatDate } from '@/lib/format'
import { vaccinationLabel, vaccinationTone } from '@/lib/status'
import { completeVaccination, getVaccinations } from '@/services/api'
import type { Vaccination, VaccinationStatus } from '@/types'

const statusOptions = [
  { value: 'all', label: 'All records' },
  { value: 'due-soon', label: 'Due soon' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

const columns: Column<Vaccination>[] = [
  {
    key: 'animalTag',
    header: 'Animal',
    render: (row) => <span className="font-medium text-ink">{row.animalTag}</span>,
  },
  {
    key: 'vaccine',
    header: 'Vaccine',
    render: (row) => (
      <div className="min-w-[11rem]">
        <p className="font-medium text-ink">{row.vaccine}</p>
        <p className="text-xs text-ink-muted">{row.protectsAgainst}</p>
      </div>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due date',
    render: (row) => <span className="nums whitespace-nowrap">{formatDate(row.dueDate)}</span>,
  },
  {
    key: 'administeredOn',
    header: 'Administered',
    hideOnMobile: true,
    render: (row) => (
      <div>
        <p className="nums">{row.administeredOn ? formatDate(row.administeredOn) : '—'}</p>
        {row.batchNo ? <p className="text-xs text-ink-muted">Batch {row.batchNo}</p> : null}
      </div>
    ),
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

export default function FarmerVaccinations() {
  const { user } = useAuth()
  const [status, setStatus] = useState<VaccinationStatus | 'all'>('all')
  const [recordingId, setRecordingId] = useState<string | null>(null)

  const { data: vaccinations, isLoading, setData } = useAsyncData(() => getVaccinations(), [])

  const rows = useMemo(() => {
    const records = vaccinations ?? []
    const filtered = status === 'all' ? records : records.filter((item) => item.status === status)
    return filtered
      .slice()
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [vaccinations, status])

  const nextDue = useMemo(
    () =>
      (vaccinations ?? [])
        .filter((item) => item.status === 'due-soon' || item.status === 'overdue')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3),
    [vaccinations],
  )

  const handleComplete = async (vaccinationId: string) => {
    setRecordingId(vaccinationId)
    try {
      await completeVaccination(vaccinationId)
      setData((previous) =>
        previous
          ? previous.map((item) =>
              item.id === vaccinationId
                ? {
                    ...item,
                    status: 'completed' as VaccinationStatus,
                    administeredOn: new Date().toISOString(),
                    administeredBy: user?.name ?? 'Farm record',
                  }
                : item,
            )
          : previous,
      )
    } finally {
      setRecordingId(null)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Preventive care"
        title="Vaccinations"
        description="Immunisation schedule for the herd with due dates, batch records and coverage status."
        actions={
          <Button variant="outline" to="/farmer/disease-detection" icon={Syringe}>
            Disease detection
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Coverage summary"
          description="Status of every vaccination record for this farm"
          icon={Syringe}
        />
        <CardBody>
          <VaccinationSummary vaccinations={vaccinations ?? []} />
        </CardBody>
      </Card>

      {nextDue.length > 0 ? (
        <section aria-label="Priority vaccinations" className="grid gap-4 lg:grid-cols-3">
          {nextDue.map((item) => (
            <Card key={item.id}>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.vaccine}</p>
                    <p className="text-xs text-ink-muted">{item.animalTag}</p>
                  </div>
                  <Badge tone={vaccinationTone[item.status]} size="sm">
                    {vaccinationLabel[item.status]}
                  </Badge>
                </div>
                <p className="inline-flex items-center gap-2 text-xs text-ink-soft">
                  <CalendarDays className="size-3.5 text-ink-muted" aria-hidden="true" />
                  Due {formatDate(item.dueDate)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={CheckCircle2}
                  loading={recordingId === item.id}
                  onClick={() => void handleComplete(item.id)}
                >
                  Record as administered
                </Button>
              </CardBody>
            </Card>
          ))}
        </section>
      ) : null}

      <Card>
        <CardHeader
          title="Vaccination register"
          description="Complete immunisation history for every tagged animal."
          icon={CalendarDays}
          action={
            <div className="w-44">
              <SelectField
                label="Filter"
                value={status}
                onChange={(value) => setStatus(value as VaccinationStatus | 'all')}
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
            emptyTitle="No vaccination records"
            emptyDescription="Adjust the filter or add a vaccination record for an animal."
            emptyIcon={Syringe}
            footer={
              <span>
                Showing {rows.length} of {(vaccinations ?? []).length} records
              </span>
            }
          />
        </CardBody>
        <CardFooter>
          <span>Batch numbers are captured for traceability and audits.</span>
          <span>FMD, HS, BQ and PPR schedules supported</span>
        </CardFooter>
      </Card>
    </div>
  )
}
