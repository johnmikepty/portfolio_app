import type { APIRoute } from 'astro'
import { isAuthenticated } from '@/lib/auth'
import { getSectionVisibility, setSectionVisibility } from '@/lib/profile'

export const GET: APIRoute = async ({ request, url }) => {
    if (!await isAuthenticated(request.headers.get('cookie'))) {
        return json({ error: 'Unauthorized' }, 401)
    }
    const page = (url.searchParams.get('page') ?? 'resume') as 'resume' | 'portfolio'
    const sections = await getSectionVisibility(page)
    return json({ sections })
}

export const PUT: APIRoute = async ({ request }) => {
    if (!await isAuthenticated(request.headers.get('cookie'))) {
        return json({ error: 'Unauthorized' }, 401)
    }
    const body = await request.json().catch(() => null)
    if (!body?.page || !body?.sections) return json({ error: 'Invalid body' }, 400)
    await setSectionVisibility(body.page, body.sections)
    return json({ ok: true })
}

function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}
