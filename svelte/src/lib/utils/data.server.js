import { getImageProps } from '$lib/utils/sanity.server';

export const parseSections = (sections) =>
	sections?.map((section) => {
		// Image Section
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
	});

export const parseSEO = (seo) => ({
	...seo,
	favicon: {
		url: getImageProps({
			image: seo.favicon,
			maxWidth: 512
		})
	},
	image: {
		url: getImageProps({
			image: seo.image,
			maxWidth: 1920
		})
	}
});
