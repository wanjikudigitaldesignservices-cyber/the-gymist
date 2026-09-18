'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

export function ClassList({ classes }: { classes: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {classes.map((cls, i) => (
        <FadeIn key={cls.id} delay={i * 0.1} className="group relative flex flex-col h-full bg-white rounded overflow-hidden border border-[var(--iron)]/10 hover:border-[var(--ink)]/20 transition-all">
          <Link href={`/classes/${cls.slug}`} className="absolute inset-0 z-10">
            <span className="sr-only">View {cls.name}</span>
          </Link>
          
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
            {cls.image_url && (
              <Image
                src={cls.image_url}
                alt={cls.name}
                fill
                className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <span 
                className="inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm"
                style={{ backgroundColor: cls.color_hex || 'var(--volt)', color: 'var(--ink)' }}
              >
                {cls.name}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-archivo text-xl uppercase leading-tight text-[var(--ink)] mb-2 group-hover:text-[var(--volt)] transition-colors">
              {cls.name}
            </h3>
            <p className="text-sm text-[var(--iron)] line-clamp-2 mb-4 flex-1">
              {cls.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[var(--iron)]/10 text-sm text-[var(--iron)] font-medium">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{cls.duration_minutes}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max {cls.capacity}</span>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}
