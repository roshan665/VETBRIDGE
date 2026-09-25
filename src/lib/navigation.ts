/**
 * Role based navigation configuration for the app shell sidebar.
 */

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bug,
  ClipboardList,
  Crosshair,
  FileText,
  LayoutDashboard,
  Pill,
  Satellite,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { UserRole } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  badge?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const sidebarNavigation: Record<UserRole, NavSection[]> = {
  farmer: [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', to: '/farmer/dashboard', icon: LayoutDashboard },
        { label: 'My Animals', to: '/farmer/animals', icon: Activity },
      ],
    },
    {
      title: 'Health Management',
      items: [
        { label: 'Disease Detection', to: '/farmer/disease-detection', icon: Bug },
        { label: 'Vaccinations', to: '/farmer/vaccinations', icon: Syringe },
        { label: 'Treatments', to: '/farmer/treatments', icon: Pill },
        { label: 'Alerts', to: '/farmer/alerts', icon: Bell, badge: '7' },
      ],
    },
    {
      title: 'Insights',
      items: [{ label: 'Reports', to: '/farmer/reports', icon: FileText }],
    },
  ],
  veterinarian: [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', to: '/veterinarian/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Clinical Work',
      items: [
        { label: 'Patients', to: '/veterinarian/patients', icon: Stethoscope },
        { label: 'Diagnosis', to: '/veterinarian/diagnosis', icon: Crosshair, badge: '12' },
        { label: 'Treatment', to: '/veterinarian/treatment', icon: Pill },
        { label: 'Vaccinations', to: '/veterinarian/vaccinations', icon: Syringe },
      ],
    },
    {
      title: 'Surveillance',
      items: [
        { label: 'Alerts', to: '/veterinarian/alerts', icon: AlertTriangle, badge: '3' },
        { label: 'Reports', to: '/veterinarian/reports', icon: FileText },
      ],
    },
  ],
  admin: [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Disease Monitoring', to: '/admin/disease-monitoring', icon: Bug },
        { label: 'GIS Map', to: '/admin/map', icon: Satellite },
      ],
    },
    {
      title: 'Registries',
      items: [
        { label: 'Farmers', to: '/admin/farmers', icon: Users },
        { label: 'Veterinarians', to: '/admin/veterinarians', icon: ShieldCheck },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
        { label: 'Reports', to: '/admin/reports', icon: ClipboardList },
      ],
    },
  ],
}

/** Icons used in the public marketing navbar / footer links. */
export const publicNavigation = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
]

export const publicResourceLinks = [
  { label: 'Disease Library', href: '#features' },
  { label: 'Prevention', href: '#how-it-works' },
  { label: 'Vaccination', href: '#roles' },
]

export const dashboardLink: Record<UserRole, string> = {
  farmer: '/farmer/dashboard',
  veterinarian: '/veterinarian/dashboard',
  admin: '/admin/dashboard',
}

export const roleLabels: Record<UserRole, string> = {
  farmer: 'Farmer',
  veterinarian: 'Veterinarian',
  admin: 'Government',
}

/** Alerts / surveillance screen per role (used by the app header bell). */
export const alertPath: Record<UserRole, string> = {
  farmer: '/farmer/alerts',
  veterinarian: '/veterinarian/alerts',
  admin: '/admin/disease-monitoring',
}
