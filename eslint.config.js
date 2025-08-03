import js from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,

	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		languageOptions: {
			globals: globals.browser,
		},
	},
	{
		files: ['**/*.astro'],
		languageOptions: {
			globals: globals.browser,
		},
	},

	{
		files: ['**/*.config.{js,ts}', '**/scripts/**/*.{js,ts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
		...jsxA11y.flatConfigs.recommended,
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	{
		ignores: [
			'.astro/',
			'dist/',
			'node_modules/',
			'.gitignore',
			'.vercel/**/*',
			'**/*.mjs',
			'**/chunks/**/*',
			'**/_functions/**/*',
			'**/static/_astro/**/*',
		],
	},
]
