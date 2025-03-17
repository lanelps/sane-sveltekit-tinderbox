<script lang="ts">
	import type { Media } from '$lib/types';

	import Image from '$lib/components/Image.svelte';
	import Video from '$lib/components/Video.svelte';

	interface Props {
		media: Media;
	}

	let { media }: Props = $props();
</script>

{#if media.type === 'image' && media.image}
	<Image image={media.image} />
{:else if media.type === 'video' && media.video}
	<Video sources={[media.video]} />
{/if}
