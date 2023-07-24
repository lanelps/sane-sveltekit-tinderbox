<script lang="ts">
	export let portableText;

	$: ({
		value: { href }
	} = portableText);
</script>

<a {href} target="_blank" rel="noreferrer noopener" class="underline">
	<slot />
</a>
