import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ ref?: string }>
}

export const metadata = {
  title: 'Booking Confirmed — The Gymist',
}

export default async function BookingConfirmationPage({ searchParams }: PageProps) {
  const { ref } = await searchParams
  
  if (!ref) {
    notFound()
  }

  const supabase = await createClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      class_session:class_sessions(
        start_time,
        class:classes(name)
      ),
      instructor:instructors(full_name)
    `)
    .eq('reference_code', ref)
    .single()

  if (!booking) {
    notFound()
  }

  const { data: settings } = await supabase
    .from('site_settings')
    .select('mpesa_till_number, whatsapp_number')
    .single()

  const till = settings?.mpesa_till_number || '123456'
  const waNumber = settings?.whatsapp_number || '254740396075'
  
  // Calculate price (very rough logic for UI, real app needs a pricing table/logic)
  let price = 0
  let description = ''
  
  if (booking.type === 'class') {
    price = 1500
    description = `Drop-in: ${booking.class_session?.class?.name}`
  } else if (booking.type === 'personal_training') {
    price = 3000
    description = `PT Session with ${booking.instructor?.full_name}`
  } else if (booking.type === 'day_pass') {
    price = 800
    description = 'Day Pass'
  } else if (booking.type === 'intro') {
    price = 0
    description = 'Intro Session (Free)'
  }

  const waText = encodeURIComponent(`Hi, I've just booked a session (Ref: ${booking.reference_code}) and paid KES ${price}.`)
  const waUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${waText}`

  return (
    <main className="flex-1 bg-[var(--bone)] flex items-center justify-center py-24 px-6">
      <div className="w-full max-w-lg bg-white rounded shadow-xl border border-[var(--iron)]/10 overflow-hidden">
        <div className="bg-[var(--ink)] text-center p-12 text-white">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--volt)] mb-6">
            <CheckCircle2 className="h-10 w-10 text-[var(--ink)]" />
          </div>
          <h1 className="font-archivo text-3xl uppercase tracking-tight mb-2">Booking Received</h1>
          <p className="text-[var(--volt)] font-mono text-sm uppercase tracking-widest">
            Ref: {booking.reference_code}
          </p>
        </div>

        <div className="p-8 sm:p-12">
          <div className="space-y-4 mb-12">
            <div className="flex justify-between border-b border-[var(--iron)]/10 pb-4">
              <span className="text-[var(--iron)] font-medium">Type</span>
              <span className="font-bold text-[var(--ink)]">{description}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--iron)]/10 pb-4">
              <span className="text-[var(--iron)] font-medium">Name</span>
              <span className="font-bold text-[var(--ink)]">{booking.user_name}</span>
            </div>
            {price > 0 && (
              <div className="flex justify-between border-b border-[var(--iron)]/10 pb-4">
                <span className="text-[var(--iron)] font-medium">Total Due</span>
                <span className="font-archivo text-xl text-[var(--ink)]">KES {price.toLocaleString()}</span>
              </div>
            )}
          </div>

          {price > 0 ? (
            <div className="rounded bg-[var(--bone)] p-6 mb-8 text-center border border-[var(--iron)]/20">
              <p className="text-[var(--iron)] text-sm mb-4">
                To confirm your booking, please pay <strong className="text-[var(--ink)]">KES {price.toLocaleString()}</strong> to M-Pesa Buy Goods Till Number:
              </p>
              <div className="font-archivo text-4xl text-[var(--ink)] tracking-widest mb-4">
                {till}
              </div>
              <p className="text-xs text-[var(--iron)] mb-6">
                (The Gymist Kilimani)
              </p>
              
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded bg-[#25D366] px-6 py-4 font-bold text-white transition-colors hover:bg-[#20bd5a]"
              >
                I've paid, notify reception <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          ) : (
            <div className="rounded bg-[var(--bone)] p-6 mb-8 text-center border border-[var(--iron)]/20">
              <p className="text-[var(--iron)] mb-4">
                Your intro session is free. Our head coach will text you on <strong>{booking.user_phone}</strong> to confirm the exact time.
              </p>
              <Link 
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded bg-[var(--ink)] px-6 py-4 font-bold text-white transition-colors hover:bg-[var(--volt)] hover:text-[var(--ink)]"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
