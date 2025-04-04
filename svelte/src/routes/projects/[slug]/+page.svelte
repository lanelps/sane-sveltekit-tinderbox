<script lang="ts">
	import { page } from '$app/state';
	import PageBuilder from '$lib/components/PageBuilder.svelte';

	import { useProjectPage } from '$lib/utils/queryHooks';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const slug = $derived(page.params.slug);
	const query = $derived(useProjectPage(slug, data.initial));

	// Access the store values reactively
	$effect(() => {
		console.log('Project data changed:', $query.data);
	});

	// Extract needed values with $derived for use in the template
	const projectData = $derived($query.data);
	const isLoading = $derived($query.loading);
</script>

{#if isLoading}
	<p>Loading...</p>
{:else}
	<h1 class="text-title col-span-full">{projectData.slug.current}</h1>

	<PageBuilder sections={projectData?.sections} />
{/if}
