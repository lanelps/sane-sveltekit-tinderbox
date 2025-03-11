<script>
	let { image, loading = 'lazy' } = $props();
	let loaded = $state(false);
</script>

<img
	class={[
		'relative h-auto w-full opacity-0 transition-opacity duration-1000',
		loaded ? 'opacity-100' : ''
	]}
	{loading}
	fetchPriority={loading === 'eager' ? 'high' : undefined}
	alt={image?.altText || ''}
	{...image?.url}
	onload={() => (loaded = true)}
/>
