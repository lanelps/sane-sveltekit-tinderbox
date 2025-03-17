<script lang="ts">
	import { page } from '$app/state';
	import Link from '$lib/components/Link.svelte';
	import Media from '$lib/components/Media.svelte';

	import { useProjectsPage } from '$lib/utils/queryHooks';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = useProjectsPage(data.initial);
	const { data: projects, loading, encodeDataAttribute } = $derived($query);
</script>

{#if loading}
	<p>Loading...</p>
{:else}
	<h1 class="col-span-full">Projects</h1>

	<ul class="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each projects as project (project._id)}
			<li>
				<Link
					class="w-full"
					link={{
						type: 'internal',
						label: project.title,
						reference: {
							_type: 'project',
							_id: project.slug.current,
							title: project.title,
							slug: project.slug
						}
					}}
				>
					<h2>{project.title}</h2>
					<Media media={project.thumbnail} />
				</Link>
			</li>
		{/each}
	</ul>
{/if}
