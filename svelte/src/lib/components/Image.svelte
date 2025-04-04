<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { SanityImageData } from '$lib/types';
	import { getImageProps } from '$lib/utils/sanity/client/image';

	interface Props {
		class?: string;
		image: SanityImageData;
		alt?: string;
		loading?: 'lazy' | 'eager';
		maxWidth?: number;
	}

	const { image, alt = '', class: className, loading = 'lazy', maxWidth }: Props = $props();
	let img = getImageProps({ image, maxWidth });
	let loaded = $state(false);

	const handleImageLoaded = () => {
		loaded = true;
	};
</script>

{#if img}
	<figure class={twMerge('relative w-full', className)}>
		<img
			class="relative h-auto w-full transition-opacity duration-700"
			{loading}
			fetchPriority={loading === 'eager' ? 'high' : undefined}
			src={img.src}
			srcset={img.srcSet}
			sizes={img.sizes}
			width={img.width}
			height={img.height}
			alt={alt || img.alt}
			onload={handleImageLoaded}
		/>
		{#if img.placeholder}
			<img
				class={twMerge(
					'pointer-events-none absolute inset-0 block h-full w-full object-cover transition-opacity',
					loaded ? 'opacity-0' : 'opacity-100'
				)}
				src={img.placeholder}
				alt=""
				aria-hidden="true"
			/>
		{/if}
	</figure>
{/if}
