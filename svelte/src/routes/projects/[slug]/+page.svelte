<script lang="ts">
	import PageBuilder from '$lib/components/PageBuilder.svelte';

	import { useProjectPage } from '$lib/utils/queryHooks';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = useProjectPage(data.params.slug ?? '', data.initial);
	const { data: project, loading, encodeDataAttribute } = $derived($query);
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1 class="text-title col-span-full">{project.slug.current}</h1>

	<PageBuilder sections={project?.sections} />
{/if}
