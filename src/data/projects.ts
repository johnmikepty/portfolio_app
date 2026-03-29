import { defineCollection, getCollection, z } from 'astro:content'
import { sortByPriority } from '@/util'
import type { Locale } from '@/i18n'

const schema = z.object({
    name: z.string(),
    icons: z.array(z.string()).optional(),
    priority: z.number().optional(),
})

export const ProjectCollection = defineCollection({ schema, type: 'content' })
export type ProjectType = z.infer<typeof schema>

export async function getProjects(locale: Locale = 'en') {
    const items = await getCollection('projects', ({ id }) =>
        id.endsWith(`.${locale}.md`) && !id.startsWith('_')
    )
    items.sort(sortByPriority)
    return items
}
