import { defineCollection, getCollection, z } from 'astro:content'

const schema = z.object({
    mentorship: z.string(),
    title: z.string(),
    year: z.number().int().gte(1).lte(12),
    website: z.string().url().optional(),
})

export const ExperienceCollection = defineCollection({ schema, type: 'content' })

export type ExperienceType = z.infer<typeof schema>

export async function getCertifications() {
	let items = await getCollection('certifications')

    items.sort((a, b) => {
        const startA = new Date(a.data.startYear, a.data.startMonth + 1)
        const startB = new Date(b.data.startYear, b.data.startMonth + 1)
        return startB.valueOf() - startA.valueOf()
    })

	return items
}
