'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { submitEnquiry } from '@/app/actions/contact'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Please select or enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const searchParams = useSearchParams()
  const defaultSubject = searchParams.get('subject') || 'General Enquiry'
  
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: defaultSubject
    }
  })

  const onSubmit = (data: ContactFormValues) => {
    setErrorMsg(null)
    startTransition(async () => {
      // Convert to FormData
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      
      const result = await submitEnquiry(null, formData)
      
      if (result.success) {
        setSuccess(true)
        reset()
      } else {
        setErrorMsg(result.message)
      }
    })
  }

  if (success) {
    return (
      <div className="rounded bg-white p-12 text-center border border-[var(--iron)]/10 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--volt)] mb-6">
          <CheckCircle2 className="h-8 w-8 text-[var(--ink)]" />
        </div>
        <h3 className="font-archivo text-2xl uppercase tracking-tight text-[var(--ink)] mb-4">Message Received</h3>
        <p className="text-[var(--iron)] mb-8">
          Thanks for reaching out. We've received your enquiry and our team will get back to you within 24 hours.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="rounded border border-[var(--iron)]/20 px-6 py-3 font-bold text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="rounded bg-[var(--danger)]/10 p-4 text-[var(--danger)] flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            className={`w-full rounded bg-white p-4 border ${errors.name ? 'border-[var(--danger)]' : 'border-[var(--iron)]/20'} focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]`}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-[var(--danger)]">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            className={`w-full rounded bg-white p-4 border ${errors.email ? 'border-[var(--danger)]' : 'border-[var(--iron)]/20'} focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]`}
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-[var(--danger)]">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className={`w-full rounded bg-white p-4 border ${errors.phone ? 'border-[var(--danger)]' : 'border-[var(--iron)]/20'} focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]`}
            {...register('phone')}
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
            Subject *
          </label>
          <select
            id="subject"
            className={`w-full rounded bg-white p-4 border ${errors.subject ? 'border-[var(--danger)]' : 'border-[var(--iron)]/20'} focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]`}
            {...register('subject')}
          >
            <option value="General Enquiry">General Enquiry</option>
            <option value="Membership">Membership Details</option>
            <option value="Personal Training">Personal Training</option>
            <option value="Drop-in">Drop-in / Day Pass</option>
            <option value="Session Pack">Session Pack</option>
          </select>
          {errors.subject && <p className="mt-1 text-xs text-[var(--danger)]">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          className={`w-full rounded bg-white p-4 border ${errors.message ? 'border-[var(--danger)]' : 'border-[var(--iron)]/20'} focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]`}
          {...register('message')}
        ></textarea>
        {errors.message && <p className="mt-1 text-xs text-[var(--danger)]">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center rounded bg-[var(--ink)] px-6 py-4 font-bold text-white transition-colors hover:bg-[var(--volt)] hover:text-[var(--ink)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}
