import { parseSections } from '~utils/data.server';
import { fetchPage } from '~utils/queries.server';

export const load = async ({ params }) => {
	const data = await fetchPage(params.slug);

	if (!data) {
		return {
			status: 500,
			body: new Error('Internal Server Error')
		};
	}

	return {
		...data,
		sections: parseSections(data?.sections)
	};
};
