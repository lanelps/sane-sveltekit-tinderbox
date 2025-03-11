import { getImageProps } from '$lib/utils/sanity.server';
import type {
	Section,
	ParsedSection,
	MediaSection,
	ParsedMediaSection,
	RawImage,
	Image,
	Author,
	ParsedAuthor,
	SEOPage,
	ParsedSEOPage,
	Schema,
	ParsedSchema,
	SiteData,
	ParsedSiteData,
	SettingsData
} from '$lib/types';

const parseImage = (image: RawImage | undefined, maxWidth?: number): Image | undefined =>
	image ? getImageProps({ image, maxWidth }) : undefined;

const parseAuthor = (author: Author | undefined): ParsedAuthor | undefined => {
	if (!author) return undefined;
	return {
		...author,
		image: parseImage(author.image)
	};
};

const parseSchema = (schema: Schema | undefined): ParsedSchema | undefined => {
	if (!schema) return undefined;

	return {
		...schema,
		author: parseAuthor(schema.author)
	};
};

export const parseSections = (sections: Section[]): ParsedSection[] =>
	sections?.map((section: Section) => {
		if (section._type === 'media.section') {
			const mediaSection = section as MediaSection;
			return {
				...mediaSection,
				media: {
					...mediaSection.media,
					image: parseImage(mediaSection.media.image)
				}
			} as ParsedMediaSection;
		}
		return section as ParsedSection;
	});

export const parseSEO = (seo: SEOPage): ParsedSEOPage => ({
	...seo,
	image: parseImage(seo?.image),
	schema: parseSchema(seo?.schema)
});

export const parseSite = (site: SiteData): ParsedSiteData => ({
	...site,
	organization: {
		...site.organization,
		logo: parseImage(site?.organization?.logo)
	}
});

export const parseSettings = (settings: SettingsData): SettingsData => settings;
