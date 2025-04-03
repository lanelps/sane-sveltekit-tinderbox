<script lang="ts">
	import PortableText from '$lib/components/PortableText.svelte';

	import type { ExampleSection } from '$lib/types';

	interface Props {
		data: ExampleSection;
	}

	let { data }: Props = $props();
</script>

<section class="relative col-span-full flex flex-col">
	<h1 class="text-lg font-bold">{data.heading}</h1>
	<PortableText value={data?.content} />
</section>
