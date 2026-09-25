import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { BarChart3, Bell, Bug, ClipboardCheck, FileBarChart, Map, Settings, Siren, Stethoscope, Syringe, Users } from 'lucide-react'

import { ComingSoon } from '@/components/common/ComingSoon'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { dashboardLink } from '@/lib/navigation'
import type { UserRole } from '@/types'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'
import AddAnimal from '@/pages/farmer/AddAnimal'
import AnimalProfile from '@/pages/farmer/AnimalProfile'

import FarmerDashboard from '@/pages/farmer/Dashboard'
import FarmerAnimals from '@/pages/farmer/Animals'
import FarmerDiseaseDetection from '@/pages/farmer/DiseaseDetection'
import FarmerVaccinations from '@/pages/farmer/Vaccinations'
import FarmerTreatments from '@/pages/farmer/Treatments'
import FarmerAlerts from '@/pages/farmer/Alerts'
import FarmerReports from '@/pages/farmer/Reports'
import VeterinarianDashboard from '@/pages/veterinarian/Dashboard'
import AdminDashboard from '@/pages/admin/Dashboard'

interface PlaceholderConfig { title: string; description: string; icon: LucideIcon; plannedFeatures: string[]; dataSources?: string[] }
const placeholders: Record<string, PlaceholderConfig> = {
  patients: { title: 'Patient registry', description: 'Review and manage animals currently assigned to your veterinary caseload.', icon: Stethoscope, plannedFeatures: ['Searchable patient registry', 'Patient history and vitals', 'Owner contact and farm context', 'Case handoff notes'], dataSources: ['GET /animals', 'GET /health-records'] },
  diagnosis: { title: 'Diagnosis workspace', description: 'Prioritise AI-assisted cases, confirm findings and record clinical decisions.', icon: Bug, plannedFeatures: ['Triage queue by risk level', 'Clinical findings and lab results', 'Diagnosis confirmation', 'Referral and escalation workflow'], dataSources: ['GET /vet/cases', 'GET /vet/diagnoses'] },
  treatment: { title: 'Treatment management', description: 'Create, schedule and monitor treatment plans for assigned livestock patients.', icon: Syringe, plannedFeatures: ['Treatment plan templates', 'Medication and dosage history', 'Follow-up reminders', 'Outcome tracking'], dataSources: ['GET /treatments', 'POST /treatments'] },
  vaccinations: { title: 'Vaccination register', description: 'Coordinate vaccination coverage and follow-up for the farms in your service area.', icon: Syringe, plannedFeatures: ['Coverage overview', 'Due and overdue registers', 'Batch traceability', 'Campaign planning'], dataSources: ['GET /vaccinations', 'GET /admin/health-coverage'] },
  alerts: { title: 'Alert centre', description: 'Review, acknowledge and coordinate the health alerts assigned to your workspace.', icon: Bell, plannedFeatures: ['Severity-based alert inbox', 'Acknowledgement workflow', 'Escalation and assignment', 'Notification history'], dataSources: ['GET /alerts', 'PATCH /alerts/:id'] },
  reports: { title: 'Reports and exports', description: 'Generate operational and health reports for your assigned service area.', icon: FileBarChart, plannedFeatures: ['Scheduled report summaries', 'CSV export for field teams', 'Trend comparison', 'Shareable audit snapshots'], dataSources: ['GET /reports', 'GET /dashboard/:role/summary'] },
  diseaseMonitoring: { title: 'Disease monitoring', description: 'Coordinate district-level surveillance, outbreak response and preventive interventions.', icon: Siren, plannedFeatures: ['State and district risk view', 'Outbreak response queue', 'Alert acknowledgement', 'Inter-agency coordination notes'], dataSources: ['GET /admin/district-risks', 'GET /admin/outbreaks'] },
  map: { title: 'GIS disease map', description: 'Visualise disease risk and livestock coverage geographically across the service region.', icon: Map, plannedFeatures: ['Interactive district map', 'Risk heat layers', 'Outbreak location pins', 'Coverage and vaccination overlays'], dataSources: ['GET /admin/district-risks', 'GET /admin/regions'] },
  farmers: { title: 'Farmer registry', description: 'Manage registered livestock owners, farms and participation status.', icon: Users, plannedFeatures: ['Farmer and farm directory', 'Verification status', 'Farm health score', 'Contact and consent records'], dataSources: ['GET /admin/farms'] },
  veterinarians: { title: 'Veterinarian directory', description: 'Coordinate veterinary officers, service areas and active caseloads.', icon: Stethoscope, plannedFeatures: ['Officer availability', 'District assignments', 'Caseload overview', 'Performance and response metrics'], dataSources: ['GET /admin/veterinarians'] },
  analytics: { title: 'Government analytics', description: 'Explore statewide health, vaccination and disease intelligence trends.', icon: BarChart3, plannedFeatures: ['Cross-district comparisons', 'Disease trend analysis', 'Coverage gap identification', 'Exportable intelligence briefs'], dataSources: ['GET /admin/disease-trends', 'GET /admin/health-coverage'] },
  settings: { title: 'Workspace settings', description: 'Manage your profile, notification preferences and workspace defaults.', icon: Settings, plannedFeatures: ['Profile and organisation details', 'Notification preferences', 'Accessibility options', 'Session and security controls'], dataSources: ['PATCH /users/me'] },
  help: { title: 'Help and support', description: 'Find guidance for monitoring livestock health and using JeevRaksha effectively.', icon: ClipboardCheck, plannedFeatures: ['Role-based user guides', 'Disease response playbooks', 'Frequently asked questions', 'Contact support request'], dataSources: ['GET /resources', 'POST /support/tickets'] },
}

function Placeholder({ configKey }: { configKey: string }) {
  const config = placeholders[configKey]
  return <ComingSoon title={config.title} description={config.description} icon={config.icon} plannedFeatures={config.plannedFeatures} dataSources={config.dataSources} />
}

function ProtectedRoute({ role }: { role: UserRole }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user?.role !== role) return <Navigate to={user ? dashboardLink[user.role] : '/login'} replace />
  return <Outlet />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute role="farmer" />}>
        <Route element={<AppLayout />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/animals" element={<FarmerAnimals />} />
          <Route path="/farmer/animals/add" element={<AddAnimal />} />
          <Route path="/farmer/animals/:animalId" element={<AnimalProfile />} />
          <Route path="/farmer/disease-detection" element={<FarmerDiseaseDetection />} />
          <Route path="/farmer/vaccinations" element={<FarmerVaccinations />} />
          <Route path="/farmer/treatments" element={<FarmerTreatments />} />
          <Route path="/farmer/alerts" element={<FarmerAlerts />} />
          <Route path="/farmer/reports" element={<FarmerReports />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute role="veterinarian" />}>
        <Route element={<AppLayout />}>
          <Route path="/veterinarian/dashboard" element={<VeterinarianDashboard />} />
          <Route path="/veterinarian/patients" element={<Placeholder configKey="patients" />} />
          <Route path="/veterinarian/diagnosis" element={<Placeholder configKey="diagnosis" />} />
          <Route path="/veterinarian/treatment" element={<Placeholder configKey="treatment" />} />
          <Route path="/veterinarian/vaccinations" element={<Placeholder configKey="vaccinations" />} />
          <Route path="/veterinarian/alerts" element={<Placeholder configKey="alerts" />} />
          <Route path="/veterinarian/reports" element={<Placeholder configKey="reports" />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/disease-monitoring" element={<Placeholder configKey="diseaseMonitoring" />} />
          <Route path="/admin/map" element={<Placeholder configKey="map" />} />
          <Route path="/admin/farmers" element={<Placeholder configKey="farmers" />} />
          <Route path="/admin/veterinarians" element={<Placeholder configKey="veterinarians" />} />
          <Route path="/admin/analytics" element={<Placeholder configKey="analytics" />} />
          <Route path="/admin/reports" element={<Placeholder configKey="reports" />} />
        </Route>
      </Route>
      <Route path="/settings" element={<AppLayout />}><Route index element={<Placeholder configKey="settings" />} /></Route>
      <Route path="/help" element={<AppLayout />}><Route index element={<Placeholder configKey="help" />} /></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

