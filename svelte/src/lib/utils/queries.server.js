import { links, sections } from '$lib/utils/groq.server';
import { client } from '$lib/utils/sanity.server';

export const fetchSettings = async () => {
	const settings = client.fetch(
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

	if (!settings) throw new Error('Error fetching settings data');

	return settings;
};

export const fetchPage = async (slug) => {
	const page = client.fetch(
		`*[_type == "page" && slug.current == $slug][0] {
            title,
            slug {
                current
            },
            ${sections}
        }`,
		{ slug }
	);

	if (!page) throw new Error('Error fetching page data');

	return page;
};
