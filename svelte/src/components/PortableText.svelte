<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import Normal from '~components/contentBlocks/Normal.svelte';
	import Link from '~components/contentBlocks/Link.svelte';

	export let value;
</script>

<PortableText
	{value}
	onMissingComponent={false}
	components={{
		block: {
			normal: Normal
		},
		marks: {
			link: Link
		}
	}}
/>
