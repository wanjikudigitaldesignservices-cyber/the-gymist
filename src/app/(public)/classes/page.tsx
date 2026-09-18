import { createPublicClient } from '@/lib/supabase/public'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { Timetable } from '@/components/classes/timetable'
import { ClassList } from '@/components/classes/class-list'

export const revalidate = 3600; // Cache the page for 1 hour

export const metadata = {
  title: 'Classes & Timetable — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Small group strength and conditioning classes. View our weekly timetable and book your session.',
}

export default async function ClassesPage() {
  const supabase = createPublicClient()

  // Fetch all published classes
  const { data: classes } = await supabase
    .from('classes')
    .select(`
      *,
      instructor:instructors (
        id, slug, full_name, portrait_url
      )
    `)
    .eq('is_published', true)
    
  // Fetch all active sessions
  const { data: sessions } = await supabase
    .from('class_sessions')
    .select(`
      *,
      class:classes (
        id, name, slug, color_hex, capacity, duration_minutes
      ),
      instructor:instructors (
        id, slug, full_name
      )
    `)
    .eq('is_active', true)
    .order('start_time', { ascending: true })

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16">
          <RepCounter index="03" label="CLASSES" />
          <h1 className="font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Train <br className="hidden sm:block" /> together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--iron)]">
            Our group classes are capped at 14 people to ensure you actually get coached. 
            Strength, conditioning, and mobility — programmed to work together.
          </p>
        </div>

        {/* Timetable Section */}
        <section className="mb-24">
          <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
            Weekly Timetable
          </h2>
          <div className="overflow-x-auto rounded-lg border border-[var(--iron)]/10 bg-white shadow-sm">
            <Timetable sessions={sessions || []} classes={classes || []} />
          </div>
        </section>

        {/* Class Types */}
        <section className="mb-16">
          <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
            Our Classes
          </h2>
          <ClassList classes={classes || []} />
        </section>
      </div>

      <CTABand />
    </main>
  )
}
