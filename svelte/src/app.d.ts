import type { LoaderLocals } from '@sanity/svelte-loader';

declare global {
	let __LOADED_IMAGES__: Set<string> | undefined;

	namespace App {
		interface Locals extends LoaderLocals {}
	}
}

export {};
