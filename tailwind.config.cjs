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
					'.rounded-l-xxl': { borderRadius: '4rem 0 0 4rem' },
					'font-weight': '300',
					'.menu-title': {
						'font-weight': '200',
						'padding-top': '0.1rem'
					},
					'.carousel': { background: 'none' },
					'.prose': {
						'max-width': '100%',
						'line-height': '1.4em',
						color: '#d4d4d4',
						'h1,h2': {
							'line-height': '1.0em',
							color: '#EC5766'
						},
						'h3,h4,h5,h6': {
							'line-height': '1.4em',
							color: '#FFFFFF'
						},
						strong: {
							color: '#FFFFFF'
						}
					},
					'.prose-base': {
						'margin-top': '0.5em',
						'margin-bottom': '0.5em',
						'line-height': '1.4em',
						'h1,h2,h3,h4,h5,h6': {
							'line-height': '1.0em'
						},
						li: {
							'line-height': '1.2em'
						},
						'padding-right': '0.25rem',
						'padding-left': '0.25rem'
					}
				}
			}
		]
	}
}
