import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Validate record has email and reference
    if (!record || !record.user_email || !record.reference_code) {
      return new Response(JSON.stringify({ error: 'Missing required booking data' }), { status: 400 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'The Gymist <hello@thegymist.co.ke>',
        to: record.user_email,
        subject: `Booking Confirmation: ${record.reference_code}`,
        html: `
          <h1>Your booking is confirmed!</h1>
          <p>Hi ${record.user_name},</p>
          <p>Your reference code is: <strong>${record.reference_code}</strong></p>
          <p>Please present this at the reception.</p>
          <p>Thanks,<br/>The Gymist Team</p>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
