/**
 * src/lib/profile.ts
 * Capa de servicio — todas las queries a MongoDB para el portfolio.
 * Reemplaza los getCollection() de Astro content.
 */

import { connectDB } from './mongodb'
import { Personal } from './models/Personal'
import { Experience } from './models/Experience'
import { Education } from './models/Education'
import { Project } from './models/Project'
import { Certification } from './models/Certification'
import { Award } from './models/Award'
import { Reference } from './models/Reference'
import { SkillSection } from './models/SkillSection'
import type { Locale } from '@/i18n'

// ─── Personal ────────────────────────────────────────────────────────────────

export async function getPersonal(locale: Locale = 'en') {
    await connectDB()
    const doc = await Personal.findOne({ locale }).lean()
    if (!doc) throw new Error(`Personal data not found for locale: ${locale}`)
    return doc
}

// ─── Experience ──────────────────────────────────────────────────────────────

export async function getExperienceDB(locale: Locale = 'en') {
    await connectDB()
    const docs = await Experience.find({ locale })
        .sort({ startYear: -1, startMonth: -1 })
        .lean()
    return docs
}

// ─── Education ───────────────────────────────────────────────────────────────

export async function getEducationDB(locale: Locale = 'en') {
    await connectDB()
    const docs = await Education.find({ locale })
        .sort({ year: -1 })
        .lean()
    return docs
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjectsDB(locale: Locale = 'en') {
    await connectDB()
    const docs = await Project.find({ locale })
        .sort({ priority: -1 })
        .lean()
    return docs
}

// ─── Certifications (sin locale) ─────────────────────────────────────────────

export async function getCertificationsDB() {
    await connectDB()
    const docs = await Certification.find()
        .sort({ year: -1, priority: -1 })
        .lean()
    return docs
}

// ─── Awards ──────────────────────────────────────────────────────────────────

export async function getAwardsDB(locale: Locale = 'en') {
    await connectDB()
    const docs = await Award.find({ locale })
        .sort({ name: 1 })
        .lean()
    return docs
}

// ─── References (sin locale) ─────────────────────────────────────────────────

export async function getReferencesDB() {
    await connectDB()
    const docs = await Reference.find()
        .sort({ priority: 1 })
        .lean()
    return docs
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getSkillSectionsDB() {
    await connectDB()
    const docs = await SkillSection.find()
        .sort({ priority: 1 })
        .lean()
    return docs
}
