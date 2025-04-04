<script lang="ts">
	import { page } from '$app/state';
	import PageBuilder from '$lib/components/PageBuilder.svelte';

	import { usePage } from '$lib/utils/queryHooks';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const slug = $derived(page.params.slug);
	const query = $derived(usePage(slug, data.initial));

	const pageData = $derived($query.data);
	const isLoading = $derived($query.loading);
</script>

{#if isLoading}
	<p>Loading...</p>
{:else}
	<h1 class="text-title col-span-full">{pageData.slug.current}</h1>

	<PageBuilder sections={pageData?.sections} />
{/if}
