<script lang="ts">
	import { page } from '$app/state';
	import { serializeSchema } from '$lib/utils/json-ld';
	import type { SEOPage, ParsedSiteData } from '$lib/types';
	import type {
		Schema,
		JsonLdOrganization,
		JsonLdWebPage,
		JsonLdBreadcrumbItem
	} from '$lib/utils/json-ld';

	interface Props {
		seo: SEOPage;
		title: string;
		settings: ParsedSiteData;
	}
	let { seo, title, settings }: Props = $props();

	// Compute basic SEO values with fallbacks
	const pageTitle = $derived(seo?.title || title || '');
	const siteTitle = $derived(settings?.seo?.title);
	const finalTitle = $derived(
		siteTitle ? `${pageTitle || ''} | ${siteTitle}` : pageTitle || siteTitle || ''
	);
	const finalDescription = $derived(seo?.description || settings?.seo?.description || '');
	const finalKeywords = $derived(seo?.keywords || settings?.seo?.keywords || []);
	const finalImage = $derived(seo?.image || settings?.seo?.image);

	// Generate breadcrumbs from URL
	const breadcrumbItems = $derived(() => {
		const paths = page.url.pathname.split('/').filter(Boolean);
		if (!paths.length) return null;

		return paths.map(
			(path: string, index: number) =>
				({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'WebPage',
						'@id': `${page.url.origin}/${paths.slice(0, index + 1).join('/')}`,
						name: path === 'projects' ? 'Projects' : pageTitle
					}
				}) satisfies JsonLdBreadcrumbItem
		);
	});

	// Compute organization schema
	const orgSchema = $derived(() => {
		if (!settings?.organization?.name || !page?.url?.origin) return null;

		const org: JsonLdOrganization = {
			'@type': 'Organization',
			'@id': `${page.url.origin}/#organization`,
			name: settings.organization.name,
			url: page.url.origin
		};

		if (settings.organization.logo?.src) {
			org.logo = {
				'@type': 'ImageObject',
				'@id': `${page.url.origin}/#logo`,
				url: settings.organization.logo.src,
				width: settings.organization.logo.width || 0,
				height: settings.organization.logo.height || 0,
				caption: settings.organization.name
			};
		}

		if (settings.organization.description) {
			org.description = settings.organization.description;
		}

		if (settings.organization.address) {
			org.address = {
				'@type': 'PostalAddress',
				streetAddress: settings.organization.address.street,
				addressLocality: settings.organization.address.city,
				addressRegion: settings.organization.address.state,
				postalCode: settings.organization.address.zipCode,
				addressCountry: settings.organization.address.country
			};
		}

		return org;
	});

	// Compute page schema
	const pageSchema = $derived(() => {
		if (!settings?.organization?.name || !page?.url?.href) return null;

		const schema: JsonLdWebPage = {
			'@type': seo?.schema?.type || 'WebPage',
			'@id': `${page.url.href}#webpage`,
			url: page.url.href,
			name: finalTitle,
			isPartOf: {
				'@id': `${page.url.origin}/#website`
			},
			inLanguage: 'en-US'
		};

		if (finalDescription) {
			schema.description = finalDescription;
		}

		if (finalImage?.url) {
			schema.image = {
				'@type': 'ImageObject',
				'@id': `${page.url.href}#primaryimage`,
				url: finalImage.url,
				width: finalImage.dimensions?.width || 0,
				height: finalImage.dimensions?.height || 0,
				caption: finalImage.alt || ''
			};
		}

		if (seo?.schema?.author?.name) {
			schema.author = {
				'@type': 'Person',
				name: seo.schema.author.name,
				url: seo.schema.author.url || '',
				...(seo.schema.author.image?.url && {
					image: {
						'@type': 'ImageObject',
						url: seo.schema.author.image.url,
						width: seo.schema.author.image.dimensions?.width || 0,
						height: seo.schema.author.image.dimensions?.height || 0,
						caption: seo.schema.author.name
					}
				})
			};
		}

		const items = breadcrumbItems();
		if (items) {
			schema.breadcrumb = {
				'@type': 'BreadcrumbList',
				'@id': `${page.url.href}#breadcrumb`,
				itemListElement: items
			};
		}

		return schema;
	});

	// Compute final schema
	const schema = $derived(() => {
		const items = [];
		const org = orgSchema();
		const page = pageSchema();

		if (org) items.push(org);
		if (page) items.push(page);

		if (!items.length) return null;

		return {
			'@context': 'https://schema.org',
			'@graph': items
		} satisfies Schema;
	});
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{finalTitle}</title>
	<meta name="robots" content="index,follow" />
	{#if finalDescription}
		<meta name="description" content={finalDescription} />
	{/if}
	{#if finalKeywords}
		<meta name="keywords" content={finalKeywords.join(', ')} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={finalTitle} />
	{#if finalDescription}
		<meta property="og:description" content={finalDescription} />
	{/if}
	{#if finalImage?.url}
		<meta property="og:image" content={finalImage.url} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={finalTitle} />
	{#if finalDescription}
		<meta name="twitter:description" content={finalDescription} />
	{/if}
	{#if finalImage?.url}
		<meta name="twitter:image" content={finalImage.url} />
	{/if}

	<!-- Favicon -->
	{#if settings?.seo?.favicon?.url}
		<link rel="icon" href={settings.seo.favicon.url} />
	{/if}

	<!-- JSON-LD Schema -->
	{#if seo?.schema}
		{@html schema() && serializeSchema(schema())}
	{/if}
</svelte:head>
