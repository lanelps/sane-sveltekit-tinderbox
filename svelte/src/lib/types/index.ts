import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type { PortableTextBlock } from '@portabletext/types';
import type {
	WebPage,
	Article,
	BlogPosting,
	NewsArticle,
	AboutPage,
	ContactPage,
	FAQPage,
	Product,
	Service,
	Event
} from 'schema-dts';

export interface RawImage {
	alt?: string;
	asset: {
		_ref: string;
	};
	url?: string;
	crop?: {
		left: number;
		right: number;
		top: number;
		bottom: number;
	};
	hotspot?: {
		x: number;
		y: number;
		height: number;
		width: number;
	};
	dimensions?: {
		aspectRatio: number;
		width: number;
		height: number;
	};
	mobile?: {
		asset: {
			_ref: string;
		};
	};
}

export interface Image {
	src: string;
	srcset: string;
	sizes: string;
	width: number;
	height: number;
	aspectRatio: number;
	placeholder: string;
	mobile?:
		| {
				src: string;
				srcset: string;
				sizes: string;
				width: number;
				height: number;
				aspectRatio: number;
				placeholder: string;
		  }
		| undefined;
}

export interface Video {
	asset: {
		playbackId: string;
		assetId: string;
		filename: string;
	};
}

export interface Media {
	_key?: string | undefined;
	type: 'image' | 'video';
	image?: RawImage;
	video?: Video;
}

export interface Address {
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

export interface Organization {
	name: string;
	logo?: RawImage;
	sameAs?: string[];
	address?: Address;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export interface Author {
	name: string;
	url?: string;
	image?: RawImage;
}

export interface ParsedAuthor {
	name: string;
	url?: string;
	image?: Image;
}

export type SchemaType =
	| WebPage['@type']
	| Article['@type']
	| BlogPosting['@type']
	| NewsArticle['@type']
	| AboutPage['@type']
	| ContactPage['@type']
	| FAQPage['@type']
	| Product['@type']
	| Service['@type']
	| Event['@type'];

export interface Schema {
	type: SchemaType;
	author?: Author;
	publishedAt?: string;
	modifiedAt?: string;
}

export interface ParsedSchema {
	type: SchemaType;
	author?: ParsedAuthor;
	publishedAt?: string;
	modifiedAt?: string;
}

export interface SEOPage {
	title?: string;
	description?: string;
	keywords?: string[];
	image?: RawImage;
	createdAt?: string;
	updatedAt?: string;
	schema?: Schema;
}

export interface ParsedSEOPage {
	title?: string;
	description?: string;
	keywords?: string[];
	image?: Image;
	schema?: ParsedSchema;
}

export interface SEOSite {
	title?: string;
	description?: string;
	keywords?: string[];
	favicon?: RawImage;
	image?: RawImage;
}

export type Slug = {
	current: string;
};

export type Reference = {
	_type: string;
	_id: string;
	title: string;
	slug: Slug;
};

export interface ExternalLink {
	type: 'external';
	label: string;
	url: string;
	newTab: boolean;
}

export interface FileLink {
	type: 'file';
	label: string;
	file: {
		_type: 'file';
		asset: {
			url: string;
		};
	};
}

export interface InternalLink {
	type: 'internal';
	label: string;
	reference: Reference;
}

export type Link = ExternalLink | FileLink | InternalLink | string;

export type SanityLink = ExternalLink | FileLink | InternalLink;

export type Links = Array<{ _key: string } & SanityLink>;

export interface NavStore {
	readonly isActive: boolean;
	toggle: () => void;
	open: () => void;
	close: () => void;
}

export type UrlFor = (
	imgRef: RawImage,
	options?: { quality?: number; format?: 'jpg' | 'pjpg' | 'png' | 'webp' }
) => ImageUrlBuilder;

export type GetImageProps = (props: {
	image: RawImage;
	maxWidth?: number;
	minimumWidthStep?: number;
	customWidthSteps?: number[];
}) => Image;

export type ProcessImage = (
	img: RawImage,
	maxWidth: number
) => {
	src: string;
	srcset: string;
	sizes: string;
	width: number;
	height: number;
	aspectRatio: number;
	placeholder: string;
};

export type GetImageDimensions = (image: RawImage) => {
	width: number;
	height: number;
	aspectRatio: number;
};

export type GetRetinaSizes = (
	baseSizes: number[],
	imageWidth: number,
	maxWidth: number,
	minimumWidthStep: number
) => number[];

// Page Data Types

export type SiteData = {
	navigation: Links;
	organization: {
		name: string;
		logo?: RawImage;
	};
	socialLinks: Links;
	address?: Address;
	seo: SEOSite;
};

export type ParsedSiteData = {
	navigation: Links;
	organization: {
		name: string;
		logo?: Image;
		sameAs?: string[];
		address?: Address;
		description?: string;
	};
	socialLinks: Links;
	seo: SEOSite;
};

export type SettingsData = {
	scripts: {
		_type: 'scriptInline' | 'scriptSrc';
		content?: string;
		src?: string;
	}[];
	redirects: string[];
};

export type LayoutData = {
	site: ParsedSiteData;
	settings: SettingsData;
};

export type HomePageData = {
	title: string;
	seo: SEOPage;
};

export type PageData = {
	title: string;
	slug: Slug;
	sections: Section[];
	seo: SEOPage;
};

export type ProjectData = {
	title: string;
	slug: Slug;
	date: string;
	thumbnail: RawImage;
	gallery: RawImage[];
	sections: Section[];
	seo: SEOPage;
};

export type ProjectsPageData = {
	projects: {
		_id: string;
		title: string;
		slug: Slug;
		date: string;
		thumbnail: RawImage;
	}[];
};

// Sections

export interface ExampleSection {
	_key: string;
	_type: 'example.section';
	heading: string;
	content: PortableTextBlock[];
}

export interface MediaSection {
	_key: string;
	_type: 'media.section';
	media: Media;
}

export type Section = ExampleSection | MediaSection;

export interface ParsedMediaSection extends Omit<MediaSection, 'media'> {
	media: Omit<Media, 'image'> & { image: Image };
}

export type ParsedSection = ExampleSection | ParsedMediaSection;
