import { parseSections } from '~utils/data.server';
import { sections } from '~utils/groq.server';
import { client } from '~utils/sanity.server';

export const load = async () => {
	const data = await client.fetch(
		`*[_type == "page" && slug.current == "/"][0] {
		title,
		slug {
            current
        },
		${sections}
	}`
	);

	if (data) {
		return {
			...data,
			sections: parseSections(data?.sections)
		};
	}

	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
};
