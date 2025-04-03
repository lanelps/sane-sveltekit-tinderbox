import { error } from '@sveltejs/kit';
import { fetchProduct } from '$lib/utils/data.server';

import type { ProductData } from '$lib/types';
import type { PageServerLoad } from './$types';
import type { QueryResponseInitial } from '@sanity/svelte-loader';

export const load: PageServerLoad = async ({
	params,
	locals: { loadQuery }
}): Promise<{ initial: QueryResponseInitial<ProductData>; seo: { title: string } }> => {
	try {
		const initial = await fetchProduct(loadQuery, { slug: params.slug });

		return {
			initial,
			seo: { title: initial?.data?.seo?.title || initial?.data?.store?.title }
		};
	} catch (err) {
		console.error(err);
		throw error(500, 'Internal Server Error');
	}
};
