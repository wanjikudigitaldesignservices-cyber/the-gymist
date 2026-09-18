"use client";

import { useRef, useEffect, useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";

const stats = [
  { value: 12, label: "Coaches", suffix: "" },
  { value: 24, label: "Programmed Workouts", suffix: "" },
  { value: 40, label: "Classes a Week", suffix: "" },
  { value: 900, label: "Members Trained", suffix: "+" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="stat-number">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function StatStrip() {
  return (
    <section className="bg-ink py-16">
      <div className="container-gymist">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <FadeIn key={stat.label} className="text-center">
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              <p className="text-white/50 text-sm mt-2 font-mono uppercase tracking-wider">
                {stat.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
