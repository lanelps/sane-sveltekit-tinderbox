import { parseSections } from '$lib/utils/data.server';
import { fetchPage } from '$lib/utils/queries.server';
import { error } from '@sveltejs/kit';
import type { PageData, ParsedSection } from '$lib/types';
import type { PageServerLoad } from './$types';

type ReturnedData = Omit<PageData, 'sections'> & {
	sections: ParsedSection[];
};

export const load: PageServerLoad = async ({ params }): Promise<ReturnedData> => {
	// if we load the home page, return (ignore this for now)
	// if (params.slug === 'favicon.ico') return;

	try {
		const data = await fetchPage(params.slug);

		return {
			...data,
			sections: parseSections(data?.sections)
		};
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
