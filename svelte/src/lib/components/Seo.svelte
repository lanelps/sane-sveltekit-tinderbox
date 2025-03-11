<script lang="ts">
	import type { SEOPage, ParsedSiteData } from '$lib/types';

	interface Props {
		seo: SEOPage;
		title: string;
		settings: ParsedSiteData;
	}
	let { seo, title, settings }: Props = $props();

	// Compute final SEO values with fallbacks
	const pageTitle = $derived(seo?.title || title);
	const siteTitle = $derived(settings?.seo?.title);
	const finalSeo = $derived({
		title: siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle || siteTitle,
		description: seo?.description || settings?.seo?.description,
		keywords: seo?.keywords || settings?.seo?.keywords,
		image: seo?.image || settings?.seo?.image,
		favicon: settings?.seo?.favicon
	});
</script>

<svelte:head>
	<!-- Basic -->
	<title>{finalSeo.title}</title>
	<meta name="robots" content="index,follow" />
	{#if finalSeo.description}
		<meta name="description" content={finalSeo.description} />
	{/if}
	{#if finalSeo.keywords}
		<meta name="keywords" content={finalSeo.keywords.join(', ')} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={finalSeo.title} />
	{#if finalSeo.description}
		<meta property="og:description" content={finalSeo.description} />
	{/if}
	{#if finalSeo.image?.url}
		<meta property="og:image" content={finalSeo.image.url} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={finalSeo.title} />
	{#if finalSeo.description}
		<meta name="twitter:description" content={finalSeo.description} />
	{/if}
	{#if finalSeo.image?.url}
		<meta name="twitter:image" content={finalSeo.image.url} />
	{/if}

	<!-- Favicon -->
	{#if finalSeo.favicon?.url}
		<link rel="icon" href={finalSeo.favicon.url} />
	{/if}

	<!-- JSON-LD Schema -->
	{#if seo?.schema}
		<script type="application/ld+json">
			{JSON.stringify({
				'@context': 'https://schema.org',
				'@graph': [
					// Organization
					{
						'@type': 'Organization',
						'@id': `${$page.url.origin}/#organization`,
						name: settings?.seo?.organization?.name,
						url: $page.url.origin,
						logo: settings?.seo?.organization?.logo?.url
							? {
									'@type': 'ImageObject',
									'@id': `${$page.url.origin}/#logo`,
									url: settings.seo.organization.logo.url,
									contentUrl: settings.seo.organization.logo.url,
									width: settings.seo.organization.logo.dimensions?.width,
									height: settings.seo.organization.logo.dimensions?.height
							  }
							: undefined,
						sameAs: settings?.seo?.organization?.sameAs,
						address: settings?.seo?.organization?.address
							? {
									'@type': 'PostalAddress',
									streetAddress: settings.seo.organization.address.street,
									addressLocality: settings.seo.organization.address.city,
									addressRegion: settings.seo.organization.address.state,
									postalCode: settings.seo.organization.address.zipCode,
									addressCountry: settings.seo.organization.address.country
							  }
							: undefined
					},

					// Page
					{
						'@type': seo.schema[seo.schema.pageType]?.type,
						'@id': `${$page.url.href}#webpage`,
						url: $page.url.href,
						name: finalSeo.title,
						description: finalSeo.description,
						datePublished: seo.schema[seo.schema.pageType]?.publishedAt,
						dateModified: seo.schema[seo.schema.pageType]?.modifiedAt,
						isPartOf: {
							'@id': `${$page.url.origin}/#website`
						},
						inLanguage: 'en-US',
						...(finalSeo.image?.url
							? {
									image: {
										'@type': 'ImageObject',
										'@id': `${$page.url.href}#primaryimage`,
										url: finalSeo.image.url,
										width: finalSeo.image.dimensions?.width,
										height: finalSeo.image.dimensions?.height
									}
							  }
							: {}),
						...(seo.schema[seo.schema.pageType]?.breadcrumb
							? {
									breadcrumb: {
										'@type': 'BreadcrumbList',
										'@id': `${$page.url.href}#breadcrumb`,
										itemListElement: seo.schema[seo.schema.pageType].breadcrumb.map(
											(item, index) => ({
												'@type': 'ListItem',
												position: index + 1,
												item: {
													'@type': 'WebPage',
													'@id': item.url,
													url: item.url,
													name: item.name
												}
											})
										)
									}
							  }
							: {}),
						...(seo.schema[seo.schema.pageType]?.author
							? {
									author: {
										'@type': 'Person',
										'@id': `${$page.url.origin}#${seo.schema[seo.schema.pageType].author.name
											.toLowerCase()
											.replace(/\s+/g, '-')}`,
										name: seo.schema[seo.schema.pageType].author.name,
										url: seo.schema[seo.schema.pageType].author.url,
										...(seo.schema[seo.schema.pageType].author.image?.url
											? {
													image: {
														'@type': 'ImageObject',
														'@id': `${$page.url.origin}#${seo.schema[
															seo.schema.pageType
														].author.name
															.toLowerCase()
															.replace(/\s+/g, '-')}-image`,
														url: seo.schema[seo.schema.pageType].author.image.url,
														width: seo.schema[seo.schema.pageType].author.image.dimensions?.width,
														height: seo.schema[seo.schema.pageType].author.image.dimensions?.height
													}
											  }
											: {})
									}
							  }
							: {})
					}
				]
			})}
		</script>
	{/if}
</svelte:head>
