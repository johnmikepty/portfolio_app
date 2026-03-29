import { defineCollection, getCollection, z } from 'astro:content'
import type { Locale } from '@/i18n'

const schema = z.object({
    name: z.string(),
    degree: z.string(),
    subject: z.string().optional(),
    year: z.number(),
    url: z.string().url().optional(),
    image: z.string().optional(),
})

export const EducationCollection = defineCollection({ schema, type: 'content' })
export type EducationType = z.infer<typeof schema>

export async function getEducation(locale: Locale = 'en') {
    const items = await getCollection('education', ({ id }) =>
        id.endsWith(`.${locale}.md`) && !id.startsWith('_')
    )
    items.sort((a, b) => b.data.year - a.data.year)
    return items
}
