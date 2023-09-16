<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import '../styles/index.css';

	import navActive from '~stores/navActive';
	import Header from '~components/Header.svelte';
	import Seo from '~components/Seo.svelte';

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
		<main class="relative w-full h-full grid grid-cols-4 sm-t:grid-cols-12 gap-6 px-6">
			<slot />
		</main>
	{/key}
</div>
