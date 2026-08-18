// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-menu.com',
	trailingSlash: 'never',
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			lastmod: new Date(),
			filter: (page) => !/\/(privacy|terms)$/.test(page),
			serialize(item) {
				if (item.url === 'https://astro-menu.com/') item.priority = 1.0
				else if (/\/(pricing|demo|features|how-it-works)$/.test(item.url)) item.priority = 0.9
				else if (/\/blog\//.test(item.url)) item.priority = 0.6
				else item.priority = 0.7
				return item
			}
		})
	],
	image: {
		// Every screenshot ships as WebP at a known width, so the browser can
		// reserve the box before the bytes land.
		responsiveStyles: true,
		layout: 'constrained'
	},
	vite: {
		plugins: [tailwindcss()]
	}
})
