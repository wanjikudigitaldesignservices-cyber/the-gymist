import { createClient } from '@/lib/supabase/server'
import { BookingFlow } from '@/components/booking/booking-flow'
import { CTABand } from '@/components/ui/cta-band'
import Image from 'next/image'

export const metadata = {
  title: 'Book a Session — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Book a class, personal training session, or day pass at The Gymist.',
}

export default async function BookingPage() {
  const supabase = await createClient()

  const { data: instructors } = await supabase
    .from('instructors')
    .select('id, full_name, role, portrait_url, slug')
    .eq('is_published', true)

  const { data: classes } = await supabase
    .from('classes')
    .select('id, name, color_hex, duration_minutes, slug')
    .eq('is_published', true)

  const { data: upcomingSessions } = await supabase
    .from('class_sessions')
    .select('id, class_id, start_time, instructor:instructors(full_name)')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(50) // Just grab next 50 sessions

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="relative min-h-[80vh] flex items-center justify-center py-24 px-6 sm:px-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Gym interior"
            fill
            className="object-cover saturate-[0.5] opacity-20"
            priority
          />
        </div>
        
        <div className="relative z-10 w-full">
          <div className="text-center mb-12">
            <h1 className="font-archivo text-4xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl mb-4">
              Book a Session.
            </h1>
            <p className="text-lg text-[var(--iron)] font-medium">
              Select what you want to do, pick a time, and we'll see you on the floor.
            </p>
          </div>

          <BookingFlow 
            instructors={instructors || []}
            classes={classes || []}
            upcomingSessions={upcomingSessions || []}
          />
        </div>
      </div>
      
      <CTABand />
    </main>
  )
}
