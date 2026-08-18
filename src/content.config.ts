import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		draft: z.boolean().default(false),
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		author: z.string().default('Astro-Menu'),
		category: z.string(),
		tags: z.array(z.string())
	})
})

export const collections = { blog }
