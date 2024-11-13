const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
	darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [`'Plus Jakarta Sans Variable', sans-serif`, ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('tailwindcss-animated'),
		require('tailwindcss-intersect'),
		require('daisyui')
	],
	daisyui: {
		themes: [
			{
				business: {
					...require('daisyui/src/theming/themes')['business'],
					primary: '#000000',
					secondary: '#EC5766',
					color: 'black',
					'.text-primary': { color: '#000000' },
					'.text-secondary': { color: '#EC5766' },
					'.rounded-xxl': { borderRadius: '4rem' },
					'font-weight': '300',
					'.menu-title': {
						'font-weight': '200',
						'padding-top': '0.1rem'
					}
				}
			}
		]
	}
}
