<script lang="ts">
	import { useHomePage } from '$lib/utils/queryHooks';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = useHomePage(data.initial);
	const { data: home, loading, encodeDataAttribute } = $derived($query);
</script>

{#if loading}
	<div>Loading...</div>
{:else}
	<h1 class="text-title col-span-full" data-sanity={encodeDataAttribute(['title'])}>
		Welcome to Sane SvelteKit Tinderbox {home.title} 🔥
	</h1>
{/if}
