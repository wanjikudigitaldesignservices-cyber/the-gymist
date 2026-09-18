import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { FadeIn } from '@/components/ui/fade-in'
import { Award } from 'lucide-react'

export const metadata = {
  title: 'Our Team — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Meet the coaches at The Gymist. Expert strength, conditioning, and nutrition coaches committed to your results.',
}

export default async function InstructorsPage() {
  const supabase = await createClient()

  // Fetch all published instructors
  const { data: instructors } = await supabase
    .from('instructors')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  const count = instructors?.length || 0

  // Quick number-to-word converter for the intro (up to ~20)
  const numberWords: Record<number, string> = {
    1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight',
    9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen',
    15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty'
  }
  
  const countWord = count > 0 && count <= 20 ? numberWords[count] : count.toString()

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          <RepCounter index="04" label="OUR TEAM" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            {countWord} coaches.<br />One standard.
          </h1>
          <p className="mt-8 text-lg text-[var(--iron)]">
            We don't hire cheerleaders. Every coach on this floor is a practitioner 
            who understands human movement, programming, and how to get you from where you are 
            to where you want to be.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {instructors?.map((instructor, i) => {
            const certCount = instructor.certifications?.length || 0
            
            return (
              <FadeIn key={instructor.id} delay={i * 0.1} className="group relative flex flex-col h-full bg-white rounded overflow-hidden border border-[var(--iron)]/10 hover:border-[var(--ink)]/30 transition-all shadow-sm hover:shadow-md">
                <Link href={`/instructors/${instructor.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {instructor.full_name}'s profile</span>
                </Link>
                
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={instructor.portrait_url}
                    alt={instructor.portrait_alt || instructor.full_name}
                    fill
                    className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {certCount > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 rounded bg-[var(--ink)]/80 backdrop-blur-sm px-2 py-1 shadow-sm text-white font-mono text-xs">
                      <Award className="h-3 w-3 text-[var(--volt)]" />
                      <span>{certCount} CERTS</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-archivo text-xl uppercase leading-tight text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">
                    {instructor.full_name}
                  </h3>
                  <div className="text-sm font-medium text-[var(--iron)] mb-4 pb-4 border-b border-[var(--iron)]/10">
                    {instructor.role}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {instructor.specialities?.slice(0, 3).map((spec: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center rounded-sm bg-[var(--bone)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--iron)]">
                        {spec}
                      </span>
                    ))}
                    {instructor.specialities && instructor.specialities.length > 3 && (
                      <span className="inline-flex items-center rounded-sm bg-[var(--bone)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--iron)]">
                        +{instructor.specialities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>

      <CTABand />
    </main>
  )
}
