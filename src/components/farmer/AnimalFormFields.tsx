import type { ReactNode } from 'react'
import { CircleUserRound, FileText, MapPin, Ruler, Stethoscope } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { SelectField, TextField, TextareaField } from '@/components/common/FormField'
import type { AnimalGender, AnimalInput, AnimalSpecies } from '@/types'

export interface AnimalFormState {
  name: string
  tag: string
  species: AnimalSpecies | ''
  breed: string
  gender: AnimalGender | ''
  dateOfBirth: string
  weight: string
  height: string
  bodyConditionScore: string
  healthStatus: AnimalInput['healthStatus'] | ''
  temperature: string
  lastCheckup: string
  knownDiseases: string
  currentMedication: string
  allergies: string
  tagNumber: string
  ownerName: string
  location: string
  notes: string
}

export type AnimalFormErrors = Partial<Record<keyof AnimalFormState, string>>

export const emptyAnimalForm: AnimalFormState = {
  name: '', tag: '', species: '', breed: '', gender: '', dateOfBirth: '',
  weight: '', height: '', bodyConditionScore: '3.5', healthStatus: 'healthy',
  temperature: '38.6', lastCheckup: '', knownDiseases: '', currentMedication: '',
  allergies: '', tagNumber: '', ownerName: '', location: '', notes: '',
}

const speciesOptions = [
  { value: '', label: 'Select species' },
  { value: 'cattle', label: 'Cow' },
  { value: 'buffalo', label: 'Buffalo' },
  { value: 'goat', label: 'Goat' },
  { value: 'sheep', label: 'Sheep' },
  { value: 'other', label: 'Other' },
]
const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]
const statusOptions = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'critical', label: 'Critical' },
]

function Section({ step, title, description, icon: Icon, children }: {
  step: number
  title: string
  description: string
  icon: LucideIcon
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
            <span className="text-[10px] font-semibold text-brand-600">0{step}</span>
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

interface AnimalFormFieldsProps {
  form: AnimalFormState
  errors: AnimalFormErrors
  onChange: <K extends keyof AnimalFormState>(key: K, value: AnimalFormState[K]) => void
}

export function AnimalFormFields({ form, errors, onChange }: AnimalFormFieldsProps) {
  return (
    <div className="space-y-8">
      <Section step={1} title="Basic Information" description="Identity and core animal details." icon={CircleUserRound}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Animal Name" value={form.name} onChange={(v) => onChange('name', v)} error={errors.name} required />
          <TextField label="Animal ID" value={form.tag} onChange={(v) => onChange('tag', v)} placeholder="COW-1070" error={errors.tag} required />
          <SelectField label="Species" value={form.species} onChange={(v) => onChange('species', v as AnimalFormState['species'])} options={speciesOptions} error={errors.species} required />
          <TextField label="Breed" value={form.breed} onChange={(v) => onChange('breed', v)} placeholder="Gir" error={errors.breed} required />
          <SelectField label="Gender" value={form.gender} onChange={(v) => onChange('gender', v as AnimalFormState['gender'])} options={genderOptions} error={errors.gender} required />
          <TextField label="Date of Birth" value={form.dateOfBirth} onChange={(v) => onChange('dateOfBirth', v)} type="date" error={errors.dateOfBirth} />
        </div>
      </Section>

      <Section step={2} title="Physical Information" description="Measurements used for growth and condition monitoring." icon={Ruler}>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Weight (kg)" value={form.weight} onChange={(v) => onChange('weight', v)} type="number" inputMode="numeric" error={errors.weight} required />
          <TextField label="Height (cm)" value={form.height} onChange={(v) => onChange('height', v)} type="number" inputMode="numeric" error={errors.height} />
          <TextField label="Body Condition Score" value={form.bodyConditionScore} onChange={(v) => onChange('bodyConditionScore', v)} type="number" inputMode="decimal" hint="1 (poor) to 5 (ideal)" error={errors.bodyConditionScore} />
        </div>
      </Section>

      <Section step={3} title="Health Information" description="Current observations and medical information." icon={Stethoscope}>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Current Health Status" value={form.healthStatus} onChange={(v) => onChange('healthStatus', v as AnimalFormState['healthStatus'])} options={statusOptions} />
          <TextField label="Temperature (°C)" value={form.temperature} onChange={(v) => onChange('temperature', v)} type="number" inputMode="decimal" error={errors.temperature} />
          <TextField label="Last Health Check" value={form.lastCheckup} onChange={(v) => onChange('lastCheckup', v)} type="date" />
          <TextField label="Known Diseases" value={form.knownDiseases} onChange={(v) => onChange('knownDiseases', v)} placeholder="Separate multiple entries with commas" />
          <TextField label="Current Medication" value={form.currentMedication} onChange={(v) => onChange('currentMedication', v)} placeholder="Medication and dosage" />
          <TextField label="Allergies" value={form.allergies} onChange={(v) => onChange('allergies', v)} placeholder="Separate multiple allergies with commas" />
        </div>
      </Section>

      <Section step={4} title="Identification" description="Ownership, traceability and location details." icon={MapPin}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Tag Number" value={form.tagNumber} onChange={(v) => onChange('tagNumber', v)} placeholder="Official ear tag or RFID" />
          <TextField label="Owner Name" value={form.ownerName} onChange={(v) => onChange('ownerName', v)} />
          <TextField label="Farm Location" value={form.location} onChange={(v) => onChange('location', v)} placeholder="Farm, shed or village" />
        </div>
      </Section>

      <Section step={5} title="Additional Notes" description="Optional context for future care and veterinary teams." icon={FileText}>
        <TextareaField label="Notes" value={form.notes} onChange={(v) => onChange('notes', v)} placeholder="Add temperament, preventive care or other useful information..." rows={5} />
      </Section>
    </div>
  )
}

