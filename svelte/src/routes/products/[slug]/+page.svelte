<script lang="ts">
	import { page } from '$app/state';
	import PageBuilder from '$lib/components/PageBuilder.svelte';
	import VariantSelector from '$lib/components/VariantSelector.svelte';

	import { useProductPage } from '$lib/utils/queryHooks';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const slug = $derived(page.params.slug);
	const query = $derived(useProductPage(slug, data.initial));

	const productData = $derived($query.data);
	const isLoading = $derived($query.loading);
</script>

{#if isLoading}
	<p>Loading...</p>
{:else}
	<h1 class="text-h1">{productData.store.title}</h1>

	<VariantSelector title={productData.store.title} variants={productData.variants} />

	<PageBuilder sections={productData.sections} />
{/if}
