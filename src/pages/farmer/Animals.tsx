import { useMemo, useState } from 'react'
import { Activity, AlertTriangle, ArrowRight, Bug, HeartPulse, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardHeader } from '@/components/common/Card'
import { DataTable } from '@/components/common/DataTable'
import type { Column } from '@/components/common/DataTable'
import { SelectField, TextField } from '@/components/common/FormField'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatAge, formatRelativeTime } from '@/lib/format'
import { animalSpeciesLabel, healthLabel, healthTone, riskLabel, riskTone, scoreTone } from '@/lib/status'
import { getAnimals, getDashboardStats } from '@/services/api'
import type { Animal, HealthStatus, RiskLevel } from '@/types'

const riskOptions = [{ value: 'all', label: 'All risk levels' }, { value: 'low', label: 'Low risk' }, { value: 'medium', label: 'Medium risk' }, { value: 'high', label: 'High risk' }]
const statusOptions = [{ value: 'all', label: 'All health statuses' }, { value: 'healthy', label: 'Healthy' }, { value: 'at-risk', label: 'At risk' }, { value: 'critical', label: 'Critical' }]
const speciesOptions = [{ value: 'all', label: 'All species' }, { value: 'cattle', label: 'Cattle' }, { value: 'buffalo', label: 'Buffalo' }, { value: 'goat', label: 'Goat' }, { value: 'sheep', label: 'Sheep' }, { value: 'other', label: 'Other' }]
const ageOptions = [{ value: 'all', label: 'All age groups' }, { value: 'young', label: 'Under 2 years' }, { value: 'adult', label: '2–5 years' }, { value: 'senior', label: 'Over 5 years' }]

const columns: Column<Animal>[] = [
  { key: 'tag', header: 'Animal', render: (row) => <div className="min-w-[9rem]"><p className="font-medium text-ink">{row.tag}</p><p className="text-xs text-ink-muted">{row.name}</p></div> },
  { key: 'species', header: 'Species', hideOnMobile: true, render: (row) => <div><p>{animalSpeciesLabel[row.species] ?? row.species}</p><p className="text-xs text-ink-muted">{row.breed}</p></div> },
  { key: 'ageMonths', header: 'Age', hideOnMobile: true, render: (row) => <span className="nums">{formatAge(row.ageMonths)}</span> },
  { key: 'weightKg', header: 'Weight', hideOnMobile: true, render: (row) => <span className="nums">{row.weightKg} kg</span> },
  { key: 'healthScore', header: 'Score', render: (row) => <div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-canvas"><div className={row.healthScore >= 80 ? 'h-full bg-emerald-500' : row.healthScore >= 65 ? 'h-full bg-amber-500' : 'h-full bg-red-500'} style={{ width: `${row.healthScore}%` }} /></div><span className="nums text-xs font-medium text-ink">{row.healthScore}</span><Badge tone={scoreTone(row.healthScore)} size="sm" className="hidden lg:inline-flex">{row.healthScore >= 80 ? 'Good' : row.healthScore >= 65 ? 'Watch' : 'Critical'}</Badge></div> },
  { key: 'riskLevel', header: 'Risk', render: (row) => <Badge tone={riskTone[row.riskLevel]} size="sm">{riskLabel[row.riskLevel]}</Badge> },
  { key: 'healthStatus', header: 'Status', render: (row) => <Badge tone={healthTone[row.healthStatus]} size="sm">{healthLabel[row.healthStatus]}</Badge> },
  { key: 'lastCheckup', header: 'Last checkup', hideOnMobile: true, render: (row) => <span className="text-xs">{formatRelativeTime(row.lastCheckup)}</span> },
]

export default function FarmerAnimals() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [riskLevel, setRiskLevel] = useState<RiskLevel | 'all'>('all')
  const [healthStatus, setHealthStatus] = useState<HealthStatus | 'all'>('all')
  const [species, setSpecies] = useState('all')
  const [breed, setBreed] = useState('all')
  const [ageGroup, setAgeGroup] = useState('all')
  const { data: stats } = useAsyncData(() => getDashboardStats(), [])
  const { data: animals, isLoading, reload } = useAsyncData(() => getAnimals(), [])
  const breeds = useMemo(() => [{ value: 'all', label: 'All breeds' }, ...Array.from(new Set((animals ?? []).map((animal) => animal.breed))).sort().map((value) => ({ value, label: value }))], [animals])
  const filteredAnimals = useMemo(() => (animals ?? []).filter((animal) => {
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || [animal.tag, animal.name, animal.breed].some((value) => value.toLowerCase().includes(term))
    const matchesRisk = riskLevel === 'all' || animal.riskLevel === riskLevel
    const matchesStatus = healthStatus === 'all' || animal.healthStatus === healthStatus
    const matchesSpecies = species === 'all' || animal.species === species
    const matchesBreed = breed === 'all' || animal.breed === breed
    const matchesAge = ageGroup === 'all' || (ageGroup === 'young' && animal.ageMonths < 24) || (ageGroup === 'adult' && animal.ageMonths >= 24 && animal.ageMonths <= 60) || (ageGroup === 'senior' && animal.ageMonths > 60)
    return matchesSearch && matchesRisk && matchesStatus && matchesSpecies && matchesBreed && matchesAge
  }), [animals, search, riskLevel, healthStatus, species, breed, ageGroup])
  const isFiltered = Boolean(search.trim() || riskLevel !== 'all' || healthStatus !== 'all' || species !== 'all' || breed !== 'all' || ageGroup !== 'all')
  const clearFilters = () => { setSearch(''); setRiskLevel('all'); setHealthStatus('all'); setSpecies('all'); setBreed('all'); setAgeGroup('all') }
  const goToProfile = (animal: Animal) => navigate(`/farmer/animals/${animal.id}`)

  return <div className="space-y-6 lg:space-y-8">
    <PageHeader eyebrow="Livestock registry" title="My Animals" description="Every registered animal with its tag, health score and current risk grading." actions={<><Button variant="outline" onClick={() => void reload()} icon={Activity}>Refresh</Button><Button icon={Plus} to="/farmer/animals/add">Add Animal</Button></>} />
    <section aria-label="Herd summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Animals" value={stats?.totalAnimals ?? '—'} icon={Activity} tone="brand" caption="Registered on this farm" /><StatCard label="Healthy" value={stats?.healthy ?? '—'} icon={HeartPulse} tone="success" caption="No action required" /><StatCard label="At Risk" value={stats?.atRisk ?? '—'} icon={AlertTriangle} tone="warning" caption="Under observation" /><StatCard label="Critical" value={stats?.critical ?? '—'} icon={Bug} tone="danger" caption="Veterinary attention needed" /></section>
    <Card><CardHeader title="Animal register" description="Search and filter livestock records, then open a profile for the complete health history." icon={Activity} action={<Badge tone="neutral">{filteredAnimals.length} profiles</Badge>} />
      <CardBody className="grid gap-4 border-b border-line sm:grid-cols-2 xl:grid-cols-3"><TextField label="Search" value={search} onChange={setSearch} placeholder="COW-1042 or Ganga" icon={Search} /><SelectField label="Species" value={species} onChange={setSpecies} options={speciesOptions} /><SelectField label="Breed" value={breed} onChange={setBreed} options={breeds} /><SelectField label="Risk level" value={riskLevel} onChange={(value) => setRiskLevel(value as RiskLevel | 'all')} options={riskOptions} /><SelectField label="Health status" value={healthStatus} onChange={(value) => setHealthStatus(value as HealthStatus | 'all')} options={statusOptions} /><SelectField label="Age group" value={ageGroup} onChange={setAgeGroup} options={ageOptions} /></CardBody>
      <CardBody padded={false}><div className="hidden md:block"><DataTable columns={columns} rows={filteredAnimals} rowKey={(row) => row.id} isLoading={isLoading} onRowClick={goToProfile} emptyTitle={isFiltered ? 'No animals match these filters' : 'No animals registered yet'} emptyDescription={isFiltered ? 'Try clearing one or more filters.' : 'Add your first animal to start building a health record.'} emptyIcon={isFiltered ? Search : Activity} emptyAction={isFiltered ? <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button> : <Button size="sm" icon={Plus} to="/farmer/animals/add">Add Animal</Button>} footer={<span>Select a row to view the complete health record. Showing {filteredAnimals.length} of {stats?.totalAnimals ?? 0} registered animals.</span>} /></div>
        <div className="space-y-3 p-4 md:hidden">{isLoading ? <div className="py-10 text-center text-sm text-ink-muted">Loading animal profiles…</div> : filteredAnimals.length ? filteredAnimals.map((animal) => <button key={animal.id} type="button" onClick={() => goToProfile(animal)} className="w-full rounded-xl border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-brand-300"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-ink">{animal.tag} · {animal.name}</p><p className="mt-1 text-xs text-ink-muted">{animalSpeciesLabel[animal.species] ?? animal.species} · {animal.breed}</p></div><ArrowRight className="size-4 text-ink-muted" /></div><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><span className="block text-ink-muted">Score</span><b className="nums text-ink">{animal.healthScore}</b></div><div><span className="block text-ink-muted">Risk</span><Badge tone={riskTone[animal.riskLevel]}>{riskLabel[animal.riskLevel]}</Badge></div><div><span className="block text-ink-muted">Status</span><Badge tone={healthTone[animal.healthStatus]}>{healthLabel[animal.healthStatus]}</Badge></div></div></button>) : <div className="py-10 text-center text-sm text-ink-muted">No animals match these filters.</div>}</div>
      </CardBody>
    </Card>
  </div>
}
