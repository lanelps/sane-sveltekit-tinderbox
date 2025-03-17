import { error } from '@sveltejs/kit';
import { fetchProjects } from '$lib/utils/data.server';

import type { ProjectsPageData } from '$lib/types';
import type { PageServerLoad } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: PageServerLoad = async ({
	locals: { loadQuery }
}): Promise<{ initial: QueryResponseInitial<ProjectsPageData>; seo: { title: 'Projects' } }> => {
	try {
		const initial = await fetchProjects(loadQuery);

		return { initial, seo: { title: 'Projects' } };
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
