<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import '$lib/styles/index.css';

	import navActive from '$lib/stores/navActive';
	import Header from '$lib/components/Header.svelte';
	import Seo from '$lib/components/Seo.svelte';

	export let data;

	$: ({ title, seo, settings } = $page.data);

	afterNavigate(() => {
		navActive.close();
	});
</script>

<svelte:window on:keydown={navActive.close} />

<Seo {seo} {title} {settings} />

<div class="relative text-main pt-20">
	<Header links={data?.settings?.menu?.links} />

	{#key data?.url}
		<main class="relative h-full grid-main">
			<slot />
		</main>
	{/key}
</div>
