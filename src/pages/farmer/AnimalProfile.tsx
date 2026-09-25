import { useState } from 'react'
import { Activity, ArrowLeft, CalendarDays, ClipboardList, Edit3, HeartPulse, MapPin, RefreshCw, ShieldCheck, Stethoscope, Syringe, Thermometer, Weight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { SelectField, TextField } from '@/components/common/FormField'
import { Loading } from '@/components/common/Loading'
import { Modal } from '@/components/common/Modal'
import { PageHeader } from '@/components/common/PageHeader'
import { HealthScore } from '@/components/dashboard/HealthScore'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatAge, formatDate, formatRelativeTime, titleCase } from '@/lib/format'
import { animalSpeciesLabel, healthLabel, healthTone, riskLabel, treatmentTone, vaccinationLabel, vaccinationTone } from '@/lib/status'
import { getAnimal, getAnimalHealthHistory, getAnimalHealthTrend, recordHealthCheck, updateAnimal } from '@/services/api'
import type { Animal, RecordHealthCheckRequest, UpdateAnimalRequest } from '@/types'

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Activity }) {
  return <div className="rounded-lg border border-line bg-canvas/60 p-3"><Icon className="size-4 text-brand-600" aria-hidden="true" /><p className="mt-2 text-xs text-ink-muted">{label}</p><p className="nums mt-1 font-semibold text-ink">{value}</p></div>
}

function EditAnimalModal({ animal, open, onClose, onSaved }: { animal: Animal; open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: animal.name, tag: animal.tag, breed: animal.breed, weightKg: String(animal.weightKg), healthStatus: animal.healthStatus, location: animal.location, notes: animal.notes })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  async function save() {
    if (!form.name.trim() || !form.tag.trim()) { setError('Name and animal ID are required.'); return }
    setSaving(true); setError(null)
    try {
      await updateAnimal(animal.id, { name: form.name.trim(), tag: form.tag.trim(), breed: form.breed.trim(), weightKg: Number(form.weightKg) || animal.weightKg, healthStatus: form.healthStatus as Animal['healthStatus'], location: form.location.trim(), notes: form.notes.trim() } satisfies UpdateAnimalRequest)
      onSaved(); onClose()
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to update animal.') } finally { setSaving(false) }
  }
  return <Modal open={open} onClose={onClose} title="Edit animal profile" description={`Update the core record for ${animal.tag}.`} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button icon={Edit3} loading={saving} onClick={save}>Save changes</Button></>}><div className="space-y-4"><TextField label="Animal Name" value={form.name} onChange={(v) => update('name', v)} /><TextField label="Animal ID" value={form.tag} onChange={(v) => update('tag', v)} /><div className="grid gap-4 sm:grid-cols-2"><TextField label="Breed" value={form.breed} onChange={(v) => update('breed', v)} /><TextField label="Weight (kg)" type="number" value={form.weightKg} onChange={(v) => update('weightKg', v)} /></div><SelectField label="Health status" value={form.healthStatus} onChange={(v) => update('healthStatus', v)} options={[{ value: 'healthy', label: 'Healthy' }, { value: 'at-risk', label: 'At Risk' }, { value: 'critical', label: 'Critical' }]} /><TextField label="Farm location" value={form.location} onChange={(v) => update('location', v)} />{error ? <p role="alert" className="text-xs font-medium text-red-600">{error}</p> : null}</div></Modal>
}

function HealthCheckModal({ animal, open, onClose, onSaved }: { animal: Animal; open: boolean; onClose: () => void; onSaved: () => void }) {
  const [temperature, setTemperature] = useState(String(animal.temperatureC))
  const [weight, setWeight] = useState(String(animal.weightKg))
  const [activity, setActivity] = useState(animal.activity || 'Normal')
  const [appetite, setAppetite] = useState(animal.appetite || 'Good')
  const [heartRate, setHeartRate] = useState('72')
  const [respiratory, setRespiratory] = useState('24')
  const [symptoms, setSymptoms] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function save() {
    const payload: RecordHealthCheckRequest = { temperatureC: Number(temperature), weightKg: Number(weight), activity, appetite, heartRateBpm: Number(heartRate), respiratoryRateBpm: Number(respiratory), symptoms: symptoms.split(',').map((item) => item.trim()).filter(Boolean) }
    if (!Number.isFinite(payload.temperatureC) || !Number.isFinite(payload.weightKg) || payload.weightKg <= 0) { setError('Enter a valid temperature and weight.'); return }
    setSaving(true); setError(null)
    try { await recordHealthCheck(animal.id, payload); onSaved(); onClose() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to record health check.') } finally { setSaving(false) }
  }
  return <Modal open={open} onClose={onClose} title="Record health check" description="Add a new observation to this animal's health history." footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button icon={Stethoscope} loading={saving} onClick={save}>Save health check</Button></>}><div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><TextField label="Temperature (°C)" type="number" value={temperature} onChange={setTemperature} /><TextField label="Weight (kg)" type="number" value={weight} onChange={setWeight} /><TextField label="Heart rate (bpm)" type="number" value={heartRate} onChange={setHeartRate} /><TextField label="Respiratory rate (bpm)" type="number" value={respiratory} onChange={setRespiratory} /></div><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Activity" value={activity} onChange={setActivity} options={[{ value: 'Normal', label: 'Normal' }, { value: 'Slightly reduced', label: 'Slightly reduced' }, { value: 'Reduced', label: 'Reduced' }]} /><SelectField label="Appetite" value={appetite} onChange={setAppetite} options={[{ value: 'Good', label: 'Good' }, { value: 'Reduced', label: 'Reduced' }, { value: 'Poor', label: 'Poor' }]} /></div><TextField label="Symptoms" value={symptoms} onChange={setSymptoms} placeholder="Separate symptoms with commas" />{error ? <p role="alert" className="text-xs font-medium text-red-600">{error}</p> : null}</div></Modal>
}



export default function AnimalProfile() {
  const { animalId = '' } = useParams()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [checkOpen, setCheckOpen] = useState(false)
  const { data: animal, isLoading, error, reload } = useAsyncData(() => getAnimal(animalId), [animalId])
  const { data: history, reload: reloadHistory } = useAsyncData(() => getAnimalHealthHistory(animalId), [animalId])
  const { data: trend } = useAsyncData(() => getAnimalHealthTrend(animalId), [animalId])
  const refresh = () => { void reload(); void reloadHistory() }
  if (isLoading) return <Loading label="Loading animal profile" className="min-h-64" />
  if (error || !animal) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">Animal profile could not be loaded.</div>
  const trendValues = trend ?? []
  return <div className="space-y-6 lg:space-y-8">
    <PageHeader eyebrow="Livestock registry" title={`${animal.tag} · ${animal.name}`} description={`${animalSpeciesLabel[animal.species] ?? animal.species} · ${animal.breed}`} actions={<><Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/farmer/animals')}>Back to My Animals</Button><Button variant="outline" icon={Edit3} onClick={() => setEditOpen(true)}>Edit Profile</Button><Button icon={Stethoscope} onClick={() => setCheckOpen(true)}>Record Health Check</Button></>} />
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Current health score" value={`${animal.healthScore}/100`} icon={HeartPulse} /><Metric label="Risk level" value={riskLabel[animal.riskLevel]} icon={ShieldCheck} /><Metric label="Temperature" value={`${animal.temperatureC.toFixed(1)} °C`} icon={Thermometer} /><Metric label="Weight" value={`${animal.weightKg} kg`} icon={Weight} /></section>
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card><CardHeader title="Health score" description="Composite score from vitals, activity and history." icon={HeartPulse} /><CardBody><HealthScore score={animal.healthScore} label={`${animal.tag} health score`} breakdown={[{ label: 'Vital stability', score: animal.temperatureC >= 38 && animal.temperatureC <= 39.5 ? 92 : 58 }, { label: 'Body condition', score: Math.round(animal.bodyConditionScore * 20) }, { label: 'Preventive care', score: animal.vaccinations.some((item) => item.status === 'completed') ? 88 : 58 }]} /></CardBody><CardFooter><span>Last checked {formatRelativeTime(animal.lastCheckup)}</span><Badge tone={healthTone[animal.healthStatus]}>{healthLabel[animal.healthStatus]}</Badge></CardFooter></Card><Card><CardHeader title="Animal details" description="Identity, ownership and preventive care context." icon={ClipboardList} /><CardBody className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-ink-muted">Official tag</p><p className="mt-1 text-sm font-medium text-ink">{animal.tagNumber || animal.tag}</p></div><div><p className="text-xs text-ink-muted">Age / gender</p><p className="mt-1 text-sm font-medium text-ink">{formatAge(animal.ageMonths)} · {titleCase(animal.gender)}</p></div><div><p className="text-xs text-ink-muted">Owner</p><p className="mt-1 text-sm font-medium text-ink">{animal.ownerName}</p></div><div><p className="text-xs text-ink-muted">Location</p><p className="mt-1 flex items-center gap-1 text-sm font-medium text-ink"><MapPin className="size-3.5 text-ink-muted" />{animal.location || animal.district}</p></div><div><p className="text-xs text-ink-muted">Known diseases</p><p className="mt-1 text-sm font-medium text-ink">{animal.knownDiseases.length ? animal.knownDiseases.join(', ') : 'None recorded'}</p></div><div><p className="text-xs text-ink-muted">Current medication</p><p className="mt-1 text-sm font-medium text-ink">{animal.currentMedication || 'None'}</p></div></CardBody></Card></section>

<section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card><CardHeader title="Health trend" description="Recent composite score observations." icon={Activity} /><CardBody><div className="flex h-44 items-end gap-2">{trendValues.map((point) => <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="w-full rounded-t bg-brand-500/80" style={{ height: `${Math.max(8, point.score)}%` }} title={`${point.score}/100`} /><span className="truncate text-[10px] text-ink-muted">{formatRelativeTime(point.date)}</span></div>)}</div>{trendValues.length === 0 ? <p className="text-sm text-ink-muted">No trend observations yet.</p> : null}</CardBody></Card><Card><CardHeader title="Health risk indicators" description="Signals requiring monitoring or action." icon={ShieldCheck} /><CardBody className="space-y-3">{animal.riskIndicators.map((indicator) => <div key={indicator.id} className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"><span className="text-sm text-ink-soft">{indicator.label}</span><span className="text-right"><span className="block text-sm font-medium text-ink">{indicator.value}</span><Badge size="sm" tone={indicator.level === 'critical' ? 'danger' : indicator.level === 'watch' ? 'warning' : 'success'}>{titleCase(indicator.level)}</Badge></span></div>)}</CardBody></Card></section>

    <section className="grid gap-6 lg:grid-cols-2"><Card><CardHeader title="Vaccinations" description="Upcoming and completed immunisations." icon={Syringe} action={<Button variant="ghost" size="sm" to="/farmer/vaccinations">View register</Button>} /><CardBody className="space-y-2">{animal.vaccinations.length ? animal.vaccinations.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-b border-line py-2 last:border-0"><div><p className="text-sm font-medium text-ink">{item.vaccine}</p><p className="text-xs text-ink-muted">Due {formatDate(item.dueDate)}</p></div><Badge tone={vaccinationTone[item.status]}>{vaccinationLabel[item.status]}</Badge></div>) : <p className="text-sm text-ink-muted">No vaccinations recorded.</p>}</CardBody></Card><Card><CardHeader title="Treatments" description="Current and previous treatment plans." icon={ClipboardList} action={<Button variant="ghost" size="sm" to="/farmer/treatments">View treatments</Button>} /><CardBody className="space-y-2">{animal.treatments.length ? animal.treatments.map((item) => <div key={item.id} className="border-b border-line py-2 last:border-0"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-ink">{item.diagnosis}</p><Badge tone={treatmentTone[item.status]}>{titleCase(item.status)}</Badge></div><p className="mt-1 text-xs text-ink-muted">{item.medicine} · {item.dosage}</p></div>) : <p className="text-sm text-ink-muted">No treatments recorded.</p>}</CardBody></Card></section>
    <Card><CardHeader title="Health history" description="Latest observations recorded for this animal." icon={CalendarDays} action={<Button variant="outline" size="sm" icon={RefreshCw} onClick={refresh}>Refresh</Button>} /><CardBody className="space-y-3">{history?.length ? history.map((record) => <article key={record.id} className="rounded-lg border border-line bg-canvas/50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><Badge tone={healthTone[record.status]}>{healthLabel[record.status]}</Badge><span className="text-sm font-medium text-ink">{record.title ?? titleCase(record.type ?? 'health record')}</span></div><span className="text-xs text-ink-muted">{formatRelativeTime(record.recordedAt)}</span></div><div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-soft"><span className="inline-flex items-center gap-1.5"><Thermometer className="size-3.5 text-ink-muted" />{record.temperatureC} °C</span><span>{record.heartRateBpm} bpm</span><span>{record.weightKg} kg</span><span>Activity {record.activityScore}/100</span></div>{record.symptoms.length ? <p className="mt-2 text-xs text-ink-muted">Symptoms: {record.symptoms.join(', ')}</p> : null}</article>) : <p className="text-sm text-ink-muted">No health records yet.</p>}</CardBody></Card>
    <EditAnimalModal animal={animal} open={editOpen} onClose={() => setEditOpen(false)} onSaved={refresh} /><HealthCheckModal animal={animal} open={checkOpen} onClose={() => setCheckOpen(false)} onSaved={refresh} />
  </div>
}
