import { defineCollection, getCollection, z } from 'astro:content'
import type { Locale } from '@/i18n'

const schema = z.object({
    name: z.string(),
})

export const AwardsCollection = defineCollection({ schema, type: 'content' })
export type AwardType = z.infer<typeof schema>

export async function getAwards(locale: Locale = 'en') {
    const items = await getCollection('awards', ({ id }) =>
        id.endsWith(`.${locale}.md`) && !id.startsWith('_')
    )
    items.sort((a, b) => a.id.localeCompare(b.id))
    return items
}
