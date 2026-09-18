import { createClient } from '@/lib/supabase/server'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { ContactForm } from '@/components/contact/contact-form'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Get in touch with The Gymist in Kilimani, Nairobi. Drop in, call us, or send a message.',
}

export default async function ContactPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16">
          <RepCounter index="09" label="CONTACT" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Get in <br className="hidden sm:block" /> touch.
          </h1>
          <p className="mt-6 text-lg text-[var(--iron)] max-w-2xl">
            Have a question about membership, personal training, or dropping in? Send us a message or visit us in Kilimani.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Form */}
          <div>
            <div className="rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm">
              <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)] mb-8">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Right: Info & Map */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Location
                </h3>
                <p className="text-[var(--ink)] font-medium leading-relaxed whitespace-pre-wrap">
                  {settings?.address || 'Wood Avenue Plaza\nKilimani, Nairobi'}
                </p>
              </div>
              
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Hours
                </h3>
                <p className="text-[var(--ink)] font-medium leading-relaxed whitespace-pre-wrap">
                  {settings?.opening_hours || 'Mon-Fri: 5am - 10pm\nSat-Sun: 7am - 8pm'}
                </p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone
                </h3>
                <p className="text-[var(--ink)] font-medium">
                  {settings?.contact_phone || '+254 740 396 075'}
                </p>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </h3>
                <p className="text-[var(--ink)] font-medium">
                  {settings?.contact_email || 'hello@thegymist.co.ke'}
                </p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded overflow-hidden shadow-sm border border-[var(--iron)]/10 h-80 relative bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.234676644026!2d36.782813500000005!3d-1.2941014000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10b7f6c8d7b3%3A0x6b6302e1c93a8d9a!2sWood%20Avenue%20Plaza!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="The Gymist Location on Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <CTABand />
    </main>
  )
}
