import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';

import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2022-01-12',
	useCdn: false
});

const imageBuilder = imageUrlBuilder(client);

export const getImageDimensions: GetImageDimensions = (image) => {
	if (!image?.asset?._ref) {
		throw new Error(`getImageDimensions: image.asset._ref is undefined`);
	}

	const dimensions = image?.asset?._ref?.split('-')[2];
	const [width, height] = dimensions.split('x').map(Number);

	if (!width || !height || Number.isNaN(width) || Number.isNaN(height)) {
		throw new Error(`getImageDimensions: Image width or height is either undefined or NaN`);
	}

	return {
		width,
		height,
		aspectRatio: width / height
	};
};

const LARGEST_VIEWPORT = 1920;

const DEFAULT_MIN_STEP = 0.1;
const DEFAULT_WIDTH_STEPS = [400, 600, 850, 1000, 1150];
const DEFAULT_FULL_WIDTH_STEPS = [360, 414, 768, 1280, 1366, 1440, 1536, 1728, 1920];

export const getImageProps: GetImageProps = ({
	image,
	maxWidth: userMaxWidth,
	minimumWidthStep = DEFAULT_MIN_STEP,
	customWidthSteps,
	sizes
}) => {
	if (!image?.asset?._ref) throw new Error(`getImageProps: image has no _ref`);

	const imageDimensions = getImageDimensions(image);
	if (!imageDimensions) throw new Error(`getImageDimensions erorr: Could not get image dimensions`);

	const maxWidth = typeof userMaxWidth === 'number' ? userMaxWidth : LARGEST_VIEWPORT;

	// For all image variations, we'll use an auto format and prevent scaling it over its max dimensions
	const builder = imageBuilder.image(image).fit('max').auto('format');

	// Width sizes the image could assume
	const baseSizes = [
		maxWidth,
		...(customWidthSteps ||
			(typeof userMaxWidth === 'number' ? DEFAULT_WIDTH_STEPS : DEFAULT_FULL_WIDTH_STEPS))
	];

	const retinaSizes = Array.from(
		// De-duplicate sizes with a Set
		new Set([
			...baseSizes,
			...baseSizes.map((size) => size * 2),
			...baseSizes.map((size) => size * 3)
		])
	)
		.sort((a, b) => a - b) // Lowest to highest
		.filter(
			(size) =>
				// Exclude sizes 10% or more larger than the image itself. Sizes slightly larger
				// than the image are included to ensure we always get closest to the highest
				// quality for an image. Sanity's CDN won't scale the image above its limits.
				size <= imageDimensions.width * 1.1 &&
				// Exclude those larger than maxWidth's retina (x3)
				size <= maxWidth * 3
		)
		// Exclude those with a value difference to their following size smaller than `minimumWidthStep`
		// This ensures we don't have too many srcSet variations, polluting the HTML
		.filter((size, i, arr) => {
			const nextSize = arr[i + 1];
			if (nextSize) {
				return nextSize / size > minimumWidthStep + 1;
			}

			return true;
		});

	return {
		// Use the original image as the `src` for the <img>
		src: builder.width(maxWidth).url(),

		// Build a `{URL} {SIZE}w, ...` string for the srcset
		srcset: retinaSizes.map((size) => `${builder.width(size).url()} ${size}w`).join(', '),
		sizes:
			userMaxWidth === '100vw'
				? '100vw'
				: sizes || `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`,

		// Let's also tell the browser what's the size of the image so it can calculate aspect ratios
		width: retinaSizes[0],
		height: retinaSizes[0] / imageDimensions?.aspectRatio
	};
};
