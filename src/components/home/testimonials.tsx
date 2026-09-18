import { Star } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";

const testimonials = [
  {
    name: "Grace Wambui",
    quote: "I came in not knowing how to hold a barbell. Six months later, I deadlift 80kg and feel stronger than I have in my life. The coaches genuinely care about your form.",
    rating: 5,
  },
  {
    name: "James Njoroge",
    quote: "Tried three gyms in Nairobi before The Gymist. The difference is the programming — every session has a purpose, not just random exercises thrown together.",
    rating: 5,
  },
  {
    name: "Amina Osman",
    quote: "As a runner, I never thought strength training was for me. The mobility and strength work here has taken minutes off my half-marathon time.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-gymist">
        <FadeIn>
          <RepCounter index="09" label="RESULTS" />
          <h2 className="mb-12">What members say.</h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="bg-bone rounded p-6 border border-ink/5">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-volt text-volt"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-ink/80 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
