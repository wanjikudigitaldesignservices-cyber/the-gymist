import { createClient } from '@/lib/supabase/server'
import { RepCounter } from '@/components/ui/rep-counter'
import { CTABand } from '@/components/ui/cta-band'
import { BlogList } from '@/components/blog/blog-list'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Blog — The Gymist | Gym in Kilimani, Nairobi',
  description: 'Articles on training, nutrition, recovery, and mindset by the coaches at The Gymist.',
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: postsRaw } = await supabase
    .from('blog_posts')
    .select(`
      id, slug, title, excerpt, cover_image_url, cover_image_alt, published_at, reading_minutes, is_featured,
      category:blog_categories(id, name, slug),
      author:instructors(id, full_name, slug, portrait_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const posts = postsRaw as any[]

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  // Find the featured post
  const featuredPost = posts?.find((p: any) => p.is_featured) || posts?.[0]
  const otherPosts = posts?.filter((p: any) => p.id !== featuredPost?.id) || []

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12 md:py-36">
        <div className="mb-16">
          <RepCounter index="06" label="KNOWLEDGE BASE" />
          <h1 className="font-archivo text-5xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            The <br className="hidden sm:block" /> Journal.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--iron)]">
            No fluff. Just evidence-based protocols and practical advice from coaches who actually train people in Nairobi.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-24">
            <Link href={`/blog/${featuredPost.slug}`} className="group flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              <div className="w-full lg:w-3/5 relative aspect-[16/9] overflow-hidden rounded bg-gray-200">
                <Image
                  src={featuredPost.cover_image_url}
                  alt={featuredPost.cover_image_alt || featuredPost.title}
                  fill
                  className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center rounded bg-[var(--volt)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
                    Featured
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--iron)]">
                    {featuredPost.category?.name}
                  </span>
                </div>
                <h2 className="mb-4 font-archivo text-4xl uppercase tracking-tight text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="mb-6 text-lg text-[var(--iron)]">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    {featuredPost.author?.portrait_url && (
                      <Image
                        src={featuredPost.author.portrait_url}
                        alt={featuredPost.author.full_name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--ink)] text-sm">{featuredPost.author?.full_name}</span>
                    <span className="text-xs text-[var(--iron)] font-mono">
                      {new Date(featuredPost.published_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })} · {featuredPost.reading_minutes} min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Search, Filter & List */}
        <BlogList initialPosts={otherPosts} categories={categories || []} />
        
        {/* Newsletter Capture */}
        <section className="mt-32 rounded bg-[var(--ink)] p-8 text-white sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="font-archivo text-3xl uppercase tracking-tight mb-4">
              Get better every week.
            </h2>
            <p className="text-[var(--white)]/70 text-lg">
              Join 900+ Nairobi locals getting our best training protocols, nutrition tips, and gym updates delivered every Friday.
            </p>
          </div>
          <form className="w-full max-w-md" action={async (formData) => {
            'use server'
            const email = formData.get('email') as string
            const sb = await createClient()
            await sb.from('newsletter_subscribers').insert({ email, source: 'blog_footer' })
          }}>
            <div className="flex gap-2">
              <input 
                type="email" 
                name="email"
                required
                placeholder="Your email address" 
                className="w-full rounded bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/20 focus:border-[var(--volt)] focus:outline-none focus:ring-1 focus:ring-[var(--volt)]"
              />
              <button type="submit" className="shrink-0 rounded bg-[var(--volt)] px-6 py-3 font-bold text-[var(--ink)] hover:bg-white transition-colors">
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-xs text-[var(--white)]/50">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </section>
      </div>

      <CTABand />
    </main>
  )
}
