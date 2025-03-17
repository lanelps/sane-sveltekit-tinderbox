import { error } from '@sveltejs/kit';

import { fetchSettings, fetchSite } from '$lib/utils/data.server';

import type { SiteData, SettingsData } from '$lib/types';
import type { LayoutServerLoad, LayoutParams } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: LayoutServerLoad = async ({
	params,
	locals: { preview, loadQuery }
}): Promise<{
	params: LayoutParams;
	initialSite: QueryResponseInitial<SiteData>;
	initialSettings: QueryResponseInitial<SettingsData>;
	preview: boolean;
}> => {
	try {
		const [initialSite, initialSettings] = await Promise.all([
			fetchSite(loadQuery),
			fetchSettings(loadQuery)
		]);

		return {
			initialSite,
			initialSettings,
			preview,
			params
		};
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
