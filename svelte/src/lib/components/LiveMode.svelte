<script lang="ts">
	import { onMount } from 'svelte';
	import { enableVisualEditing } from '@sanity/visual-editing';
	import { useLiveMode } from '@sanity/svelte-loader';
	import { sanityClient } from '$lib/utils/sanity/client';

	onMount(() => enableVisualEditing());
	onMount(() => useLiveMode({ client: sanityClient }));
</script>
