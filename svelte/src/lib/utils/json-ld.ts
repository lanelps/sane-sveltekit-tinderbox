import type { SchemaType } from '$lib/types';

// Use the existing types but extend them for JSON-LD structure
export interface JsonLdImage {
	'@type': 'ImageObject';
	'@id'?: string;
	url: string;
	width?: number;
	height?: number;
	caption?: string;
}

export interface JsonLdOrganization {
	'@type': 'Organization';
	'@id'?: string;
	name: string;
	url?: string;
	logo?: JsonLdImage;
	description?: string;
	address?: {
		'@type': 'PostalAddress';
		streetAddress: string;
		addressLocality: string;
		addressRegion: string;
		postalCode: string;
		addressCountry: string;
	};
}

export interface JsonLdPerson {
	'@type': 'Person';
	'@id'?: string;
	name: string;
	url?: string;
	image?: JsonLdImage;
}

export interface JsonLdBreadcrumbItem {
	'@type': 'ListItem';
	position: number;
	item: {
		'@type': 'WebPage';
		'@id': string;
		name: string;
	};
}

export interface JsonLdWebPage {
	'@type': SchemaType;
	'@id'?: string;
	url: string;
	name: string;
	description?: string;
	image?: JsonLdImage;
	author?: JsonLdPerson;
	isPartOf?: {
		'@id': string;
	};
	inLanguage?: string;
	breadcrumb?: {
		'@type': 'BreadcrumbList';
		'@id'?: string;
		itemListElement: JsonLdBreadcrumbItem[];
	};
}

export type SchemaValue = JsonLdOrganization | JsonLdPerson | JsonLdImage | JsonLdWebPage;

export interface Schema {
	'@context': 'https://schema.org';
	'@graph': SchemaValue[];
}

export function serializeSchema(thing: Schema | null) {
	if (!thing) return '';
	return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}
