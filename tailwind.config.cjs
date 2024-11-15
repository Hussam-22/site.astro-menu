const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
	darkMode: 'selector',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
<<<<<<< HEAD
				sans: ['"Jost Variable", sans-serif', ...defaultTheme.fontFamily.sans]
=======
				sans: [`'Plus Jakarta Sans Variable', sans-serif`, ...defaultTheme.fontFamily.sans]
>>>>>>> staging
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
					'font-weight': '300'
				}
			},
			'fantasy'
		]
	}
}
