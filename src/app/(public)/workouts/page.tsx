import { createPublicClient } from '@/lib/supabase/public'
import { WorkoutLibrary } from '@/components/workouts/workout-library'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'

export const revalidate = 3600; // Cache the page for 1 hour

export const metadata = {
  title: 'Workouts — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Explore our library of 24 programmed workouts spanning strength, conditioning, hypertrophy, mobility, core, and olympic lifting.',
}

export default async function WorkoutsPage() {
  const supabase = createPublicClient()

  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching workouts:', error)
  }

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16">
          <RepCounter index="02" label="WORKOUT LIBRARY" />
          <h1 className="font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Train <br className="hidden sm:block" /> with intent.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--iron)]">
            Our programming is built on a tier system. TIER 01 is beginner-safe and focuses on fundamentals. TIER 02 is intermediate, adding complexity and load. TIER 03 is advanced, reserved for highly technical or heavily loaded movements.
          </p>
        </div>

        <WorkoutLibrary initialWorkouts={workouts || []} />
      </div>

      <CTABand />
    </main>
  )
}
