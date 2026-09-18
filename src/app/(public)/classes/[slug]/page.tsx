import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { CTABand } from '@/components/ui/cta-band'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { RepCounter } from '@/components/ui/rep-counter'
import { Clock, Users, ArrowRight, Zap, Target } from 'lucide-react'

// Simple helper for day names
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: gymClass } = await supabase
    .from('classes')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!gymClass) return { title: 'Not Found — The Gymist' }

  return {
    title: `${gymClass.name} — The Gymist | Gym in Kilimani, Nairobi`,
    description: gymClass.description,
  }
}

export default async function SingleClassPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gymClass } = await supabase
    .from('classes')
    .select(`
      *,
      instructor:instructors (
        id, slug, full_name, portrait_url, role
      )
    `)
    .eq('slug', slug)
    .single()

  if (!gymClass || !gymClass.is_published) {
    notFound()
  }

  // Fetch all active sessions for this class
  const { data: sessions } = await supabase
    .from('class_sessions')
    .select('*')
    .eq('class_id', gymClass.id)
    .eq('is_active', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 md:py-24">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Classes', href: '/classes' },
          { label: gymClass.name, href: `/classes/${gymClass.slug}` }
        ]} />

        <div className="mt-8 mb-12">
          <span 
            className="mb-6 inline-flex items-center rounded px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: gymClass.color_hex || 'var(--volt)', color: 'var(--ink)' }}
          >
            GROUP CLASS
          </span>
          
          <h1 className="font-archivo text-4xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl">
            {gymClass.name}
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-[var(--iron)]">
            {gymClass.description}
          </p>
        </div>

        {/* Hero Image */}
        {gymClass.image_url && (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded bg-gray-200 mb-16 shadow-sm border border-[var(--iron)]/10">
            <Image
              src={gymClass.image_url}
              alt={gymClass.name}
              fill
              className="object-cover saturate-[0.9]"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <section className="mb-16">
              <RepCounter index="01" label="DETAILS" />
              <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                What to expect
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-[var(--volt)]" />
                    <h3 className="font-archivo text-xl uppercase text-[var(--ink)]">Who it's for</h3>
                  </div>
                  <p className="text-[var(--iron)]">
                    {gymClass.who_its_for || 'Suitable for all fitness levels. Coaches will provide scaling options for beginners.'}
                  </p>
                </div>
                
                <div className="rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-6 w-6 text-[var(--volt)]" />
                    <h3 className="font-archivo text-xl uppercase text-[var(--ink)]">What to bring</h3>
                  </div>
                  <p className="text-[var(--iron)]">
                    {gymClass.what_to_bring || 'Water bottle, towel, and a good attitude. We provide everything else.'}
                  </p>
                </div>
              </div>

              {/* Intensity Meter */}
              <div className="rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm mb-12">
                <h3 className="font-archivo text-xl uppercase text-[var(--ink)] mb-4">Intensity Level</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div 
                      key={level}
                      className={`h-4 flex-1 rounded-sm ${
                        level <= (gymClass.intensity || 3)
                          ? 'bg-[var(--volt)]'
                          : 'bg-[var(--bone)]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 font-mono text-xs text-[var(--iron)] uppercase">
                  <span>Beginner</span>
                  <span>Advanced</span>
                </div>
              </div>
            </section>

            {/* Timetable/Sessions */}
            <section className="mb-16">
              <RepCounter index="02" label="SCHEDULE" />
              <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                Weekly Sessions
              </h2>
              
              {sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map(session => (
                    <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded bg-white border border-[var(--iron)]/10 shadow-sm gap-4">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-[var(--ink)]">{DAYS[session.day_of_week]}</span>
                          <span className="font-mono text-[var(--iron)]">{session.start_time.substring(0, 5)}</span>
                        </div>
                        <div className="h-10 w-px bg-[var(--iron)]/20 hidden sm:block" />
                        <div className="flex items-center gap-2 text-[var(--iron)]">
                          <Clock className="h-4 w-4" />
                          <span>{gymClass.duration_minutes}m</span>
                        </div>
                      </div>
                      <Link 
                        href={`/booking?type=class&session=${session.id}`}
                        className="rounded bg-[var(--ink)] px-6 py-3 font-bold text-white transition-colors hover:bg-[var(--volt)] hover:text-[var(--ink)] whitespace-nowrap text-center"
                      >
                        Book this session
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded border border-dashed border-[var(--iron)]/20 bg-white/50 p-8 text-center text-[var(--iron)]">
                  No upcoming sessions scheduled for this class.
                </div>
              )}
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded bg-[var(--ink)] p-8 text-white shadow-xl">
              <h3 className="font-archivo text-2xl uppercase mb-8 text-[var(--white)]">Class Specs</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-1">Duration</span>
                    <span className="text-xl font-bold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[var(--volt)]" />
                      {gymClass.duration_minutes}m
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-1">Capacity</span>
                    <span className="text-xl font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-[var(--volt)]" />
                      {gymClass.capacity} max
                    </span>
                  </div>
                </div>

                <div className="h-px w-full bg-[var(--white)]/10 my-4" />

                <div>
                  <span className="block font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4">Lead Coach</span>
                  {gymClass.instructor ? (
                    <Link href={`/instructors/${gymClass.instructor.slug}`} className="group flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[var(--white)]/10">
                        <Image
                          src={gymClass.instructor.portrait_url}
                          alt={gymClass.instructor.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-[var(--volt)] transition-colors">
                          {gymClass.instructor.full_name}
                        </div>
                        <div className="text-sm text-[var(--white)]/70">
                          {gymClass.instructor.role}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="text-white/70">Team coached</div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <Link 
                  href={`/booking?type=class&class=${gymClass.id}`}
                  className="flex w-full items-center justify-center rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-white"
                >
                  Book this class
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <CTABand />
    </main>
  )
}
