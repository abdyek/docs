// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
	site: 'https://docs.umono.dev',
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Umono',
			description: 'Documentation of Umono, the vendor lock-in killer CMS.',
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/umono-cms' }],
			editLink: {
				baseUrl: 'https://github.com/umono-cms/docs/edit/main/',
			},
			customCss: [
				'@fontsource-variable/inter',
				'@fontsource/iosevka/400.css',
				'@fontsource/iosevka/400-italic.css',
				'@fontsource/iosevka/700.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{ label: 'Introduction', link: '/' },
				{ label: 'Getting Started', items: [{ autogenerate: { directory: 'getting-started' } }] },
			],
			plugins: [starlightLinksValidator()],
		}),
	],
});
