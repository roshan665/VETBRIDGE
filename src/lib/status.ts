/**
 * Maps domain status values to badge tones, chart colours and labels.
 * Keeping this here stops pages from inventing their own colour logic.
 */

import type { BadgeTone } from '@/components/common/Badge'
import type {
  AlertSeverity,
  CaseStatus,
  HealthStatus,
  OutbreakStatus,
  RiskLevel,
  TreatmentStatus,
  VaccinationStatus,
} from '@/types'
import { titleCase } from '@/lib/format'

/* --------------------------------- Palette ------------------------------- */

export const chartColors = {
  healthy: '#2c7f5e',
  atRisk: '#d97706',
  critical: '#dc2626',
  info: '#1d4ed8',
  neutral: '#64748b',
  grid: '#e2e9e4',
  axis: '#6b7d74',
} as const

export const riskColors: Record<RiskLevel, string> = {
  low: chartColors.healthy,
  medium: chartColors.atRisk,
  high: chartColors.critical,
}

export const coverageColors = ['#1b6849', '#2c7f5e', '#d97706', '#b91c1c'] as const

export const diseaseTrendSeries = [
  { key: 'lumpySkin', name: 'Lumpy Skin Disease', color: '#1b6849' },
  { key: 'fmd', name: 'Foot and Mouth Disease', color: '#2c7f5e' },
  { key: 'haemorrhagicSepticaemia', name: 'Haemorrhagic Septicaemia', color: '#d97706' },
  { key: 'brucellosis', name: 'Brucellosis', color: '#1d4ed8' },
] as const

/* ---------------------------- Status dictionaries ------------------------ */

export const riskTone: Record<RiskLevel, BadgeTone> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

export const riskLabel: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const healthTone: Record<HealthStatus, BadgeTone> = {
  healthy: 'success',
  'at-risk': 'warning',
  critical: 'danger',
}

export const healthLabel: Record<HealthStatus, string> = {
  healthy: 'Healthy',
  'at-risk': 'At Risk',
  critical: 'Critical',
}

export const severityTone: Record<AlertSeverity, BadgeTone> = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
}

export const vaccinationTone: Record<VaccinationStatus, BadgeTone> = {
  completed: 'success',
  'due-soon': 'warning',
  upcoming: 'info',
  overdue: 'danger',
}

export const vaccinationLabel: Record<VaccinationStatus, string> = {
  completed: 'Completed',
  'due-soon': 'Due Soon',
  upcoming: 'Upcoming',
  overdue: 'Overdue',
}

export const treatmentTone: Record<TreatmentStatus, BadgeTone> = {
  ongoing: 'warning',
  scheduled: 'info',
  completed: 'success',
}

export const caseTone: Record<CaseStatus, BadgeTone> = {
  'awaiting-review': 'danger',
  'in-treatment': 'warning',
  resolved: 'success',
  referred: 'info',
}

export const outbreakTone: Record<OutbreakStatus, BadgeTone> = {
  active: 'danger',
  monitoring: 'warning',
  contained: 'success',
}

export const caseLabel: Record<CaseStatus, string> = {
  'awaiting-review': 'Awaiting Review',
  'in-treatment': 'In Treatment',
  resolved: 'Resolved',
  referred: 'Referred',
}

export const scheduleTone: Record<'scheduled' | 'in-progress' | 'completed', BadgeTone> = {
  scheduled: 'info',
  'in-progress': 'warning',
  completed: 'success',
}

export const animalSpeciesLabel: Record<string, string> = {
  cattle: 'Cattle',
  buffalo: 'Buffalo',
  goat: 'Goat',
  sheep: 'Sheep',
}

/* --------------------------------- Helpers ------------------------------- */

/** 0-100 health score -> semantic tone. */
export function scoreTone(score: number): BadgeTone {
  if (score >= 80) return 'success'
  if (score >= 65) return 'warning'
  return 'danger'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Good'
  if (score >= 65) return 'Needs attention'
  return 'Critical'
}

export function formatSymptomList(symptoms: string[]): string {
  if (symptoms.length === 0) return 'No symptoms reported'
  return symptoms.map((symptom) => titleCase(symptom)).join(', ')
}
