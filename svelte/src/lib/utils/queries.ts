import { image, link, sections, siteSEO, pageSEO, media } from '$lib/utils/groq';

export const siteQuery = `*[_type == "site"][0]{
	navigation[]{
		_key,
		${link}
	},
	organization{
		name,
		description,
		logo {
			${image}
		},
		address,
	},
	socialLinks[]{
		_key,
		link {
			${link}
		}
	},
	${siteSEO}
}`;

export const settingsQuery = `*[_type == "settings"][0]{
	scripts[]{
		_type,
		content,
		src
	},
	redirects
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
	title,
	${pageSEO}
}`;

export const pageQuery = `*[_type == "page" && slug.current == $slug][0] {
	title,
	slug {
		current
	},
	${sections}
	${pageSEO}
}`;

export const projectQuery = `*[_type == "project" && slug.current == $slug][0] {
	title,
	slug {
		current
	},
	date,
	thumbnail {
		${image}
	},
	gallery[] {
		${image}
	},
	${sections}
	${pageSEO}
}`;

export const projectsPageQuery = `*[_type == "project"] {
	_id,
	title,
	slug {
		current
	},
	date,
	thumbnail {
		${media}
	},
}`;

export const productQuery = `{
	"details": *[_type == "product" && store.slug.current == $slug][0],
	"variants": *[_type == "productVariant" && store.productId == $productId]
}`;

export const productsQuery = `*[_type == "product"] {
	_id,
	"slug": store.slug,
	"productId": store.id,
}`;
