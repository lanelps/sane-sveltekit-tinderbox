<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { isPreviewing } from '@sanity/visual-editing/svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	// Register GSAP plugins
	gsap.registerPlugin(ScrollTrigger);

	import { nav } from '$lib/stores/nav.svelte';

	import Cart from '$lib/components/Cart.svelte';
	import Header from '$lib/components/Header.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import LiveMode from '$lib/components/LiveMode.svelte';

	import { useSiteData, useSettingsData } from '$lib/utils/queryHooks';
	import '$lib/styles/index.css';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	afterNavigate(() => {
		nav.close();
	});

	const siteQuery = $derived(useSiteData(data.initialSite));
	const site = $derived($siteQuery.data);

	const settingsQuery = $derived(useSettingsData(data.initialSettings));
	const settings = $derived($settingsQuery.data);
</script>

<svelte:window on:keydown={nav.close} />

<Seo seo={page.data.seo} title={page.data.title} {site} />
<Header links={site.navigation} />
<Cart />

{#key page.data?.url}
	<main class="grid-main relative h-full pt-20">
		{#if $isPreviewing}
			<div class="col-span-full">Previews ENABLED</div>
			<LiveMode />
		{:else}
			<div class="col-span-full">Previews DISABLED</div>
		{/if}
		{@render children()}
	</main>
{/key}
