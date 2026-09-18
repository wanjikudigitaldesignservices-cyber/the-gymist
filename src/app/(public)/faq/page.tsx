import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'FAQ — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Frequently asked questions about membership, training, facility, and policies at The Gymist.',
}

export default async function FAQPage() {
  const supabase = await createClient()

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  // Group by category
  const categories = ['Membership', 'Training', 'Facility', 'Policies']
  const groupedFaqs = categories.map(cat => ({
    name: cat,
    faqs: faqs?.filter(faq => faq.category === cat) || []
  })).filter(group => group.faqs.length > 0)

  // Any FAQs without a category or an unknown category will go to 'Other'
  const otherFaqs = faqs?.filter(faq => !categories.includes(faq.category || '')) || []
  if (otherFaqs.length > 0) {
    groupedFaqs.push({ name: 'Other', faqs: otherFaqs })
  }

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16 text-center">
          <RepCounter index="08" label="FAQ" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl">
            Common <br className="hidden sm:block" /> Questions.
          </h1>
          <p className="mt-6 text-lg text-[var(--iron)] max-w-2xl mx-auto">
            Everything you need to know about training with us in Kilimani.
          </p>
        </div>

        <div className="space-y-16">
          {groupedFaqs.map(group => (
            <div key={group.name}>
              <h2 className="mb-6 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)] border-b border-[var(--iron)]/10 pb-4">
                {group.name}
              </h2>
              <div className="space-y-4">
                {group.faqs.map((faq: any) => (
                  <details key={faq.id} className="group rounded bg-white border border-[var(--iron)]/10 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-[var(--ink)] text-lg">
                      {faq.question}
                      <span className="ml-6 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--iron)]/30 text-[var(--iron)] transition-transform duration-300 group-open:rotate-180 group-open:bg-[var(--ink)] group-open:text-white group-open:border-[var(--ink)]">
                        ↓
                      </span>
                    </summary>
                    <div className="border-t border-[var(--iron)]/10 px-6 pb-6 pt-4 text-[var(--iron)] prose prose-p:mb-2 prose-a:text-[var(--ink)] prose-a:font-bold hover:prose-a:text-[var(--volt)]">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 rounded bg-[var(--ink)] text-white p-12 text-center shadow-xl">
          <HelpCircle className="h-12 w-12 text-[var(--volt)] mx-auto mb-6" />
          <h2 className="font-archivo text-3xl uppercase tracking-tight mb-4">
            Still have questions?
          </h2>
          <p className="text-[var(--white)]/70 mb-8 max-w-lg mx-auto">
            If you didn't find what you were looking for, reach out to our front desk team. We usually respond within an hour during business hours.
          </p>
          <Link href="/contact" className="inline-block rounded bg-[var(--volt)] px-8 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-white">
            Contact Us
          </Link>
        </div>
      </div>

      <CTABand />
    </main>
  )
}
