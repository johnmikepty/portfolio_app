import { defineMiddleware } from 'astro:middleware'
import { isAuthenticated } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Visit } from '@/lib/models/Visit'
import { getLocaleFromCookie } from '@/i18n'

export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname } = context.url
    const cookieHeader = context.request.headers.get('cookie')

    // ── Tracking de visitas ───────────────────────────────────────────────────
    if (pathname === '/' || pathname === '/resume') {
        try {
            await connectDB()
            const ip = context.request.headers.get('x-forwarded-for') ?? 'unknown'
            const ipHash = ip !== 'unknown'
                ? Array.from(new Uint8Array(
                    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
                )).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
                : 'unknown'

            await Visit.create({
                page: pathname,
                action: 'view',
                locale: getLocaleFromCookie(cookieHeader),
                ipHash,
                userAgent: context.request.headers.get('user-agent')?.slice(0, 200) ?? '',
            })
        } catch {
            // No bloquear la request si falla el tracking
        }
    }

    // ── Protección de rutas CRM ───────────────────────────────────────────────
    if (pathname.startsWith('/cms') && pathname !== '/cms/login') {
        const authenticated = await isAuthenticated(cookieHeader)
        if (!authenticated) {
            return context.redirect('/cms/login')
        }
    }

    return next()
})
