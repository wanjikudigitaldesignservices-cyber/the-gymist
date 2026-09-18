import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CalendarCheck, MessageSquare, Dumbbell, CalendarDays, Users } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard — The Gymist',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: bookingsCount },
    { count: enquiriesCount },
    { count: workoutsCount },
    { count: classesCount },
    { count: instructorsCount }
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending_payment'),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('workouts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('classes').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('instructors').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  const statCards = [
    { label: 'Pending Bookings', value: bookingsCount || 0, icon: CalendarCheck, href: '/admin/bookings', color: 'bg-blue-50 text-blue-600' },
    { label: 'New Enquiries', value: enquiriesCount || 0, icon: MessageSquare, href: '/admin/enquiries', color: 'bg-red-50 text-red-600' },
    { label: 'Active Workouts', value: workoutsCount || 0, icon: Dumbbell, href: '/admin/workouts', color: 'bg-green-50 text-green-600' },
    { label: 'Active Classes', value: classesCount || 0, icon: CalendarDays, href: '/admin/classes', color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Instructors', value: instructorsCount || 0, icon: Users, href: '/admin/instructors', color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
            Overview
          </h1>
          <p className="text-[var(--iron)] mt-1">
            Welcome back to The Gymist administration panel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <Link key={i} href={stat.href} className="block rounded-lg bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <p className="font-archivo text-4xl text-[var(--ink)]">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-[var(--ink)] uppercase tracking-wider text-sm">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/workouts/new" className="flex items-center justify-center p-4 rounded border border-gray-200 hover:border-[var(--ink)] hover:bg-gray-50 transition-colors font-medium">
              + Add Workout
            </Link>
            <Link href="/admin/classes/new" className="flex items-center justify-center p-4 rounded border border-gray-200 hover:border-[var(--ink)] hover:bg-gray-50 transition-colors font-medium">
              + Add Class
            </Link>
            <Link href="/admin/blog/new" className="flex items-center justify-center p-4 rounded border border-gray-200 hover:border-[var(--ink)] hover:bg-gray-50 transition-colors font-medium">
              + Write Post
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-center p-4 rounded border border-gray-200 hover:border-[var(--ink)] hover:bg-gray-50 transition-colors font-medium">
              Edit Site Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
