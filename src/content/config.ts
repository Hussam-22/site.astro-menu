// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content'

// 2. Define your collection(s)
const blogCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			draft: z.boolean(),
			title: z.string(),
			snippet: z.string(),
			image: z.object({
				src: image().refine((img) => img.width >= 200, {
					message: 'Cover image must be at least 1080 pixels wide!'
				}),
				alt: z.string()
			}),
			publishDate: z.string().transform((str) => new Date(str)),
			author: z.string().default('Astro-Menu'),
			category: z.string(),
			tags: z.array(z.string())
		})
})

const docsCollection = defineCollection({
	schema: z.object({
		draft: z.boolean(),
		title: z.string(),
		snippet: z.string(),
		extraText: z.string().optional(),
		icon: z.string(),
		image: z.object({
			src: z.string(),
			alt: z.string()
		}),
		publishDate: z.string().transform((str) => new Date(str)),
		author: z.string().default('Astro-Menu'),
		category: z.string(),
		tags: z.array(z.string()),
		order: z.number()
	})
})

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	blog: blogCollection,
	docs: docsCollection
}
