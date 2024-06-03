<script>
	export let image;
	export let loading = 'lazy';
	let loaded = false;
</script>

<img
	class="relative w-full h-auto opacity-0 transition-opacity duration-1000"
	class:opacity-100={loaded}
	{loading}
	fetchPriority={loading === 'eager' ? 'high' : undefined}
	alt={image?.altText || ''}
	{...image?.url}
	on:load={() => (loaded = true)}
/>
