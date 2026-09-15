// v2 - redeployed
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Secret key simples para autenticar o cron job
const CRON_SECRET = Deno.env.get('CRON_SECRET') || 'tonys-reminder-2026'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Verificar autenticacao: aceita tanto service role quanto cron secret
  const authHeader = req.headers.get('Authorization') || ''
  const cronSecret = req.headers.get('x-cron-secret') || ''

  const isServiceRole = authHeader.includes(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '')
  const isCronSecret = cronSecret === CRON_SECRET

  if (!isServiceRole && !isCronSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    webpush.setVapidDetails(
      Deno.env.get('VAPID_SUBJECT')!,
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    )

    // Buscar appointments de amanha em horario New York
    const { data: appointments } = await supabaseAdmin
      .rpc('get_tomorrows_appointments')

    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: 'No appointments tomorrow' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar todas as subscriptions
    const { data: subscriptions } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: 'No subscriptions' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const formatTime = (isoString: string) =>
      new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
      })

    const formatDate = (isoString: string) =>
      new Date(isoString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/New_York',
      })

    let notifTitle: string
    let notifBody: string

    if (appointments.length === 1) {
      const a = appointments[0]
      notifTitle = `Tomorrow: ${a.title}`
      const parts: string[] = []
      parts.push(`📅 ${formatDate(a.scheduled_at)}`)
      parts.push(`⏰ ${formatTime(a.scheduled_at)} ET`)
      if (a.lead_name) parts.push(`👤 ${a.lead_name}`)
      if (a.notes) parts.push(`📝 ${a.notes}`)
      notifBody = parts.join(' · ')
    } else {
      notifTitle = `Tomorrow: ${appointments.length} Appointments`
      const lines = appointments.map((a: any) => {
        const lead = a.lead_name ? ` · ${a.lead_name}` : ''
        return `${formatTime(a.scheduled_at)} ET · ${a.title}${lead}`
      })
      notifBody = `📅 ${formatDate(appointments[0].scheduled_at)}\n` + lines.join('\n')
    }

    const pushPayload = {
      title: notifTitle,
      body: notifBody,
      count: appointments.length,
      type: 'reminder',
    }

    let sent = 0
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(pushPayload)
        )
        sent++
      } catch (err: any) {
        if (err.statusCode === 410) {
          await supabaseAdmin
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', sub.endpoint)
        }
      }
    }

    return new Response(
      JSON.stringify({ sent, appointments: appointments.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
