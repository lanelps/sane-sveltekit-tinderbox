<script lang="ts">
	import type { Video } from '$lib/types';

	interface Props {
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		sources?: Video[];
	}

	let { autoplay = true, loop = true, muted = true, sources = [] }: Props = $props();

	let loaded = $state(false);
</script>

{#if sources.length > 0}
	<video
		{autoplay}
		{loop}
		{muted}
		playsInline
		class="w-full opacity-1 transition-opacity duration-1000"
		class:opacity-100={loaded}
		onloadeddata={() => (loaded = true)}
	>
		<track kind="captions" />
		{#each sources as src}
			<source src={src?.url} type={src?.type && `video/${src?.type}`} />
		{/each}
	</video>
{/if}
