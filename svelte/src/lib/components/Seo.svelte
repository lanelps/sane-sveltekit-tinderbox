<script lang="ts">
	import { page } from '$app/state';
	import { serializeSchema } from '$lib/utils/json-ld';
	import type { SEOPage, SiteData } from '$lib/types';
	import type {
		Schema,
		JsonLdOrganization,
		JsonLdWebPage,
		JsonLdBreadcrumbItem
	} from '$lib/utils/json-ld';
	import { urlFor, getImageProps } from '$lib/utils/sanity/client/image';

	interface Props {
		seo: SEOPage;
		title: string;
		site: SiteData;
	}
	let { seo, title, site }: Props = $props();

	// Compute basic SEO values with fallbacks
	const pageTitle = $derived(seo?.title || title || '');
	const siteTitle = $derived(site?.seo?.title);
	const finalTitle = $derived(
		pageTitle && siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle || siteTitle || ''
	);
	const finalDescription = $derived(seo?.description || site?.seo?.description || '');
	const finalKeywords = $derived(seo?.keywords || site?.seo?.keywords || []);
	const finalImage = $derived(
		seo?.image
			? getImageProps({ image: seo.image })
			: site?.seo?.image && getImageProps({ image: site.seo.image })
	);

	const finalFavicon = $derived(site?.seo?.favicon && urlFor(site.seo.favicon).width(512).url());

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
		if (!site?.organization?.name || !page?.url?.origin) return null;

		const organizationLogo =
			site.organization.logo && getImageProps({ image: site.organization.logo });

		const org: JsonLdOrganization = {
			'@type': 'Organization',
			'@id': `${page.url.origin}/#organization`,
			name: site.organization.name,
			url: page.url.origin
		};

		if (organizationLogo?.src) {
			org.logo = {
				'@type': 'ImageObject',
				'@id': `${page.url.origin}/#logo`,
				url: organizationLogo.src,
				width: organizationLogo.width || 0,
				height: organizationLogo.height || 0,
				caption: site.organization.name
			};
		}

		if (site.organization.description) {
			org.description = site.organization.description;
		}

		if (site.organization.address) {
			org.address = {
				'@type': 'PostalAddress',
				streetAddress: site.organization.address.street,
				addressLocality: site.organization.address.city,
				addressRegion: site.organization.address.state,
				postalCode: site.organization.address.zipCode,
				addressCountry: site.organization.address.country
			};
		}

		return org;
	});

	// Compute page schema
	const pageSchema = $derived(() => {
		if (!site?.organization?.name || !page?.url?.href) return null;

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

		if (finalImage?.src) {
			schema.image = {
				'@type': 'ImageObject',
				'@id': `${page.url.href}#primaryimage`,
				url: finalImage.src,
				width: finalImage.width || 0,
				height: finalImage.height || 0,
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
	{#if finalImage?.src}
		<meta property="og:image" content={finalImage.src} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={finalTitle} />
	{#if finalDescription}
		<meta name="twitter:description" content={finalDescription} />
	{/if}
	{#if finalImage?.src}
		<meta name="twitter:image" content={finalImage.src} />
	{/if}

	<!-- Favicon -->
	{#if finalFavicon}
		<link rel="icon" href={finalFavicon} />
	{/if}

	<!-- JSON-LD Schema -->
	{#if seo?.schema}
		{@html schema() && serializeSchema(schema())}
	{/if}
</svelte:head>
