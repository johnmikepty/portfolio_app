import type { APIRoute } from 'astro'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { verifyPassword, createToken, makeAuthCookie } from '@/lib/auth'

// Rate limiting básico en memoria
const attempts = new Map<string, { count: number; resetAt: number }>()

export const POST: APIRoute = async ({ request }) => {
    const ip = request.headers.get('x-forwarded-for') ?? 'local'
    const now = Date.now()

    // Max 5 intentos por 15 minutos
    const record = attempts.get(ip)
    if (record && now < record.resetAt && record.count >= 5) {
        return new Response(JSON.stringify({ error: 'Too many attempts. Try again later.' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const body = await request.json().catch(() => ({}))
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
        const current = attempts.get(ip) ?? { count: 0, resetAt: now + 15 * 60 * 1000 }
        attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt })

        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    attempts.delete(ip)
    const token = await createToken({ userId: user._id.toString(), email: user.email })

    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': makeAuthCookie(token),
        },
    })
}
