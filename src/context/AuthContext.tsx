import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { dashboardLink } from '@/lib/navigation'
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '@/services/api'
import type { AuthSession, LoginRequest, RegisterRequest, User } from '@/types'

const STORAGE_KEY = 'jeevraksha.session'

function readStoredSession(): AuthSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed.user?.role || !parsed.user?.name) return null
    return parsed
  } catch {
    return null
  }
}

function writeStoredSession(session: AuthSession | null, persistent = true): void {
  const store = persistent ? window.localStorage : window.sessionStorage
  const other = persistent ? window.sessionStorage : window.localStorage

  if (session) {
    store.setItem(STORAGE_KEY, JSON.stringify(session))
    other.removeItem(STORAGE_KEY)
  } else {
    store.removeItem(STORAGE_KEY)
    other.removeItem(STORAGE_KEY)
  }
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  /** Landing route for the signed-in role (farmer / veterinarian / admin). */
  roleHome: string
  signIn: (payload: LoginRequest) => Promise<User>
  signUp: (payload: RegisterRequest) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession())

  const signIn = useCallback(async (payload: LoginRequest) => {
    const nextSession = await apiLogin(payload)
    writeStoredSession(nextSession, payload.remember ?? true)
    setSession(nextSession)
    return nextSession.user
  }, [])

  const signUp = useCallback(async (payload: RegisterRequest) => {
    const nextSession = await apiRegister(payload)
    writeStoredSession(nextSession, true)
    setSession(nextSession)
    return nextSession.user
  }, [])

  const signOut = useCallback(async () => {
    await apiLogout()
    writeStoredSession(null)
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      roleHome: session ? dashboardLink[session.user.role] : '/login',
      signIn,
      signUp,
      signOut,
    }),
    [session, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}
