import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Info, Mail, ShieldCheck } from 'lucide-react'

import { AuthVisual } from '@/components/auth/AuthVisual'
import type { AuthSnapshotRow } from '@/components/auth/AuthVisual'
import { RoleSelector } from '@/components/auth/RoleSelector'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { PasswordField, TextField } from '@/components/common/FormField'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import { useAsyncData } from '@/hooks/useAsyncData'
import { getDemoAccounts } from '@/services/api'
import type { DemoAccount, UserRole } from '@/types'

const snapshot: AuthSnapshotRow[] = [
  { label: 'Healthy animals', value: '39 of 48', progress: 81, tone: 'success' },
  { label: 'At-risk animals', value: '6', progress: 14, tone: 'warning' },
  { label: 'Critical cases', value: '3', progress: 8, tone: 'danger' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface LoginErrors {
  email?: string
  password?: string
}

export default function Login() {
  const { signIn, isAuthenticated, roleHome } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState<UserRole>('farmer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResetNote, setShowResetNote] = useState(false)

  const { data: demoCredentials } = useAsyncData<DemoAccount[]>(() => getDemoAccounts(), [])

  const requestedPath = (location.state as { from?: string } | null)?.from
  const redirectTo = requestedPath ?? roleHome

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true })
  }, [isAuthenticated, navigate, redirectTo])

  const applyDemoAccount = (account: DemoAccount) => {
    setRole(account.role)
    setEmail(account.email)
    setPassword(account.password)
    setErrors({})
    setFormError(null)
  }

  const validate = (): boolean => {
    const next: LoginErrors = {}

    if (!email.trim()) {
      next.email = 'Email address is required.'
    } else if (!emailPattern.test(email.trim())) {
      next.email = 'Enter a valid email address, for example name@farm.in'
    }

    if (!password) {
      next.password = 'Password is required.'
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters.'
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
      await signIn({ email: email.trim(), password, role, remember })
      navigate(redirectTo, { replace: true })
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : 'Unable to sign in right now. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthVisual
        title="Livestock health intelligence at your fingertips"
        description="Sign in to monitor animal health, review disease risk and coordinate veterinary response across your farm, district or state."
        highlights={[
          'Early disease risk alerts with recommended action',
          'Vaccination and treatment records in one place',
          'Direct coordination with veterinary officers',
        ]}
        snapshot={snapshot}
      />

      <div className="flex flex-col bg-canvas">
        <header className="border-b border-line bg-surface px-4 py-4 sm:px-6 lg:hidden">
          <Logo />
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-ink">Sign in to VETBRIDGE</h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Select your role and continue to your workspace. Access is scoped to the role you
                choose.
              </p>
            </div>

            {demoCredentials && demoCredentials.length > 0 ? (
              <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold text-brand-800">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Demo credentials (evaluation build)
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {demoCredentials.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => applyDemoAccount(account)}
                      className="rounded-lg border border-brand-200 bg-surface px-3 py-1.5 text-xs font-medium text-brand-800 transition-colors hover:border-brand-400"
                    >
                      Use {account.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <RoleSelector value={role} onChange={setRole} variant="stacked" />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@farm.in"
                icon={Mail}
                autoComplete="email"
                inputMode="email"
                error={errors.email}
                required
              />

              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
                error={errors.password}
                autoComplete="current-password"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="size-4 rounded border-line text-brand-600"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetNote(true)}
                  className="text-sm font-medium text-brand-700 hover:text-brand-800"
                >
                  Forgot password?
                </button>
              </div>

              {showResetNote ? (
                <p className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-800">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Password reset by OTP is wired to the FastAPI service and will be enabled with the
                  backend release. For now use the demo credentials above.
                </p>
              ) : null}

              {formError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700"
                >
                  {formError}
                </p>
              ) : null}

              <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
                {isSubmitting ? 'Signing in' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
              <p className="text-sm text-ink-muted">
                New to VETBRIDGE?{' '}
                <Link to="/register" className="font-medium text-brand-700 hover:text-brand-800">
                  Create Account
                </Link>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Mock authentication</Badge>
                <Badge tone="info">No backend connected yet</Badge>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-700"
              >
                <ArrowRight className="size-3.5 rotate-180" aria-hidden="true" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
