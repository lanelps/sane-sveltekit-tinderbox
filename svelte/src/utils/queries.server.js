import { links, sections } from '~utils/groq.server';
import { client } from '~utils/sanity.server';

export const fetchHome = async () => {
	const home = client.fetch(
		`*[_type == "page" && slug.current == "/"][0] {
            title,
            slug {
                current
            },
            ${sections}
        }`
	);

	if (!home) throw new Error('Erorr fetching home data');

	return home;
};

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
