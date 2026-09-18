'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ink)] px-6">
      <div className="w-full max-w-md bg-white rounded shadow-2xl overflow-hidden border border-white/10">
        
        <div className="p-8 text-center border-b border-[var(--iron)]/10 bg-[var(--bone)]">
          <Link href="/" className="inline-block font-archivo text-3xl font-black uppercase tracking-tighter text-[var(--ink)]">
            THE<span className="text-[var(--volt)]">GYMIST</span>
          </Link>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest text-[var(--iron)]">
            System Administration
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded bg-[var(--danger)]/10 p-4 text-sm font-medium text-[var(--danger)]">
                {error}
              </div>
            )}
            
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded bg-[var(--bone)] p-4 border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded bg-[var(--bone)] p-4 border border-[var(--iron)]/20 focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded bg-[var(--volt)] px-6 py-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
