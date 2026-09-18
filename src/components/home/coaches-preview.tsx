import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { FadeIn } from "@/components/ui/fade-in";

const coaches = [
  { slug: "brian-otieno", name: "Brian Otieno", role: "Head Coach & Co-founder", speciality: "Powerlifting, strength programming" },
  { slug: "achieng-mboya", name: "Achieng' Mboya", role: "Strength & Conditioning Coach", speciality: "Women's strength, postnatal return" },
  { slug: "kevin-mwangi", name: "Kevin Mwangi", role: "Performance Coach", speciality: "Hyrox, engine work, running" },
  { slug: "njeri-kamau", name: "Njeri Kamau", role: "Mobility & Rehab Lead", speciality: "Movement screening, injury-return" },
];

export function CoachesPreview() {
  return (
    <section className="section-spacing">
      <div className="container-gymist">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <RepCounter index="05" label="COACHES" />
              <h2>Meet your coaches.</h2>
            </div>
            <Link
              href="/instructors"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-iron transition-colors"
            >
              See the full team
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {coaches.map((coach) => (
            <Link
              key={coach.slug}
              href={`/instructors/${coach.slug}`}
              className="flex-shrink-0 w-[260px] snap-start group"
            >
              <div className="aspect-[3/4] rounded overflow-hidden bg-charcoal mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 text-4xl font-heading">
                  {coach.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-lg group-hover:text-iron transition-colors font-heading">
                {coach.name}
              </h3>
              <p className="text-iron text-sm">{coach.role}</p>
              <p className="text-iron/60 text-xs mt-1 font-mono uppercase tracking-wider">
                {coach.speciality}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/instructors" className="btn-ghost-dark">
            See the Full Team
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
