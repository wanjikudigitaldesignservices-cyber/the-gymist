'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Dumbbell, Filter } from 'lucide-react'
import { Workout } from '@/lib/types'
import { FadeIn } from '@/components/ui/fade-in'

interface WorkoutLibraryProps {
  initialWorkouts: Workout[]
}

const CATEGORIES = ['Strength', 'Conditioning', 'Hypertrophy', 'Mobility', 'Core', 'Olympic']
const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Quads', 'Hamstrings', 'Glutes']
const TIERS = [1, 2, 3]

export function WorkoutLibrary({ initialWorkouts }: WorkoutLibraryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'))
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(searchParams.get('muscle'))
  const [selectedTier, setSelectedTier] = useState<number | null>(searchParams.get('tier') ? Number(searchParams.get('tier')) : null)
  
  // Mobile filter toggle
  const [showFilters, setShowFilters] = useState(false)

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedMuscle) params.set('muscle', selectedMuscle)
    if (selectedTier) params.set('tier', selectedTier.toString())
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedCategory, selectedMuscle, selectedTier, pathname, router])

  // Filter workouts
  const filteredWorkouts = useMemo(() => {
    return initialWorkouts.filter(workout => {
      const matchSearch = searchQuery === '' || 
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchCategory = !selectedCategory || workout.category === selectedCategory
      
      const matchMuscle = !selectedMuscle || 
        workout.primary_muscles.includes(selectedMuscle) || 
        (workout.secondary_muscles && workout.secondary_muscles.includes(selectedMuscle))
        
      const matchTier = !selectedTier || workout.tier === selectedTier

      return matchSearch && matchCategory && matchMuscle && matchTier
    })
  }, [initialWorkouts, searchQuery, selectedCategory, selectedMuscle, selectedTier])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedMuscle(null)
    setSelectedTier(null)
  }

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      {/* Mobile filter toggle */}
      <div className="md:hidden">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between rounded bg-[var(--white)] px-4 py-3 text-sm font-medium border border-[var(--iron)]/20"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters {filteredWorkouts.length < initialWorkouts.length ? '(Active)' : ''}
          </span>
          <span>{showFilters ? 'Hide' : 'Show'}</span>
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`w-full shrink-0 flex-col gap-8 md:flex md:w-64 ${showFilters ? 'flex' : 'hidden'}`}>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--iron)] h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded bg-[var(--white)] pl-10 pr-4 py-2 text-sm border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--iron)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[var(--iron)]">Category</h3>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map(category => (
              <label key={category} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--volt)]">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === category}
                  onChange={() => setSelectedCategory(category)}
                  className="text-[var(--ink)] focus:ring-[var(--ink)]"
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Tier */}
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[var(--iron)]">Tier</h3>
          <div className="flex flex-col gap-2">
            {TIERS.map(tier => (
              <label key={tier} className="flex items-center gap-2 text-sm cursor-pointer hover:text-[var(--volt)]">
                <input 
                  type="radio" 
                  name="tier" 
                  checked={selectedTier === tier}
                  onChange={() => setSelectedTier(tier)}
                  className="text-[var(--ink)] focus:ring-[var(--ink)]"
                />
                TIER 0{tier}
              </label>
            ))}
          </div>
        </div>

        {/* Muscle Groups */}
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-[var(--iron)]">Muscle Group</h3>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map(muscle => (
              <button
                key={muscle}
                onClick={() => setSelectedMuscle(selectedMuscle === muscle ? null : muscle)}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                  selectedMuscle === muscle 
                    ? 'bg-[var(--ink)] text-white border-[var(--ink)]' 
                    : 'bg-[var(--white)] text-[var(--iron)] border-[var(--iron)]/20 hover:border-[var(--ink)] hover:text-[var(--ink)]'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || selectedCategory || selectedMuscle || selectedTier) && (
          <button 
            onClick={clearFilters}
            className="text-sm font-medium text-[var(--danger)] hover:underline flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Clear all filters
          </button>
        )}
      </aside>

      {/* Results Grid */}
      <div className="flex-1">
        {filteredWorkouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--iron)]/20 bg-[var(--white)]/50 py-24 text-center">
            <Dumbbell className="mb-4 h-12 w-12 text-[var(--iron)]/30" />
            <h3 className="mb-2 text-lg font-bold text-[var(--ink)]">No workouts found</h3>
            <p className="mb-6 text-sm text-[var(--iron)] max-w-md">
              We couldn't find any workouts matching your current filters. Try adjusting them or clear all filters to see the full library.
            </p>
            <button 
              onClick={clearFilters}
              className="rounded bg-[var(--ink)] px-6 py-2 text-sm font-medium text-white hover:bg-[var(--ink)]/90"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredWorkouts.map((workout, i) => (
              <FadeIn key={workout.id} delay={i * 0.05} className="group relative flex flex-col h-full bg-[var(--white)] rounded overflow-hidden border border-[var(--iron)]/10 hover:border-[var(--ink)]/20 transition-all">
                <Link href={`/workouts/${workout.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {workout.name}</span>
                </Link>
                
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={workout.image_url}
                    alt={workout.image_alt || workout.name}
                    fill
                    className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="inline-flex items-center rounded bg-[var(--volt)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] shadow-sm">
                      TIER 0{workout.tier}
                    </span>
                    <span className="inline-flex items-center rounded bg-[var(--ink)]/80 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {workout.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="font-archivo text-lg uppercase leading-tight text-[var(--ink)] mb-1 group-hover:text-[var(--volt)] transition-colors">
                    {workout.name}
                  </h3>
                  <p className="text-sm text-[var(--iron)] line-clamp-2 mb-4 flex-1">
                    {workout.short_description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-[var(--iron)]/10">
                    <div className="flex gap-1 overflow-hidden">
                      {workout.primary_muscles.map((muscle, idx) => (
                        <span key={idx} className="text-[10px] uppercase font-bold text-[var(--iron)] bg-[var(--bone)] px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
