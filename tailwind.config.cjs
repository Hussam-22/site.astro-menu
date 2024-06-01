/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
	darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Bricolage Grotesque Variable',
					'Inter Variable',
					'Inter',
					...defaultTheme.fontFamily.sans
				]
			}
		}
	},
	daisyui: {
		themes: ['business', 'cupcake']
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwindcss-animated'),
		require('tailwindcss-intersect'),
		require('daisyui')
	]
}
