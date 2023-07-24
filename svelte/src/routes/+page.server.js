import { client, getImageProps } from '~utils/sanity.server';
import { sections } from '~utils/groq';

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
