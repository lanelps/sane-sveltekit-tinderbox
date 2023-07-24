<script>
	import navActive from '~stores/navActive';
	import { onMount } from 'svelte';
	import Link from '~components/Link.svelte';

	export let links;

	onMount(() => {
		navActive.close();
	});
</script>

<header class="fixed top-0 left-0 right-0 w-full grid grid-cols-4 sm-t:grid-cols-12 gap-6 p-6 z-50">
	<h1 class="col-span-3">Sane SvelteKit Tinderbox 🔥</h1>

	<nav class="hidden sm-t:block">
		<ul class="w-full flex justify-between gap-x-8">
			{#each links as link (link._key)}
				<li>
					<Link {link} />
				</li>
			{/each}
		</ul>
	</nav>

	<nav
		class="mobile-nav fixed sm-t:hidden inset-0 w-full h-full p-6 bg-white opacity-0 pointer-events-none transition-opacity z-40"
		class:active={$navActive}
		aria-hidden={!$navActive}
	>
		<ul class="w-full flex flex-col justify-between gap-x-8">
			{#each links as link (link._key)}
				<li>
					<Link {link} />
				</li>
			{/each}
		</ul>
	</nav>

	<button class="sm-t:hidden absolute top-6 right-6 z-50" on:click={navActive.toggle}
		>{$navActive ? `Close` : `Open`} menu</button
	>
</header>

<style lang="postcss">
	.mobile-nav.active {
		opacity: 1;
		pointer-events: all;
	}
</style>
