const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [`'Plus Jakarta Sans Variable', sans-serif`, ...defaultTheme.fontFamily.sans]
			},
			borderRadius: {
				xxl: '2.5rem',
				'4xl': '2rem'
			},
			fontSize: {
				// Display scale for the hero and section headings.
				'display-sm': ['3rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
				display: ['4.25rem', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
				'display-lg': ['5.75rem', { lineHeight: '0.94', letterSpacing: '-0.04em' }]
			},
			colors: {
				brand: 'rgb(var(--c-brand) / <alpha-value>)',
				brandInk: 'rgb(var(--c-brand-ink) / <alpha-value>)',
				brandOn: 'rgb(var(--c-brand-on) / <alpha-value>)',
				brandDeep: 'rgb(var(--c-brand-deep) / <alpha-value>)',
				// Kept as aliases so existing markup does not break.
				secondary: 'rgb(var(--c-brand) / <alpha-value>)',
				accent: 'rgb(var(--c-brand) / <alpha-value>)',
				page: 'rgb(var(--c-page) / <alpha-value>)',
				ink: 'rgb(var(--c-ink) / <alpha-value>)',
				muted: 'rgb(var(--c-muted) / <alpha-value>)',
				card: 'rgb(var(--c-card) / <alpha-value>)',
				'card-ink': 'rgb(var(--c-card-ink) / <alpha-value>)',
				invert: 'rgb(var(--c-invert) / <alpha-value>)',
				'invert-ink': 'rgb(var(--c-invert-ink) / <alpha-value>)',
				line: 'rgb(var(--c-line) / <alpha-value>)'
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
				astro: {
					primary: '#CB3044',
					'primary-content': '#ffffff',
					secondary: '#B2F0C7',
					'secondary-content': '#0c0c0e',
					accent: '#D6C7F8',
					'accent-content': '#0c0c0e',
					neutral: '#0c0c0e',
					'neutral-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f6f6f8',
					'base-300': '#e2e2e8',
					'base-content': '#0c0c0e'
				}
			}
		],
		logs: false
	}
}
