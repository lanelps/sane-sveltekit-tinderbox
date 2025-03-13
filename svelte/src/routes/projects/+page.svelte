<script lang="ts">
	import type { ProjectsPageData } from '$lib/types';
	import Link from '$lib/components/Link.svelte';
	import Media from '$lib/components/Media.svelte';

	interface Props {
		data: ProjectsPageData;
	}

	let { data }: Props = $props();
</script>

<h1 class="col-span-full">Projects</h1>

<ul class="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	{#each data.projects as project (project._id)}
		<li>
			<Link
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
