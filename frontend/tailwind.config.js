const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			},
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				tertiary: 'var(--color-tertiary)',
				faded: 'var(--color-btnFade)',
				background: 'var(--color-background)',
				'surface-100': 'var(--color-surface-100)',
				'surface-200': 'var(--color-surface-200)',
				'surface-300': 'var(--color-surface-300)',
				'surface-400': 'var(--color-surface-400)',
				text: 'var(--color-text)',
				highlight: 'var(--color-highlight)',
				disabled: 'var(--color-disabled)',
				error: 'var(--color-error)'
			},
			boxShadow: {
				chatPanel: 'inset 0px 0px 10px 5px rgba(0,0,0,0.2)'
			},
			dropShadow: {
				custom: 'var(--shadow-custom)'
			}
		}
	},
	darkMode: 'class',
	plugins: [nextui()]
}
