import type { APIRoute } from 'astro'
import { SUPPORTED_LOCALES, type Locale } from '@/i18n'

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json().catch(() => ({}))
    const lang = body?.lang as Locale

    if (!SUPPORTED_LOCALES.includes(lang)) {
        return new Response(JSON.stringify({ error: 'Invalid locale' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify({ ok: true, lang }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`,
        },
    })
}
