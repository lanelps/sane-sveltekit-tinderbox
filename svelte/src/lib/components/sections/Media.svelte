<script lang="ts">
	import type { ParsedMediaSection } from '$lib/types';
	import Image from '$lib/components/Image.svelte';
	import Video from '$lib/components/Video.svelte';

	interface Props {
		data: ParsedMediaSection;
	}

	let { data }: Props = $props();
</script>

<section class="relative w-full">
	{#if data.media.type === 'image' && data.media.image}
		<Image image={data.media.image} />
	{:else if data.media.type === 'video' && data.media.video}
		<Video sources={[data.media.video]} />
	{/if}
</section>
