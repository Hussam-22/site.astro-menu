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
		themes: [
			{
				cupcake: {
					...require('daisyui/src/theming/themes')['cupcake'],
					'base-100': '#FFFFFF',
					'base-content': '#000000',
					primary: '#FB7185',
					secondary: '#000000'
				}
			},
			{
				business: {
					...require('daisyui/src/theming/themes')['business'],
					primary: '#FB7185',
					secondary: '#000000'
				}
			}
		]
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwindcss-animated'),
		require('tailwindcss-intersect'),
		require('daisyui')
	]
}
