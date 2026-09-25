import { useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/common/Button'
import { Card, CardBody } from '@/components/common/Card'
import { PageHeader } from '@/components/common/PageHeader'
import { AnimalFormFields, emptyAnimalForm } from '@/components/farmer/AnimalFormFields'
import type { AnimalFormErrors, AnimalFormState } from '@/components/farmer/AnimalFormFields'
import { useAuth } from '@/context/AuthContext'
import { createAnimal } from '@/services/api'
import type { AnimalInput } from '@/types'

function ageFromDate(value: string): number {
  const birthDate = new Date(value)
  if (Number.isNaN(birthDate.getTime())) return 0
  const today = new Date()
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12
  months += today.getMonth() - birthDate.getMonth()
  if (today.getDate() < birthDate.getDate()) months -= 1
  return Math.max(0, months)
}

function validate(form: AnimalFormState): AnimalFormErrors {
  const errors: AnimalFormErrors = {}
  if (!form.name.trim()) errors.name = 'Animal name is required.'
  if (!form.tag.trim()) errors.tag = 'Animal ID is required.'
  if (!form.species) errors.species = 'Species is required.'
  if (!form.breed.trim()) errors.breed = 'Breed is required.'
  if (!form.gender) errors.gender = 'Gender is required.'
  if (form.weight.trim() && (!Number.isFinite(Number(form.weight)) || Number(form.weight) <= 0)) errors.weight = 'Enter a valid weight in kilograms.'
  if (form.height.trim() && (!Number.isFinite(Number(form.height)) || Number(form.height) <= 0)) errors.height = 'Enter a valid height in centimeters.'
  if (form.bodyConditionScore && (Number(form.bodyConditionScore) < 1 || Number(form.bodyConditionScore) > 5)) errors.bodyConditionScore = 'Body condition score must be between 1 and 5.'
  if (form.temperature.trim() && !Number.isFinite(Number(form.temperature))) errors.temperature = 'Temperature must be a valid number.'
  return errors
}

function toApiInput(form: AnimalFormState, ownerName: string): AnimalInput {
  return {
    name: form.name.trim(), tag: form.tag.trim().toUpperCase(),
    species: form.species as AnimalInput['species'], breed: form.breed.trim(),
    gender: form.gender as AnimalInput['gender'],
    dateOfBirth: form.dateOfBirth || new Date().toISOString(),
    ageMonths: form.dateOfBirth ? ageFromDate(form.dateOfBirth) : 0,
    weightKg: Number(form.weight) || 0, heightCm: Number(form.height) || 0,
    bodyConditionScore: Number(form.bodyConditionScore) || 3.5,
    healthStatus: form.healthStatus || 'healthy', temperatureC: Number(form.temperature) || 38.6,
    lastCheckup: form.lastCheckup ? new Date(`${form.lastCheckup}T12:00:00`).toISOString() : new Date().toISOString(),
    knownDiseases: form.knownDiseases.split(',').map((item) => item.trim()).filter(Boolean),
    currentMedication: form.currentMedication.trim(),
    allergies: form.allergies.split(',').map((item) => item.trim()).filter(Boolean),
    tagNumber: form.tagNumber.trim() || form.tag.trim().toUpperCase(),
    ownerName: form.ownerName.trim() || ownerName, location: form.location.trim(), notes: form.notes.trim(),
  }
}


export default function AddAnimal() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState<AnimalFormState>({ ...emptyAnimalForm })
  const [errors, setErrors] = useState<AnimalFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const summary = useMemo(() => `${form.name || 'New animal'} · ${form.tag ? form.tag.toUpperCase() : 'No ID'}`, [form.name, form.tag])

  function update<K extends keyof AnimalFormState>(key: K, value: AnimalFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
    setSubmitError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please correct the highlighted fields before saving.')
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await createAnimal(toApiInput(form, user?.name ?? 'Farm owner'))
      navigate('/farmer/animals', { state: { message: 'Animal added successfully.' } })
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : 'Unable to save this animal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader eyebrow="Livestock registry" title="Add Animal" description="Create a complete health and identification profile for a new animal." actions={<Button variant="outline" icon={ArrowLeft} to="/farmer/animals">Back to My Livestock</Button>} />
      {submitError ? <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{submitError}</span></div> : null}
      <form onSubmit={handleSubmit} noValidate className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card><CardBody className="space-y-8 p-5 sm:p-6">
          <AnimalFormFields form={form} errors={errors} onChange={update} />
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => navigate('/farmer/animals')}>Cancel</Button><Button type="submit" icon={Save} loading={isSubmitting}>Save Animal</Button></div>
        </CardBody></Card>
        <Card className="xl:sticky xl:top-24"><CardBody>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Record preview</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">{summary}</h2>
          <div className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3 border-b border-line pb-3"><span className="text-ink-muted">Status</span><span className="font-medium text-brand-700">{form.healthStatus || 'Not set'}</span></div><div className="flex justify-between gap-3 border-b border-line pb-3"><span className="text-ink-muted">Breed</span><span className="font-medium text-ink">{form.breed || '—'}</span></div><div className="flex justify-between gap-3"><span className="text-ink-muted">Weight</span><span className="nums font-medium text-ink">{form.weight ? `${form.weight} kg` : '—'}</span></div></div>
          <div className="mt-5 flex gap-2 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-brand-800"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />Required information is marked with inline validation messages.</div>
        </CardBody></Card>
      </form>
    </div>
  )
}
