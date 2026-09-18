'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Dumbbell, 
  CalendarDays, 
  Users, 
  FileText, 
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  CreditCard
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/admin/classes', label: 'Classes', icon: CalendarDays },
  { href: '/admin/instructors', label: 'Instructors', icon: Users },
  { href: '/admin/blog', label: 'Journal', icon: FileText },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/memberships', label: 'Memberships', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[var(--ink)] text-white flex flex-col border-r border-white/10 z-50">
      <div className="p-6">
        <Link href="/admin" className="font-archivo text-2xl font-black uppercase tracking-tighter text-white">
          THE<span className="text-[var(--volt)]">GYMIST</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--volt)] text-[var(--ink)]' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-[var(--ink)]' : 'text-white/50'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 text-white/50" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
