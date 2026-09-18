'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Clock, Users, ArrowRight } from 'lucide-react'

// Simple helper for day names
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// Note: day_of_week is 0-6 where 0 = Monday, 6 = Sunday (or maybe 0=Sunday in some systems, let's assume 0=Monday as per standard ISO)

export function Timetable({ sessions, classes }: { sessions: any[], classes: any[] }) {
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const router = useRouter()

  // Generate time slots based on sessions
  // For simplicity, we just list hours that have classes
  const hours = Array.from(new Set(sessions.map(s => s.start_time.substring(0, 2)))).sort()
  
  // Create a grid representation: day_of_week -> array of sessions
  const gridByDay = DAYS.map((_, dayIndex) => {
    // Note: assuming dayIndex matches day_of_week in DB (0-6)
    return sessions.filter(s => s.day_of_week === dayIndex)
  })

  // Format time HH:MM:SS to HH:MM
  const formatTime = (time: string) => time.substring(0, 5)

  return (
    <div className="relative">
      <div className="min-w-[800px]">
        {/* Header row */}
        <div className="grid grid-cols-8 border-b border-[var(--iron)]/10 bg-[var(--bone)]">
          <div className="p-4 font-mono text-xs font-bold uppercase text-[var(--iron)] text-center border-r border-[var(--iron)]/10">
            Time
          </div>
          {DAYS.map((day, i) => (
            <div key={day} className="p-4 text-center font-bold text-[var(--ink)] border-r border-[var(--iron)]/10 last:border-0">
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        <div className="flex flex-col">
          {hours.map(hour => {
            const hasClassesInHour = sessions.some(s => s.start_time.startsWith(hour))
            if (!hasClassesInHour) return null

            return (
              <div key={hour} className="grid grid-cols-8 border-b border-[var(--iron)]/10 last:border-0">
                <div className="flex items-center justify-center p-4 font-mono text-sm text-[var(--iron)] border-r border-[var(--iron)]/10">
                  {hour}:00
                </div>
                
                {DAYS.map((_, dayIndex) => {
                  const daySessions = gridByDay[dayIndex].filter(s => s.start_time.startsWith(hour))
                  
                  return (
                    <div key={dayIndex} className="p-2 border-r border-[var(--iron)]/10 last:border-0 min-h-[100px] flex flex-col gap-2">
                      {daySessions.map(session => {
                        const classInfo = session.class
                        return (
                          <button
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className="flex flex-col items-start rounded p-2 text-left transition-transform hover:scale-[1.02] active:scale-95 shadow-sm"
                            style={{ 
                              backgroundColor: `${classInfo.color_hex}15`,
                              borderLeft: `4px solid ${classInfo.color_hex}`
                            }}
                          >
                            <span className="font-bold text-[var(--ink)] text-sm leading-tight">{classInfo.name}</span>
                            <span className="text-xs text-[var(--iron)] mt-1 font-mono">{formatTime(session.start_time)}</span>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Slide-over sheet for class details */}
      {selectedSession && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-[var(--ink)]/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedSession(null)}
          />
          
          {/* Sheet */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--white)] shadow-2xl flex flex-col h-full animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-[var(--iron)]/10 px-6 py-4">
              <h3 className="font-archivo text-xl uppercase text-[var(--ink)]">Class Details</h3>
              <button 
                onClick={() => setSelectedSession(null)}
                className="rounded-full p-2 text-[var(--iron)] hover:bg-[var(--bone)] hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div 
                className="mb-6 inline-flex rounded px-3 py-1 text-sm font-bold shadow-sm"
                style={{ backgroundColor: selectedSession.class.color_hex, color: 'var(--ink)' }}
              >
                {selectedSession.class.name}
              </div>
              
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded bg-[var(--bone)] p-4">
                  <Clock className="h-5 w-5 text-[var(--volt)]" />
                  <div>
                    <div className="text-xs font-mono uppercase text-[var(--iron)]">Time</div>
                    <div className="font-bold">{DAYS[selectedSession.day_of_week]}, {formatTime(selectedSession.start_time)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded bg-[var(--bone)] p-4">
                  <Users className="h-5 w-5 text-[var(--volt)]" />
                  <div>
                    <div className="text-xs font-mono uppercase text-[var(--iron)]">Capacity</div>
                    <div className="font-bold">{selectedSession.capacity_override || selectedSession.class.capacity} spots</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="mb-2 font-bold uppercase tracking-wider text-[var(--iron)] text-sm">Instructor</h4>
                <div className="text-lg font-medium text-[var(--ink)]">
                  {selectedSession.instructor?.full_name || selectedSession.class.instructor?.full_name || 'TBA'}
                </div>
              </div>
              
              <Link 
                href={`/classes/${selectedSession.class.slug}`}
                className="group flex items-center justify-between rounded border border-[var(--iron)]/20 p-4 hover:border-[var(--ink)]"
              >
                <div>
                  <div className="font-bold text-[var(--ink)] group-hover:text-[var(--volt)]">View full class info</div>
                  <div className="text-sm text-[var(--iron)]">See what to bring and who it's for</div>
                </div>
                <ArrowRight className="h-5 w-5 text-[var(--iron)] group-hover:text-[var(--volt)]" />
              </Link>
            </div>
            
            <div className="border-t border-[var(--iron)]/10 p-6 bg-[var(--bone)]">
              <button 
                onClick={() => {
                  router.push(`/booking?type=class&session=${selectedSession.id}`)
                }}
                className="w-full rounded bg-[var(--volt)] py-4 font-bold text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors"
              >
                Book this session
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
