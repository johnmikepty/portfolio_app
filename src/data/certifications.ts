import { defineCollection, getCollection, z } from 'astro:content'
import type { Locale } from '@/i18n'

const schema = z.object({
    mentorship: z.string(),
    title: z.string(),
    year: z.number(),
    website: z.string().url().optional(),
})

export const CertificationCollection = defineCollection({ schema, type: 'content' })
export type CertificationType = z.infer<typeof schema>

export async function getCertifications(_locale: Locale = 'en') {
    // Certifications have no translated content — load files without locale suffix
    const items = await getCollection('certifications', ({ id }) =>
        !id.startsWith('_') && !id.includes('.en.') && !id.includes('.es.')
    )
    items.sort((a, b) => b.data.year - a.data.year)
    return items
}
