import { platformStats } from '@/data/mockData'

/** Trust / impact band with the platform's headline numbers. */
export function StatsBand() {
  return (
    <section id="about" className="border-b border-line bg-canvas">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            About JeevRaksha
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            Built for early warning, preventive care and coordinated response
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            JeevRaksha connects farmers, veterinary officers and animal husbandry departments on a
            single livestock health record - combining symptom reporting, health monitoring and
            disease risk analytics so outbreaks are contained before they spread.
          </p>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {platformStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-line bg-surface p-5 shadow-card"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="nums block text-3xl font-semibold text-brand-700 sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm font-semibold text-ink">{stat.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                  {stat.caption}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default StatsBand
