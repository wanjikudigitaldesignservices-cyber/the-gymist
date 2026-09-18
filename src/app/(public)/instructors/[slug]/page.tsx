import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/public'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { CTABand } from '@/components/ui/cta-band'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'
import { RepCounter } from '@/components/ui/rep-counter'
import { Award, CheckCircle2, MessageSquare, ArrowRight, Calendar, Star } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

export const revalidate = 3600; // Cache the page for 1 hour

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = createPublicClient()
  
  const { data: instructor } = await supabase
    .from('instructors')
    .select('full_name, role, philosophy')
    .eq('slug', slug)
    .single()

  if (!instructor) return { title: 'Not Found — The Gymist' }

  return {
    title: `${instructor.full_name} — The Gymist | Gym in Kilimani, Nairobi`,
    description: instructor.philosophy || `Coach at The Gymist. ${instructor.role}.`,
  }
}

export default async function SingleInstructorPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createPublicClient()

  // 1. Fetch Instructor
  const { data: instructor } = await supabase
    .from('instructors')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!instructor || !instructor.is_published) {
    notFound()
  }

  // 2. Fetch Workouts they coach
  let workouts: any[] = []
  if (instructor.categories && instructor.categories.length > 0) {
    const { data: w } = await supabase
      .from('workouts')
      .select('id, slug, name, image_url, image_alt, tier, category, short_description')
      .in('category', instructor.categories)
      .eq('is_published', true)
      .limit(4)
    if (w) workouts = w
  }

  // 3. Fetch Classes they lead
  const { data: classes } = await supabase
    .from('classes')
    .select('id, slug, name, color_hex, duration_minutes')
    .eq('instructor_id', instructor.id)
    .eq('is_published', true)

  // 4. Fetch Testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('instructor_id', instructor.id)
    .eq('is_published', true)
    .limit(2)

  // 5. Fetch Other Coaches
  const { data: otherCoaches } = await supabase
    .from('instructors')
    .select('id, slug, full_name, portrait_url, role')
    .neq('id', instructor.id)
    .eq('is_published', true)
    .limit(3)

  const firstName = instructor.full_name.split(' ')[0]
  
  // Format stats
  const stats = [
    { label: 'Years Coaching', value: instructor.years_coaching || 0 },
    { label: 'Sessions Delivered', value: instructor.sessions_delivered || 0 },
    { label: 'Members Coached', value: instructor.members_coached || 0 },
  ]

  // Get WhatsApp number or fallback to site default
  let waNumber = instructor.whatsapp_number
  if (!waNumber) {
    const { data: siteSettings } = await supabase.from('site_settings').select('whatsapp_number').single()
    waNumber = siteSettings?.whatsapp_number || '254740396075'
  }
  
  const waUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${firstName}, I'd like to train with you at The Gymist.`)}`

  return (
    <main className="flex-1 bg-[var(--bone)]">
      {/* Hero Section */}
      <div className="bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 pt-24 md:pt-32">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Coaches', href: '/instructors' },
              { label: instructor.full_name, href: `/instructors/${instructor.slug}` }
            ]} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="font-archivo text-5xl uppercase leading-none tracking-tight sm:text-6xl md:text-7xl mb-4">
                {instructor.full_name}
              </h1>
              <div className="text-xl text-[var(--volt)] font-medium mb-8">
                {instructor.role}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {instructor.specialities?.map((spec: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center rounded-sm bg-white/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {spec}
                  </span>
                ))}
              </div>

              {instructor.philosophy && (
                <div className="border-l-2 border-[var(--volt)] pl-6 mb-12">
                  <p className="text-2xl font-light italic text-white/90">
                    "{instructor.philosophy}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/booking?type=personal_training&instructor=${instructor.id}`}
                  className="rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-white"
                >
                  Book with {firstName}
                </Link>
                <a 
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-white/20 bg-transparent px-6 py-4 font-bold text-white transition-colors hover:bg-white/10 flex items-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  Train with {firstName}
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded shadow-2xl border border-white/10">
                <Image
                  src={instructor.portrait_url}
                  alt={instructor.full_name}
                  fill
                  className="object-cover saturate-[0.9]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Bio, Certs, Gallery */}
          <div className="lg:col-span-8">
            {/* About */}
            <section className="mb-16">
              <RepCounter index="01" label="ABOUT" />
              <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                Biography
              </h2>
              <div className="prose prose-lg prose-p:text-[var(--iron)] prose-p:leading-relaxed max-w-none whitespace-pre-wrap">
                {instructor.bio}
              </div>
            </section>

            {/* Specialities Cards */}
            {instructor.specialities && instructor.specialities.length > 0 && (
              <section className="mb-16">
                <RepCounter index="02" label="FOCUS" />
                <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                  Specialities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {instructor.specialities.map((spec: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 rounded bg-white p-6 border border-[var(--iron)]/10 shadow-sm">
                      <CheckCircle2 className="h-6 w-6 text-[var(--volt)] shrink-0" />
                      <span className="font-bold text-[var(--ink)] text-lg">{spec}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {instructor.gallery_urls && instructor.gallery_urls.length > 0 && (
              <section className="mb-16">
                <RepCounter index="03" label="ACTION" />
                <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                  In the Gym
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {instructor.gallery_urls.map((url: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded overflow-hidden bg-gray-100 border border-[var(--iron)]/10">
                      <Image
                        src={url}
                        alt={`${instructor.full_name} coaching in the gym`}
                        fill
                        className="object-cover saturate-[0.9] hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Workouts they coach */}
            {workouts.length > 0 && (
              <section className="mb-16 border-t border-[var(--iron)]/10 pt-16">
                <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                  Workouts {firstName} Coaches
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {workouts.map((workout: any) => (
                    <Link key={workout.id} href={`/workouts/${workout.slug}`} className="group relative flex flex-col h-full bg-white rounded overflow-hidden border border-[var(--iron)]/10 hover:border-[var(--ink)]/30 transition-all shadow-sm">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <Image
                          src={workout.image_url}
                          alt={workout.image_alt || workout.name}
                          fill
                          className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="inline-flex items-center rounded bg-[var(--volt)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] shadow-sm">
                            TIER 0{workout.tier}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-archivo text-lg uppercase leading-tight text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">
                          {workout.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            
            {/* Testimonials */}
            {testimonials && testimonials.length > 0 && (
              <section className="mb-16 border-t border-[var(--iron)]/10 pt-16">
                <h2 className="mb-8 font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
                  Member Results
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm relative">
                      <div className="absolute top-8 right-8 text-[var(--iron)]/20 font-serif text-6xl leading-none">"</div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[var(--volt)] text-[var(--volt)]" />
                        ))}
                      </div>
                      <p className="text-lg text-[var(--ink)] italic mb-6 relative z-10">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-4">
                        {testimonial.author_image_url ? (
                          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 border border-[var(--iron)]/10">
                            <Image src={testimonial.author_image_url} alt={testimonial.author_name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-[var(--ink)] text-[var(--volt)] flex items-center justify-center font-bold text-lg">
                            {testimonial.author_name.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-[var(--ink)]">{testimonial.author_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Track Record, Certs, Availability */}
          <div className="lg:col-span-4">
            {/* Track Record Stats */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {stats.map((stat, idx) => (
                stat.value > 0 && (
                  <div key={idx} className="bg-white rounded p-6 border border-[var(--iron)]/10 shadow-sm flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--iron)]">{stat.label}</span>
                    <span className="font-archivo text-3xl text-[var(--ink)]">{stat.value.toLocaleString()}{idx === 2 ? '+' : ''}</span>
                  </div>
                )
              ))}
            </div>

            {/* Certifications */}
            {instructor.certifications && instructor.certifications.length > 0 && (
              <div className="rounded bg-[var(--ink)] p-8 text-white shadow-xl mb-8">
                <h3 className="font-archivo text-2xl uppercase mb-6 text-[var(--white)] flex items-center gap-3">
                  <Award className="h-6 w-6 text-[var(--volt)]" />
                  Credentials
                </h3>
                <ul className="space-y-6">
                  {instructor.certifications.map((cert: any, idx: number) => (
                    <li key={idx}>
                      <div className="font-bold text-lg mb-1">{cert.name}</div>
                      <div className="flex items-center justify-between text-sm text-[var(--white)]/70">
                        <span>{cert.body}</span>
                        <span className="font-mono">{cert.year}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Classes Led */}
            {classes && classes.length > 0 && (
              <div className="bg-white rounded p-8 border border-[var(--iron)]/10 shadow-sm mb-8">
                <h3 className="font-archivo text-xl uppercase mb-6 text-[var(--ink)]">Classes Led</h3>
                <div className="space-y-3">
                  {classes.map((cls: any) => (
                    <Link key={cls.id} href={`/classes/${cls.slug}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cls.color_hex || 'var(--volt)' }} />
                        <span className="font-bold text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">{cls.name}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--iron)] group-hover:text-[var(--ink)]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="bg-white rounded p-8 border border-[var(--iron)]/10 shadow-sm">
              <h3 className="font-archivo text-xl uppercase mb-6 text-[var(--ink)] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--iron)]" />
                Availability
              </h3>
              
              {instructor.availability && Object.keys(instructor.availability).length > 0 ? (
                <div className="space-y-4 mb-8">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                    const times = instructor.availability![day]
                    if (!times || times.length === 0) return null
                    
                    return (
                      <div key={day} className="flex justify-between items-center text-sm border-b border-[var(--iron)]/10 pb-2 last:border-0 last:pb-0">
                        <span className="capitalize font-bold text-[var(--iron)]">{day}</span>
                        <span className="text-[var(--ink)] font-mono">{times.join(', ')}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-[var(--iron)] mb-8">Available by appointment. Please book a session to see available slots.</p>
              )}

              <Link 
                href={`/booking?type=personal_training&instructor=${instructor.id}`}
                className="flex w-full items-center justify-center rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white"
              >
                Book a 1-on-1
              </Link>
            </div>

          </div>
        </div>

        {/* Other Coaches */}
        {otherCoaches && otherCoaches.length > 0 && (
          <div className="mt-32 border-t border-[var(--iron)]/10 pt-24">
            <h2 className="mb-12 font-archivo text-4xl uppercase tracking-tight text-[var(--ink)]">
              Other Coaches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {otherCoaches.map((coach: any) => (
                <Link key={coach.id} href={`/instructors/${coach.slug}`} className="group flex items-center gap-4 bg-white p-4 rounded border border-[var(--iron)]/10 hover:border-[var(--ink)]/30 transition-all">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                    <Image src={coach.portrait_url} alt={coach.full_name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">{coach.full_name}</div>
                    <div className="text-sm text-[var(--iron)]">{coach.role}</div>
                  </div>
                </Link>
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
