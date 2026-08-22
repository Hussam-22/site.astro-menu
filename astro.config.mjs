// @ts-check
import { readdirSync, readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

const BLOG_DIR = new URL('./src/content/blog/', import.meta.url)

/**
 * Real per-page dates for the sitemap's <lastmod>, read out of the blog
 * frontmatter.
 *
 * This used to be a blanket `lastmod: new Date()`, which stamped every URL
 * with the build time — so a post untouched since March claimed to have
 * changed on whatever day the site last deployed. Google stops trusting
 * lastmod across a whole site once it catches that, which costs more than
 * having no dates at all. So only pages whose real date we can prove get one:
 * the posts, from their own frontmatter, and the two blog indexes, from the
 * newest post they list. The marketing pages ship with no lastmod, because a
 * build machine's checkout has no honest answer — file mtimes are the clone
 * time and the git history may be shallow.
 *
 * Returns a Map of pathname -> Date, e.g. "/blog/how-to-make-a-qr-code-menu".
 */
function postDates() {
	const dates = new Map()

	const walk = (dir, id = '') => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				walk(new URL(`${entry.name}/`, dir), `${id}${entry.name}/`)
				continue
			}
			if (!/\.mdx?$/.test(entry.name)) continue

			const source = readFileSync(new URL(entry.name, dir), 'utf8')
			const frontmatter = source.slice(0, source.indexOf('\n---', 3))
			const field = (key) =>
				frontmatter.match(new RegExp(`^${key}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1]

			// updatedDate is what <lastmod> means; publishDate is the fallback.
			const date = field('updatedDate') ?? field('publishDate')
			if (!date) continue

			// Collection ids mirror the routes: "foo" renders at /blog/foo and
			// "ar/foo" at /ar/blog/foo.
			const slug = `${id}${entry.name.replace(/\.mdx?$/, '')}`
			const path = slug.startsWith('ar/') ? `/ar/blog/${slug.slice(3)}` : `/blog/${slug}`
			dates.set(path, new Date(date))
		}
	}
	walk(BLOG_DIR)

	// An index page is exactly as fresh as the newest post on it.
	for (const index of ['/blog', '/ar/blog']) {
		const newest = [...dates]
			.filter(([path]) => path.startsWith(`${index}/`))
			.map(([, date]) => date)
			.sort((a, b) => b.valueOf() - a.valueOf())[0]
		if (newest) dates.set(index, newest)
	}

	return dates
}

const LASTMOD = postDates()

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-menu.com',
	trailingSlash: 'never',
	i18n: {
		locales: ['en', 'ar'],
		defaultLocale: 'en',
		routing: { prefixDefaultLocale: false }
	},
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			// The 404 routes carry noindex, so listing them only earns an
			// "excluded by noindex" error in the Pages report. Astro drops /404
			// on its own but not /ar/404, so match both.
			//
			// /privacy and /terms used to be excluded here. They are ordinary
			// indexable pages that a SaaS buyer goes looking for, so they stay in.
			filter: (page) => !/\/404\/?$/.test(page),
			serialize(item) {
				const path = new URL(item.url).pathname.replace(/\/$/, '') || '/'

				// Only set a date we can actually stand behind — see postDates().
				const lastmod = LASTMOD.get(path)
				if (lastmod) item.lastmod = lastmod.toISOString()
				else delete item.lastmod

				if (path === '/') item.priority = 1.0
				else if (/^\/(ar\/)?(pricing|demo|features|how-it-works)$/.test(path)) item.priority = 0.9
				else if (path.includes('/blog/')) item.priority = 0.6
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
