import { parseSections } from '~utils/data.server';
import { fetchPage } from '~utils/queries.server';

export const load = async ({ params }) => {
	// if we load the home page, return
	if (params.slug === 'favicon.ico') return;

	try {
		const data = await fetchPage(params.slug);

		return {
			...data,
			sections: parseSections(data?.sections)
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: new Error('Internal Server Error')
		};
	}
};
