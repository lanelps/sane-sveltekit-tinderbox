import { client } from '~utils/sanity.server';
import { links } from '~utils/groq';

export const load = async () => {
	const data = await client.fetch(
		`*[_type == "settings"][0] {
            menu {
                links[] {
                    ${links}
                }
            },
            seo,
            scripts,
            redirects,
        }`
	);

	if (data) {
		return data;
	}

	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
};
