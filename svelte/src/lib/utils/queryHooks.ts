import { useQuery } from '@sanity/svelte-loader';
import {
	homePageQuery,
	pageQuery,
	productQuery,
	siteQuery,
	settingsQuery
} from '$lib/utils/queries';

import type {
	HomePageData,
	PageData,
	ProductData,
	ProjectData,
	SiteData,
	SettingsData
} from '$lib/types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const useSiteData = (initial: QueryResponseInitial<SiteData>) =>
	useQuery<SiteData>(siteQuery, {}, { initial });

export const useSettingsData = (initial: QueryResponseInitial<SettingsData>) =>
	useQuery<SettingsData>(settingsQuery, {}, { initial });

export const useHomePage = (initial: QueryResponseInitial<HomePageData>) =>
	useQuery<HomePageData>(homePageQuery, {}, { initial });

export const usePage = (slug: string, initial: QueryResponseInitial<PageData>) =>
	useQuery<PageData>(pageQuery, { slug }, { initial });

export const useProjectPage = (slug: string, initial: QueryResponseInitial<ProjectData>) =>
	useQuery<ProjectData>(pageQuery, { slug }, { initial });

export const useProductPage = (slug: string, initial: QueryResponseInitial<ProductData>) =>
	useQuery<ProductData>(productQuery, { slug }, { initial });
