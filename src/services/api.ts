/**
 * JeevRaksha API client.
 *
 * Every screen talks to the backend through this module only, so moving from
 * mock data to the FastAPI service is a one-file change:
 *
 *   .env:  VITE_USE_MOCK_API=false
 *          VITE_API_BASE_URL=https://api.jeevraksha.in/api/v1
 *
 * Each exported function documents the FastAPI route it will eventually call.
 */

import {
  adminStats,
  demoAccounts,
  diseaseLibrary,
  districtCoverage,
  districtRisks,
  farmDirectory,
  farmerDashboardStats,
  featuredOutbreak,
  healthCoverage,
  herdHealthTrend,
  herdRiskDistribution,
  mockAlerts,
  mockAnimals,
  mockHealthRecords,
  mockTreatments,
  mockUsers,
  mockVaccinations,
  monthlyDiseaseTrend,
  outbreakAlerts,
  pendingDiagnoses,
  recentCases,
  regionCoverage,
  symptomOptions,
  todaySchedule,
  veterinarianDirectory,
  veterinarianStats,
  vetCaseTrend,
  vetCriticalAlerts,
  vetPatientRisk,
} from '@/data/mockData'
import type {
  AdminStats,
  Alert,
  Animal,
  ApiResponse,
  AuthSession,
  CreateAnimalRequest,
  DashboardStats,
  DemoAccount,
  DiseaseCheckRequest,
  DiseaseCheckResult,
  DiseaseLibraryEntry,
  DiseaseOutbreak,
  DistrictRisk,
  FarmSummary,
  HealthCoveragePoint,
  HealthRecord,
  LoginRequest,
  MonthlyTrendPoint,
  PendingDiagnosis,
  RegisterRequest,
  RecordHealthCheckRequest,
  RegionCoverage,
  RiskLevel,
  RiskSlice,
  ScheduleItem,
  Treatment,
  TrendPoint,
  UpdateAnimalRequest,
  User,
  UserRole,
  Vaccination,
  VetCase,
  VeterinarianStats,
  VeterinarianSummary,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000)

/** True while the app is running on temporary data (shown in the sidebar). */
export const usingMockApi = USE_MOCK_API

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Thin fetch wrapper so FastAPI responses can be dropped in later. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status)
    }

    return (await response.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

/** Simulates network latency so loading states behave like the real backend. */
function withLatency<T>(payload: T, delayMs = 220): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), delayMs)
  })
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

/** Session-local store: mutations survive route changes without pretending to persist a backend. */
let animalStore: Animal[] = clone(mockAnimals)
let healthRecordStore: HealthRecord[] = clone(
  mockAnimals.flatMap((animal) => animal.healthHistory).concat(
    mockHealthRecords.filter(
      (record) => !mockAnimals.some((animal) => animal.id === record.animalId),
    ),
  ),
)

/* ------------------------------ Authentication --------------------------- */

function userFromEmail(email: string, role: UserRole): User {
  const local = email.split('@')[0] ?? 'user'
  const name = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ')

  const template = mockUsers[role]
  return {
    ...template,
    id: `usr-${role}-${local}`,
    name: name || template.name,
    email,
  }
}

/** POST /auth/login */
export async function login(payload: LoginRequest): Promise<AuthSession> {
  if (!USE_MOCK_API) {
    return request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  const email = payload.email.trim().toLowerCase()
  const isDemoAccount = demoAccounts.some(
    (account) => account.role === payload.role && account.email.toLowerCase() === email,
  )
  const user = isDemoAccount ? mockUsers[payload.role] : userFromEmail(email, payload.role)

  return withLatency({ token: `mock-token-${payload.role}-${Date.now()}`, user }, 360)
}

/** POST /auth/register */
export async function register(payload: RegisterRequest): Promise<AuthSession> {
  if (!USE_MOCK_API) {
    return request<AuthSession>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  const template = mockUsers[payload.role]
  const user: User = {
    ...template,
    id: `usr-${payload.role}-${Date.now()}`,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone,
    createdAt: new Date().toISOString(),
  }

  return withLatency({ token: `mock-token-${payload.role}-${Date.now()}`, user }, 420)
}

/** POST /auth/logout - stateless today, kept for parity with the backend. */
export async function logout(): Promise<ApiResponse<null>> {
  if (!USE_MOCK_API) {
    return request<ApiResponse<null>>('/auth/logout', { method: 'POST' })
  }
  return withLatency({ data: null, message: 'Signed out' }, 120)
}

/**
 * GET /auth/demo-accounts
 * Only used while authentication is mocked, so evaluators can sign in quickly.
 */
export async function getDemoAccounts(): Promise<DemoAccount[]> {
  if (!USE_MOCK_API) {
    return withLatency<DemoAccount[]>([], 40)
  }

  return withLatency(clone(demoAccounts), 120)
}

/* --------------------------------- Livestock ----------------------------- */

/** GET /animals */
export async function getAnimals(params?: {
  riskLevel?: RiskLevel
  healthStatus?: Animal['healthStatus']
  search?: string
}): Promise<Animal[]> {
  if (!USE_MOCK_API) {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return request<Animal[]>(`/animals${query ? `?${query}` : ''}`)
  }

  let animals = clone(animalStore)
  if (params?.riskLevel) animals = animals.filter((animal) => animal.riskLevel === params.riskLevel)
  if (params?.healthStatus) animals = animals.filter((animal) => animal.healthStatus === params.healthStatus)
  if (params?.search) {
    const term = params.search.trim().toLowerCase()
    animals = animals.filter((animal) =>
      [animal.tag, animal.name, animal.breed].some((value) => value.toLowerCase().includes(term)),
    )
  }

  return withLatency(animals, 260)
}

/** GET /animals/{animalId} */
export async function getAnimal(animalId: string): Promise<Animal> {
  if (!USE_MOCK_API) {
    return request<Animal>(`/animals/${animalId}`)
  }

  const animal = animalStore.find((item) => item.id === animalId || item.tag === animalId)
  if (!animal) {
    throw new ApiError('Animal record was not found.', 404)
  }

  return withLatency(clone(animal), 180)
}

export async function getAnimalById(animalId: string): Promise<Animal> {
  return getAnimal(animalId)
}

/** POST /animals */
export async function createAnimal(payload: CreateAnimalRequest): Promise<Animal> {
  if (!USE_MOCK_API) {
    return request<Animal>('/animals', { method: 'POST', body: JSON.stringify(payload) })
  }

  const now = new Date().toISOString()
  const ageMonths = payload.ageMonths ?? 36
  const healthStatus = payload.healthStatus ?? 'healthy'
  const healthScore = healthStatus === 'healthy' ? 90 : healthStatus === 'at-risk' ? 68 : 42
  const temperatureC = payload.temperatureC ?? 38.6
  const animal: Animal = {
    id: `ani-${Date.now()}`,
    tag: payload.tag.trim().toUpperCase(),
    name: payload.name.trim(),
    species: payload.species,
    breed: payload.breed.trim(),
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth ?? new Date(new Date().setMonth(new Date().getMonth() - ageMonths)).toISOString(),
    ageMonths,
    weightKg: payload.weightKg,
    heightCm: payload.heightCm ?? 135,
    bodyConditionScore: payload.bodyConditionScore ?? 3.5,
    healthStatus,
    riskLevel: healthStatus === 'critical' ? 'high' : healthStatus === 'at-risk' ? 'medium' : 'low',
    healthScore,
    temperatureC,
    activity: 'Normal',
    appetite: 'Good',
    ownerName: payload.ownerName ?? mockUsers.farmer.name,
    farmName: mockUsers.farmer.farmName ?? 'Sharma Dairy Farm',
    district: mockUsers.farmer.district ?? 'Sehore',
    state: mockUsers.farmer.state ?? 'Madhya Pradesh',
    location: payload.location ?? 'Sharma Dairy Farm',
    tagNumber: payload.tagNumber ?? payload.tag,
    lastCheckup: payload.lastCheckup ?? now,
    nextCheckup: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    knownDiseases: payload.knownDiseases ?? [],
    currentMedication: payload.currentMedication ?? 'None',
    allergies: payload.allergies ?? [],
    notes: payload.notes ?? '',
    vaccinations: [],
    treatments: [],
    healthHistory: [],
    healthTrend: [{ date: now, score: healthScore }],
    riskIndicators: [
      { id: 'temperature', label: 'Temperature', value: `${temperatureC.toFixed(1)}°C`, level: 'normal' },
      { id: 'weight', label: 'Weight', value: `${payload.weightKg} kg`, level: 'normal' },
      { id: 'activity', label: 'Activity', value: 'Normal', level: 'normal' },
      { id: 'appetite', label: 'Appetite', value: 'Good', level: 'normal' },
      { id: 'vaccination', label: 'Vaccination', value: 'Not recorded', level: 'watch' },
      { id: 'disease', label: 'Disease Risk', value: 'Low', level: 'normal' },
    ],
  }
  if (animalStore.some((item) => item.tag.toLowerCase() === animal.tag.toLowerCase())) {
    throw new ApiError('An animal with this ID already exists.', 409)
  }
  animalStore = [animal, ...animalStore]

  return withLatency(clone(animal), 380)
}

/** PATCH /animals/{animalId} */
export async function updateAnimal(animalId: string, payload: UpdateAnimalRequest): Promise<Animal> {
  if (!USE_MOCK_API) return request<Animal>(`/animals/${animalId}`, { method: 'PATCH', body: JSON.stringify(payload) })
  const index = animalStore.findIndex((animal) => animal.id === animalId || animal.tag === animalId)
  if (index < 0) throw new ApiError('Animal record was not found.', 404)
  const current = animalStore[index]!
  const updated: Animal = { ...current, ...payload, id: current.id, tag: payload.tag?.trim().toUpperCase() ?? current.tag }
  if (payload.healthStatus && payload.healthStatus !== current.healthStatus) {
    updated.riskLevel = payload.healthStatus === 'critical' ? 'high' : payload.healthStatus === 'at-risk' ? 'medium' : 'low'
    updated.healthScore = payload.healthStatus === 'critical' ? 42 : payload.healthStatus === 'at-risk' ? 68 : Math.max(current.healthScore, 88)
  }
  animalStore[index] = updated
  return withLatency(clone(updated), 320)
}

/** POST /animals/{animalId}/health-checks */
export async function recordHealthCheck(animalId: string, payload: RecordHealthCheckRequest): Promise<HealthRecord> {
  if (!USE_MOCK_API) return request<HealthRecord>(`/animals/${animalId}/health-checks`, { method: 'POST', body: JSON.stringify(payload) })
  const index = animalStore.findIndex((animal) => animal.id === animalId || animal.tag === animalId)
  if (index < 0) throw new ApiError('Animal record was not found.', 404)
  const animal = animalStore[index]!
  const now = new Date().toISOString()
  const status = payload.temperatureC > 40 || payload.symptoms.length > 2 ? 'critical' : payload.temperatureC > 39.5 || payload.symptoms.length > 0 ? 'at-risk' : 'healthy'
  const activityScore = payload.activity === 'Normal' ? 90 : payload.activity === 'Slightly reduced' ? 70 : 45
  const record: HealthRecord = {
    id: `hr-${animal.id}-${Date.now()}`, animalId: animal.id, animalTag: animal.tag,
    type: 'health-check', title: 'Routine health check', recordedAt: now,
    temperatureC: payload.temperatureC, heartRateBpm: payload.heartRateBpm,
    respiratoryRateBpm: payload.respiratoryRateBpm, weightKg: payload.weightKg,
    activity: payload.activity, appetite: payload.appetite, activityScore,
    symptoms: payload.symptoms, status, recordedBy: mockUsers.farmer.name, notes: payload.notes,
  }
  const score = Math.max(30, Math.min(100, Math.round((100 - Math.max(0, payload.temperatureC - 38) * 15) * 0.3 + activityScore * 0.25 + (payload.appetite === 'Good' ? 95 : 65) * 0.25 + animal.healthScore * 0.2)))
  animalStore[index] = {
    ...animal, temperatureC: payload.temperatureC, weightKg: payload.weightKg,
    activity: payload.activity, appetite: payload.appetite, healthStatus: status, healthScore: score,
    riskLevel: status === 'critical' ? 'high' : status === 'at-risk' ? 'medium' : 'low',
    lastCheckup: now, healthHistory: [record, ...animal.healthHistory],
    healthTrend: [...animal.healthTrend, { date: now, score }].slice(-14),
  }
  healthRecordStore = [record, ...healthRecordStore]
  return withLatency(clone(record), 360)
}

export async function getAnimalHealthHistory(animalId: string): Promise<HealthRecord[]> {
  if (!USE_MOCK_API) return request<HealthRecord[]>(`/animals/${animalId}/health-records`)
  const animal = animalStore.find((item) => item.id === animalId || item.tag === animalId)
  if (!animal) throw new ApiError('Animal record was not found.', 404)
  return withLatency(clone(animal.healthHistory), 180)
}

export async function getAnimalHealthTrend(animalId: string): Promise<Animal['healthTrend']> {
  if (!USE_MOCK_API) return request<Animal['healthTrend']>(`/animals/${animalId}/health-trend`)
  const animal = animalStore.find((item) => item.id === animalId || item.tag === animalId)
  if (!animal) throw new ApiError('Animal record was not found.', 404)
  return withLatency(clone(animal.healthTrend), 180)
}


/** GET /health-records (optionally scoped to one animal) */
export async function getHealthRecords(animalId?: string): Promise<HealthRecord[]> {
  if (!USE_MOCK_API) {
    return request<HealthRecord[]>(
      animalId ? `/animals/${animalId}/health-records` : '/health-records',
    )
  }

  const records = animalId
    ? healthRecordStore.filter((record) => record.animalId === animalId)
    : healthRecordStore

  return withLatency(clone(records), 240)
}

/* ------------------------- Disease risk prediction ----------------------- */

interface PredictionRule {
  disease: string
  match: string[]
  recommend: string
}

const PREDICTION_RULES: PredictionRule[] = [
  {
    disease: 'Lumpy Skin Disease',
    match: ['Skin nodules', 'High fever', 'Watery eyes', 'Reduced milk yield'],
    recommend: 'Isolate the animal and request veterinary inspection within 24 hours.',
  },
  {
    disease: 'Foot and Mouth Disease',
    match: ['Mouth ulcers', 'Lameness', 'High fever', 'Loss of appetite'],
    recommend: 'Restrict animal movement, disinfect sheds and notify the veterinary officer.',
  },
  {
    disease: 'Haemorrhagic Septicaemia',
    match: ['High fever', 'Laboured breathing', 'Loss of appetite', 'Elevated heart rate'],
    recommend: 'Start emergency antibiotic therapy and confirm with a blood sample.',
  },
  {
    disease: 'Peste des Petits Ruminants',
    match: ['Watery diarrhoea', 'Mouth ulcers', 'Nasal discharge', 'High fever'],
    recommend: 'Separate the flock and begin PPR supportive care immediately.',
  },
  {
    disease: 'Pneumonia',
    match: ['Laboured breathing', 'Nasal discharge', 'High fever', 'Loss of appetite'],
    recommend: 'Begin broad-spectrum antibiotic cover and keep the animal warm.',
  },
  {
    disease: 'Mastitis',
    match: ['Reduced milk yield', 'Loss of appetite', 'High fever'],
    recommend: 'Perform a strip cup test and start intramammary antibiotic therapy.',
  },
  {
    disease: 'Rumen acidosis',
    match: ['Reduced rumination', 'Loss of appetite', 'Sudden weight loss'],
    recommend: 'Correct the diet, provide a rumen tonic and monitor feed intake for 3 days.',
  },
]

/**
 * Deterministic triage built from the reported signals. This is the seam where
 * the scikit-learn model (served through FastAPI) will plug in later.
 */
function assessRisk(payload: DiseaseCheckRequest): DiseaseCheckResult {
  const reported = payload.symptoms.filter((symptom) => symptomOptions.includes(symptom))

  let best: PredictionRule | undefined
  let bestScore = 0

  for (const rule of PREDICTION_RULES) {
    const score = rule.match.filter((symptom) => reported.includes(symptom)).length
    if (score > bestScore) {
      best = rule
      bestScore = score
    }
  }

  const feverPenalty = payload.temperatureC >= 40 ? 1.5 : payload.temperatureC >= 39.5 ? 0.5 : 0
  const activityPenalty = payload.activityScore < 45 ? 0.75 : payload.activityScore < 65 ? 0.25 : 0
  const weightedScore = bestScore + feverPenalty + activityPenalty

  const riskLevel: RiskLevel =
    weightedScore >= 3.5 ? 'high' : weightedScore >= 1.75 ? 'medium' : 'low'

  const indicators = [...reported]
  if (payload.temperatureC >= 39.5) {
    indicators.push(`Body temperature ${payload.temperatureC.toFixed(1)} °C`)
  }
  if (payload.activityScore < 65) {
    indicators.push(`Activity index ${payload.activityScore}/100`)
  }
  if (indicators.length === 0) {
    indicators.push('No abnormal indicators reported')
  }

  const fallback: PredictionRule = {
    disease: 'No significant disease pattern',
    match: [],
    recommend: 'Continue routine monitoring and re-run the check if symptoms change.',
  }
  const rule = best ?? fallback

  const confidence = Math.min(0.96, 0.42 + weightedScore * 0.11 + reported.length * 0.03)

  return {
    disease: rule.disease,
    riskLevel,
    confidence: Number(confidence.toFixed(2)),
    indicators,
    recommendedAction: rule.recommend,
    veterinarianReviewRequired: riskLevel !== 'low',
  }
}

/** POST /disease-predictions */
export async function getDiseasePrediction(
  payload: DiseaseCheckRequest,
): Promise<DiseaseCheckResult> {
  if (!USE_MOCK_API) {
    return request<DiseaseCheckResult>('/disease-predictions', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  return withLatency(assessRisk(payload), 700)
}

/** GET /diseases (library / reference data) */
export async function getDiseaseLibrary(): Promise<DiseaseLibraryEntry[]> {
  if (!USE_MOCK_API) {
    return request<DiseaseLibraryEntry[]>('/diseases')
  }

  return withLatency(clone(diseaseLibrary), 200)
}

/** GET /diseases/symptoms - selectable symptoms for the detection form. */
export async function getSymptomOptions(): Promise<string[]> {
  if (!USE_MOCK_API) {
    return request<string[]>('/diseases/symptoms')
  }

  return withLatency(clone(symptomOptions), 140)
}

/* -------------------------- Vaccination & treatment ---------------------- */

/** GET /vaccinations */
export async function getVaccinations(params?: {
  status?: Vaccination['status']
}): Promise<Vaccination[]> {
  if (!USE_MOCK_API) {
    const query = params?.status ? `?status=${params.status}` : ''
    return request<Vaccination[]>(`/vaccinations${query}`)
  }

  const records = params?.status
    ? mockVaccinations.filter((item) => item.status === params.status)
    : mockVaccinations

  return withLatency(clone(records), 240)
}

/** PATCH /vaccinations/{vaccinationId}/complete */
export async function completeVaccination(
  vaccinationId: string,
): Promise<ApiResponse<{ id: string }>> {
  if (!USE_MOCK_API) {
    return request<ApiResponse<{ id: string }>>(`/vaccinations/${vaccinationId}/complete`, {
      method: 'PATCH',
    })
  }

  return withLatency({ data: { id: vaccinationId }, message: 'Vaccination recorded' }, 200)
}

/** GET /treatments */
export async function getTreatments(params?: {
  status?: Treatment['status']
}): Promise<Treatment[]> {
  if (!USE_MOCK_API) {
    const query = params?.status ? `?status=${params.status}` : ''
    return request<Treatment[]>(`/treatments${query}`)
  }

  const records = params?.status
    ? mockTreatments.filter((item) => item.status === params.status)
    : mockTreatments

  return withLatency(clone(records), 240)
}

/* ----------------------------------- Alerts ------------------------------ */

/** GET /alerts */
export async function getAlerts(params?: { severity?: Alert['severity'] }): Promise<Alert[]> {
  if (!USE_MOCK_API) {
    const query = params?.severity ? `?severity=${params.severity}` : ''
    return request<Alert[]>(`/alerts${query}`)
  }

  const records = params?.severity
    ? mockAlerts.filter((alert) => alert.severity === params.severity)
    : mockAlerts

  return withLatency(clone(records), 200)
}

/** GET /alerts/critical - surveillance feed shown to veterinarians. */
export async function getCriticalAlerts(): Promise<Alert[]> {
  if (!USE_MOCK_API) {
    return request<Alert[]>('/alerts/critical')
  }

  return withLatency(clone(vetCriticalAlerts), 200)
}

/** PATCH /alerts/{alertId}/acknowledge */
export async function acknowledgeAlert(alertId: string): Promise<ApiResponse<{ id: string }>> {
  if (!USE_MOCK_API) {
    return request<ApiResponse<{ id: string }>>(`/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
    })
  }

  return withLatency({ data: { id: alertId }, message: 'Alert acknowledged' }, 180)
}

/* ------------------------------- Veterinary ------------------------------ */

/** GET /veterinarian/cases */
export async function getVetCases(params?: { status?: VetCase['status'] }): Promise<VetCase[]> {
  if (!USE_MOCK_API) {
    const query = params?.status ? `?status=${params.status}` : ''
    return request<VetCase[]>(`/veterinarian/cases${query}`)
  }

  const records = params?.status
    ? recentCases.filter((item) => item.status === params.status)
    : recentCases

  return withLatency(clone(records), 260)
}

/** GET /veterinarian/pending-diagnoses */
export async function getPendingDiagnoses(): Promise<PendingDiagnosis[]> {
  if (!USE_MOCK_API) {
    return request<PendingDiagnosis[]>('/veterinarian/pending-diagnoses')
  }

  return withLatency(clone(pendingDiagnoses), 240)
}

/** GET /veterinarian/schedule?date=today */
export async function getSchedule(): Promise<ScheduleItem[]> {
  if (!USE_MOCK_API) {
    return request<ScheduleItem[]>('/veterinarian/schedule?date=today')
  }

  return withLatency(clone(todaySchedule), 220)
}

/** GET /veterinarian/stats */
export async function getVeterinarianStats(): Promise<VeterinarianStats> {
  if (!USE_MOCK_API) {
    return request<VeterinarianStats>('/veterinarian/stats')
  }

  return withLatency(clone(veterinarianStats), 200)
}

/** GET /veterinarian/caseload-trend */
export async function getVetCaseTrend(): Promise<TrendPoint[]> {
  if (!USE_MOCK_API) {
    return request<TrendPoint[]>('/veterinarian/caseload-trend')
  }

  return withLatency(clone(vetCaseTrend), 220)
}

/** GET /veterinarian/caseload-risk */
export async function getVetPatientRisk(): Promise<RiskSlice[]> {
  if (!USE_MOCK_API) {
    return request<RiskSlice[]>('/veterinarian/caseload-risk')
  }

  return withLatency(clone(vetPatientRisk), 200)
}

/* ------------------------------- Dashboards ------------------------------ */

/** GET /dashboard/farmer/stats */
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!USE_MOCK_API) {
    return request<DashboardStats>('/dashboard/farmer/stats')
  }

  return withLatency(clone(farmerDashboardStats), 200)
}

/** GET /dashboard/farmer/herd-trend */
export async function getHerdHealthTrend(): Promise<TrendPoint[]> {
  if (!USE_MOCK_API) {
    return request<TrendPoint[]>('/dashboard/farmer/herd-trend')
  }

  return withLatency(clone(herdHealthTrend), 220)
}

/** GET /dashboard/farmer/risk-distribution */
export async function getRiskDistribution(): Promise<RiskSlice[]> {
  if (!USE_MOCK_API) {
    return request<RiskSlice[]>('/dashboard/farmer/risk-distribution')
  }

  return withLatency(clone(herdRiskDistribution), 200)
}

/* --------------------------------- Government ---------------------------- */

/** GET /admin/stats */
export async function getAdminStats(): Promise<AdminStats> {
  if (!USE_MOCK_API) {
    return request<AdminStats>('/admin/stats')
  }

  return withLatency(clone(adminStats), 220)
}

/** GET /admin/district-risks */
export async function getDistrictRisks(): Promise<DistrictRisk[]> {
  if (!USE_MOCK_API) {
    return request<DistrictRisk[]>('/admin/district-risks')
  }

  return withLatency(clone(districtRisks), 240)
}

/** GET /admin/disease-trends */
export async function getMonthlyDiseaseTrend(): Promise<MonthlyTrendPoint[]> {
  if (!USE_MOCK_API) {
    return request<MonthlyTrendPoint[]>('/admin/disease-trends')
  }

  return withLatency(clone(monthlyDiseaseTrend), 240)
}

/** GET /admin/health-coverage */
export async function getHealthCoverage(): Promise<HealthCoveragePoint[]> {
  if (!USE_MOCK_API) {
    return request<HealthCoveragePoint[]>('/admin/health-coverage')
  }

  return withLatency(clone(healthCoverage), 220)
}

/** GET /admin/district-coverage */
export async function getDistrictCoverage(): Promise<HealthCoveragePoint[]> {
  if (!USE_MOCK_API) {
    return request<HealthCoveragePoint[]>('/admin/district-coverage')
  }

  return withLatency(clone(districtCoverage), 220)
}

/** GET /admin/regions */
export async function getRegionCoverage(): Promise<RegionCoverage[]> {
  if (!USE_MOCK_API) {
    return request<RegionCoverage[]>('/admin/regions')
  }

  return withLatency(clone(regionCoverage), 240)
}

/** GET /admin/outbreaks */
export async function getOutbreakAlerts(): Promise<DiseaseOutbreak[]> {
  if (!USE_MOCK_API) {
    return request<DiseaseOutbreak[]>('/admin/outbreaks')
  }

  return withLatency(clone(outbreakAlerts), 220)
}

/** GET /admin/outbreaks/featured - highlighted on the public landing page. */
export async function getFeaturedOutbreak(): Promise<DiseaseOutbreak> {
  if (!USE_MOCK_API) {
    return request<DiseaseOutbreak>('/admin/outbreaks/featured')
  }

  return withLatency(clone(featuredOutbreak), 160)
}

/** GET /admin/farms */
export async function getFarmDirectory(): Promise<FarmSummary[]> {
  if (!USE_MOCK_API) {
    return request<FarmSummary[]>('/admin/farms')
  }

  return withLatency(clone(farmDirectory), 240)
}

/** GET /admin/veterinarians */
export async function getVeterinarianDirectory(): Promise<VeterinarianSummary[]> {
  if (!USE_MOCK_API) {
    return request<VeterinarianSummary[]>('/admin/veterinarians')
  }

  return withLatency(clone(veterinarianDirectory), 240)
}




