import { error } from '@sveltejs/kit';
import { fetchProjects } from '$lib/utils/queries.server';
import { parseProjectList } from '$lib/utils/data.server';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	try {
		const projects = await fetchProjects();
		return { title: 'Projects', projects: parseProjectList(projects) };
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
