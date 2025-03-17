<script lang="ts">
	import type { RawImage } from '$lib/types';
	import { getImageProps } from '$lib/utils/sanity/client/image';

	interface Props {
		image: RawImage;
		loading?: 'lazy' | 'eager';
		maxWidth?: number;
	}

	let { image, loading = 'lazy', maxWidth }: Props = $props();

	let img = getImageProps({ image, maxWidth });
	let loaded = $state(false);
</script>

{#if img}
	<figure class="relative overflow-hidden">
		{#if img.placeholder}
			<img class="absolute inset-0 h-full w-full" src={img.placeholder} alt="" aria-hidden="true" />
		{/if}
		<img
			class={[
				'relative h-auto w-full transition-opacity duration-700',
				loaded ? 'opacity-100' : 'opacity-0'
			]}
			{loading}
			fetchPriority={loading === 'eager' ? 'high' : undefined}
			src={img.src}
			srcset={img.srcset}
			sizes={img.sizes}
			width={img.width}
			height={img.height}
			alt={img.alt}
			onload={() => (loaded = true)}
		/>
	</figure>
{/if}
