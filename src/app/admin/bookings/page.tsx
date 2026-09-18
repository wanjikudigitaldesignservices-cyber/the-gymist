import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'

export const metadata = {
  title: 'Bookings — Admin',
}

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  // Fetch all bookings, newest first
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      class_session:class_sessions(class:classes(name), start_time),
      instructor:instructors(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
            Bookings
          </h1>
          <p className="text-[var(--iron)] mt-1">
            Manage incoming bookings for classes, PT, and day passes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">Ref</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings?.map((booking) => {
                let details = '-'
                if (booking.type === 'class') details = booking.class_session?.class?.name || 'Class'
                if (booking.type === 'personal_training') details = `PT w/ ${booking.instructor?.full_name}`
                
                // We're just displaying here; in a full app we'd have a mark as paid button.
                
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-bold text-[var(--ink)]">{booking.reference_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {format(new Date(booking.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--ink)]">{booking.user_name}</div>
                      <div className="text-xs text-gray-500 font-mono">{booking.user_phone}</div>
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider text-gray-500">
                      {booking.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">{details}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Simple action buttons can be client components later. Just read-only for now */}
                      <button className="text-[var(--volt)] font-bold bg-[var(--ink)] px-3 py-1 rounded text-xs hover:bg-[var(--ink)]/80">
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
              
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
