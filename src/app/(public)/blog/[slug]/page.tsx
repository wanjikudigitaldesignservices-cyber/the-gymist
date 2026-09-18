import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { CTABand } from '@/components/ui/cta-band'
import { MarkdownRenderer } from '@/components/blog/markdown-renderer'
import { Share2, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, cover_image_url')
    .eq('slug', slug)
    .single()

  if (!post) return { title: 'Not Found — The Gymist' }

  return {
    title: post.meta_title || `${post.title} — The Gymist | Gym in Kilimani, Nairobi`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      images: [post.cover_image_url]
    }
  }
}

// Very basic regex-based TOC generator for markdown h2s
function extractToc(md: string) {
  const h2Regex = /^##\s+(.+)$/gm
  const toc = []
  let match
  while ((match = h2Regex.exec(md)) !== null) {
    const title = match[1].trim()
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    toc.push({ id, title })
  }
  return toc
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Increment view count (fire and forget)
  supabase.rpc('increment_blog_view', { post_slug: slug }).then(res => {
    if (res.error) console.error(res.error)
  })

  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name, slug),
      author:instructors(id, full_name, slug, portrait_url, role, bio)
    `)
    .eq('slug', slug)
    .single()

  const postAny = post as any

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, cover_image_url, cover_image_alt, category:blog_categories(name)')
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .eq('status', 'published')
    .limit(3)

  const toc = extractToc(post.body_md)
  
  // Format dates
  const pubDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-KE', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  // We don't have current URL easily in server component without request headers, so we'll use site URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegymist.co.ke'
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const encodedUrl = encodeURIComponent(postUrl)
  const encodedTitle = encodeURIComponent(post.title)

  return (
    <main className="flex-1 bg-[var(--bone)]">
      <article>
        {/* Article Header */}
        <div className="mx-auto max-w-7xl px-6 pt-24 sm:px-12 md:pt-32">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.category?.name || 'Article', href: '/blog' },
          ]} />

          <div className="mt-12 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded bg-[var(--volt)] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                {post.category?.name}
              </span>
              <span className="font-mono text-sm text-[var(--iron)]">
                {pubDate}
              </span>
              <span className="font-mono text-sm text-[var(--iron)]">
                · {post.reading_minutes} min read
              </span>
            </div>
            
            <h1 className="font-archivo text-4xl uppercase leading-none tracking-tight text-[var(--ink)] sm:text-5xl md:text-6xl mb-8">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mx-auto max-w-7xl px-6 sm:px-12 mb-16">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded bg-gray-200 shadow-sm border border-[var(--iron)]/10">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover saturate-[0.9]"
              priority
            />
          </div>
        </div>

        {/* Article Body & Sidebar */}
        <div className="mx-auto max-w-7xl px-6 sm:px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Sidebar (TOC & Share) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                {/* Author Minified */}
                <div className="flex items-center gap-3 mb-10 pb-10 border-b border-[var(--iron)]/10">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    {post.author?.portrait_url && (
                      <Image src={post.author.portrait_url} alt={post.author.full_name} fill className="object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-[var(--iron)] mb-1">Written by</div>
                    <Link href={`/instructors/${post.author?.slug}`} className="font-bold text-[var(--ink)] hover:text-[var(--volt)] transition-colors">
                      {post.author?.full_name}
                    </Link>
                  </div>
                </div>

                {/* TOC */}
                {toc.length > 0 && (
                  <div className="mb-10">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4">Contents</h3>
                    <ul className="space-y-3 border-l-2 border-[var(--iron)]/20 pl-4">
                      {toc.map((item, i) => (
                        <li key={i}>
                          <a href={`#${item.id}`} className="text-sm font-medium text-[var(--iron)] hover:text-[var(--ink)] transition-colors line-clamp-2">
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Share */}
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--iron)] mb-4 flex items-center gap-2">
                    <Share2 className="h-3 w-3" /> Share
                  </h3>
                  <div className="flex gap-2">
                    <a 
                      href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} 
                      target="_blank" rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[var(--iron)]/20 text-[var(--iron)] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                      aria-label="Share on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[var(--iron)]/20 text-[var(--iron)] hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
                      aria-label="Share on X"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <MarkdownRenderer content={post.body_md} />
              
              {/* Author Bio Box */}
              <div className="mt-16 rounded bg-white p-8 border border-[var(--iron)]/10 shadow-sm flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {post.author?.portrait_url && (
                    <Image src={post.author.portrait_url} alt={post.author.full_name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)] mb-1">
                    {post.author?.full_name}
                  </h3>
                  <p className="font-medium text-[var(--iron)] mb-4">{post.author?.role}</p>
                  <p className="text-[var(--iron)] mb-4 line-clamp-3">{post.author?.bio}</p>
                  <Link href={`/instructors/${post.author?.slug}`} className="inline-flex items-center gap-2 font-bold text-[var(--volt)] bg-[var(--ink)] px-4 py-2 rounded text-sm hover:bg-[var(--volt)] hover:text-[var(--ink)] transition-colors">
                    View profile <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="border-t border-[var(--iron)]/10 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-12">
            <h2 className="mb-12 font-archivo text-4xl uppercase tracking-tight text-[var(--ink)]">
              Related Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group flex flex-col h-full rounded overflow-hidden shadow-sm border border-[var(--iron)]/10 hover:border-[var(--ink)]/30 transition-all">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                    <Image
                      src={related.cover_image_url}
                      alt={related.cover_image_alt || related.title}
                      fill
                      className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded bg-[var(--ink)]/80 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                        {(related as any).category?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-archivo text-xl uppercase leading-tight text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <CTABand />
    </main>
  )
}
