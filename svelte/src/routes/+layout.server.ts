import { error } from '@sveltejs/kit';

import { parseSite } from '$lib/utils/data.server';
import { fetchSettings, fetchSite } from '$lib/utils/queries.server';

import type { LayoutData } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (): Promise<LayoutData> => {
	try {
		const [site, settings] = await Promise.all([fetchSite(), fetchSettings()]);

		return {
			site: parseSite(site),
			settings
		};
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
