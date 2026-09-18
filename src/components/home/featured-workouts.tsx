import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";
import { WorkoutCard } from "@/components/workouts/workout-card";

// Hardcoded featured workouts for initial render — will be replaced with Supabase data
const featuredWorkouts = [
  {
    slug: "barbell-back-squat",
    name: "Barbell Back Squat",
    category: "Strength" as const,
    tier: 2 as const,
    short_description: "The king of lower body lifts. Build quad and glute strength with a full-depth barbell squat.",
    image_url: "/supabase-mock/barbell-back-squat.webp",
    primary_muscles: ["Quads", "Glutes"],
    equipment: ["Barbell", "Rack"],
  },
  {
    slug: "conventional-deadlift",
    name: "Conventional Deadlift",
    category: "Strength" as const,
    tier: 3 as const,
    short_description: "The ultimate posterior chain builder. Pull heavy from the floor with perfect form.",
    image_url: "/supabase-mock/conventional-deadlift.webp",
    primary_muscles: ["Posterior chain"],
    equipment: ["Barbell"],
  },
  {
    slug: "kettlebell-swing",
    name: "Kettlebell Swing",
    category: "Conditioning" as const,
    tier: 2 as const,
    short_description: "Explosive hip extension that builds power and conditioning in one movement.",
    image_url: "/supabase-mock/kettlebell-swing.webp",
    primary_muscles: ["Posterior chain"],
    equipment: ["Kettlebell"],
  },
  {
    slug: "pull-up",
    name: "Pull-Up",
    category: "Strength" as const,
    tier: 2 as const,
    short_description: "Bodyweight lat and bicep builder. The gold standard of upper body pulling.",
    image_url: "/supabase-mock/pull-up.webp",
    primary_muscles: ["Lats", "Biceps"],
    equipment: ["Bar"],
  },
  {
    slug: "hip-thrust",
    name: "Hip Thrust",
    category: "Hypertrophy" as const,
    tier: 2 as const,
    short_description: "Isolate and load the glutes through a full range of hip extension.",
    image_url: "/supabase-mock/hip-thrust.webp",
    primary_muscles: ["Glutes"],
    equipment: ["Barbell", "Bench"],
  },
  {
    slug: "power-clean",
    name: "Power Clean",
    category: "Olympic" as const,
    tier: 3 as const,
    short_description: "Explosive full-body lift that builds athletic power from the floor to the rack.",
    image_url: "/supabase-mock/power-clean.webp",
    primary_muscles: ["Full body"],
    equipment: ["Barbell"],
  },
];

export function FeaturedWorkouts() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-gymist">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <RepCounter index="03" label="WORKOUTS" />
              <h2>Featured movements.</h2>
            </div>
            <Link
              href="/workouts"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-iron transition-colors"
            >
              View all 24
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorkouts.map((workout) => (
            <StaggerItem key={workout.slug}>
              <WorkoutCard workout={workout} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/workouts" className="btn-volt">
            View All Workouts
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
