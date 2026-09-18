import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/settings-form'

export const metadata = {
  title: 'Site Settings — Admin',
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  // Always fetch row 1
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-archivo text-3xl uppercase tracking-tight text-[var(--ink)]">
            Site Settings
          </h1>
          <p className="text-[var(--iron)] mt-1">
            Manage global information like contact details, hours, and M-Pesa till number.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-w-3xl">
        <div className="p-6">
          <SettingsForm initialData={settings || {}} />
        </div>
      </div>
    </div>
  )
}
