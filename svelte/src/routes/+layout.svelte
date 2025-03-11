<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	import { nav } from '$lib/stores/nav.svelte';
	import Header from '$lib/components/Header.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import '$lib/styles/index.css';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	afterNavigate(() => {
		nav.close();
	});
</script>

<svelte:window on:keydown={nav.close} />

<Seo seo={page.data.seo} title={page.data.title} settings={data.site} />

<Header links={data.site.navigation} />

{#key page.data?.url}
	<main class="grid-main relative h-full pt-20">
		{@render children()}
	</main>
{/key}
