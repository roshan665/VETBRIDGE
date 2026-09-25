import { ArrowRight, ClipboardList, Gauge, ShieldCheck, Siren } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Step {
  number: string
  icon: LucideIcon
  title: string
  description: string
  detail: string
}

const steps: Step[] = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Register Livestock',
    description:
      'Add each animal with ear tag, species, breed, age and owner details to create a permanent health identity.',
    detail: 'Takes under two minutes per animal',
  },
  {
    number: '02',
    icon: Gauge,
    title: 'Monitor Health',
    description:
      'Record temperature, activity, weight and milk yield. Baseline and trend are calculated for every animal.',
    detail: 'Daily or weekly entries',
  },
  {
    number: '03',
    icon: Siren,
    title: 'Detect Disease Risk',
    description:
      'The detection engine scores symptoms and vitals against disease indicators and grades the animal risk level.',
    detail: 'Low, medium or high risk',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'Take Preventive Action',
    description:
      'Alerts reach the farmer and the assigned veterinary officer with the recommended action and follow-up plan.',
    detail: 'Vaccinate, isolate or treat',
  },
]

/** Four step connected timeline. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            From identification to intervention in four steps
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            The workflow mirrors how animal health is actually managed in the field - identify,
            observe, assess, act.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 lg:grid-cols-4 lg:gap-4">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              {index < steps.length - 1 ? (
                <span
                  className="absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-line lg:block"
                  aria-hidden="true"
                />
              ) : null}

              <div className="relative rounded-xl border border-line bg-surface p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-700 text-white">
                    <step.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="nums text-2xl font-semibold text-brand-100">{step.number}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-700">
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
