import { parseSections } from '~utils/data.server';
import { fetchHome } from '~utils/queries.server';

export const load = async () => {
	try {
		const data = await fetchHome();

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
