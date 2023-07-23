import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		}),
		alias: {
			'~assets': path.resolve('./src/assets'),
			'~components': path.resolve('./src/components'),
			'~stores': path.resolve('./src/stores'),
			'~utils': path.resolve('./src/utils')
		}
	}
};

export default config;
