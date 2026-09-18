import Link from "next/link";
import { Dumbbell } from "lucide-react";

interface WorkoutCardProps {
  workout: {
    slug: string;
    name: string;
    category: string;
    tier: number;
    short_description: string;
    image_url: string;
    primary_muscles: string[];
    equipment: string[];
  };
}

const tierLabels: Record<number, string> = {
  1: "TIER 01",
  2: "TIER 02",
  3: "TIER 03",
};

const tierClasses: Record<number, string> = {
  1: "tier-01",
  2: "tier-02",
  3: "tier-03",
};

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link
      href={`/workouts/${workout.slug}`}
      className="group block bg-white rounded overflow-hidden border border-ink/5 hover:border-ink/10 transition-all hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-charcoal">
        {/* Tier badge */}
        <div className={`absolute top-3 left-3 z-10 tier-badge ${tierClasses[workout.tier] || "tier-01"}`}>
          {tierLabels[workout.tier] || "TIER 01"}
        </div>
        
        {/* Placeholder icon until real images are loaded */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Dumbbell size={40} className="text-white/10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-iron/60">
            {workout.category}
          </span>
        </div>
        <h3 className="text-lg mb-2 group-hover:text-ink/80 transition-colors font-heading">
          {workout.name}
        </h3>
        <p className="text-iron text-sm line-clamp-2 mb-3">
          {workout.short_description}
        </p>

        {/* Muscle chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {workout.primary_muscles.map((muscle) => (
            <span key={muscle} className="muscle-chip">
              {muscle}
            </span>
          ))}
        </div>

        {/* Equipment */}
        <div className="flex items-center gap-1.5 text-iron/50">
          {workout.equipment.slice(0, 3).map((eq) => (
            <span key={eq} className="text-xs font-mono">
              {eq}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
