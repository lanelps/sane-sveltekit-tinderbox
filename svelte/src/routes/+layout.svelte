<script>
	import { afterNavigate } from '$app/navigation';
	import '../styles/index.css';

	import navActive from '~stores/navActive';
	import Header from '~components/Header.svelte';

	export let data;

	afterNavigate(() => {
		navActive.close();
	});
</script>

<svelte:window on:keydown={navActive.close} />

<div class="relative text-main pt-20">
	<Header links={data?.menu?.links} />

	{#key data?.url}
		<main class="relative w-full h-full grid grid-cols-4 sm-t:grid-cols-12 gap-6 px-6">
			<slot />
		</main>
	{/key}
</div>
