import { useMemo, useState } from 'react'
import { ClipboardList, Cpu, Sparkles, Stethoscope } from 'lucide-react'

import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/common/Card'
import { SelectField, TextField } from '@/components/common/FormField'
import { Loading } from '@/components/common/Loading'
import { PageHeader } from '@/components/common/PageHeader'
import { DiseaseLibraryList } from '@/components/farmer/DiseaseLibraryList'
import { useAsyncData } from '@/hooks/useAsyncData'
import { formatPercent } from '@/lib/format'
import { riskLabel, riskTone } from '@/lib/status'
import {
  getAnimals,
  getDiseaseLibrary,
  getDiseasePrediction,
  getSymptomOptions,
} from '@/services/api'
import type { DiseaseCheckResult } from '@/types'

const DEFAULT_TEMPERATURE = '38.5'
const DEFAULT_ACTIVITY = '80'

export default function DiseaseDetection() {
  const [animalTag, setAnimalTag] = useState('')
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE)
  const [activity, setActivity] = useState(DEFAULT_ACTIVITY)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [result, setResult] = useState<DiseaseCheckResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewRequested, setReviewRequested] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: animals } = useAsyncData(() => getAnimals(), [])
  const { data: symptomOptions } = useAsyncData(() => getSymptomOptions(), [])
  const { data: library, isLoading: isLoadingLibrary } = useAsyncData(
    () => getDiseaseLibrary(),
    [],
  )

  const animalOptions = useMemo(
    () => [
      { value: '', label: 'Select an animal' },
      ...(animals ?? []).map((animal) => ({
        value: animal.tag,
        label: `${animal.tag} · ${animal.name}`,
      })),
    ],
    [animals],
  )

  const toggleSymptom = (symptom: string) => {
    setSymptoms((previous) =>
      previous.includes(symptom)
        ? previous.filter((item) => item !== symptom)
        : [...previous, symptom],
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setReviewRequested(false)

    if (!animalTag) {
      setError('Select the animal you want to check.')
      return
    }

    const temperatureValue = Number(temperature)
    const activityValue = Number(activity)

    if (!Number.isFinite(temperatureValue) || temperatureValue < 35 || temperatureValue > 43) {
      setError('Enter a body temperature between 35 °C and 43 °C.')
      return
    }

    if (!Number.isFinite(activityValue) || activityValue < 0 || activityValue > 100) {
      setError('Activity index must be between 0 and 100.')
      return
    }

    if (symptoms.length === 0) {
      setError('Select at least one observed symptom before running the check.')
      return
    }

    setIsSubmitting(true)
    try {
      const prediction = await getDiseasePrediction({
        animalTag,
        symptoms,
        temperatureC: temperatureValue,
        activityScore: activityValue,
      })
      setResult(prediction)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Detection failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSymptoms([])
    setTemperature(DEFAULT_TEMPERATURE)
    setActivity(DEFAULT_ACTIVITY)
    setResult(null)
    setError(null)
    setReviewRequested(false)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Disease intelligence"
        title="AI Disease Detection"
        description="Record symptoms and vitals to receive an early disease risk assessment with the recommended next action."
        meta={
          <>
            <Badge tone="brand" icon={Cpu}>
              Triage engine v0.9
            </Badge>
            <Badge tone="info">50+ disease indicators</Badge>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader
            title="Health observation entry"
            description="Every field feeds the risk engine that grades this animal."
            icon={ClipboardList}
          />
          <form onSubmit={handleSubmit} noValidate>
            <CardBody className="space-y-5">
              <SelectField
                label="Animal"
                value={animalTag}
                onChange={(value) => {
                  setAnimalTag(value)
                  setResult(null)
                }}
                options={animalOptions}
                hint="Only registered animals can be assessed."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Body temperature (°C)"
                  type="number"
                  value={temperature}
                  onChange={setTemperature}
                  inputMode="numeric"
                  hint="Normal range for cattle is 38.0 - 39.5 °C"
                />
                <TextField
                  label="Activity index (0-100)"
                  type="number"
                  value={activity}
                  onChange={setActivity}
                  inputMode="numeric"
                  hint="Mobility and rumination score"
                />
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-ink">Observed symptoms</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(symptomOptions ?? []).map((symptom) => {
                    const isChecked = symptoms.includes(symptom)
                    return (
                      <label
                        key={symptom}
                        className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                          isChecked
                            ? 'border-brand-600 bg-brand-50 text-brand-800'
                            : 'border-line bg-surface text-ink-soft hover:border-brand-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSymptom(symptom)}
                          className="mt-0.5 size-3.5 rounded border-line"
                        />
                        {symptom}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700"
                >
                  {error}
                </p>
              ) : null}
            </CardBody>

            <CardFooter className="justify-end gap-3">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit" icon={Sparkles} loading={isSubmitting}>
                {isSubmitting ? 'Analysing' : 'Run AI check'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader
            title="Risk assessment"
            description="Generated from the reported symptoms and vitals."
            icon={Stethoscope}
          />
          <CardBody>
            {isSubmitting ? (
              <Loading label="Scoring disease indicators" className="h-64" />
            ) : !result ? (
              <div className="rounded-lg border border-dashed border-line bg-canvas/50 px-5 py-10 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                  <Cpu className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">No assessment yet</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-ink-muted">
                  Select an animal, record the temperature, activity index and observed symptoms,
                  then run the AI check to see the graded risk and the recommended action.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">
                      Suspected condition
                    </p>
                    <p className="mt-1 text-lg font-semibold text-ink">{result.disease}</p>
                  </div>
                  <Badge tone={riskTone[result.riskLevel]} size="md">
                    {riskLabel[result.riskLevel]} risk
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>Model confidence</span>
                    <span className="nums font-medium text-ink">
                      {formatPercent(result.confidence * 100)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Indicators used
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {result.indicators.map((indicator) => (
                      <li
                        key={indicator}
                        className="rounded-md bg-canvas px-2 py-1 text-[11px] font-medium text-ink-soft ring-1 ring-inset ring-line"
                      >
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-brand-200 bg-brand-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">
                    Recommended action
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-900">
                    {result.recommendedAction}
                  </p>
                </div>

                {result.veterinarianReviewRequired ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3">
                    <p className="max-w-[16rem] text-xs text-ink-muted">
                      Veterinary review is recommended for this risk level.
                    </p>
                    <Button
                      size="sm"
                      variant={reviewRequested ? 'secondary' : 'primary'}
                      icon={Stethoscope}
                      onClick={() => setReviewRequested(true)}
                      disabled={reviewRequested}
                    >
                      {reviewRequested ? 'Review requested' : 'Request veterinary review'}
                    </Button>
                  </div>
                ) : (
                  <p className="rounded-lg border border-line bg-canvas/60 px-3 py-2.5 text-xs text-ink-muted">
                    Low risk detected. Continue routine monitoring and re-run the check if symptoms
                    change.
                  </p>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Disease reference library"
          description="Indicators, transmission routes and prevention for the diseases tracked by the platform."
          icon={ClipboardList}
        />
        <CardBody>
          {isLoadingLibrary || !library ? (
            <Loading label="Loading disease library" />
          ) : (
            <DiseaseLibraryList entries={library} />
          )}
        </CardBody>
      </Card>
    </div>
  )
}
