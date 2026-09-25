import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, ShieldCheck, UserPlus } from 'lucide-react'

import { AuthVisual } from '@/components/auth/AuthVisual'
import type { AuthSnapshotRow } from '@/components/auth/AuthVisual'
import { RoleSelector } from '@/components/auth/RoleSelector'
import { Button } from '@/components/common/Button'
import { PasswordField, TextField } from '@/components/common/FormField'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'

const snapshot: AuthSnapshotRow[] = [
  { label: 'District coverage', value: '4,280 farms', progress: 86, tone: 'success' },
  { label: 'Vaccination drive', value: '82%', progress: 82, tone: 'success' },
  { label: 'Active alerts', value: '34', progress: 22, tone: 'warning' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phonePattern = /^[6-9]\d{9}$/
const namePattern = /^[A-Za-z][A-Za-z\s.'-]{2,}$/

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: UserRole
}

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>

const initialForm: RegisterForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'farmer',
}

export default function Register() {
  const { signUp, isAuthenticated, roleHome } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterForm>(initialForm)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate(roleHome, { replace: true })
  }, [isAuthenticated, navigate, roleHome])

  const updateField = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: RegisterErrors = {}
    const phoneDigits = form.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')

    if (!form.name.trim()) {
      next.name = 'Full name is required.'
    } else if (!namePattern.test(form.name.trim())) {
      next.name = 'Enter your name using letters only (minimum 3 characters).'
    }

    if (!form.email.trim()) {
      next.email = 'Email address is required.'
    } else if (!emailPattern.test(form.email.trim())) {
      next.email = 'Enter a valid email address, for example name@farm.in'
    }

    if (!form.phone.trim()) {
      next.phone = 'Phone number is required.'
    } else if (!phonePattern.test(phoneDigits)) {
      next.phone = 'Enter a valid 10 digit Indian mobile number.'
    }

    if (!form.password) {
      next.password = 'Password is required.'
    } else if (form.password.length < 8) {
      next.password = 'Use at least 8 characters.'
    } else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      next.password = 'Include at least one letter and one number.'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Please confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const phoneDigits = form.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
      await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: `+91 ${phoneDigits}`,
        password: form.password,
        role: form.role,
      })
      navigate(roleHome, { replace: true })
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : 'Unable to create the account right now. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthVisual
        title="Create your JeevRaksha account"
        description="Register your farm or department in minutes and start building a complete, traceable livestock health record."
        highlights={[
          'Free for individual farmers and gaushalas',
          'Veterinary officer assignment by district',
          'Works on mobile, tablet and desktop',
        ]}
        snapshot={snapshot}
      />

      <div className="flex flex-col bg-canvas">
        <header className="border-b border-line bg-surface px-4 py-4 sm:px-6 lg:hidden">
          <Logo />
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                All fields are required. Your role determines the workspace and permissions assigned
                after registration.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <RoleSelector
                value={form.role}
                onChange={(role) => updateField('role', role)}
                variant="cards"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Full Name"
                  value={form.name}
                  onChange={(value) => updateField('name', value)}
                  placeholder="Prem Kumar Sharma"
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => updateField('email', value)}
                  placeholder="you@farm.in"
                  icon={Mail}
                  error={errors.email}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                <TextField
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => updateField('phone', value)}
                  placeholder="98260 45117"
                  icon={Phone}
                  error={errors.phone}
                  hint="Indian mobile number, +91 prefix optional"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
                <div className="sm:col-span-1">
                  <PasswordField
                    label="Password"
                    value={form.password}
                    onChange={(value) => updateField('password', value)}
                    placeholder="Minimum 8 characters"
                    error={errors.password}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <PasswordField
                    label="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(value) => updateField('confirmPassword', value)}
                    placeholder="Re-enter your password"
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {formError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700"
                >
                  {formError}
                </p>
              ) : null}

              <p className="flex items-start gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-xs leading-relaxed text-ink-muted">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand-600" aria-hidden="true" />
                This is a demo registration. No personal data leaves this browser until the FastAPI
                backend and PostgreSQL database are connected.
              </p>

              <Button type="submit" size="lg" fullWidth loading={isSubmitting} icon={UserPlus}>
                {isSubmitting ? 'Creating account' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
              <p className="text-sm text-ink-muted">
                Already registered?{' '}
                <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
                  Sign in
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-700"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
