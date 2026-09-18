import { createClient } from '@/lib/supabase/server'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { GalleryGrid } from '@/components/gallery/gallery-grid'

export const metadata = {
  title: 'Gallery — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Take a look inside The Gymist. Facility, classes, coaching, and community.',
}

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  // Extract unique categories
  const categories = Array.from(new Set(images?.map(img => img.category).filter(Boolean))) as string[]

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
          <RepCounter index="07" label="GALLERY" />
          <h1 className="mt-8 font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Inside <br className="hidden sm:block" /> the facility.
          </h1>
          <p className="mt-8 text-lg text-[var(--iron)]">
            A look at our training floor on Wood Avenue, Kilimani. Purpose-built for strength, conditioning, and real coaching.
          </p>
        </div>

        <GalleryGrid initialImages={images || []} categories={categories} />
      </div>

      <CTABand />
    </main>
  )
}
