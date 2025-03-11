import { sanityClient } from '$lib/utils/sanity.server';
import { image, link, sections, siteSEO, pageSEO } from '$lib/utils/groq.server';
import type { HomePageData, PageData, ProjectData } from '$lib/types';

export const siteQuery = `*[_type == "site"][0]{
	navigation[]{
		_key,
		link {
			${link}
		}
	},
	organization{
		name,
		logo {
			${image}
		}
	},
	socialLinks[]{
		_key,
		link {
			${link}
		}
	},
	address,
	${siteSEO}
}`;

export const settingsQuery = `*[_type == "settings"][0]{
	scripts[]{
		_type,
		content,
		src
	},
	redirects
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
	title,
	${pageSEO}
}`;

export const pageQuery = `*[_type == "page" && slug.current == $slug][0] {
	title,
	slug {
		current
	},
	${sections}
	${pageSEO}
}`;

export const projectQuery = `*[_type == "project" && slug.current == $slug][0] {
	title,
	slug {
		current
	},
	date,
	thumbnail {
		${image}
	},
	gallery[] {
		${image}
	},
	${sections}
	${pageSEO}
}`;

export const projectListQuery = `*[_type == "project"] {
	_id,
	title,
	slug {
		current
	},
	date,
	thumbnail {
		${image}
	},
}`;

export const fetchSite = async () => {
	const site = await sanityClient.fetch(siteQuery);
	if (!site) throw new Error('Error fetching site data');
	return site;
};

export const fetchSettings = async () => {
	const settings = await sanityClient.fetch(settingsQuery);
	if (!settings) throw new Error('Error fetching settings data');
	return settings;
};

export const fetchHomePage = async (): Promise<HomePageData> => {
	const homePage = await sanityClient.fetch(homePageQuery);
	if (!homePage) throw new Error('Error fetching home page data');
	return homePage;
};

export const fetchPage = async (slug: string): Promise<PageData> => {
	const page = await sanityClient.fetch(pageQuery, { slug });
	if (!page) throw new Error('Error fetching page data');
	return page;
};

export const fetchProject = async (slug: string): Promise<ProjectData> => {
	const project = await sanityClient.fetch(projectQuery, { slug });
	if (!project) throw new Error('Error fetching project data');
	return project;
};

export const fetchProjects = async (): Promise<ProjectData[]> => {
	const projects = await sanityClient.fetch(projectListQuery);
	if (!projects) throw new Error('Error fetching projects data');
	return projects;
};
