import { parseSection } from '~utils/data.server';
import { sections } from '~utils/groq.server';
import { client } from '~utils/sanity.server';

export const load = async ({ params }) => {
	const data = await client.fetch(
		`*[_type == "page" && slug.current == $slug][0] {
		title,
		slug {
            current
        },
		${sections}
	}`,
		{ slug: params?.slug }
	);

	if (data) {
		return {
			...data,
			sections: parseSection(data?.sections)
		};
	}

	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
};
