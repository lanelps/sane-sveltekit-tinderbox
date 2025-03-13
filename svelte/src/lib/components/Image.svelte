<script lang="ts">
	import type { Image } from '$lib/types';

	interface Props {
		image: Image;
		loading?: 'lazy' | 'eager';
	}

	let { image, loading = 'lazy' }: Props = $props();
	let loaded = $state(false);
</script>

<div class="relative overflow-hidden">
	{#if image.placeholder}
		<img class="absolute inset-0 h-full w-full" src={image.placeholder} alt="" aria-hidden="true" />
	{/if}
	<img
		class={[
			'relative h-auto w-full transition-opacity duration-700',
			loaded ? 'opacity-100' : 'opacity-0'
		]}
		{loading}
		fetchPriority={loading === 'eager' ? 'high' : undefined}
		src={image.src}
		srcset={image.srcset}
		sizes={image.sizes}
		width={image.width}
		height={image.height}
		alt={image?.alt || ''}
		onload={() => (loaded = true)}
	/>
</div>
