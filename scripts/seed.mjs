/**
 * seed.mjs — Migra los datos actuales de los .md a MongoDB
 * Uso: node scripts/seed.mjs
 *
 * Requiere: MongoDB corriendo en Docker (docker compose up -d)
 */

import mongoose from 'mongoose'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT = join(ROOT, 'src', 'content')

const MONGODB_URI = 'mongodb://admin:admin1234@localhost:27017/portfolio?authSource=admin'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (!match) return { data: {}, body: content }

    const data = {}
    match[1].split('\n').forEach(line => {
        const [key, ...rest] = line.split(':')
        if (key && rest.length) {
            const val = rest.join(':').trim().replace(/^["']|["']$/g, '')
            data[key.trim()] = isNaN(val) ? val : Number(val)
        }
    })

    return { data, body: match[2].trim() }
}

function parseBullets(body) {
    return body
        .split('\n')
        .filter(l => l.trim().startsWith('- '))
        .map(l => l.replace(/^- /, '').trim())
}

function getLocaleFiles(dir) {
    try {
        return readdirSync(dir).filter(f =>
            (f.endsWith('.en.md') || f.endsWith('.es.md')) && !f.startsWith('_')
        )
    } catch { return [] }
}

function getLocale(filename) {
    return filename.includes('.en.md') ? 'en' : 'es'
}

function getSlug(filename) {
    return filename.replace('.en.md', '').replace('.es.md', '')
}

// ─── Modelos inline (sin importar TS) ─────────────────────────────────────────

const { Schema, model, models } = mongoose

const PersonalSchema = new Schema({
    locale: String, name: String, title: String, email: String,
    phone: String, linkedin: String, github: String, website: String,
    location: String, bio: String, bioHtml: String,
})
const ExperienceSchema = new Schema({
    locale: String, slug: String, name: String, title: String,
    url: String, location: String, startMonth: Number, startYear: Number,
    endMonth: Number, endYear: Number, bullets: [String], priority: Number,
})
const EducationSchema = new Schema({
    locale: String, slug: String, name: String, degree: String,
    subject: String, year: Number, url: String, bullets: [String],
})
const ProjectSchema = new Schema({
    locale: String, slug: String, name: String,
    icons: [String], bullets: [String], priority: Number,
})
const CertificationSchema = new Schema({
    mentorship: String, title: String, year: Number,
    website: String, priority: Number,
})
const AwardSchema = new Schema({
    locale: String, slug: String, name: String, bullets: [String],
})
const ReferenceSchema = new Schema({
    name: String, title: String, company: String,
    email: String, phone: String, priority: Number,
})
const SkillSectionSchema = new Schema({
    title: String, items: [String], priority: Number,
})

const Personal      = models.Personal      || model('Personal', PersonalSchema)
const Experience    = models.Experience    || model('Experience', ExperienceSchema)
const Education     = models.Education     || model('Education', EducationSchema)
const Project       = models.Project       || model('Project', ProjectSchema)
const Certification = models.Certification || model('Certification', CertificationSchema)
const Award         = models.Award         || model('Award', AwardSchema)
const Reference     = models.Reference     || model('Reference', ReferenceSchema)
const SkillSection  = models.SkillSection  || model('SkillSection', SkillSectionSchema)

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { dbName: 'portfolio' })
    console.log('✅ Connected\n')

    // Limpiar colecciones
    await Promise.all([
        Personal.deleteMany({}),
        Experience.deleteMany({}),
        Education.deleteMany({}),
        Project.deleteMany({}),
        Certification.deleteMany({}),
        Award.deleteMany({}),
        Reference.deleteMany({}),
        SkillSection.deleteMany({}),
    ])
    console.log('🗑️  Collections cleared\n')

    // ── Personal (myself) ──────────────────────────────────────────────────────
    const myselfFiles = getLocaleFiles(join(CONTENT, 'myself'))
    for (const file of myselfFiles) {
        const raw = readFileSync(join(CONTENT, 'myself', file), 'utf-8')
        const { data, body } = parseFrontmatter(raw)
        const locale = getLocale(file)

        // Extraer h3 y bio del body
        const h3Match = body.match(/<h3[^>]*>(.*?)<\/h3>/s)
        const bioHtml = h3Match ? h3Match[0] : ''
        const bio = body.replace(/<h3[^>]*>.*?<\/h3>/s, '').trim()

        await Personal.create({ locale, ...data, bio, bioHtml })
        console.log(`👤 Personal [${locale}] → ${data.name}`)
    }

    // ── Experience ─────────────────────────────────────────────────────────────
    const expFiles = getLocaleFiles(join(CONTENT, 'experience'))
    for (const file of expFiles) {
        const raw = readFileSync(join(CONTENT, 'experience', file), 'utf-8')
        const { data, body } = parseFrontmatter(raw)
        const locale = getLocale(file)
        const slug = getSlug(file)
        const bullets = parseBullets(body)

        await Experience.create({ locale, slug, ...data, bullets, priority: 0 })
        console.log(`💼 Experience [${locale}] → ${data.name}`)
    }

    // ── Education ──────────────────────────────────────────────────────────────
    const eduFiles = getLocaleFiles(join(CONTENT, 'education'))
    for (const file of eduFiles) {
        const raw = readFileSync(join(CONTENT, 'education', file), 'utf-8')
        const { data, body } = parseFrontmatter(raw)
        const locale = getLocale(file)
        const slug = getSlug(file)
        const bullets = parseBullets(body)

        await Education.create({ locale, slug, ...data, bullets })
        console.log(`🎓 Education [${locale}] → ${data.name}`)
    }

    // ── Projects ───────────────────────────────────────────────────────────────
    const projFiles = getLocaleFiles(join(CONTENT, 'projects'))
    for (const file of projFiles) {
        const raw = readFileSync(join(CONTENT, 'projects', file), 'utf-8')
        const { data, body } = parseFrontmatter(raw)
        const locale = getLocale(file)
        const slug = getSlug(file)
        const bullets = parseBullets(body)

        // icons viene como array en frontmatter YAML — parseo manual
        const iconsMatch = raw.match(/icons:\n([\s\S]*?)(?=\w|\n---)/m)
        const icons = iconsMatch
            ? iconsMatch[1].split('\n').filter(l => l.trim().startsWith('- ')).map(l => l.replace('  - ', '').trim())
            : []

        await Project.create({ locale, slug, name: data.name, icons, bullets, priority: data.priority || 0 })
        console.log(`🚀 Project [${locale}] → ${data.name}`)
    }

    // ── Certifications (sin locale) ────────────────────────────────────────────
    const certDir = join(CONTENT, 'certifications')
    const certFiles = readdirSync(certDir).filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.includes('.en.') && !f.includes('.es.'))
    for (const file of certFiles) {
        const raw = readFileSync(join(certDir, file), 'utf-8')
        const { data } = parseFrontmatter(raw)

        await Certification.create({
            mentorship: data.mentorship,
            title: data.title,
            year: data.year,
            website: data.website || '',
            priority: 0,
        })
        console.log(`📜 Certification → ${data.title}`)
    }

    // ── Awards ─────────────────────────────────────────────────────────────────
    const awardFiles = getLocaleFiles(join(CONTENT, 'awards'))
    for (const file of awardFiles) {
        const raw = readFileSync(join(CONTENT, 'awards', file), 'utf-8')
        const { data, body } = parseFrontmatter(raw)
        const locale = getLocale(file)
        const slug = getSlug(file)
        const bullets = parseBullets(body)

        await Award.create({ locale, slug, name: data.name, bullets })
        console.log(`🏆 Award [${locale}] → ${data.name}`)
    }

    // ── References (sin locale — mismos para ambos idiomas) ───────────────────
    const refDir = join(CONTENT, 'references')
    const refFiles = readdirSync(refDir).filter(f =>
        (f.endsWith('.yaml') || f.endsWith('.yml')) && !f.startsWith('_')
    )
    for (const file of refFiles) {
        const raw = readFileSync(join(refDir, file), 'utf-8')
        // Parseo simple de YAML plano (key: value)
        const data = {}
        raw.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':')
            if (key && rest.length) {
                data[key.trim()] = rest.join(':').trim().replace(/^['"]|['"]$/g, '')
            }
        })
        await Reference.create({
            name: data.name,
            title: data.title,
            company: data.company,
            email: data.email || '',
            phone: data.phone || '',
            priority: Number(data.priority) || 0,
        })
        console.log(`👥 Reference → ${data.name}`)
    }

    // ── Skills ─────────────────────────────────────────────────────────────────
    // Las skills están en skillsection1.md — parseo manual por sección
    const skillFile = join(CONTENT, 'skillsection', 'skillsection1.md')
    const skillRaw = readFileSync(skillFile, 'utf-8')
    const skillBody = skillRaw.replace(/^---[\s\S]*?---\n/, '').replace(/<!--[\s\S]*?-->/g, '').trim()

    let priority = 0
    const sections = skillBody.split('\n\n').filter(s => s.trim())
    for (const section of sections) {
        const lines = section.split('\n').filter(l => l.trim())
        const titleLine = lines.find(l => l.startsWith('**') && l.endsWith('**:'))
        if (!titleLine) continue
        const title = titleLine.replace(/\*\*/g, '').replace(':', '').trim()
        const itemsLine = lines.find(l => l.startsWith('- '))
        const items = itemsLine ? itemsLine.replace('- ', '').split(', ').map(s => s.trim()) : []

        await SkillSection.create({ title, items, priority: priority++ })
        console.log(`🛠️  Skills → ${title} (${items.length} items)`)
    }

    console.log('\n✅ Seed completed successfully!')
    await mongoose.disconnect()
}

seed().catch(err => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})
