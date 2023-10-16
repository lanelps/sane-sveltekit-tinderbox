import { SANITY_PROJECT_ID, SANITY_DATASET } from '$env/static/private';

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: '2023-07-01',
	useCdn: false
});

const imageBuilder = imageUrlBuilder(client);

// For all image variations, we'll use an auto format and prevent scaling it over its max dimensions
export const urlFor = (imgRef) => {
	return imageBuilder.image(imgRef).fit('max');
};

export const getImageDimensions = (image) => {
	const { asset, crop } = image;
	let width, height, aspectRatio;

	const [w, h] = asset._ref.split('-')[2].split('x').map(Number);
		width = w;
		height = h;
		aspectRatio = width / height;

	if (crop) {
		// if the image has a crop, return the crop's aspect ratio calculated from the cropped image dimensions
		// crop is in percentages, so we remove that from the image dimensions to get the cropped width and height
		const croppedWidth = width * (1 - (crop?.right + crop?.left));
		const croppedHeight = height * (1 - (crop?.top + crop?.bottom));

		width = croppedWidth;
		height = croppedHeight;
		aspectRatio = croppedWidth / croppedHeight;
	}

	if (
		!width ||
		!height ||
		!aspectRatio ||
		Number.isNaN(width) ||
		Number.isNaN(height) ||
		Number.isNaN(aspectRatio)
	) {
		throw new Error(
			`getImageDimensions: Image width, height or aspect ratio is either undefined or NaN`
		);
	}

	return {
		width,
		height,
		aspectRatio
	};
};

const LARGEST_VIEWPORT = 1920;

const DEFAULT_MIN_STEP = 0.1;
const DEFAULT_WIDTH_STEPS = [400, 600, 850, 1000, 1150];
const DEFAULT_FULL_WIDTH_STEPS = [360, 414, 768, 1280, 1366, 1440, 1536, 1728, 1920];

export const getImageProps = ({
	image,
	maxWidth: userMaxWidth,
	minimumWidthStep = DEFAULT_MIN_STEP,
	customWidthSteps,
	sizes
}) => {
	if (!image?.asset?._ref) {
		console.warn(`getImageProps: image has no _ref`);
		return;
	}

	const imageDimensions = getImageDimensions(image);

	const maxWidth = typeof userMaxWidth === 'number' ? userMaxWidth : LARGEST_VIEWPORT;

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
		src: urlFor(image).width(maxWidth).url(),
		// Build a `{URL} {SIZE}w, ...` string for the srcset
		srcset: retinaSizes.map((size) => `${urlFor(image).width(size).url()} ${size}w`).join(', '),
		sizes:
			userMaxWidth === '100vw'
				? '100vw'
				: sizes || `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`,
		// Let's also tell the browser what's the size of the image so it can calculate aspect ratios
		width: retinaSizes[0],
		height: retinaSizes[0] / imageDimensions?.aspectRatio,
		aspectRatio: imageDimensions?.aspectRatio
	};
};
