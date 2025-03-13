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
	SettingsData,
	ProjectData,
	ParsedProjectData,
	ProjectListData,
	ParsedProjectListData,
	ParsedMedia,
	Media
} from '$lib/types';

const parseImage = (image: RawImage | undefined, maxWidth?: number): Image | undefined =>
	image ? getImageProps({ image, maxWidth }) : undefined;

const parseMedia = (
	media: Media | undefined,
	{ maxWidth }: { maxWidth?: number } = {}
): ParsedMedia | undefined => {
	if (!media) return undefined;

	return {
		...media,
		image: parseImage(media.image, maxWidth)
	};
};

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

export const parseSections = (sections: Section[] | undefined): ParsedSection[] => {
	if (!sections) return [];

	return sections.map((section: Section) => {
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
};

export const parseSEO = (seo: SEOPage | undefined): ParsedSEOPage | undefined => {
	if (!seo) return undefined;

	return {
		...seo,
		image: parseImage(seo?.image),
		schema: parseSchema(seo?.schema)
	};
};

export const parseSite = (site: SiteData): ParsedSiteData => ({
	...site,
	organization: {
		...site.organization,
		logo: parseImage(site?.organization?.logo)
	}
});

export const parseSettings = (settings: SettingsData): SettingsData => settings;

export const parseProjects = (projects: ProjectData[]): ParsedProjectData[] =>
	projects?.map(({ thumbnail, gallery, sections, seo, ...project }) => ({
		...project,
		thumbnail: parseMedia(thumbnail, { maxWidth: 640 }) as ParsedMedia,
		gallery: gallery.map((img) => parseMedia(img) as ParsedMedia),
		sections: parseSections(sections),
		seo: parseSEO(seo)
	}));

export const parseProjectList = (projects: ProjectListData): ParsedProjectListData =>
	projects.map((project) => ({
		...project,
		thumbnail: parseMedia(project.thumbnail, { maxWidth: 640 }) as ParsedMedia
	}));
