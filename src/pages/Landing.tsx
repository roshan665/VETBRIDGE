import { CtaSection } from '@/components/landing/CtaSection'
import { EarlyWarning } from '@/components/landing/EarlyWarning'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { Footer } from '@/components/landing/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { RoleSection } from '@/components/landing/RoleSection'
import { StatsBand } from '@/components/landing/StatsBand'
import { Navbar } from '@/components/layout/Navbar'

/** Public product landing page. */
export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <FeaturesGrid />
        <HowItWorks />
        <RoleSection />
        <EarlyWarning />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
