import { parseSEO } from '~utils/data.server';
import { fetchSettings } from '~utils/queries.server';

export const load = async () => {
	const settings = await fetchSettings();

	if (!settings) {
		return {
			status: 500,
			body: new Error('Internal Server Error')
		};
	}

	return {
		settings: {
			...settings,
			seo: parseSEO(settings?.seo)
		}
	};
};
