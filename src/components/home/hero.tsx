"use client";

import Link from "next/link";
import { RepCounter } from "@/components/ui/rep-counter";
import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-end bg-ink overflow-hidden">
      {/* Background image placeholder — will be replaced with AI-generated image */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-ink" />
      
      {/* Scrim overlay */}
      <div className="absolute inset-0 hero-scrim" />

      {/* Content */}
      <div className="container-gymist relative z-10 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <RepCounter index="01" label="NAIROBI" />
          <h1 className="text-white mb-6">
            Train with intent.
          </h1>
          <p className="text-white/70 max-w-xl text-lg mb-8">
            Coach-led strength and conditioning in Kilimani. Small groups. Real programming. Measured results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/booking" className="btn-volt">
              Book a Free Intro Session
            </Link>
            <Link href="/workouts" className="btn-ghost">
              See the Workouts
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
