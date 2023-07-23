<script>
	import navActive from '~stores/navActive';
	import { onMount } from 'svelte';

	onMount(() => {
		navActive.close();
	});
</script>

<header class="fixed top-0 left-0 right-0 w-full grid grid-cols-4 sm-t:grid-cols-12 gap-6 p-6 z-50">
	<h1 class="col-span-3">Sane SvelteKit Tinderbox 🔥</h1>
	<nav>
		<ul class="w-full flex justify-between gap-x-8">
			<li><a href="/">Home</a></li>
			<li><a href="/about">About</a></li>
			<li><a href="/contact">Contact</a></li>
		</ul>
	</nav>
	<button class="absolute top-6 right-6" on:click={navActive.toggle}
		>{$navActive ? `Close` : `Open`} menu</button
	>
</header>
