import { defineCollection, getCollection, z } from 'astro:content'
import type { Locale } from '@/i18n'

const schema = z.object({
    name: z.string(),
    title: z.string(),
    email: z.string(),
    phone: z.string(),
    linkedin: z.string(),
    github: z.string(),
    website: z.string(),
    location: z.string(),
})

export const MySelfCollection = defineCollection({ schema, type: 'content' })
export type MySelfType = z.infer<typeof schema>

export async function getMySelf(locale: Locale = 'en') {
    const items = await getCollection('myself', ({ id }) =>
        id.endsWith(`.${locale}.md`) && !id.startsWith('_')
    )
    if (items.length > 0) return items[0].data
    // fallback to English
    const fallback = await getCollection('myself', ({ id }) => id.endsWith('.en.md') && !id.startsWith('_'))
    return fallback[0].data
}

export async function getMySelfSlug(locale: Locale = 'en') {
    const items = await getCollection('myself', ({ id }) =>
        id.endsWith(`.${locale}.md`) && !id.startsWith('_')
    )
    if (items.length > 0) return items[0].slug
    const fallback = await getCollection('myself', ({ id }) => id.endsWith('.en.md') && !id.startsWith('_'))
    return fallback[0].slug
}
