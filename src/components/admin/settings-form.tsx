'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export function SettingsForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    contact_email: initialData?.contact_email || '',
    contact_phone: initialData?.contact_phone || '',
    whatsapp_number: initialData?.whatsapp_number || '',
    address: initialData?.address || '',
    opening_hours: initialData?.opening_hours || '',
    mpesa_till_number: initialData?.mpesa_till_number || '',
    instagram_url: initialData?.instagram_url || '',
  })
  
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...formData })

    setSaving(false)

    if (error) {
      toast.error('Failed to save settings: ' + error.message)
    } else {
      toast.success('Settings saved successfully')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">Contact Email</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">Contact Phone</label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">WhatsApp Number</label>
          <input
            type="text"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleChange}
            className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none font-mono"
            placeholder="2547XXXXXXXX"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">M-Pesa Till Number</label>
          <input
            type="text"
            name="mpesa_till_number"
            value={formData.mpesa_till_number}
            onChange={handleChange}
            className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none font-mono font-bold text-lg"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">Instagram URL</label>
        <input
          type="url"
          name="instagram_url"
          value={formData.instagram_url}
          onChange={handleChange}
          className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-700">Opening Hours</label>
        <textarea
          name="opening_hours"
          value={formData.opening_hours}
          onChange={handleChange}
          rows={3}
          className="w-full rounded bg-gray-50 p-3 border border-gray-200 focus:border-[var(--ink)] focus:outline-none"
        />
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded bg-[var(--ink)] px-6 py-3 font-bold text-white transition-colors hover:bg-[var(--volt)] hover:text-[var(--ink)] disabled:opacity-70"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
