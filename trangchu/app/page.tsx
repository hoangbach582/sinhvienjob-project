import { SiteNavbar } from "@/components/site-navbar"
import { HeroSection } from "@/components/hero-section"
import { StatsBar } from "@/components/stats-bar"
import { JobCategories } from "@/components/job-categories"
import { WhyChoose } from "@/components/why-choose"
import { PartnersSection } from "@/components/partners-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <SiteNavbar />
      <HeroSection />
      {/* light content area with rounded top overlapping the hero */}
      <div className="relative z-10 -mt-12 rounded-t-[2.5rem] bg-background pt-2">
        <StatsBar />
        <JobCategories />
        <WhyChoose />
        <PartnersSection />
      </div>
      <SiteFooter />
    </main>
  )
}
