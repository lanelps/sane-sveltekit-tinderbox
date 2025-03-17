import { fetchHomePage } from '$lib/utils/data.server';
import { error } from '@sveltejs/kit';

import type { HomePageData } from '$lib/types';
import type { PageServerLoad, RouteParams } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: PageServerLoad = async ({
	params,
	locals: { loadQuery }
}): Promise<{ params: RouteParams; initial: QueryResponseInitial<HomePageData> }> => {
	try {
		const initial = await fetchHomePage(loadQuery);

		return { initial, params };
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
