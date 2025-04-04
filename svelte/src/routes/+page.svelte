<script lang="ts">
	import { useHomePage } from '$lib/utils/queryHooks';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(useHomePage(data.initial));

	const homeData = $derived($query.data);
	const isLoading = $derived($query.loading);
	const encodeDataAttribute = $derived($query.encodeDataAttribute);
</script>

{#if isLoading}
	<div>Loading...</div>
{:else}
	<h1 class="text-title col-span-full" data-sanity={encodeDataAttribute(['title'])}>
		Welcome to Sane SvelteKit Tinderbox {homeData.title} 🔥
	</h1>
{/if}
