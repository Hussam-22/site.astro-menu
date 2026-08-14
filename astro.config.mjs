import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-menu.com',
	trailingSlash: 'never',
	integrations: [
		tailwind(),
		mdx(),
		sitemap({
			changefreq: 'weekly',
			lastmod: new Date(),
			serialize(item) {
				if (item.url === 'https://astro-menu.com/') item.priority = 1.0
				else if (/\/(pricing|qr-menu|features|how-it-works)$/.test(item.url)) item.priority = 0.9
				else if (/\/(blog|terms|privacy)/.test(item.url)) item.priority = 0.5
				else item.priority = 0.7
				return item
			}
		})
	],
	vite: {
		// Declaring postcss inline stops the config search from walking above the project
		// root. @astrojs/tailwind appends its plugin to this object.
		css: { postcss: { plugins: [] } },
		// Same reason: esbuild's dep scanner reads package.json files up the tree, which
		// hangs when a parent checkout has one it cannot parse.
		optimizeDeps: { exclude: ['tailwindcss-intersect'] }
	}
})
