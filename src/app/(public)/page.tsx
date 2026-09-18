import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, Dumbbell, Zap, Heart } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { CTABand } from "@/components/ui/cta-band";
import { HomeHero } from "@/components/home/hero";
import { StatStrip } from "@/components/home/stat-strip";
import { FeaturedWorkouts } from "@/components/home/featured-workouts";
import { CoachesPreview } from "@/components/home/coaches-preview";
import { TimetablePreview } from "@/components/home/timetable-preview";
import { MembershipSnapshot } from "@/components/home/membership-snapshot";
import { TestimonialsSection } from "@/components/home/testimonials";
import { LatestBlog } from "@/components/home/latest-blog";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "The Gymist | Coach-Led Strength & Conditioning in Kilimani, Nairobi",
  description:
    "Train with intent at The Gymist. Coach-led strength and conditioning in Kilimani, Nairobi. Small groups, real programming, measured results. Book your free intro session today.",
};

const pillars = [
  {
    icon: Dumbbell,
    title: "Strength",
    description:
      "Barbell and dumbbell programmes built on progressive overload. Squat, press, pull, hinge — coached every rep.",
    href: "/workouts?category=Strength",
    image: "/images/placeholder-strength.jpg",
  },
  {
    icon: Zap,
    title: "Conditioning",
    description:
      "Engine work that builds capacity without burning you out. Intervals, circuits, and Hyrox prep.",
    href: "/workouts?category=Conditioning",
    image: "/images/placeholder-conditioning.jpg",
  },
  {
    icon: Heart,
    title: "Mobility & Recovery",
    description:
      "Movement screening, joint prep, and recovery protocols. The training nobody sees that makes everything else possible.",
    href: "/workouts?category=Mobility",
    image: "/images/placeholder-mobility.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HomeHero />

      {/* Stat Strip */}
      <StatStrip />

      {/* What We Do */}
      <section className="section-spacing">
        <div className="container-gymist">
          <FadeIn>
            <RepCounter index="02" label="WHAT WE DO" />
            <h2 className="mb-12">
              Three pillars.
              <br />
              One standard.
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Link
                  href={pillar.href}
                  className="group block bg-white rounded overflow-hidden border border-ink/5 hover:border-ink/10 transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-charcoal">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <pillar.icon size={48} className="text-white/20" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 group-hover:text-ink transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-iron text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold mt-4 text-ink">
                      Explore
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Workouts */}
      <FeaturedWorkouts />

      {/* Meet Your Coaches */}
      <CoachesPreview />

      {/* Timetable Preview */}
      <TimetablePreview />

      {/* Nutrition Teaser */}
      <section className="clay-section py-20">
        <div className="container-gymist">
          <FadeIn>
            <RepCounter index="07" label="NUTRITION" className="!text-white/60" />
            <h2 className="text-white mb-4">
              Know your numbers before
              <br />
              you chase them.
            </h2>
            <p className="text-white/70 max-w-xl mb-8">
              Our calorie and macro calculator is built for Kenyan food — ugali, nyama choma, sukuma wiki, chapati and all. Get a real plan you can actually follow.
            </p>
            <Link href="/nutrition" className="btn-volt">
              Open the Calculator
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Membership Snapshot */}
      <MembershipSnapshot />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Latest from the Blog */}
      <LatestBlog />

      {/* CTA Band */}
      <CTABand />
    </>
  );
}
