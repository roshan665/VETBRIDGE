import { ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react'

import { Button } from '@/components/common/Button'

const assurances = [
  'No hardware required to get started',
  'Works for cattle, buffalo, goat and sheep',
  'Role based access for every stakeholder',
]

/** Closing call to action. */
export function CtaSection() {
  return (
    <section className="border-b border-line bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-2xl border border-brand-700 bg-brand-800 px-6 py-10 text-center sm:px-10 lg:px-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-white sm:text-3xl">
            Protect Livestock Before Disease Spreads.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-100">
            Register your herd, record the first health entry and let the platform watch for
            disease risk continuously.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button to="/register" variant="secondary" size="lg" iconRight={ArrowRight}>
              Start Monitoring
            </Button>
            <Button
              to="/login"
              variant="ghost"
              size="lg"
              icon={PhoneCall}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              Talk to our team
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {assurances.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-xs text-brand-100">
                <CheckCircle2 className="size-3.5 text-emerald-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
