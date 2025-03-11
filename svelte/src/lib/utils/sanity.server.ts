import { SANITY_PROJECT_ID, SANITY_DATASET } from '$env/static/private';

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import type {
	UrlFor,
	GetImageProps,
	ProcessImage,
	GetImageDimensions,
	GetRetinaSizes
} from '$lib/types';

export const sanityClient = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	apiVersion: '2025-03-01',
	useCdn: true
});

const LARGEST_VIEWPORT = 1920;

const DEFAULT_MIN_STEP = 0.1;
const DEFAULT_FULL_WIDTH_STEPS = [320, 375, 428, 768, 960, 1280, 1366, 1440, 1536, 1728];

export const imageBuilder = imageUrlBuilder(sanityClient);

export const urlFor: UrlFor = (imgRef, options) => {
	const { quality = 100, format } = options || {};

	let builder = imageBuilder.image(imgRef).fit('max').quality(quality);

	if (format) {
		builder = builder.format(format);
	} else {
		builder = builder.auto('format');
	}

	return builder;
};

export const getImageDimensions: GetImageDimensions = (image) => {
	const { asset, crop } = image;

	const [originalWidth, originalHeight] = asset._ref.split('-')[2].split('x').map(Number);
	let aspectRatio = originalWidth / originalHeight;

	let width = originalWidth;
	let height = originalHeight;

	if (crop) {
		const cropWidth = crop.right + crop.left;
		const cropHeight = crop.top + crop.bottom;

		width = originalWidth * (1 - cropWidth);
		height = originalHeight * (1 - cropHeight);
		aspectRatio = width / height;
	}

	if (!width || !height) {
		throw new Error('Unable to determine image dimensions');
	}

	return { width, height, aspectRatio };
};

const getRetinaSizes: GetRetinaSizes = (baseSizes, imageWidth, maxWidth, minimumWidthStep) => {
	const allSizes = [
		imageWidth,
		...baseSizes,
		...baseSizes.map((size) => size * 2),
		...baseSizes.map((size) => size * 3)
	];

	const uniqueSizes = Array.from(new Set(allSizes)).sort((a, b) => a - b);

	const filteredSizes = uniqueSizes
		.filter((size) => size <= imageWidth && size <= maxWidth * 3)
		.filter((size, i, arr) => {
			const nextSize = arr[i + 1];
			return nextSize ? nextSize / size > minimumWidthStep + 1 : true;
		});

	return filteredSizes.length > 0 ? filteredSizes : [imageWidth];
};

export const getImageProps: GetImageProps = ({
	image,
	maxWidth: userMaxWidth = LARGEST_VIEWPORT,
	minimumWidthStep = DEFAULT_MIN_STEP,
	customWidthSteps
}) => {
	if (!image?.asset?._ref) {
		return undefined;
	}

	const processImage: ProcessImage = (img, maxWidth) => {
		const { width: imageWidth, aspectRatio } = getImageDimensions(img);
		const baseSizes = [maxWidth, ...(customWidthSteps || DEFAULT_FULL_WIDTH_STEPS)];
		const retinaSizes = getRetinaSizes(baseSizes, imageWidth, maxWidth, minimumWidthStep);

		return {
			src: urlFor(img).width(maxWidth).url(),
			srcset: retinaSizes.map((size) => `${urlFor(img).width(size).url()} ${size}w`).join(', '),
			sizes: userMaxWidth
				? `(max-width: ${userMaxWidth}px) 100vw, ${userMaxWidth}px`
				: `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`,
			width: imageWidth,
			height: imageWidth / aspectRatio,
			aspectRatio,
			placeholder: urlFor(img, { quality: 100 }).width(32).url()
		};
	};

	const mainImageProps = processImage(
		image,
		typeof userMaxWidth === 'number' ? userMaxWidth : LARGEST_VIEWPORT
	);

	let mobileImageProps;
	if (image?.mobile?.asset?._ref) {
		mobileImageProps = processImage(
			image.mobile,
			typeof userMaxWidth === 'number' ? userMaxWidth : LARGEST_VIEWPORT
		);
	}

	return {
		...mainImageProps,
		...(mobileImageProps && { mobile: mobileImageProps })
	};
};
