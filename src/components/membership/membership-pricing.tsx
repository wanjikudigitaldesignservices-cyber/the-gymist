'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { MembershipPlan } from '@/lib/types'
import { FadeIn } from '@/components/ui/fade-in'

interface MembershipPricingProps {
  plans: MembershipPlan[]
}

export function MembershipPricing({ plans }: MembershipPricingProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const sortedPlans = [...plans].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="flex flex-col items-center">
      {/* Annual Toggle */}
      <div className="mb-16 flex items-center gap-4 rounded-full border border-[var(--iron)]/20 bg-white p-2 shadow-sm">
        <button
          onClick={() => setIsAnnual(false)}
          className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            !isAnnual ? 'bg-[var(--ink)] text-white' : 'text-[var(--iron)] hover:text-[var(--ink)]'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            isAnnual ? 'bg-[var(--volt)] text-[var(--ink)]' : 'text-[var(--iron)] hover:text-[var(--ink)]'
          }`}
        >
          Annually
        </button>
        <div className="absolute -right-2 -top-3 sm:-right-8 sm:-top-6 rotate-12 rounded bg-[var(--danger)] px-2 py-1 font-mono text-[10px] font-bold uppercase text-white shadow-sm">
          2 months free
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {sortedPlans.map((plan, i) => {
          const price = isAnnual && plan.annual_price_kes 
            ? plan.annual_price_kes 
            : plan.price_kes
            
          const period = isAnnual ? 'year' : plan.period

          return (
            <FadeIn key={plan.id} delay={i * 0.1} className={`relative flex flex-col rounded-lg bg-white p-8 shadow-sm border ${
              plan.is_highlighted ? 'border-[var(--volt)] ring-1 ring-[var(--volt)] transform md:-translate-y-4 md:shadow-xl z-10' : 'border-[var(--iron)]/10'
            }`}>
              {plan.is_highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--volt)] px-4 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)] shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8 border-b border-[var(--iron)]/10 pb-8 text-center">
                <h3 className="mb-2 font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">
                  {plan.name}
                </h3>
                <p className="min-h-[48px] text-sm text-[var(--iron)]">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline justify-center gap-1">
                  <span className="font-mono text-sm font-bold text-[var(--iron)]">KES</span>
                  <span className="font-archivo text-5xl tracking-tight text-[var(--ink)]">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-[var(--iron)]">/{period}</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[var(--ink)]">
                    <Check className="h-5 w-5 shrink-0 text-[var(--success)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/booking?type=intro`}
                className={`mt-auto rounded py-4 text-center font-bold transition-colors ${
                  plan.is_highlighted 
                    ? 'bg-[var(--volt)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white' 
                    : 'bg-[var(--ink)] text-white hover:bg-[var(--volt)] hover:text-[var(--ink)]'
                }`}
              >
                Choose {plan.name}
              </Link>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}
