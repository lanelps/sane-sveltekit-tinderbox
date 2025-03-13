<script lang="ts">
	import type { ParsedMediaSection } from '$lib/types';
	import Media from '$lib/components/Media.svelte';

	interface Props {
		data: ParsedMediaSection;
	}

	let { data }: Props = $props();
</script>

<section class="relative w-full">
	<Media media={data.media} />
</section>
