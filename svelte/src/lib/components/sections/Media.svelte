<script lang="ts">
	import type { MediaSection } from '$lib/types';
	import Media from '$lib/components/Media.svelte';

	interface Props {
		data: MediaSection;
	}

	let { data }: Props = $props();
</script>

<section class="relative col-span-full w-full">
	<Media media={data.media} />
</section>
