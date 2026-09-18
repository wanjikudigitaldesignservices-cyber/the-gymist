import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { RepCounter } from "@/components/ui/rep-counter";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/fade-in";
import { formatKES } from "@/lib/utils";

const plans = [
  {
    slug: "foundation",
    name: "Foundation",
    price: 6500,
    annualPrice: 54167,
    period: "month",
    highlighted: false,
    features: [
      "Full gym floor access",
      "2 group classes a week",
      "Induction session",
      "Personalised programme",
    ],
  },
  {
    slug: "momentum",
    name: "Momentum",
    price: 9500,
    annualPrice: 79167,
    period: "month",
    highlighted: true,
    features: [
      "Unlimited group classes",
      "Quarterly fitness assessment",
      "Personalised nutrition plan",
      "1 guest pass per month",
      "Priority booking",
    ],
  },
  {
    slug: "private",
    name: "Private",
    price: 22000,
    annualPrice: 183333,
    period: "month",
    highlighted: false,
    features: [
      "Everything in Momentum",
      "8 one-on-one sessions / month",
      "WhatsApp coach access",
      "Monthly body composition scan",
      "Supplement guidance",
    ],
  },
];

export function MembershipSnapshot() {
  return (
    <section className="section-spacing">
      <div className="container-gymist">
        <FadeIn>
          <div className="text-center mb-12">
            <RepCounter index="08" label="MEMBERSHIP" className="justify-center" />
            <h2>Invest in the work.</h2>
            <p className="text-iron mt-4 max-w-lg mx-auto">
              Three plans. No lock-in contracts. Start with a free intro session.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <StaggerItem key={plan.slug}>
              <div
                className={`rounded p-6 border transition-all ${
                  plan.highlighted
                    ? "bg-ink text-white border-ink scale-[1.02] shadow-xl"
                    : "bg-white border-ink/10"
                }`}
              >
                {plan.highlighted && (
                  <span className="tier-badge tier-02 mb-4 inline-block">
                    MOST POPULAR
                  </span>
                )}
                <h3
                  className={`text-xl mb-2 ${
                    plan.highlighted ? "text-white" : ""
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span
                    className={`font-mono text-2xl font-bold ${
                      plan.highlighted ? "text-volt" : "text-ink"
                    }`}
                  >
                    {formatKES(plan.price)}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      plan.highlighted ? "text-white/50" : "text-iron"
                    }`}
                  >
                    / {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-volt" : "text-success"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-white/80" : "text-iron"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/membership"
                  className={`block text-center py-3 px-6 rounded text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "btn-volt w-full justify-center"
                      : "border border-ink/20 hover:border-ink/40 text-ink"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="text-center mt-8">
          <Link
            href="/membership"
            className="text-sm text-iron hover:text-ink transition-colors"
          >
            Compare all plans, day passes, and student rates →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
