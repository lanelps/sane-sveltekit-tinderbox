<script>
	import PageBuilder from '$lib/components/PageBuilder.svelte';
	export let data;
</script>

<h1 class="col-span-full text-title">{data?.slug?.current}</h1>

<PageBuilder sections={data?.sections} />
