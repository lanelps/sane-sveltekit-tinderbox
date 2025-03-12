<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { Snippet } from 'svelte';

	import ExternalIcon from '$lib/assets/svg/External.svelte';
	import DownloadIcon from '$lib/assets/svg/Download.svelte';

	import type { Link, InternalLink, ExternalLink, FileLink } from '$lib/types';

	interface Props {
		class?: string;
		link: Link;
		label?: string;
		children?: Snippet;
		ariaLabel?: string;
	}

	let { link, label, class: className, children, ariaLabel }: Props = $props();

	// Type guards
	const isString = (value: unknown): value is string => typeof value === 'string';
	const isExternal = (value: unknown): value is ExternalLink =>
		typeof value === 'object' && value !== null && (value as any).type === 'external';
	const isInternal = (value: unknown): value is InternalLink =>
		typeof value === 'object' && value !== null && (value as any).type === 'internal';
	const isFile = (value: unknown): value is FileLink =>
		typeof value === 'object' && value !== null && (value as any).type === 'file';

	const ignoreInternalTypes = ['homePage', 'page'];

	const getLabel = (): string | null => {
		if (label) return label;
		if (typeof link === 'object' && link !== null && 'label' in link) return link.label;
		return null;
	};

	const getHref = (): string => {
		if (isString(link)) return link;
		if (isExternal(link)) return link.url;
		if (isFile(link)) return link.file.asset.url;
		if (isInternal(link)) {
			const { _type, slug } = link.reference;
			return ignoreInternalTypes.includes(_type)
				? `/${slug.current}`
				: `/${_type}s/${slug.current}`;
		}
		return '#';
	};

	const getLinkProps = () => {
		const props: Record<string, string | boolean> = {
			role: 'link',
			tabindex: '0'
		};

		if (isExternal(link)) {
			props.target = link.newTab ? '_blank' : '_self';
			props.rel = 'noopener noreferrer';
			props['aria-label'] = ariaLabel || `${getLabel()} (opens in new tab)`;
		} else if (isFile(link)) {
			props.download = true;
			props.target = '_blank';
			props['aria-label'] = ariaLabel || `Download ${getLabel()}`;
		} else if (ariaLabel || getLabel()) {
			props['aria-label'] = ariaLabel || getLabel() || '';
		}

		return props;
	};

	const linkClass = twMerge(
		'inline-block text-main w-max hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all',
		className
	);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			(event.currentTarget as HTMLAnchorElement).click();
		}
	};
</script>

<a class={linkClass} href={getHref()} {...getLinkProps()} onkeydown={handleKeyDown}>
	{#if getLabel()}
		<span class="inline-flex items-center gap-1">
			{getLabel()}
			{#if isExternal(link)}
				<span class="sr-only">(opens in new tab)</span>
				<ExternalIcon class="h-4 w-4" />
			{:else if isFile(link)}
				<span class="sr-only">(download file)</span>
				<DownloadIcon class="h-4 w-4" />
			{/if}
		</span>
	{:else if children}
		{@render children()}
	{/if}
</a>
