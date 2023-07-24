<script>
	export let link;
</script>

{#if link._type === 'linkInternal'}
	<a href={link?.reference?.slug?.current} class="text-main">
		{link?.title}
	</a>
{:else if link._type === 'linkExternal'}
	<a href={link?.url} class="text-main" target={link?.newWindow ? `_blank` : ``}>
		{link?.title}
	</a>
{/if}
