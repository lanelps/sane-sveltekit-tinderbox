<script lang="ts">
	import ExampleSection from '$lib/components/sections/Example.svelte';
	import MediaSection from '$lib/components/sections/Media.svelte';

	import type { Section } from '$lib/types';

	interface Props {
		sections?: Section[];
	}

	let { sections }: Props = $props();
</script>

<div class="relative col-span-full flex w-full gap-y-16">
	{#if sections && sections.length > 0}
		{#each sections as section (section._key)}
			{#if section._type === 'example.section'}
				<ExampleSection data={section} />
			{:else if section._type === 'media.section'}
				<MediaSection data={section} />
			{/if}
		{/each}
	{/if}
</div>
