import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/public'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { CTABand } from '@/components/ui/cta-band'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { RepCounter } from '@/components/ui/rep-counter'
import { Dumbbell, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

export const revalidate = 3600; // Cache the page for 1 hour

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = createPublicClient()
  
  const { data: workout } = await supabase
    .from('workouts')
    .select('name, short_description')
    .eq('slug', slug)
    .single()

  if (!workout) return { title: 'Not Found — The Gymist' }

  return {
    title: `${workout.name} — The Gymist | Gym in Kilimani, Nairobi`,
    description: workout.short_description,
  }
}

export default async function SingleWorkoutPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: workout } = await supabase
    .from('workouts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!workout || !workout.is_published) {
    notFound()
  }

  // Fetch instructors that coach this category
  const { data: instructors } = await supabase
    .from('instructors')
    .select('slug, full_name, portrait_url')
    .contains('categories', [workout.category])
    .eq('is_published', true)
    .limit(4)

  // Fetch related workouts (same primary muscle)
  const { data: relatedWorkouts } = await supabase
    .from('workouts')
    .select('slug, name, image_url, image_alt, tier, category, primary_muscles, short_description')
    .contains('primary_muscles', workout.primary_muscles.slice(0, 1))
    .neq('id', workout.id)
    .eq('is_published', true)
    .limit(3)

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 md:py-24">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Workouts', href: '/workouts' },
          { label: workout.name, href: `/workouts/${workout.slug}` }
        ]} />

        <div className="mt-8 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center rounded bg-[var(--volt)] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              TIER 0{workout.tier}
            </span>
            <span className="inline-flex items-center rounded bg-[var(--ink)] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[var(--white)]">
              {workout.category}
            </span>
          </div>
          
          <h1 className="font-archivo text-4xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl">
            {workout.name}
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-[var(--iron)]">
            {workout.short_description}
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-gray-200 mb-16 shadow-sm border border-[var(--iron)]/10">
          <Image
            src={workout.image_url}
            alt={workout.image_alt || workout.name}
            fill
            className="object-cover saturate-[0.9]"
            priority
          />
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* How to perform it */}
            <section className="mb-16">
              <RepCounter index="01" label="EXECUTION" />
              <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                How to perform it
              </h2>
              <div className="space-y-6">
                {workout.steps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] font-mono text-sm font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="text-lg text-[var(--ink)] leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cues */}
            <section className="mb-16">
              <RepCounter index="02" label="COACHING" />
              <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                Coaching Cues
              </h2>
              <ul className="space-y-4">
                {workout.cues.map((cue: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 rounded bg-[var(--white)] p-6 border border-[var(--iron)]/10 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[var(--success)]" />
                    <span className="text-lg text-[var(--ink)] font-medium">"{cue}"</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Mistakes */}
            <section className="mb-16">
              <RepCounter index="03" label="CORRECTIONS" />
              <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                Common Mistakes
              </h2>
              <div className="space-y-6">
                {workout.mistakes.map((item: any, idx: number) => (
                  <div key={idx} className="overflow-hidden rounded border border-[var(--danger)]/20 bg-white">
                    <div className="flex items-center gap-3 bg-[var(--danger)]/5 px-6 py-4 border-b border-[var(--danger)]/10">
                      <AlertTriangle className="h-5 w-5 text-[var(--danger)]" />
                      <h4 className="font-bold text-[var(--ink)]">Mistake: {item.mistake}</h4>
                    </div>
                    <div className="px-6 py-5">
                      <p className="text-[var(--iron)] flex gap-2">
                        <strong className="text-[var(--success)]">Fix:</strong> {item.fix}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Progressions & Regressions */}
            {(workout.progressions?.length || workout.regressions?.length) && (
              <section className="mb-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {workout.progressions && workout.progressions.length > 0 && (
                  <div className="rounded bg-[var(--white)] p-8 border border-[var(--iron)]/10">
                    <h3 className="font-archivo text-xl uppercase mb-4 text-[var(--ink)]">Progressions</h3>
                    <ul className="space-y-3">
                      {workout.progressions.map((prog: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--iron)]">
                          <ArrowRight className="h-5 w-5 shrink-0 text-[var(--volt)]" />
                          <span>{prog}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {workout.regressions && workout.regressions.length > 0 && (
                  <div className="rounded bg-[var(--white)] p-8 border border-[var(--iron)]/10">
                    <h3 className="font-archivo text-xl uppercase mb-4 text-[var(--ink)]">Regressions</h3>
                    <ul className="space-y-3">
                      {workout.regressions.map((reg: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--iron)]">
                          <ArrowRight className="h-5 w-5 shrink-0 text-[var(--iron)]/50" />
                          <span>{reg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Programming Notes */}
            {workout.programming_notes && (
              <section className="mb-16">
                <RepCounter index="04" label="APPLICATION" />
                <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                  Programme It
                </h2>
                <div className="rounded border-l-4 border-[var(--volt)] bg-[var(--white)] p-8 shadow-sm">
                  <p className="text-lg text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
                    {workout.programming_notes}
                  </p>
                </div>
              </section>
            )}
            
            {/* Coached By */}
            {instructors && instructors.length > 0 && (
              <section>
                <RepCounter index="05" label="TEAM" />
                <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                  Coached By
                </h2>
                <div className="flex flex-wrap gap-6">
                  {instructors.map(instructor => (
                    <Link key={instructor.slug} href={`/instructors/${instructor.slug}`} className="group flex items-center gap-4 rounded-full border border-[var(--iron)]/20 bg-[var(--white)] pr-6 p-2 hover:border-[var(--ink)] transition-colors">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                        <Image
                          src={instructor.portrait_url}
                          alt={instructor.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">
                        {instructor.full_name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded bg-[var(--ink)] p-8 text-white shadow-xl">
              <h3 className="font-archivo text-2xl uppercase mb-8 text-[var(--white)]">Specs</h3>
              
              <div className="space-y-6">
                <div>
                  <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-2">Primary Muscles</span>
                  <div className="flex flex-wrap gap-2">
                    {workout.primary_muscles.map((muscle: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center rounded-sm bg-[var(--white)]/10 px-2 py-1 text-sm font-medium">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {workout.secondary_muscles && workout.secondary_muscles.length > 0 && (
                  <div>
                    <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-2">Secondary</span>
                    <p className="text-sm text-[var(--white)]/70">{workout.secondary_muscles.join(', ')}</p>
                  </div>
                )}

                <div>
                  <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-2">Equipment</span>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-[var(--volt)]" />
                    <span className="text-sm font-medium">{workout.equipment.join(', ')}</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[var(--white)]/10 my-4" />

                <div className="grid grid-cols-2 gap-4">
                  {workout.sets_reps && (
                    <div>
                      <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-1">Sets × Reps</span>
                      <span className="text-lg font-bold">{workout.sets_reps}</span>
                    </div>
                  )}
                  {workout.rest_seconds && (
                    <div>
                      <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-1">Rest</span>
                      <span className="text-lg font-bold">{workout.rest_seconds}s</span>
                    </div>
                  )}
                  {workout.tempo && (
                    <div className="col-span-2">
                      <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-1">Tempo</span>
                      <span className="text-lg font-bold">{workout.tempo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <Link 
                  href="/booking" 
                  className="flex w-full items-center justify-center rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-white"
                >
                  Book a session
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Workouts */}
        {relatedWorkouts && relatedWorkouts.length > 0 && (
          <div className="mt-32 border-t border-[var(--iron)]/10 pt-24">
            <h2 className="mb-12 font-archivo text-4xl uppercase tracking-tight text-[var(--ink)]">
              More {workout.primary_muscles[0]} Workouts
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedWorkouts.map((related, i) => (
                <FadeIn key={related.slug} delay={i * 0.1} className="group relative flex flex-col h-full bg-[var(--white)] rounded overflow-hidden border border-[var(--iron)]/10 hover:border-[var(--ink)]/20 transition-all">
                  <Link href={`/workouts/${related.slug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {related.name}</span>
                  </Link>
                  
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={related.image_url}
                      alt={related.image_alt || related.name}
                      fill
                      className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="inline-flex items-center rounded bg-[var(--volt)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] shadow-sm">
                        TIER 0{related.tier}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-archivo text-lg uppercase leading-tight text-[var(--ink)] mb-1 group-hover:text-[var(--volt)] transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-sm text-[var(--iron)] line-clamp-2">
                      {related.short_description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}
      </div>

      <WhatsAppButton />
      <CTABand />
    </main>
  )
}
