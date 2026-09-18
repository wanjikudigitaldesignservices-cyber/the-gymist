import { AdminSidebar } from '@/components/admin/sidebar'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Admin Dashboard — The Gymist',
  robots: { index: false, follow: false }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-[var(--ink)]">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
