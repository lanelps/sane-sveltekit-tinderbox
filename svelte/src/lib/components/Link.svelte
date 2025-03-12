<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { Snippet } from 'svelte';
	import type { Link, InternalLink, ExternalLink, FileLink } from '$lib/types';

	interface Props {
		class?: string;
		link: Link;
		label?: string;
		children?: Snippet;
	}

	let { link, label, class: className, children }: Props = $props();

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
		if (isExternal(link)) {
			return {
				target: link.newTab ? '_blank' : '_self',
				rel: 'noopener noreferrer'
			};
		}
		if (isFile(link)) {
			return {
				download: true,
				target: '_blank'
			};
		}
		return {};
	};

	const linkClass = 'inline-block text-main w-max';
	const allLinkClasses = twMerge(linkClass, className);
</script>

<a class={[allLinkClasses]} href={getHref()} {...getLinkProps()}>
	{#if getLabel()}
		{getLabel()}
	{:else if children}
		{@render children()}
	{/if}
</a>
