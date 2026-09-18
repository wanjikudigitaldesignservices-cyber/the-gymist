import { createPublicClient } from '@/lib/supabase/public'
import Link from 'next/link'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { MembershipPricing } from '@/components/membership/membership-pricing'
import { CheckCircle2, HelpCircle } from 'lucide-react'

export const revalidate = 3600; // Cache the page for 1 hour

export const metadata = {
  title: 'Membership — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Membership plans and pricing at The Gymist. No hidden fees, real coaching, and a community that pushes you.',
}

export default async function MembershipPage() {
  const supabase = createPublicClient()

  // Fetch membership plans
  const { data: plans } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('is_published', true)
    
  // Fetch FAQs for membership
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('category', 'Membership')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          <RepCounter index="05" label="MEMBERSHIP" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Invest in <br className="hidden sm:block" /> your standard.
          </h1>
          <p className="mt-8 text-lg text-[var(--iron)]">
            We aren't a budget gym and we don't sell access to treadmills. 
            A membership here means programming, coaching, and a community of people 
            who actually train.
          </p>
        </div>

        {/* Pricing Component */}
        <section className="mb-24">
          <MembershipPricing plans={plans || []} />
          
          <div className="mt-12 text-center text-sm text-[var(--iron)]">
            <p className="mb-2">
              <strong className="text-[var(--ink)]">Joining Fee:</strong> KES 2,000 one-off setup fee for new members (waived on annual plans).
            </p>
            <p>
              <strong className="text-[var(--ink)]">Student Rate:</strong> 20% off the Foundation plan with a valid university ID (in-person only).
            </p>
          </div>
        </section>

        {/* Other Options */}
        <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)] mb-4">Day Pass</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-mono text-sm font-bold text-[var(--iron)]">KES</span>
              <span className="font-archivo text-4xl tracking-tight text-[var(--ink)]">800</span>
            </div>
            <p className="text-[var(--iron)] mb-8">
              Just passing through Nairobi or want to try the facility before committing? Get full floor access for the day.
            </p>
            <Link href="/booking?type=day_pass" className="mt-auto w-full rounded border border-[var(--iron)]/20 bg-transparent px-6 py-3 font-bold text-[var(--ink)] transition-colors hover:border-[var(--ink)]">
              Book Day Pass
            </Link>
          </div>

          <div className="rounded bg-[var(--ink)] text-white p-8 border border-[var(--iron)]/10 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-archivo text-2xl uppercase tracking-tight text-white mb-4">10-Session Pack</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-mono text-sm font-bold text-[var(--iron)]">KES</span>
              <span className="font-archivo text-4xl tracking-tight text-white">7,000</span>
            </div>
            <p className="text-[var(--iron)] mb-8 text-white/70">
              Valid for 3 months. Perfect if you only want to drop into group classes a few times a month.
            </p>
            <Link href="/contact?subject=Session Pack" className="mt-auto w-full rounded border border-white/20 bg-transparent px-6 py-3 font-bold text-white transition-colors hover:bg-white hover:text-[var(--ink)]">
              Enquire at Reception
            </Link>
          </div>
        </section>

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <section className="max-w-3xl mx-auto">
            <RepCounter index="06" label="FAQ" />
            <h2 className="mb-12 mt-8 font-archivo text-4xl uppercase tracking-tight text-[var(--ink)] text-center">
              Common Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map(faq => (
                <details key={faq.id} className="group rounded bg-white border border-[var(--iron)]/10 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-[var(--ink)] text-lg">
                    {faq.question}
                    <span className="ml-6 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--iron)]/30 text-[var(--iron)] transition-transform duration-300 group-open:rotate-180 group-open:bg-[var(--ink)] group-open:text-white group-open:border-[var(--ink)]">
                      ↓
                    </span>
                  </summary>
                  <div className="border-t border-[var(--iron)]/10 px-6 pb-6 pt-4 text-lg text-[var(--iron)]">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      <CTABand />
    </main>
  )
}
