import { fetchHomePage } from '$lib/utils/data.server';
import { error } from '@sveltejs/kit';

import type { HomePageData } from '$lib/types';
import type { PageServerLoad } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: PageServerLoad = async ({
	locals: { loadQuery }
}): Promise<{ initial: QueryResponseInitial<HomePageData> }> => {
	try {
		const initial = await fetchHomePage(loadQuery);

		return { initial };
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
