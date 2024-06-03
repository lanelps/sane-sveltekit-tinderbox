<script>
	export let seo;
	export let title;
	export let settings;
</script>

<svelte:head>
	<title>{seo?.title || title}{settings?.seo?.title ? ` | ${settings?.seo?.title}` : ``}</title>

	{#if settings?.seo?.description || seo?.description}
		<meta name="description" content={seo?.description || settings?.seo?.description} />
	{/if}

	{#if seo?.keywords}
		<meta name="keywords" content={seo.keywords} />
	{/if}

	{#if settings?.seo?.image?.url?.src || seo?.image?.url?.src}
		<meta property="og:image" content={seo?.image?.url?.src || settings?.seo?.image?.url?.src} />
	{/if}

	{#if settings?.seo?.favicon?.url?.src}
		<link rel="icon" href={settings.seo.favicon.url.src} />
	{/if}
</svelte:head>
