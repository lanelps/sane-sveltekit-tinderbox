<script>
	import PortableText from '$lib/components/PortableText.svelte';

	export let data;
</script>

<section class="relative flex flex-col">
	<h1 class="text-lg font-bold">{data.title}</h1>
	<PortableText value={data?.body} />
</section>
