import { parseSections } from '$lib/utils/data.server';
import { fetchProject } from '$lib/utils/queries.server';
import { error } from '@sveltejs/kit';
import type { ProjectData, ParsedSection } from '$lib/types';
import type { PageServerLoad } from './$types';

type ReturnedData = Omit<ProjectData, 'sections'> & {
	sections: ParsedSection[];
};

export const load: PageServerLoad = async ({ params }): Promise<ReturnedData> => {
	// if we load the home page, return
	// if (params.slug === 'favicon.ico') return;

	try {
		const data = await fetchProject(params.slug);

		return {
			...data,
			sections: parseSections(data?.sections)
		};
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
