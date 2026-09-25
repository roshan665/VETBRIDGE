import { useState } from 'react'

import { Button } from '@/components/common/Button'
import { SelectField, TextField } from '@/components/common/FormField'
import { Modal } from '@/components/common/Modal'
import { createAnimal } from '@/services/api'
import type { Animal, AnimalGender, AnimalSpecies } from '@/types'

const speciesOptions: Array<{ value: AnimalSpecies; label: string }> = [
  { value: 'cattle', label: 'Cattle (cow / ox)' },
  { value: 'buffalo', label: 'Buffalo' },
  { value: 'goat', label: 'Goat' },
  { value: 'sheep', label: 'Sheep' },
]

const genderOptions: Array<{ value: AnimalGender; label: string }> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]

interface FormState {
  tag: string
  name: string
  species: AnimalSpecies
  breed: string
  gender: AnimalGender
  ageMonths: string
  weightKg: string
}

const emptyForm: FormState = {
  tag: '',
  name: '',
  species: 'cattle',
  breed: '',
  gender: 'female',
  ageMonths: '',
  weightKg: '',
}

export interface AddAnimalModalProps {
  open: boolean
  onClose: () => void
  onCreated?: (animal: Animal) => void
}

/** Registers a new animal through the API layer (mock today, FastAPI later). */
export function AddAnimalModal({ open, onClose, onCreated }: AddAnimalModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
  }

  const handleClose = () => {
    setForm(emptyForm)
    setErrors({})
    onClose()
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    const age = Number(form.ageMonths)
    const weight = Number(form.weightKg)

    if (!form.tag.trim()) next.tag = 'Ear tag is required.'
    else if (!/^[A-Za-z]{3}-\d{3,5}$/.test(form.tag.trim()))
      next.tag = 'Use the format COW-1042 (three letters, dash, digits).'

    if (!form.name.trim()) next.name = 'Animal name is required.'
    if (!form.breed.trim()) next.breed = 'Breed is required.'
    if (!form.ageMonths.trim()) next.ageMonths = 'Age in months is required.'
    else if (!Number.isFinite(age) || age <= 0 || age > 400) next.ageMonths = 'Enter an age between 1 and 400 months.'
    if (!form.weightKg.trim()) next.weightKg = 'Weight is required.'
    else if (!Number.isFinite(weight) || weight <= 0) next.weightKg = 'Enter a valid weight in kg.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const animal = await createAnimal({
        tag: form.tag.trim().toUpperCase(),
        name: form.name.trim(),
        species: form.species,
        breed: form.breed.trim(),
        gender: form.gender,
        ageMonths: Number(form.ageMonths),
        weightKg: Number(form.weightKg),
      })
      onCreated?.(animal)
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add animal"
      description="Register a new animal to start tracking its health record."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Saving' : 'Save animal'}
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Ear tag"
          value={form.tag}
          onChange={(value) => update('tag', value)}
          placeholder="COW-1042"
          error={errors.tag}
          required
        />
        <TextField
          label="Animal name"
          value={form.name}
          onChange={(value) => update('name', value)}
          placeholder="Ganga"
          error={errors.name}
          required
        />
        <SelectField
          label="Species"
          value={form.species}
          onChange={(value) => update('species', value as AnimalSpecies)}
          options={speciesOptions}
        />
        <TextField
          label="Breed"
          value={form.breed}
          onChange={(value) => update('breed', value)}
          placeholder="Gir"
          error={errors.breed}
          required
        />
        <SelectField
          label="Gender"
          value={form.gender}
          onChange={(value) => update('gender', value as AnimalGender)}
          options={genderOptions}
        />
        <TextField
          label="Age (months)"
          type="number"
          value={form.ageMonths}
          onChange={(value) => update('ageMonths', value)}
          placeholder="54"
          error={errors.ageMonths}
          inputMode="numeric"
          required
        />
        <div className="sm:col-span-2">
          <TextField
            label="Weight (kg)"
            type="number"
            value={form.weightKg}
            onChange={(value) => update('weightKg', value)}
            placeholder="412"
            error={errors.weightKg}
            inputMode="numeric"
            hint="Used as the baseline for weight variation alerts."
            required
          />
        </div>
      </div>
    </Modal>
  )
}

export default AddAnimalModal
