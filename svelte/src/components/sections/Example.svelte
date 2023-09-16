<script>
	import RichText from '~components/RichText.svelte';

	export let data;
</script>

<div class="relative flex flex-col">
	<h1 class="text-lg font-bold">{data.title}</h1>
	<RichText value={data?.body} />
</div>
