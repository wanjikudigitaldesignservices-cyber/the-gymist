'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Please select or enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitEnquiry(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    const validatedData = contactSchema.parse(rawData)

    const supabase = await createClient()

    // 1. Save to database
    const { error: dbError } = await supabase
      .from('enquiries')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          subject: validatedData.subject,
          message: validatedData.message,
          status: 'new'
        }
      ])

    if (dbError) throw new Error('Failed to save enquiry')

    // 2. Fetch site settings to get contact email
    const { data: settings } = await supabase
      .from('site_settings')
      .select('contact_email')
      .single()

    const contactEmail = settings?.contact_email || 'hello@thegymist.co.ke'

    // 3. Send email via Resend (only if API key is set to avoid crashing in dev)
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'The Gymist Website <onboarding@resend.dev>', // Use verified domain in production
        to: contactEmail,
        replyTo: validatedData.email,
        subject: `New Enquiry: ${validatedData.subject}`,
        text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
Phone: ${validatedData.phone || 'Not provided'}
Subject: ${validatedData.subject}

Message:
${validatedData.message}
        `,
      })
    }

    return {
      success: true,
      message: "Thanks for reaching out. We'll get back to you within 24 hours.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Please fix the errors in the form.',
      }
    }
    
    return {
      success: false,
      message: 'Something went wrong. Please try again later or contact us via WhatsApp.',
    }
  }
}
