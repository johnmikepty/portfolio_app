import { defineMiddleware } from 'astro:middleware'
import { isAuthenticated } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Visit } from '@/lib/models/Visit'
import { getLocaleFromCookie } from '@/i18n'

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
    const u = ua.toLowerCase()
    if (/tablet|ipad|playbook|silk/.test(u)) return 'tablet'
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/.test(u)) return 'mobile'
    return 'desktop'
}

export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname } = context.url
    const cookieHeader = context.request.headers.get('cookie')

    // ── Tracking de visitas ───────────────────────────────────────────────────
    if (pathname === '/' || pathname === '/resume') {
        try {
            await connectDB()

            const ip = context.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
            const ipHash = ip !== 'unknown'
                ? Array.from(new Uint8Array(
                    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
                )).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
                : 'unknown'

            const ua = context.request.headers.get('user-agent') ?? ''

            // Deduplicar: no contar si el mismo ipHash visitó la misma página en los últimos 30 min
            const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)
            const recent = await Visit.findOne({
                ipHash,
                page: pathname,
                action: 'view',
                timestamp: { $gte: thirtyMinAgo },
            })

            if (!recent) {
                // País: desde Cloudflare header (en prod) o vacío en dev
                const country = context.request.headers.get('cf-ipcountry') ?? ''

                await Visit.create({
                    page: pathname,
                    action: 'view',
                    locale: getLocaleFromCookie(cookieHeader),
                    ipHash,
                    userAgent: ua.slice(0, 200),
                    device: detectDevice(ua),
                    country,
                })
            }
        } catch {
            // No bloquear la request si falla el tracking
        }
    }

    // ── Protección de rutas CMS ───────────────────────────────────────────────
    if (pathname.startsWith('/cms') && pathname !== '/cms/login') {
        const authenticated = await isAuthenticated(cookieHeader)
        if (!authenticated) {
            return context.redirect('/cms/login')
        }
    }

    return next()
})
