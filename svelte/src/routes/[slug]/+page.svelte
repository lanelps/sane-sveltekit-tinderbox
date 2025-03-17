<script lang="ts">
	import PageBuilder from '$lib/components/PageBuilder.svelte';
	import { usePage } from '$lib/utils/queryHooks';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = usePage(data.params.slug ?? '', data.initial);
	const { data: page, loading, encodeDataAttribute } = $derived($query);
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1 class="text-title col-span-full">{page.slug.current}</h1>

	<PageBuilder sections={page?.sections} />
{/if}
