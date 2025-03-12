<script lang="ts">
	import type { ProjectsPageData } from '$lib/types';
	import Link from '$lib/components/Link.svelte';

	interface Props {
		data: ProjectsPageData;
	}

	let { data }: Props = $props();
</script>

<h1>Projects</h1>

{#each data.projects as project}
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
	</Link>
{/each}
