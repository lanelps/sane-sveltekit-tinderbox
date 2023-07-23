<script>
	import PageBuilder from '../components/PageBuilder.svelte';

	const sections = [
		{
			_type: 'exampleSection',
			_key: 'exampleSection',
			title: 'Example Section',
			body: 'This is an example section.'
		}
	];
</script>

<h1 class="col-span-full text-title">Welcome to Sane SvelteKit Tinderbox 🔥</h1>

<PageBuilder {sections} />
