<script lang="ts">
	import ExampleSection from '$lib/components/sections/Example.svelte';
	import MediaSection from '$lib/components/sections/Media.svelte';

	import type { ParsedSection } from '$lib/types';

	interface Props {
		sections: ParsedSection[];
	}

	let { sections }: Props = $props();

	const sectionType = (type: string) => {
		switch (type) {
			case 'example.section':
				return ExampleSection;

			case 'media.section':
				return MediaSection;
			default:
				return null;
		}
	};
</script>

{#if sections}
	<div class="relative col-span-full flex w-full gap-y-16">
		{#each sections as section (section._key)}
			{@const Section = sectionType(section?._type)}
			{#if Section}
				<Section data={section} />
			{/if}
		{/each}
	</div>
{/if}
