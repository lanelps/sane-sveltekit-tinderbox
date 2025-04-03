<script lang="ts">
	import PageBuilder from '$lib/components/PageBuilder.svelte';
	import VariantSelector from '$lib/components/VariantSelector.svelte';

	import { useProductPage } from '$lib/utils/queryHooks';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = useProductPage(data.params.slug ?? '', data.initial);
	const { data: product, loading, encodeDataAttribute } = $derived($query);
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1 class="text-h1">{product.store.title}</h1>

	<VariantSelector title={product.store.title} variants={product.variants} />

	<PageBuilder sections={product.sections} />
{/if}
