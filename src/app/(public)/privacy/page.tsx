import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — The Gymist',
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16">
          <RepCounter index="12" label="LEGAL" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl">
            Privacy <br className="hidden sm:block" /> Policy.
          </h1>
          <p className="mt-6 text-sm font-mono text-[var(--iron)]">
            Last Updated: Jan 1, 2024
          </p>
        </div>

        <div className="prose prose-lg prose-p:text-[var(--iron)] prose-h2:font-archivo prose-h2:uppercase prose-h2:tracking-tight prose-h2:text-[var(--ink)] prose-h2:mt-12 prose-a:text-[var(--ink)] max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            When you interact with The Gymist online or in person, we collect information that identifies you, such as your name, email address, phone number, and payment details. We also collect health and fitness information if you participate in our personal training programs.
          </p>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your data to:
          </p>
          <ul>
            <li>Manage your membership and bookings.</li>
            <li>Process payments via third-party providers (e.g., Safaricom M-Pesa, Stripe).</li>
            <li>Communicate with you regarding your account, schedule changes, or promotional offers (if you have opted in).</li>
            <li>Ensure the safety and security of our premises via CCTV.</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>
            We do not sell your personal data to third parties. We only share information with trusted service providers necessary for our operations (such as payment gateways, email services, and booking software) who are bound by strict confidentiality agreements.
          </p>

          <h2>4. Your Rights</h2>
          <p>
            In accordance with the Data Protection Act (Kenya), you have the right to access, correct, or request the deletion of your personal data. To exercise these rights, please contact us at <a href="mailto:hello@thegymist.co.ke">hello@thegymist.co.ke</a>.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Our website uses cookies to improve user experience, remember your preferences, and analyze site traffic. You can disable cookies in your browser settings, though this may affect the functionality of our booking systems.
          </p>
        </div>
      </div>
      <CTABand />
    </main>
  )
}
