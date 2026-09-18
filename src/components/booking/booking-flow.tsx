'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight, ArrowLeft, Loader2, Calendar, Clock, MapPin, User } from 'lucide-react'
import { submitEnquiry } from '@/app/actions/contact' // fallback
import { createBooking } from '@/app/actions/booking'

interface BookingFlowProps {
  instructors: any[]
  classes: any[]
  upcomingSessions: any[]
}

const userSchema = z.object({
  user_name: z.string().min(2, 'Name must be at least 2 characters'),
  user_email: z.string().email('Invalid email address'),
  user_phone: z.string().min(9, 'Valid phone required for M-Pesa'),
})

type UserFormValues = z.infer<typeof userSchema>

export function BookingFlow({ instructors, classes, upcomingSessions }: BookingFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || ''
  const initialInstructor = searchParams.get('instructor') || ''
  const initialClass = searchParams.get('class') || ''

  const [step, setStep] = useState(1)
  const [bookingType, setBookingType] = useState<string>(initialType)
  const [selectedEntityId, setSelectedEntityId] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: 'onChange'
  })

  // Auto-advance if deep linked
  useEffect(() => {
    if (initialType === 'personal_training' && initialInstructor) {
      setBookingType('personal_training')
      setSelectedEntityId(initialInstructor)
      setStep(3)
    } else if (initialType === 'class' && initialClass) {
      setBookingType('class')
      setSelectedEntityId(initialClass)
      setStep(3) // Skip entity selection, go to time selection
    } else if (initialType === 'intro' || initialType === 'day_pass') {
      setBookingType(initialType)
      setStep(3) // Go to time selection
    } else if (initialType) {
      setBookingType(initialType)
      setStep(2)
    }
  }, [initialType, initialInstructor, initialClass])

  const handleNext = () => {
    if (step === 1 && !bookingType) return
    if (step === 2 && !selectedEntityId && ['class', 'personal_training'].includes(bookingType)) return
    if (step === 3 && !selectedTime && bookingType !== 'day_pass') return
    setStep(s => s + 1)
  }

  const handleBack = () => setStep(s => s - 1)

  const onSubmit = (data: UserFormValues) => {
    setErrorMsg(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('type', bookingType)
      
      if (bookingType === 'class') {
        // Here selectedTime is the class_session_id
        formData.append('class_session_id', selectedTime)
      } else if (bookingType === 'personal_training') {
        formData.append('instructor_id', selectedEntityId)
        formData.append('start_time', selectedTime) // We'd ideally parse this into a full timestamp, but string is fine for MVP
      } else {
        formData.append('start_time', selectedTime)
      }

      formData.append('user_name', data.user_name)
      formData.append('user_email', data.user_email)
      formData.append('user_phone', data.user_phone)

      const result = await createBooking(null, formData)
      
      if (result.success) {
        router.push(`/booking/confirmation?ref=${result.reference}`)
      } else {
        setErrorMsg(result.message || 'An unknown error occurred')
      }
    })
  }

  // Generate some dummy next 7 days for intro/PT
  const getNextDays = () => {
    const days = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }

  const renderStep1 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)] mb-6">What would you like to book?</h2>
      {[
        { id: 'class', label: 'Group Class', desc: 'Join a scheduled session' },
        { id: 'personal_training', label: 'Personal Training', desc: '1-on-1 coaching session' },
        { id: 'intro', label: 'Intro Session', desc: 'Free consultation for new members' },
        { id: 'day_pass', label: 'Day Pass', desc: 'Full access for the day (KES 800)' },
      ].map(type => (
        <button
          key={type.id}
          onClick={() => {
            setBookingType(type.id)
            setSelectedEntityId('')
            setSelectedTime('')
          }}
          className={`w-full flex items-center justify-between rounded border p-6 text-left transition-colors ${bookingType === type.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-md' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
        >
          <div>
            <div className="font-bold text-lg">{type.label}</div>
            <div className={`text-sm mt-1 ${bookingType === type.id ? 'text-white/70' : 'text-[var(--iron)]'}`}>{type.desc}</div>
          </div>
          <ChevronRight className={`h-5 w-5 ${bookingType === type.id ? 'text-[var(--volt)]' : 'text-[var(--iron)]'}`} />
        </button>
      ))}
      <div className="pt-6">
        <button onClick={handleNext} disabled={!bookingType} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
          Continue
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => {
    if (bookingType === 'class') {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--iron)]/10 text-[var(--iron)]"><ArrowLeft className="h-5 w-5" /></button>
            <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">Select a Class</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => setSelectedEntityId(cls.id)}
                className={`flex flex-col items-start rounded border p-4 text-left transition-colors ${selectedEntityId === cls.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-md' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cls.color_hex || 'var(--volt)' }} />
                  <span className="font-bold">{cls.name}</span>
                </div>
                <span className={`text-xs ${selectedEntityId === cls.id ? 'text-white/70' : 'text-[var(--iron)]'}`}>{cls.duration_minutes} min</span>
              </button>
            ))}
          </div>
          <div className="pt-6">
            <button onClick={handleNext} disabled={!selectedEntityId} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">
              Continue
            </button>
          </div>
        </div>
      )
    }

    if (bookingType === 'personal_training') {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--iron)]/10 text-[var(--iron)]"><ArrowLeft className="h-5 w-5" /></button>
            <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">Select a Coach</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {instructors.map(inst => (
              <button
                key={inst.id}
                onClick={() => setSelectedEntityId(inst.id)}
                className={`flex items-center gap-4 rounded border p-4 text-left transition-colors ${selectedEntityId === inst.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-md' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
              >
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                  {/* Assuming we'd have Image here, but skipping for simplicity in this component or using img */}
                  <img src={inst.portrait_url} alt={inst.full_name} className="object-cover w-full h-full" />
                </div>
                <div>
                  <div className="font-bold">{inst.full_name}</div>
                  <div className={`text-xs ${selectedEntityId === inst.id ? 'text-[var(--volt)]' : 'text-[var(--iron)]'}`}>{inst.role}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="pt-6">
            <button onClick={handleNext} disabled={!selectedEntityId} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">
              Continue
            </button>
          </div>
        </div>
      )
    }

    // Intro or Day Pass skip step 2
    handleNext()
    return null
  }

  const renderStep3 = () => {
    if (bookingType === 'day_pass') {
      // Day pass just needs a date
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--iron)]/10 text-[var(--iron)]"><ArrowLeft className="h-5 w-5" /></button>
            <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">When will you visit?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {getNextDays().slice(0, 8).map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedTime(date.toISOString())}
                className={`flex flex-col items-center justify-center rounded border p-4 transition-colors ${selectedTime === date.toISOString() ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-md' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
              >
                <span className="text-xs uppercase tracking-widest mb-1">{date.toLocaleDateString('en-KE', { weekday: 'short' })}</span>
                <span className="font-bold text-xl">{date.getDate()}</span>
                <span className="text-xs mt-1">{date.toLocaleDateString('en-KE', { month: 'short' })}</span>
              </button>
            ))}
          </div>
          <div className="pt-6">
            <button onClick={handleNext} disabled={!selectedTime} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">
              Continue
            </button>
          </div>
        </div>
      )
    }

    if (bookingType === 'class') {
      const classSessions = upcomingSessions.filter(s => s.class_id === selectedEntityId)
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--iron)]/10 text-[var(--iron)]"><ArrowLeft className="h-5 w-5" /></button>
            <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">Upcoming Sessions</h2>
          </div>
          
          {classSessions.length > 0 ? (
            <div className="space-y-3">
              {classSessions.map(session => {
                const date = new Date(session.start_time)
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedTime(session.id)} // For classes, time is the session ID
                    className={`w-full flex items-center justify-between rounded border p-4 text-left transition-colors ${selectedTime === session.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-md' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex flex-col items-center justify-center rounded p-2 ${selectedTime === session.id ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <span className="text-xs font-bold uppercase">{date.toLocaleDateString('en-KE', { month: 'short' })}</span>
                        <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                      </div>
                      <div>
                        <div className="font-bold">{date.toLocaleDateString('en-KE', { weekday: 'long' })}</div>
                        <div className={`text-sm flex items-center gap-1 ${selectedTime === session.id ? 'text-white/70' : 'text-[var(--iron)]'}`}>
                          <Clock className="h-3 w-3" />
                          {date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                          {session.instructor && ` · with ${session.instructor.full_name}`}
                        </div>
                      </div>
                    </div>
                    {selectedTime === session.id && <div className="rounded-full bg-[var(--volt)] h-3 w-3" />}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-[var(--iron)]/20 rounded text-[var(--iron)]">
              No upcoming sessions found for this class.
            </div>
          )}

          <div className="pt-6">
            <button onClick={handleNext} disabled={!selectedTime} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">
              Continue
            </button>
          </div>
        </div>
      )
    }

    // PT or Intro (Generic Time Slots)
    const timeSlots = ['06:00', '07:30', '09:00', '12:00', '16:00', '17:30', '19:00']
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--iron)]/10 text-[var(--iron)]"><ArrowLeft className="h-5 w-5" /></button>
          <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">Select Date & Time</h2>
        </div>
        
        <div className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--iron)]">1. Date</div>
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide">
          {getNextDays().map((date, i) => {
            const dateStr = date.toISOString().split('T')[0]
            const isSelectedDate = selectedTime.startsWith(dateStr)
            
            return (
              <button
                key={i}
                onClick={() => setSelectedTime(dateStr + (selectedTime.split('T')[1] ? 'T' + selectedTime.split('T')[1] : ''))}
                className={`flex-shrink-0 snap-start flex flex-col items-center justify-center rounded border p-4 w-24 transition-colors ${isSelectedDate ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-md' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
              >
                <span className="text-xs uppercase tracking-widest mb-1">{date.toLocaleDateString('en-KE', { weekday: 'short' })}</span>
                <span className="font-bold text-xl">{date.getDate()}</span>
                <span className="text-xs mt-1">{date.toLocaleDateString('en-KE', { month: 'short' })}</span>
              </button>
            )
          })}
        </div>

        {selectedTime.split('T')[0] && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4 mt-4 text-sm font-bold uppercase tracking-wider text-[var(--iron)]">2. Time</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map(time => {
                const fullTime = `${selectedTime.split('T')[0]}T${time}:00`
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(fullTime)}
                    className={`rounded border p-3 text-sm font-mono transition-colors ${selectedTime === fullTime ? 'border-[var(--volt)] bg-[var(--volt)] text-[var(--ink)] font-bold shadow-sm' : 'border-[var(--iron)]/20 text-[var(--ink)] hover:border-[var(--ink)]'}`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="pt-6">
          <button onClick={handleNext} disabled={!selectedTime || !selectedTime.includes('T')} className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-50">
            Continue
          </button>
        </div>
      </div>
    )
  }

  const renderStep4 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-[var(--iron)]/10 text-[var(--iron)]"><ArrowLeft className="h-5 w-5" /></button>
        <h2 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)]">Your Details</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="booking-form">
        {errorMsg && (
          <div className="rounded bg-[var(--danger)]/10 p-4 text-[var(--danger)] text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Full Name</label>
          <input
            type="text"
            className="w-full rounded bg-white p-4 border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none"
            {...register('user_name')}
          />
          {errors.user_name && <p className="mt-1 text-xs text-[var(--danger)]">{errors.user_name.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Email</label>
          <input
            type="email"
            className="w-full rounded bg-white p-4 border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none"
            {...register('user_email')}
          />
          {errors.user_email && <p className="mt-1 text-xs text-[var(--danger)]">{errors.user_email.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">M-Pesa Phone Number</label>
          <input
            type="tel"
            placeholder="07XX XXX XXX"
            className="w-full rounded bg-white p-4 border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none font-mono"
            {...register('user_phone')}
          />
          <p className="mt-1 text-xs text-[var(--iron)]">Required to complete booking payment.</p>
          {errors.user_phone && <p className="mt-1 text-xs text-[var(--danger)]">{errors.user_phone.message}</p>}
        </div>
      </form>

      <div className="pt-6">
        <button 
          form="booking-form"
          disabled={!isValid || isPending} 
          className="flex w-full items-center justify-center gap-2 rounded bg-[var(--ink)] px-6 py-4 font-bold text-white transition-colors hover:bg-[var(--volt)] hover:text-[var(--ink)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : 'Confirm & Proceed to Payment'}
        </button>
      </div>
    </div>
  )

  // Header Progress
  const progress = (step / 4) * 100

  return (
    <div className="mx-auto max-w-xl bg-white rounded shadow-xl border border-[var(--iron)]/10 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-100">
        <div className="h-full bg-[var(--volt)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-8 sm:p-12">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  )
}
