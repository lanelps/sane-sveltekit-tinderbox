import { parseSEO } from '../utils/data.server';
import { links } from '~utils/groq.server';
import { client } from '~utils/sanity.server';

export const load = async () => {
	const settings = await client.fetch(
		`*[_type == "settings"][0] {
            menu {
                links[] {
                    ${links}
                }
            },
            seo {
				title,
				description,
				favicon {
					asset {
						_ref
					}
				},
				image {
					asset {
						_ref
					}
				}
			},
            scripts,
            redirects,
        }`
	);

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
