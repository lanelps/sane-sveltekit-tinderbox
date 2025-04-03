<script lang="ts">
	import ExampleSection from '$lib/components/sections/Example.svelte';
	import MediaSection from '$lib/components/sections/Media.svelte';
	import ProductsList from '$lib/components/sections/ProductsList.svelte';
	import ProjectsList from '$lib/components/sections/ProjectsList.svelte';

	import type { Section } from '$lib/types';

	interface Props {
		sections?: Section[];
	}

	let { sections }: Props = $props();
</script>

{#if sections && sections.length > 0}
	{#each sections as section (section._key)}
		{#if section._type === 'example.section'}
			<ExampleSection data={section} />
		{:else if section._type === 'media.section'}
			<MediaSection data={section} />
		{:else if section._type === 'productsList.section'}
			<ProductsList data={section} />
		{:else if section._type === 'projectsList.section'}
			<ProjectsList data={section} />
		{/if}
	{/each}
{/if}
