import { fetchHomePage } from '$lib/utils/queries.server';
import { error } from '@sveltejs/kit';
import type { HomePageData } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<HomePageData> => {
	try {
		const data = await fetchHomePage();

		return data;
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
