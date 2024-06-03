<script>
	import ExampleSection from '$lib/components/sections/Example.svelte';

	export let sections;

	const sectionType = (type) => {
		switch (type) {
			case 'exampleSection':
				return ExampleSection;

			default:
				return null;
		}
	};
</script>

{#if sections}
	<div class="relative col-span-full w-full flex gap-y-16">
		{#each sections as section (section._key)}
			<section class="relative w-full">
				<svelte:component this={sectionType(section?._type)} data={section} />
			</section>
		{/each}
	</div>
{/if}
