<script lang="ts">
	import PageBuilder from '$lib/components/PageBuilder.svelte';

	import type { PageData } from './$types';

	let { data }: PageData = $props();
</script>

<h1 class="text-title col-span-full">{data?.slug?.current}</h1>

<PageBuilder sections={data?.sections} />
