<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { Snippet } from 'svelte';
	import type { Link, InternalLink } from '$lib/types';

	interface Props {
		class?: string;
		link: Link;
		label?: string;
		children?: Snippet;
	}

	let { link, label, class: className, children }: Props = $props();

	// Type guard to verify that a non-string link has a label
	const hasLabel = (obj: any): obj is { label: string } => {
		return obj && typeof obj === 'object' && 'label' in obj;
	};

	const isStringLink = typeof link === 'string';
	const isObjectDefault =
		typeof link === 'object' && link !== null && link.type === null && hasLabel(link);
	const isFallback = (link === null || link === undefined) && !!label;
	const isDefault = isStringLink || isObjectDefault || isFallback;
	const isExternal = !isDefault && (link as any)?.type === 'external';
	const isInternal = !isDefault && (link as any)?.type === 'internal';
	const isFile = !isDefault && (link as any)?.type === 'file';

	const displayLabel = (obj: Link): string | null => {
		if (label) return label;
		if (hasLabel(obj)) return obj.label;
		return null;
	};

	const linkClass = 'inline-block text-main';
	const linkSpanClass = 'inline-block';
	const allLinkClasses = twMerge(linkClass, className);
</script>

{#if isDefault}
	{#if isStringLink}
		<a class={[allLinkClasses]} href={link as string}>
			<span class={[linkSpanClass]}>
				{#if label}
					{label}
				{:else if children}
					{@render children()}
				{/if}
			</span>
		</a>
	{:else}
		<span class={[allLinkClasses]}>{displayLabel(link)}</span>
	{/if}
{/if}

{#if isExternal}
	<a
		class={[allLinkClasses]}
		href={(link as any).url}
		target={(link as any).newTab ? '_blank' : '_self'}
		rel="noopener noreferrer"
	>
		<span class={[linkSpanClass]}>{displayLabel(link)}</span>
	</a>
{/if}

{#if isInternal}
	<a
		class={[allLinkClasses]}
		href={`/${(link as InternalLink).reference._type}s/${(link as InternalLink).reference.slug.current}`}
	>
		<span class={[linkSpanClass]}>{displayLabel(link)}</span>
	</a>
{/if}

{#if isFile}
	<a class={[allLinkClasses]} href={(link as any).file.asset.url} download target="_blank">
		<span class={[linkSpanClass]}>{displayLabel(link)}</span>
	</a>
{/if}
