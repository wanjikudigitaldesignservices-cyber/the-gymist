'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

interface GalleryImage {
  id: string
  image_url: string
  alt_text: string
  caption: string | null
  category: string | null
}

interface GalleryGridProps {
  initialImages: GalleryImage[]
  categories: string[]
}

export function GalleryGrid({ initialImages, categories }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = useMemo(() => {
    if (!selectedCategory) return initialImages
    return initialImages.filter(img => img.category === selectedCategory)
  }, [initialImages, selectedCategory])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0))
  }, [lightboxIndex, filteredImages.length])

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1))
  }, [lightboxIndex, filteredImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, nextImage, prevImage])

  // Simple CSS columns for masonry layout
  return (
    <div>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
              !selectedCategory ? 'bg-[var(--ink)] text-white' : 'bg-white text-[var(--iron)] border border-[var(--iron)]/20 hover:border-[var(--ink)] hover:text-[var(--ink)]'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                selectedCategory === cat ? 'bg-[var(--ink)] text-white' : 'bg-white text-[var(--iron)] border border-[var(--iron)]/20 hover:border-[var(--ink)] hover:text-[var(--ink)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((image, i) => (
          <FadeIn key={image.id} delay={i * 0.05} className="break-inside-avoid">
            <button 
              onClick={() => openLightbox(i)}
              className="group relative w-full overflow-hidden rounded bg-gray-200 border border-[var(--iron)]/10 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--volt)]"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={image.image_url}
                  alt={image.alt_text}
                  fill
                  className="object-cover saturate-[0.9] transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 text-left">
                {image.category && (
                  <span className="mb-2 inline-flex self-start rounded bg-[var(--volt)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] shadow-sm">
                    {image.category}
                  </span>
                )}
                {image.caption && (
                  <p className="text-white font-medium line-clamp-2">{image.caption}</p>
                )}
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--ink)]/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
            <span className="font-mono text-xs text-white/50">{lightboxIndex + 1} / {filteredImages.length}</span>
            <button 
              onClick={closeLightbox}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="relative h-full max-h-[85vh] w-full max-w-[85vw] flex items-center justify-center">
            <Image
              src={filteredImages[lightboxIndex].image_url}
              alt={filteredImages[lightboxIndex].alt_text}
              fill
              className="object-contain"
              sizes="85vw"
              priority
            />
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 text-center px-16">
            <p className="text-white text-lg font-medium">{filteredImages[lightboxIndex].caption}</p>
          </div>
        </div>
      )}
    </div>
  )
}
