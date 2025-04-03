import { error } from '@sveltejs/kit';
import { fetchProject } from '$lib/utils/data.server';

import type { ProjectData } from '$lib/types';
import type { PageServerLoad } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: PageServerLoad = async ({
	params,
	locals: { loadQuery }
}): Promise<{ initial: QueryResponseInitial<ProjectData>; seo: { title: string } }> => {
	try {
		const initial = await fetchProject(loadQuery, { slug: params.slug });

		return { initial, seo: { title: initial?.data?.seo?.title || initial.data.title } };
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
