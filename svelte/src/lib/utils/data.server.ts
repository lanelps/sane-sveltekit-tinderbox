import {
	siteQuery,
	settingsQuery,
	homePageQuery,
	pageQuery,
	productQuery,
	productsQuery,
	projectQuery,
	projectsPageQuery
} from '$lib/utils/queries';

import type {
	HomePageData,
	PageData,
	ProductData,
	ProductsData,
	ProjectData,
	ProjectsData,
	SiteData,
	SettingsData
} from '$lib/types';
import type { LoadQuery, QueryResponseInitial } from '@sanity/svelte-loader';

export const fetchSite = async (loadQuery: LoadQuery): Promise<QueryResponseInitial<SiteData>> => {
	const initialSite = await loadQuery<SiteData>(siteQuery);
	if (!initialSite) throw new Error('Error fetching site data');
	return initialSite;
};

export const fetchSettings = async (
	loadQuery: LoadQuery
): Promise<QueryResponseInitial<SettingsData>> => {
	const initialSettings = await loadQuery<SettingsData>(settingsQuery);
	if (!initialSettings) throw new Error('Error fetching settings data');
	return initialSettings;
};

export const fetchHomePage = async (
	loadQuery: LoadQuery
): Promise<QueryResponseInitial<HomePageData>> => {
	const initialHomePage = await loadQuery<HomePageData>(homePageQuery);
	if (!initialHomePage) throw new Error('Error fetching home page data');
	return initialHomePage;
};

export const fetchPage = async (
	loadQuery: LoadQuery,
	slug: string
): Promise<QueryResponseInitial<PageData>> => {
	const initialPage = await loadQuery<PageData>(pageQuery, { slug });
	if (!initialPage) throw new Error('Error fetching page data');
	return initialPage;
};

export const fetchProject = async (
	loadQuery: LoadQuery,
	slug: string
): Promise<QueryResponseInitial<ProjectData>> => {
	const initialProject = await loadQuery<ProjectData>(projectQuery, { slug });
	if (!initialProject) throw new Error('Error fetching project data');
	return initialProject;
};

export const fetchProjects = async (
	loadQuery: LoadQuery
): Promise<QueryResponseInitial<ProjectsData>> => {
	const initialProjects = await loadQuery<ProjectsData>(projectsPageQuery);
	if (!initialProjects) throw new Error('Error fetching projects data');
	return initialProjects;
};

export const fetchProduct = async (
	loadQuery: LoadQuery,
	slug: string
): Promise<QueryResponseInitial<ProductData>> => {
	const initialProduct = await loadQuery<ProductData>(productQuery, { slug });
	if (!initialProduct) throw new Error('Error fetching product data');
	return initialProduct;
};

export const fetchProducts = async (
	loadQuery: LoadQuery
): Promise<QueryResponseInitial<ProductsData>> => {
	const initialProducts = await loadQuery<ProductsData>(productsQuery);
	if (!initialProducts) throw new Error('Error fetching products data');
	return initialProducts;
};
