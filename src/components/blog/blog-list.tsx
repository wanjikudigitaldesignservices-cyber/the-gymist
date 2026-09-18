'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

interface BlogListProps {
  initialPosts: any[]
  categories: any[]
}

export function BlogList({ initialPosts, categories }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Pagination (9 per page)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const matchSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchCategory = !selectedCategory || post.category?.slug === selectedCategory
      
      return matchSearch && matchCategory
    })
  }, [initialPosts, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-12 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              !selectedCategory ? 'bg-[var(--ink)] text-white' : 'bg-white text-[var(--iron)] border border-[var(--iron)]/20 hover:border-[var(--ink)] hover:text-[var(--ink)]'
            }`}
          >
            All Articles
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedCategory === cat.slug ? 'bg-[var(--ink)] text-white' : 'bg-white text-[var(--iron)] border border-[var(--iron)]/20 hover:border-[var(--ink)] hover:text-[var(--ink)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--iron)] h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full rounded bg-white pl-10 pr-4 py-2 text-sm border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
          />
        </div>
      </div>

      {/* Grid */}
      {currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.1} className="group flex flex-col h-full rounded overflow-hidden bg-white shadow-sm border border-[var(--iron)]/10 hover:border-[var(--ink)]/30 transition-all">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                <Image
                  src={post.cover_image_url}
                  alt={post.cover_image_alt || post.title}
                  fill
                  className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="inline-flex items-center rounded bg-[var(--ink)]/80 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {post.category?.name}
                  </span>
                </div>
              </Link>
              
              <div className="flex flex-col flex-1 p-6">
                <Link href={`/blog/${post.slug}`} className="mb-3 block font-archivo text-xl uppercase leading-tight text-[var(--ink)] group-hover:text-[var(--volt)] transition-colors">
                  {post.title}
                </Link>
                <p className="text-sm text-[var(--iron)] line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--iron)]/10">
                  <div className="flex items-center gap-2">
                    {post.author?.portrait_url && (
                      <div className="relative h-6 w-6 rounded-full overflow-hidden">
                        <Image src={post.author.portrait_url} alt={post.author.full_name} fill className="object-cover" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-[var(--ink)]">{post.author?.full_name.split(' ')[0]}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--iron)]">
                    {post.reading_minutes} min read
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded border border-dashed border-[var(--iron)]/20 bg-white/50 py-24 text-center">
          <p className="text-[var(--iron)]">No articles found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`flex h-10 w-10 items-center justify-center rounded font-mono text-sm font-bold transition-colors ${
                currentPage === i + 1
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-white text-[var(--iron)] border border-[var(--iron)]/20 hover:border-[var(--ink)] hover:text-[var(--ink)]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
