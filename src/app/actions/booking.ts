'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const bookingSchema = z.object({
  type: z.enum(['class', 'personal_training', 'intro', 'day_pass']),
  class_session_id: z.string().optional(),
  instructor_id: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  user_name: z.string().min(2, 'Name must be at least 2 characters'),
  user_email: z.string().email('Invalid email address'),
  user_phone: z.string().min(9, 'Valid phone required for M-Pesa'),
})

export async function createBooking(prevState: any, formData: FormData) {
  try {
    const rawData = {
      type: formData.get('type'),
      class_session_id: formData.get('class_session_id') || undefined,
      instructor_id: formData.get('instructor_id') || undefined,
      start_time: formData.get('start_time') || undefined,
      end_time: formData.get('end_time') || undefined,
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      user_phone: formData.get('user_phone'),
    }

    const validatedData = bookingSchema.parse(rawData)
    const supabase = await createClient()

    // Generate a short reference (e.g., BKG-A8X92)
    const ref = 'GYM-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          reference_code: ref,
          type: validatedData.type,
          class_session_id: validatedData.class_session_id,
          instructor_id: validatedData.instructor_id,
          start_time: validatedData.start_time,
          end_time: validatedData.end_time,
          user_name: validatedData.user_name,
          user_email: validatedData.user_email,
          user_phone: validatedData.user_phone,
          status: 'pending_payment',
        }
      ])
      .select('reference_code')
      .single()

    if (error) {
      console.error('Booking error:', error)
      throw new Error('Failed to create booking')
    }

    return {
      success: true,
      reference: data.reference_code,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Please check your inputs.',
      }
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
