import {
  Activity,
  Bell,
  Bug,
  MapPinned,
  Radar,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Bug,
    title: 'AI Disease Detection',
    description:
      'Symptom, vitals and behaviour signals are scored against more than 50 livestock disease indicators to flag risk early.',
  },
  {
    icon: Activity,
    title: 'Health Monitoring',
    description:
      'Continuous tracking of temperature, activity index, milk yield and weight for every tagged animal in the herd.',
  },
  {
    icon: Syringe,
    title: 'Vaccination Management',
    description:
      'Schedule, record and audit FMD, HS, BQ and PPR vaccinations with automatic due-date reminders for each animal.',
  },
  {
    icon: Bell,
    title: 'Early Warning Alerts',
    description:
      'Farmers and veterinary officers receive graded alerts the moment an animal crosses a defined health threshold.',
  },
  {
    icon: Stethoscope,
    title: 'Veterinary Support',
    description:
      'Share case history, request remote diagnosis and coordinate field visits or sample collection from one place.',
  },
  {
    icon: MapPinned,
    title: 'Disease Risk Mapping',
    description:
      'District level outbreak monitoring helps departments direct surveillance, vaccination drives and containment efforts.',
  },
]

/** Feature grid: six capability cards. */
export function FeaturesGrid() {
  return (
    <section id="features" className="border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
              <Radar className="size-3.5" aria-hidden="true" />
              Platform capabilities
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
              Complete Livestock Health Intelligence
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              From the first symptom to the closed treatment record, every step is captured,
              traceable and available to the people responsible for animal health.
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group rounded-xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-brand-200"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FeaturesGrid
