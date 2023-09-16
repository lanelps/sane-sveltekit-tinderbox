import { client, getImageProps } from '~utils/sanity.server';
import { links } from '~utils/groq';

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
			seo: {
				...settings.seo,
				favicon: {
					url: getImageProps({
						image: settings.seo.favicon,
						maxWidth: 512
					})
				},
				image: {
					url: getImageProps({
						image: settings.seo.image,
						maxWidth: 1920
					})
				}
			}
		}
	};
};
