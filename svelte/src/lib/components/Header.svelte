<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	import { nav } from '$lib/stores/nav.svelte';
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

<header class="font-main grid-main fixed top-0 right-0 left-0 z-50 p-6">
	<Link link="/" class="col-span-3">
		<h1>Sane SvelteKit Tinderbox 🔥</h1>
	</Link>

	<nav class="sm-t:block hidden">
		<ul class="flex w-full justify-between gap-x-8">
			{#each links as link (link._key)}
				<li>
					<Link {link} />
				</li>
			{/each}
		</ul>
	</nav>

	<nav
		class={twMerge(
			'mobile-nav sm-t:hidden pointer-events-none fixed inset-0 z-40 h-full w-full bg-white p-6 opacity-0 transition-opacity',
			nav.isActive && 'pointer-events-auto opacity-100'
		)}
		aria-hidden={!nav.isActive}
	>
		<ul class="flex w-full flex-col justify-between gap-x-8">
			{#each links as link (link._key)}
				<li>
					<Link {link} />
				</li>
			{/each}
		</ul>
	</nav>

	<button class="sm-t:hidden absolute top-6 right-6 z-50 cursor-pointer" onclick={nav.toggle}
		>{nav.isActive ? `Close` : `Open`} menu</button
	>
</header>
