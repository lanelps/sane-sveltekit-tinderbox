import { links, sections } from '~utils/groq.server';
import { client } from '~utils/sanity.server';

export const fetchHome = async () =>
	client.fetch(
		`*[_type == "page" && slug.current == "/"][0] {
            title,
            slug {
                current
            },
            ${sections}
        }`
	);

export const fetchSettings = async () =>
	client.fetch(
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

export const fetchPage = async (slug) =>
	client.fetch(
		`*[_type == "page" && slug.current == $slug][0] {
            title,
            slug {
                current
            },
            ${sections}
        }`,
		{ slug }
	);
