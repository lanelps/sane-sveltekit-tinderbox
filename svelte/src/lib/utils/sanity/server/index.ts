import { SANITY_API_READ_TOKEN } from '$env/static/private';
import { sanityClient } from '$lib/utils/sanity/client';

export const serverClient = sanityClient.withConfig({
	token: SANITY_API_READ_TOKEN
});
