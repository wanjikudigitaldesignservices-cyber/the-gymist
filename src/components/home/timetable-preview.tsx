import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { FadeIn } from "@/components/ui/fade-in";

const todayClasses = [
  { name: "Barbell Club", time: "06:00", coach: "Brian Otieno", remaining: 4, slug: "barbell-club" },
  { name: "Engine Room", time: "07:00", coach: "Kevin Mwangi", remaining: 6, slug: "engine-room" },
  { name: "Strong Beginnings", time: "09:00", coach: "Aisha Hassan", remaining: 8, slug: "strong-beginnings" },
  { name: "Kettlebell Complex", time: "12:00", coach: "Dennis Odhiambo", remaining: 2, slug: "kettlebell-complex" },
  { name: "Mobility Flow", time: "17:00", coach: "Njeri Kamau", remaining: 10, slug: "mobility-flow" },
  { name: "Barbell Club", time: "18:00", coach: "Brian Otieno", remaining: 1, slug: "barbell-club" },
];

export function TimetablePreview() {
  const today = new Date().toLocaleDateString("en-KE", { weekday: "long" });

  return (
    <section className="section-spacing bg-white">
      <div className="container-gymist">
        <FadeIn>
          <div className="flex items-end justify-between mb-8">
            <div>
              <RepCounter index="06" label="TIMETABLE" />
              <h2>Today&apos;s classes.</h2>
              <p className="text-iron mt-2">{today}</p>
            </div>
            <Link
              href="/classes"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-iron transition-colors"
            >
              Full timetable
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        <div className="space-y-2">
          {todayClasses.map((cls, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <Link
                href={`/classes/${cls.slug}`}
                className="flex items-center justify-between p-4 rounded bg-bone hover:bg-bone-dark border border-ink/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-ink/80 w-14">
                    {cls.time}
                  </span>
                  <div>
                    <span className="font-semibold text-sm group-hover:text-ink/80 transition-colors">
                      {cls.name}
                    </span>
                    <span className="text-iron/60 text-xs ml-2">
                      with {cls.coach}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono ${
                      cls.remaining <= 2
                        ? "text-danger"
                        : cls.remaining <= 5
                        ? "text-clay"
                        : "text-success"
                    }`}
                  >
                    {cls.remaining} spots
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-iron/30 group-hover:text-ink/60 transition-colors"
                  />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/classes" className="btn-ghost-dark">
            Full Timetable
          </Link>
        </div>
      </div>
    </section>
  );
}
