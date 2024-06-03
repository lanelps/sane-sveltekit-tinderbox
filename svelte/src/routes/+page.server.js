import { parseSections } from '$lib/utils/data.server';
import { fetchPage } from '$lib/utils/queries.server';

export const load = async () => {
	try {
		const data = await fetchPage('/');

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
