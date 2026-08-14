import { z, defineCollection } from 'astro:content'

const blogCollection = defineCollection({
	schema: z.object({
		draft: z.boolean().default(false),
		title: z.string(),
		description: z.string(),
		publishDate: z.string().transform((str) => new Date(str)),
		updatedDate: z
			.string()
			.transform((str) => new Date(str))
			.optional(),
		author: z.string().default('Astro-Menu'),
		category: z.string(),
		tags: z.array(z.string())
	})
})

export const collections = {
	blog: blogCollection
}
