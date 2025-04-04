<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	import { nav } from '$lib/stores/nav.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	import Link from '$lib/components/Link.svelte';

	import type { Links } from '$lib/types';

	interface Props {
		links: Links;
	}

	let { links }: Props = $props();

	onMount(() => {
		nav.close();
	});
</script>

<header class="p-pm sm-t:p-pd flex items-center justify-between">
	<Link link="/">
		<h1>Sane SvelteKit Tinderbox 🔥</h1>
	</Link>

	<nav class="sm-t:flex gap-x-gm sm-t:gap-x-gd hidden">
		<ul class="flex w-full gap-x-8">
			{#each links as link}
				<li>
					<Link {link} />
				</li>
			{/each}

			<button onclick={cart.toggle}>Cart ({cart.items.length})</button>
		</ul>
	</nav>

	<!-- Mobile Menu -->
	<nav
		class={twMerge(
			'sm-t:hidden pointer-events-none fixed inset-0 z-40 h-full w-full bg-white p-6 opacity-0 transition-opacity',
			nav.isOpen && 'pointer-events-auto opacity-100'
		)}
		aria-hidden={!nav.isOpen}
	>
		<ul class="flex w-full flex-col justify-between gap-x-8">
			{#each links as link}
				<li>
					<Link {link} />
				</li>
			{/each}

			<button onclick={cart.toggle}>Cart ({cart.items.length})</button>
		</ul>
	</nav>

	<button class="sm-t:hidden absolute top-6 right-6 z-50 cursor-pointer" onclick={nav.toggle}
		>{nav.isOpen ? `Close` : `Open`} menu</button
	>
</header>
