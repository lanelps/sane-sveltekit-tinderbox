# Shopify Integration Removal Guide

**AI Agent Instructions**: This file contains step-by-step instructions for completely removing Shopify integration from the Sane SvelteKit Tinderbox boilerplate. Follow these steps precisely to convert the e-commerce boilerplate into a general-purpose CMS project.

## Overview

**Removing Sanity Product Schemas**

- The `product.tsx`, `productVariant.tsx`, and `collection.tsx` schemas are tightly coupled to Shopify's data model
- They contain Shopify-specific fields and references that won't work without the Shopify Connect app
- Removing them prevents schema conflicts and cleans up your content model for non-e-commerce use cases
- The `./objects/shopify/` directory contains helper schemas that only make sense in a Shopify context

This guide removes all Shopify-related schemas, components, and routes while preserving the core PageBuilder architecture for non-e-commerce projects.

## 1. Sanity CMS Cleanup

### Delete Shopify Schema Files

```bash
rm ./sanity/src/schemas/documents/product.tsx
rm ./sanity/src/schemas/documents/collection.tsx
rm ./sanity/src/schemas/documents/productVariant.tsx
rm -rf ./sanity/src/schemas/objects/shopify/
```

### Update Schema Index (`./sanity/src/schemas/index.ts`)

Remove these imports and exports:

- `collectionType` from `'./documents/collection'`
- `productType` from `'./documents/product'`
- `productVariantType` from `'./documents/productVariant'`
- All `./objects/shopify/*` imports

### Update Constants (`./sanity/src/constants.ts`)

Remove from `SECTION_REFERENCES`:

- `{ type: 'section.productsList' }`

### Update Desk Structure (`./sanity/src/lib/desk.ts`)

Remove from `documents` array:

- `collectionType.name`
- `productType.name`
- `productVariantType.name`

### Update Sanity Config (`./sanity/sanity.config.ts`)

No Shopify plugins to remove - config is already clean.

### Run Data Migration

Remove existing Shopify data from your dataset using the pre-built migration:

```bash
cd ./sanity

# Test the migration (dry run)
sanity migration run remove-shopify

# Run the migration for real
sanity migration run remove-shopify --no-dry-run
```

**Note**: The migration targets `product`, `productVariant`, and `collection` document types. If any documents have strong references, they cannot be deleted and will need manual cleanup.

## 2. SvelteKit Frontend Cleanup

### Delete Product Components & Routes

```bash
rm ./svelte/src/lib/components/sections/ProductsList.svelte
rm -rf ./svelte/src/routes/products/
```

### Update PageBuilder (`./svelte/src/lib/components/PageBuilder.svelte`)

Remove:

- `import ProductsList` statement
- `section._type === 'section.productsList'` condition block

### Update TypeScript Types (`./svelte/src/lib/types/sections.ts`)

Remove:

- `ProductsListSection` interface
- `| ProductsListSection` from `Section` union type

### Update GROQ Fragments (`./svelte/src/lib/utils/groq.ts`)

Remove:

- `productsList` section fragment from `sectionsFragment`
- `productFragment`, `collectionFragment` (if they exist)

### Update Queries (`./svelte/src/lib/utils/queries.ts`)

Remove any product/collection queries:

- `productQuery`, `productsQuery`, `collectionQuery`, etc.

### Update Query Hooks (`./svelte/src/lib/utils/queryHooks.ts`)

Remove any product/collection hooks:

- `useProduct`, `useProducts`, `useCollection`, etc.

## 3. Dependencies & Config

### Clean Environment Variables

Remove from `.env.local`, `.env.example`:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`

## 4. Verification Steps

After removal, verify:

1. **Build Check**: `pnpm build` in both workspaces succeeds
2. **TypeScript**: No type errors remain
3. **Routes**: All remaining routes load correctly
4. **Sanity Studio**: Schemas load without errors

## Result

Clean content management boilerplate with PageBuilder architecture, ready for non-e-commerce projects.
