import type { APIRoute } from 'astro'
import { connectDB } from '@/lib/mongodb'
import { Visit } from '@/lib/models/Visit'
import { getLocaleFromCookie } from '@/i18n'

export const POST: APIRoute = async ({ request }) => {
    try {
        await connectDB()
        const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
        const ipHash = ip !== 'unknown'
            ? Array.from(new Uint8Array(
                await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
            )).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
            : 'unknown'

        await Visit.create({
            page: '/resume',
            action: 'download',
            locale: getLocaleFromCookie(request.headers.get('cookie')),
            ipHash,
            userAgent: request.headers.get('user-agent')?.slice(0, 200) ?? '',
        })
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
    } catch {
        return new Response(JSON.stringify({ ok: false }), { status: 500 })
    }
}
