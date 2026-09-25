import { ArrowRight, Home, SearchX } from 'lucide-react'

import { Button } from '@/components/common/Button'
import { Card, CardBody } from '@/components/common/Card'
import { Footer } from '@/components/landing/Footer'
import { Navbar } from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl">
          <CardBody className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
              <SearchX className="size-5" aria-hidden="true" />
            </span>
            <p className="nums mt-5 text-3xl font-semibold text-ink">404</p>
            <h1 className="mt-2 text-lg font-semibold text-ink">This page could not be found</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
              The link you followed may be outdated, or the module may not be part of this build yet.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button to="/" icon={Home} iconRight={ArrowRight}>
                Back to home
              </Button>
              <Button to="/login" variant="outline">
                Sign in
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
