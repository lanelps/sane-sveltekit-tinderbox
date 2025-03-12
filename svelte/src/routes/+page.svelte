<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<h1 class="text-title col-span-full">Welcome to Sane SvelteKit Tinderbox 🔥</h1>
