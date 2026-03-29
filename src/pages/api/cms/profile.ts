import type { APIRoute } from 'astro'
import { isAuthenticated } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Personal } from '@/lib/models/Personal'
import { Experience } from '@/lib/models/Experience'
import { Education } from '@/lib/models/Education'
import { Project } from '@/lib/models/Project'
import { Certification } from '@/lib/models/Certification'
import { Award } from '@/lib/models/Award'
import { Reference } from '@/lib/models/Reference'
import { SkillSection } from '@/lib/models/SkillSection'

export const GET: APIRoute = async ({ request, url }) => {
    if (!await isAuthenticated(request.headers.get('cookie'))) {
        return json({ error: 'Unauthorized' }, 401)
    }

    const locale = url.searchParams.get('locale') ?? 'en'
    await connectDB()

    const [personal, experience, education, projects, certifications, awards, references, skills] = await Promise.all([
        Personal.findOne({ locale }).lean(),
        Experience.find({ locale }).sort({ startYear: -1, startMonth: -1 }).lean(),
        Education.find({ locale }).sort({ year: -1 }).lean(),
        Project.find({ locale }).sort({ priority: -1 }).lean(),
        Certification.find().sort({ year: -1 }).lean(),
        Award.find({ locale }).lean(),
        Reference.find().sort({ priority: 1 }).lean(),
        SkillSection.find().sort({ priority: 1 }).lean(),
    ])

    return json({ personal, experience, education, projects, certifications, awards, references, skills })
}

export const PUT: APIRoute = async ({ request }) => {
    if (!await isAuthenticated(request.headers.get('cookie'))) {
        return json({ error: 'Unauthorized' }, 401)
    }

    const body = await request.json().catch(() => null)
    if (!body) return json({ error: 'Invalid body' }, 400)

    const { section, locale, data } = body
    await connectDB()

    try {
        switch (section) {
            case 'personal':
                await Personal.findOneAndUpdate({ locale }, data, { upsert: true })
                break

            case 'experience':
                // data = array completo — reemplazar todos del locale
                await Experience.deleteMany({ locale })
                if (data.length > 0) await Experience.insertMany(data.map((d: any) => ({ ...d, locale })))
                break

            case 'education':
                await Education.deleteMany({ locale })
                if (data.length > 0) await Education.insertMany(data.map((d: any) => ({ ...d, locale })))
                break

            case 'projects':
                await Project.deleteMany({ locale })
                if (data.length > 0) await Project.insertMany(data.map((d: any) => ({ ...d, locale })))
                break

            case 'certifications':
                await Certification.deleteMany({})
                if (data.length > 0) await Certification.insertMany(data)
                break

            case 'awards':
                await Award.deleteMany({ locale })
                if (data.length > 0) await Award.insertMany(data.map((d: any) => ({ ...d, locale })))
                break

            case 'references':
                await Reference.deleteMany({})
                if (data.length > 0) await Reference.insertMany(data)
                break

            case 'skills':
                await SkillSection.deleteMany({})
                if (data.length > 0) await SkillSection.insertMany(data)
                break

            default:
                return json({ error: `Unknown section: ${section}` }, 400)
        }

        return json({ ok: true })
    } catch (err: any) {
        return json({ error: err.message }, 500)
    }
}

function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}
