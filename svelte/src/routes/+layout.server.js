import { parseSEO } from '~utils/data.server';
import { fetchSettings } from '~utils/queries.server';

export const load = async () => {
	try {
		const settings = await fetchSettings();

		return {
			settings: {
				...settings,
				seo: parseSEO(settings?.seo)
			}
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: new Error('Internal Server Error')
		};
	}
};
