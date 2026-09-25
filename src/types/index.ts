/**
 * Central type definitions for VETBRIDGE.
 *
 * Every layer (mock data, services, components, pages) imports its domain
 * types from here so the FastAPI/PostgreSQL backend can be plugged in later
 * without touching component code.
 */

/* ----------------------------- Users & roles ----------------------------- */

export type UserRole = 'farmer' | 'veterinarian' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  /** Farmer specific */
  farmName?: string
  /** Veterinarian / Government specific */
  organization?: string
  designation?: string
  district?: string
  state?: string
  createdAt: string
}

/* -------------------------------- Livestock ------------------------------ */

export type AnimalSpecies = 'cattle' | 'buffalo' | 'goat' | 'sheep' | 'other'
export type AnimalGender = 'male' | 'female'
export type HealthStatus = 'healthy' | 'at-risk' | 'critical'
export type RiskLevel = 'low' | 'medium' | 'high'
export type HealthHistoryType = 'health-check' | 'vaccination' | 'observation' | 'treatment'

export interface HealthTrendPoint {
  date: string
  score: number
}

export interface RiskIndicator {
  id: string
  label: string
  value: string
  level: 'normal' | 'watch' | 'critical'
  note?: string
}

export interface Animal {
  id: string
  /** Official ear tag, e.g. COW-1042. */
  tag: string
  name: string
  species: AnimalSpecies
  breed: string
  gender: AnimalGender
  dateOfBirth: string
  ageMonths: number
  weightKg: number
  heightCm: number
  bodyConditionScore: number
  healthStatus: HealthStatus
  riskLevel: RiskLevel
  /** 0 - 100 composite health score. */
  healthScore: number
  temperatureC: number
  activity: string
  appetite: string
  ownerName: string
  farmName: string
  district: string
  state: string
  location: string
  tagNumber: string
  lastCheckup: string
  nextCheckup: string
  knownDiseases: string[]
  currentMedication: string
  allergies: string[]
  notes: string
  vaccinations: Vaccination[]
  treatments: Treatment[]
  healthHistory: HealthRecord[]
  healthTrend: HealthTrendPoint[]
  riskIndicators: RiskIndicator[]
}

export interface HealthRecord {
  id: string
  animalId: string
  animalTag: string
  type?: HealthHistoryType
  title?: string
  recordedAt: string
  temperatureC: number
  heartRateBpm: number
  respiratoryRateBpm?: number
  weightKg: number
  activity?: string
  appetite?: string
  /** 0 - 100 mobility / rumination activity index. */
  activityScore: number
  milkYieldLitres?: number
  symptoms: string[]
  status: HealthStatus
  recordedBy: string
  notes?: string
}

/* ---------------------------- Disease intelligence ----------------------- */

export interface DiseasePrediction {
  id: string
  animalId: string
  animalTag: string
  disease: string
  riskLevel: RiskLevel
  /** 0 - 1 model confidence */
  confidence: number
  indicators: string[]
  recommendedAction: string
  veterinarianReviewRequired: boolean
  predictedAt: string
}

export type OutbreakStatus = 'active' | 'monitoring' | 'contained'

export interface DiseaseOutbreak {
  id: string
  disease: string
  district: string
  state: string
  riskLevel: RiskLevel
  affectedAreaKm: number
  animalsAffected: number
  confirmedCases: number
  reportedOn: string
  status: OutbreakStatus
  recommendedAction: string
}

/* -------------------------------- Vaccination ---------------------------- */

export type VaccinationStatus = 'completed' | 'due-soon' | 'upcoming' | 'overdue'

export interface Vaccination {
  id: string
  animalId: string
  animalTag: string
  vaccine: string
  protectsAgainst: string
  dueDate: string
  administeredOn?: string
  status: VaccinationStatus
  batchNo?: string
  administeredBy?: string
}

/* --------------------------------- Treatment ----------------------------- */

export type TreatmentStatus = 'ongoing' | 'scheduled' | 'completed'

export interface Treatment {
  id: string
  animalId: string
  animalTag: string
  diagnosis: string
  medicine: string
  dosage: string
  durationDays: number
  startedOn: string
  endedOn?: string
  veterinarian: string
  status: TreatmentStatus
  outcome?: 'recovered' | 'under-observation' | 'referred'
  notes?: string
}

/* ----------------------------------- Alerts ------------------------------ */

export type AlertSeverity = 'high' | 'medium' | 'low'
export type AlertCategory = 'disease' | 'vaccination' | 'weight' | 'outbreak' | 'vitals'

export interface Alert {
  id: string
  severity: AlertSeverity
  category: AlertCategory
  title: string
  message: string
  animalId?: string
  animalTag?: string
  location?: string
  createdAt: string
  acknowledged: boolean
}

/* ------------------------------- Veterinary ------------------------------ */

export type CaseStatus = 'awaiting-review' | 'in-treatment' | 'resolved' | 'referred'

export interface VetCase {
  id: string
  animalTag: string
  animalName: string
  species: AnimalSpecies
  breed: string
  ownerName: string
  farmName: string
  district: string
  primaryComplaint: string
  provisionalDiagnosis: string
  riskLevel: RiskLevel
  status: CaseStatus
  reportedAt: string
  veterinarian: string
}

export interface PendingDiagnosis {
  id: string
  animalTag: string
  animalName: string
  submittedBy: string
  farmName: string
  district: string
  submittedAt: string
  symptoms: string[]
  suggestedDisease: string
  confidence: number
  riskLevel: RiskLevel
  labSampleSent: boolean
}

export type AppointmentType = 'field-visit' | 'video-call' | 'sample-collection'

export interface ScheduleItem {
  id: string
  time: string
  animalTag: string
  ownerName: string
  location: string
  purpose: string
  type: AppointmentType
  status: 'scheduled' | 'in-progress' | 'completed'
}

/* --------------------------------- Dashboards ---------------------------- */

export interface DashboardStats {
  totalAnimals: number
  healthy: number
  atRisk: number
  critical: number
  vaccinationsDue: number
  activeAlerts: number
  healthScore: number
}

export interface VeterinarianStats {
  assignedAnimals: number
  highRiskCases: number
  pendingDiagnoses: number
  appointmentsToday: number
  treatmentsOngoing: number
  resolvedThisMonth: number
  avgResponseHours: number
  vaccinationCoverage: number
}

export interface AdminStats {
  animalsMonitored: number
  activeAlerts: number
  highRiskRegions: number
  registeredFarms: number
  veterinarians: number
  vaccinationCoverage: number
  samplesTested: number
  outbreaksContained: number
}

/* ----------------------------------- Charts ------------------------------ */

export interface TrendPoint {
  /** Short axis label, e.g. "Mon" */
  label: string
  /** ISO date */
  date: string
  healthy: number
  atRisk: number
  critical: number
}

export interface RiskSlice {
  name: string
  value: number
  level: RiskLevel
}

export interface MonthlyTrendPoint {
  month: string
  lumpySkin: number
  fmd: number
  haemorrhagicSepticaemia: number
  brucellosis: number
}

export interface HealthCoveragePoint {
  name: string
  value: number
}

export interface DistrictRisk {
  id: string
  district: string
  state: string
  riskLevel: RiskLevel
  activeAlerts: number
  animalsMonitored: number
  farms: number
  vaccinationCoverage: number
  /** Percentage coordinates used by the placeholder GIS canvas (Leaflet later) */
  mapX: number
  mapY: number
}

export interface RegionCoverage {
  id: string
  region: string
  farmsCovered: number
  animalsCovered: number
  vaccinationCoverage: number
  veterinarians: number
}

/* --------------------------------- Services ------------------------------ */

export interface LoginRequest {
  email: string
  password: string
  role: UserRole
  remember?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
}

export interface AuthSession {
  token: string
  user: User
}

/** Input accepted by the dedicated Add Animal workflow. */
export interface AnimalInput {
  tag: string
  name: string
  species: AnimalSpecies
  breed: string
  gender: AnimalGender
  dateOfBirth: string
  ageMonths?: number
  weightKg: number
  heightCm: number
  bodyConditionScore: number
  healthStatus: HealthStatus
  temperatureC: number
  lastCheckup: string
  knownDiseases: string[]
  currentMedication: string
  allergies: string[]
  tagNumber: string
  ownerName: string
  location: string
  notes: string
}

/** Phase 1 quick-add callers may omit profile-only fields; the API supplies safe defaults. */
export interface CreateAnimalRequest
  extends Pick<AnimalInput, 'tag' | 'name' | 'species' | 'breed' | 'gender' | 'weightKg'> {
  ageMonths?: number
  dateOfBirth?: string
  heightCm?: number
  bodyConditionScore?: number
  healthStatus?: AnimalInput['healthStatus']
  temperatureC?: number
  lastCheckup?: string
  knownDiseases?: string[]
  currentMedication?: string
  allergies?: string[]
  tagNumber?: string
  ownerName?: string
  location?: string
  notes?: string
}
export type UpdateAnimalRequest = Partial<AnimalInput>

export interface RecordHealthCheckRequest {
  temperatureC: number
  weightKg: number
  activity: string
  appetite: string
  respiratoryRateBpm: number
  heartRateBpm: number
  symptoms: string[]
  notes?: string
}

export interface DiseaseCheckRequest {
  animalId?: string
  animalTag: string
  symptoms: string[]
  temperatureC: number
  activityScore: number
}

export interface DiseaseCheckResult {
  disease: string
  riskLevel: RiskLevel
  confidence: number
  indicators: string[]
  recommendedAction: string
  veterinarianReviewRequired: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

/** Placeholder credentials exposed on the login screen while auth is mocked. */
export interface DemoAccount {
  role: UserRole
  label: string
  email: string
  password: string
}

/* --------------------------- Directory summaries ------------------------- */

export interface FarmSummary {
  id: string
  farmName: string
  ownerName: string
  district: string
  state: string
  animals: number
  healthScore: number
  vaccinationCoverage: number
  lastInspection: string
  status: 'active' | 'needs-review' | 'restricted'
}

export interface VeterinarianSummary {
  id: string
  name: string
  designation: string
  district: string
  specialization: string
  casesHandled: number
  activeCaseload: number
  averageRating: number
  status: 'available' | 'on-field' | 'on-leave'
}

/* ------------------------------ Disease library -------------------------- */

export interface DiseaseLibraryEntry {
  id: string
  name: string
  affectedSpecies: string
  severity: RiskLevel
  transmission: string
  keyIndicators: string[]
  prevention: string
  reportingRequired: boolean
}

