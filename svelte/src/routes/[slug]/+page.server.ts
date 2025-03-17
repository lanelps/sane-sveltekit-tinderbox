import { error } from '@sveltejs/kit';
import { fetchPage } from '$lib/utils/data.server';

import type { PageData } from '$lib/types';
import type { PageServerLoad } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: PageServerLoad = async ({
	params,
	locals: { loadQuery }
}): Promise<{ initial: QueryResponseInitial<PageData>; seo: { title: string } }> => {
	// if we load the home page, return (ignore this for now)
	// if (params.slug === 'favicon.ico') return;

	try {
		const initial = await fetchPage(loadQuery, params.slug);

		return { initial, seo: { title: initial?.data?.seo?.title || initial.data.title } };
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
