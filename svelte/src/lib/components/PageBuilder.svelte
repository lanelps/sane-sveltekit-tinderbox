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
		{#if section._type === 'section.example'}
			<ExampleSection data={section} />
		{:else if section._type === 'section.media'}
			<MediaSection data={section} />
		{:else if section._type === 'section.productsList'}
			<ProductsList data={section} />
		{:else if section._type === 'section.projectsList'}
			<ProjectsList data={section} />
		{/if}
	{/each}
{/if}
