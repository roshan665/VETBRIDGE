import { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes/AppRoutes'

/** Keeps every navigation at the top of the viewport. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
