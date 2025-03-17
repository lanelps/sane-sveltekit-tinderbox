import { useQuery } from '@sanity/svelte-loader';
import {
	homePageQuery,
	pageQuery,
	projectsPageQuery,
	siteQuery,
	settingsQuery
} from '$lib/utils/queries';
import type {
	HomePageData,
	PageData,
	ProjectsPageData,
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

export const useProjectsPage = (initial: QueryResponseInitial<ProjectsPageData>) =>
	useQuery<ProjectsPageData>(projectsPageQuery, {}, { initial });

export const useProjectPage = (slug: string, initial: QueryResponseInitial<ProjectData>) =>
	useQuery<ProjectData>(pageQuery, { slug }, { initial });
