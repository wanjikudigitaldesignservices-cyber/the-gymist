import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — The Gymist',
}

export default function TermsPage() {
  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16">
          <RepCounter index="11" label="LEGAL" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl">
            Terms of <br className="hidden sm:block" /> Service.
          </h1>
          <p className="mt-6 text-sm font-mono text-[var(--iron)]">
            Last Updated: Jan 1, 2024
          </p>
        </div>

        <div className="prose prose-lg prose-p:text-[var(--iron)] prose-h2:font-archivo prose-h2:uppercase prose-h2:tracking-tight prose-h2:text-[var(--ink)] prose-h2:mt-12 prose-a:text-[var(--ink)] max-w-none">
          <h2>1. Membership & Access</h2>
          <p>
            Memberships at The Gymist are non-transferable and non-refundable. You must present your digital access card or valid ID upon entry. Management reserves the right to refuse entry or terminate membership without refund for any breach of our code of conduct.
          </p>
          
          <h2>2. Code of Conduct</h2>
          <p>
            We expect all members to treat the facility, staff, and other members with respect. This includes, but is not limited to:
          </p>
          <ul>
            <li>Re-racking weights immediately after use.</li>
            <li>Wiping down equipment.</li>
            <li>Not monopolizing equipment during peak hours.</li>
            <li>No unsolicited filming of other members.</li>
          </ul>

          <h2>3. Liability Waiver</h2>
          <p>
            By using the facilities at The Gymist, you acknowledge that physical exercise carries inherent risks of injury. You agree that you are participating voluntarily and assume all risks associated with your training. The Gymist, its owners, and staff are not liable for any injury, loss, or damage to personal property.
          </p>

          <h2>4. Payments & Cancellations</h2>
          <p>
            Monthly memberships are billed via M-Pesa or credit card. To cancel a recurring membership, you must provide written notice at least 14 days before your next billing cycle. Drop-ins and session packs are non-refundable.
          </p>

          <h2>5. Photography & Media</h2>
          <p>
            The Gymist may occasionally photograph or film the gym floor for promotional purposes. By entering the facility, you consent to being included in such media. If you prefer not to be filmed, please inform a staff member.
          </p>
        </div>
      </div>
      <CTABand />
    </main>
  )
}
