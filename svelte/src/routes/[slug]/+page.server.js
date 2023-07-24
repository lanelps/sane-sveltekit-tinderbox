import { client, getImageProps } from '~utils/sanity.server';
import { sections } from '~utils/groq';

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
			sections: data?.sections?.map((section) => {
				if (section?.image) {
					return {
						...section,
						image: {
							...section.image,
							url: getImageProps({
								image: section.image,
								maxWidth: 1920
							})
						}
					};
				}

				return section;
			})
		};
	}

	return {
		status: 500,
		body: new Error('Internal Server Error')
	};
};
