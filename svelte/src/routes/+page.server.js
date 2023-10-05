import { parseSections } from '~utils/data.server';
import { fetchHome } from '~utils/queries.server';

export const load = async () => {
	const data = await fetchHome();

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
