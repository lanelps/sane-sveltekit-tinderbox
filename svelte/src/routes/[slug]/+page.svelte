<script lang="ts">
	import PageBuilder from '$lib/components/PageBuilder.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1 class="text-title col-span-full">{data?.slug?.current}</h1>

<PageBuilder sections={data?.sections} />
