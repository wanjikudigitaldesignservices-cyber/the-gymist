import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Target, Eye, BarChart3 } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CTABand } from "@/components/ui/cta-band";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Gymist opened in 2021 in Kilimani, Nairobi. Learn about our founding story, values, facility, and why coaching quality sets us apart.",
};

const values = [
  {
    icon: Target,
    title: "Programming over guesswork",
    description:
      "Every session follows a structured programme. Progressive overload, periodisation, deload weeks — the science of getting stronger, applied consistently.",
  },
  {
    icon: Users,
    title: "Coaches who actually coach",
    description:
      "Our coaches don't just count reps. They cue your movement, adjust your load, and know your training history. Every session is coached.",
  },
  {
    icon: Eye,
    title: "Small groups, real attention",
    description:
      "Classes cap at 14. Personal training is truly personal. You're not a membership number — your coach knows your name and your goals.",
  },
  {
    icon: BarChart3,
    title: "Measured, not vibes",
    description:
      "We track. Body composition scans, strength benchmarks, conditioning tests. You'll know you're progressing because the data shows it.",
  },
];

const timeline = [
  { year: "2015", event: "Brian Otieno starts coaching out of a rented garage in Lavington" },
  { year: "2018", event: "First barbell club — 8 members, 3 barbells, zero air conditioning" },
  { year: "2019", event: "Achieng' and Kevin join as coaches. First structured group programme" },
  { year: "2021", event: "The Gymist opens on Wood Avenue, Kilimani — 300sqm, fully equipped" },
  { year: "2023", event: "Team grows to 8 coaches. 900+ members trained since opening" },
  { year: "2026", event: "Expanded floor, Hyrox prep programme, nutrition coaching launched" },
];

const facilitySpecs = [
  { label: "Floor area", value: "300 sqm across two levels" },
  { label: "Squat racks", value: "6 full power racks" },
  { label: "Platforms", value: "4 Olympic lifting platforms" },
  { label: "Cardio", value: "8 assault bikes, 4 rowers, 2 ski ergs" },
  { label: "Free weights", value: "Dumbbells 2–50 kg, kettlebells 8–40 kg" },
  { label: "Turf lane", value: "20m sled push/pull lane" },
  { label: "Changing rooms", value: "Separate men's and women's, showers, lockers" },
  { label: "Parking", value: "Basement parking, 30 spaces" },
  { label: "Amenities", value: "Water station, towel service, chalk buckets" },
];

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="container-gymist pt-24">
        <Breadcrumbs items={[{ label: "About" }]} />
      </div>

      {/* Founding Story */}
      <section className="section-spacing pt-8">
        <div className="container-gymist">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <RepCounter index="01" label="OUR STORY" />
              <h1 className="mb-6">Built from a garage in Lavington.</h1>
              <div className="space-y-4 text-iron">
                <p>
                  The Gymist didn&apos;t start with a business plan. It started with a barbell, a squat rack, and a garage in Lavington that smelled like chalk and ambition.
                </p>
                <p>
                  In 2015, Brian Otieno — a former university athlete turned strength coach — started training a handful of friends who were tired of the big-box gym experience in Nairobi. No programming, no coaching, just rows of machines and a TV playing music videos.
                </p>
                <p>
                  The garage grew to eight members, then twenty. The programming worked. People got stronger. Word spread. Six years of chalk-dust coaching later, The Gymist opened its doors on Wood Avenue in Kilimani — a proper training facility built on a simple idea: coaching quality matters more than square footage.
                </p>
                <p>
                  Today, eight coaches run over forty classes a week. The barbells are better and the showers actually work. But the philosophy hasn&apos;t changed: small groups, real programming, measured results.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="aspect-[4/3] rounded overflow-hidden bg-charcoal relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <span className="font-heading text-6xl">2015</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing bg-white">
        <div className="container-gymist">
          <FadeIn>
            <RepCounter index="02" label="VALUES" />
            <h2 className="mb-12">What we believe in.</h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <div className="p-6 rounded border border-ink/5 bg-bone">
                  <value.icon size={24} className="text-volt mb-4" />
                  <h3 className="text-lg mb-2">{value.title}</h3>
                  <p className="text-iron text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Facility */}
      <section className="section-spacing">
        <div className="container-gymist">
          <FadeIn>
            <RepCounter index="03" label="FACILITY" />
            <h2 className="mb-12">The space.</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilitySpecs.map((spec) => (
              <FadeIn key={spec.label}>
                <div className="flex items-start gap-3 p-4 rounded bg-white border border-ink/5">
                  <span className="text-xs font-mono uppercase tracking-wider text-iron/50 w-24 flex-shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-sm font-medium">{spec.value}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-spacing bg-ink">
        <div className="container-gymist">
          <FadeIn>
            <RepCounter index="04" label="TIMELINE" />
            <h2 className="text-white mb-12">The journey.</h2>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.1}>
                  <div
                    className={`flex items-start gap-6 relative ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-volt -translate-x-1.5 mt-1.5" />
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <span className="font-mono text-volt text-sm">{item.year}</span>
                      <p className="text-white/70 text-sm mt-1">{item.event}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white">
        <div className="container-gymist text-center">
          <FadeIn>
            <h2 className="mb-4">Come see the place.</h2>
            <p className="text-iron max-w-lg mx-auto mb-8">
              Book a free intro session and we&apos;ll show you around, talk about your goals, and put you through a real workout.
            </p>
            <Link href="/booking" className="btn-volt">
              Book a Free Intro Session
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      <CTABand />
    </>
  );
}
