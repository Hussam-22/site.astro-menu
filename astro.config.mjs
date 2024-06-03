import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
// import iconify from 'astro-iconify'

// https://astro.build/config
export default defineConfig({
	site: 'https://astroship.web3templates.com',
	integrations: [tailwind(), mdx(), sitemap(), icon()]
})
