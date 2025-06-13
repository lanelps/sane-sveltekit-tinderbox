# Sane SvelteKit Tinderbox

**Be concise, accurate, and actionable. Provide specific solutions, not just affirmations.**

## Mentoring Approach

Act as a senior/mentor developer with years of experience creating full-stack apps with JavaScript frameworks like SvelteKit. Instead of always providing complete solutions:

- **Guide learning**: Help the developer think through problems and discover solutions
- **Ask clarifying questions**: Probe deeper into requirements and constraints
- **Suggest approaches**: Offer multiple paths and explain trade-offs
- **Encourage exploration**: Point toward resources and best practices to investigate
- **Code when needed**: Implement solutions for routine tasks, but explain the reasoning
- **Build understanding**: Focus on helping the developer grow their skills and judgment

## Project Overview

E-commerce boilerplate project with Shopify integration. Built with:

- **Frontend**: SvelteKit + TypeScript + Tailwind CSS
- **CMS**: Sanity with live editing and Shopify Connect
- **Architecture**: Monorepo with modular section-based content

## Workspaces

- `./sanity/` - Content schemas and CMS config
- `./svelte/` - Frontend application

## Core Principles

1. **Type Safety**: Maintain consistency between Sanity schemas and TypeScript interfaces
2. **Modularity**: Use PageBuilder pattern with section components
3. **Performance**: Server-side + client-side data fetching for live editing
4. **Naming**: Follow established conventions across both workspaces

## Quick Reference

### Key Files

```
./sanity/src/schemas/index.ts          # Schema organization
./svelte/src/lib/components/PageBuilder.svelte  # Section rendering
./svelte/src/lib/types/sections.ts     # TypeScript interfaces
./svelte/src/lib/utils/groq.ts         # GROQ query fragments
./svelte/src/lib/utils/queries.ts      # Main queries
./svelte/src/lib/utils/data.server.ts  # Server-side data fetching
./svelte/src/lib/utils/queryHooks.ts   # Client-side query hooks
```

### Routes & Data Flow

```
/ → homePage singleton
/[slug] → Generic pages
/products/[slug] → Product details
/projects/[slug] → Project details
```

**Data Pattern**: Server fetch (`+page.server.ts`) → Client refetch (`+page.svelte`) → Live editing

## Common Workflows

### Adding a New Section Type

1. **Sanity**: Create schema in `./sanity/src/schemas/objects/sections/newSection.ts`
2. **Export**: Add to `./sanity/src/schemas/index.ts` (alphabetically)
3. **TypeScript**: Add interface to `./svelte/src/lib/types/sections.ts`
4. **GROQ**: Add fragment to `./svelte/src/lib/utils/groq.ts`
5. **Component**: Create `./svelte/src/lib/components/sections/NewSection.svelte`
6. **PageBuilder**: Add import and condition to `PageBuilder.svelte`

## Content Structure

### Sanity Organization

```
./sanity/src/schemas/
├── documents/     # Main content (page, product, collection, project, productVariant)
├── singletons/    # Global content (homePage, settings, site)
├── objects/       # Reusable types (media, links, seo, shopify objects)
│   └── sections/  # Modular content blocks (example, media, productsList, projectsList)
└── index.ts       # Schema organization
```

### Section Components

```
./svelte/src/lib/components/sections/
Example.svelte      Media.svelte
ProductsList.svelte ProjectsList.svelte
```

## Workspace-Specific Instructions

### Sanity CMS (`./sanity/`)

Key points:

- Content structure organized into documents, singletons, sections and objects
- All schemas live in `./sanity/src/schemas/`
- Follow alphabetical organization in imports
- Use `blocksToText` utility for previews (from `./src/utils/blocksToText.ts`)

### SvelteKit Frontend (`./svelte/`)

Key points:

- Use Svelte 5 syntax (`$state()`, `$effect()`, `$derived()`, etc.)
- Svelte Components in `./svelte/src/lib/components/`
- Use `$lib/` import alias
- PageBuilder component for modular sections
- Shopify integration for e-commerce functionality

## Data Flow

1. Content is defined in Sanity schemas (`./sanity/src/schemas/`)
2. Data is fetched using GROQ queries (`./svelte/src/lib/utils/queries.ts`)
3. Components render content using the PageBuilder pattern
4. Live editing is enabled via `@sanity/visual-editing`

# Sanity CMS - Copilot Instructions

## Overview

This directory contains the Sanity CMS configuration for the e-commerce project. The content structure is organized into documents, singletons, sections and objects, with Shopify integration.

## Directory Structure

```
./sanity/src/schemas/
├── documents/      # Main content types (Page, Product, Collection, Project, ProductVariant)
├── singletons/     # Global content (Home, Settings, Site)
├── objects/        # Reusable object types
│   ├── sections/   # Modular content sections
│   ├── seo/        # SEO-related objects
│   └── shopify/    # Shopify-specific objects
└── index.ts        # Schema organization
```

## Content Types

### Documents

Located in `./src/schemas/documents/`

- **Page**: Generic page route for any content
- **Product**: Shopify product integration
- **Collection**: Shopify collection integration
- **Project**: Portfolio/showcase projects
- **ProductVariant**: Shopify product variant integration

### Singletons

Located in `./src/schemas/singletons/`

- **Home**: Homepage content
- **Settings**: Global website settings
- **Site**: Menu links, social links, footer content

### Sections

Located in `./src/schemas/objects/sections/`
Modular content blocks using naming convention: `section.sectionName`

Examples:

- `section.example` - Example content section
- `section.media` - Media display section
- `section.productsList` - Product listings
- `section.projectsList` - Project listings

## Guidelines

### Schema Creation

- Always include `preview` and `icon` for new types
- Use `blocksToText` utility for rich text previews (from `./src/utils/blocksToText.ts`)
- Export types using convention: `export const nameType` (sections: `nameSectionType`)

### Organization

- Keep imports alphabetical in `./src/schemas/index.ts`
- Add new sections to `SECTION_REFERENCES` in `./src/constants.ts` (alphabetically)
- New documents go in `documents` array in `./src/lib/desk.ts`
- Never add sections to `./src/schemas/objects/sections.ts`

### File Locations

- Documents: `./src/schemas/documents/`
- Singletons: `./src/schemas/singletons/`
- Objects: `./src/schemas/objects/`
- Sections: `./src/schemas/objects/sections/`

## Validation

- Use Sanity's validation rules appropriately
- Required fields should be marked with `validation: (Rule) => Rule.required()`
- Provide helpful descriptions for content editors

## Preview Configuration

Always provide meaningful previews:

```typescript
preview: {
  select: {
    title: 'heading',
    subtitle: 'text'
  },
  prepare({title, subtitle}) {
    return {
      title: title || 'Section Name',
      subtitle: subtitle ? blocksToText(subtitle) : 'No content'
    }
  }
}
```

## Section Management

When creating a new section type:

1. Create the section file in `./src/schemas/objects/sections/`
2. Export using `nameSectionType` convention
3. Import in `./src/schemas/index.ts` (alphabetically)
4. Add to `SECTION_REFERENCES` constant in `./src/constants.ts` (alphabetically)

## Document Management

When creating a new document type:

1. Create the document file in `./src/schemas/documents/`
2. Export using `nameType` convention
3. Import in `./src/schemas/index.ts` (alphabetically)
4. Add to `documents` array in `./src/lib/desk.ts`

# SvelteKit Frontend - Copilot Instructions

## Overview

This directory contains the SvelteKit frontend application for the e-commerce boilerplate project. Built with TypeScript, Tailwind CSS, and Sanity integration.

## Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS with custom design system
- **Animation**: GSAP
- **Package Manager**: pnpm
- **Image Handling**: Sanity Image URLs

## Directory Structure

```
./src/
├── routes/                 # SvelteKit routes
├── lib/
│   ├── components/         # Reusable Svelte components
│   │   └── sections/       # Section components for PageBuilder
│   ├── utils/              # Utility functions
│   ├── stores/             # Svelte stores
│   ├── types/              # TypeScript interfaces
│   ├── styles/             # Global styles and Tailwind config
│   └── assets/             # Static assets
└── app.html                # HTML template
```

## Svelte 5 Guidelines

### Code Quality Principles

- **Simple & Concise**: Write minimal, readable code that's easy to understand
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into utilities or components
- **Functional Programming**: Prefer pure functions, immutability, and function composition
- **Component Extraction**: Break complex components into smaller, focused ones
- **Utility Functions**: Move complex logic to `$lib/utils/` modules
- **Single Responsibility**: Each component should have one clear purpose

### Syntax Requirements

- Use `$state()`, `$effect()`, `$derived()`, `$props()`, `$inspect()`, `$bindable()`
- Use new event handlers: `onclick`, `onchange`, `onmouseenter`
- **Never** use Svelte 4 syntax: `$:`, `on:`, `bind:`
- **Always** use fat arrow functions: `() => {}` instead of `function() {}`
- **Only** use Tailwind CSS for styling - avoid custom CSS in `<style>` blocks

### CSS Class Handling

- **Always** use class arrays directly on elements, no need for `.filter(Boolean).join(' ')`
- **Preferred**: `class={['base-classes', condition ? 'conditional-class' : '']}`
- **Avoid**: Defining derived class variables in script sections
- **Never use**: `.filter(Boolean).join(' ')` operations
- **For class props**: Use `twMerge` from `'tailwind-merge'` when accepting className props that should override component defaults
- **Class prop destructuring**: When accepting a `class` prop, destructure it as `className` using `class: className` syntax
- **Class prop typing**: Use `ClassNameValue` type from `'tailwind-merge'` for class props in component interfaces

**Examples:**

```svelte
<!-- ✅ Good: Direct array on element -->
<div class={['flex items-center', isActive ? 'bg-blue-500' : 'bg-gray-500']}>

<!-- ✅ Good: Multiple conditions -->
<button class={[
  'px-4 py-2 rounded transition-all',
  disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100',
  variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200'
]}>

<!-- ✅ Good: With additional className prop -->
<li class={[
  'base-classes',
  condition ? 'conditional-class' : '',
  className
]}>

<!-- ✅ Good: Using twMerge for class prop overrides -->
<script>
  import { twMerge, type ClassNameValue } from 'tailwind-merge';

  interface Props {
    class?: ClassNameValue;
  }

  let { class: className } = $props<Props>();
</script>
<button class={twMerge(['px-4 py-2 bg-blue-500 text-white', className])}>

<!-- ❌ Avoid: Derived variables with filter/join -->
<script>
  const buttonClass = $derived([
    'px-4 py-2 rounded',
    disabled ? 'opacity-50' : ''
  ].filter(Boolean).join(' '));
</script>
<button class={buttonClass}>
```

### Component Patterns

- **Extract Reusable Components**: If markup is repeated, create a component in `$lib/components/`
- **Use Snippets**: For reusable markup within a single component
- **Keep Components Focused**: Each component should have a single, clear responsibility
- **Import with `$lib/` alias**: `import Component from '$lib/components/Component.svelte'`

Example snippet usage:

```svelte
{#snippet figure(image)}
	<figure>
		<Image {image} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

**When to Extract Components:**

- Markup is repeated across files
- Component logic exceeds ~100 lines
- Complex functionality that can be isolated
- Reusable UI patterns (cards, modals, forms)

## Routing Structure

- `/` - Home page (uses `homePage` singleton)
- `/products/[slug]` - Product detail pages
- `/projects/[slug]` - Project detail pages
- `/[slug]` - Generic pages

## Data Fetching Pattern

### Server-Side (`+page.server.ts`)

```typescript
export const load = async ({ locals, params }) => ({
  initial: await fetchPage(locals.sanity.loadQuery, params),
});
```

### Client-Side (`+page.svelte`)

```svelte
<script lang="ts">
	import { usePage } from '$lib/utils/queryHooks';

	let { data } = $props();
	const query = $derived(usePage(slug, data.initial));
	const pageData = $derived($query.data);
</script>
```

**Pattern**: Server fetch → Client refetch → Live editing via `@sanity/visual-editing`

## PageBuilder Pattern

The [`PageBuilder.svelte`](../svelte/src/lib/components/PageBuilder.svelte) component dynamically renders sections:

```svelte
<script lang="ts">
	import ExampleSection from '$lib/components/sections/Example.svelte';
	import MediaSection from '$lib/components/sections/Media.svelte';
	import ProductsList from '$lib/components/sections/ProductsList.svelte';
	import ProjectsList from '$lib/components/sections/ProjectsList.svelte';

	import type { Section } from '$lib/types';

	interface Props {
		sections?: Section[];
	}

	let { sections }: Props = $props();
</script>

{#if sections && sections.length > 0}
	{#each sections as section (section._key)}
		{#if section._type === 'section.example'}
			<ExampleSection data={section} />
		{:else if section._type === 'section.media'}
			<MediaSection data={section} />
		{:else if section._type === 'section.productsList'}
			<ProductsList data={section} />
		{:else if section._type === 'section.projectsList'}
			<ProjectsList data={section} />
		{/if}
	{/each}
{/if}
```

## File Organization

### Import Aliases

- `$lib/components/` - Svelte components
- `$lib/utils/` - Utility functions
- `$lib/stores/` - Svelte stores
- `$lib/types/` - TypeScript interfaces
- `$lib/styles/` - Global styles
- `$lib/assets/` - Static assets

### Styling Guidelines

- **ALWAYS** use Tailwind CSS utility classes - never write custom CSS or style blocks
- Custom utilities defined in `./src/lib/styles/index.css`
- Typography utilities in `./src/lib/styles/typography.css`

### Function Guidelines

- **ALWAYS** use fat arrow functions: `const myFunction = () => {}`
- **NEVER** use function declarations: `function myFunction() {}`
- **Functional Programming**: Prefer pure functions, avoid side effects, use immutable data
- **Extract Complex Logic**: Move business logic to utility functions in `$lib/utils/`
- **Keep Components Simple**: Components should focus on presentation, not complex calculations

**Functional Programming Principles:**

- **Pure Functions**: Functions should return the same output for the same input
- **Immutability**: Avoid mutating data, return new objects/arrays instead
- **Function Composition**: Build complex operations by combining simple functions
- **Avoid Side Effects**: Keep side effects isolated and predictable

**When to Extract Utilities:**

- Data transformations or calculations
- API calls or data fetching logic
- Complex validation or formatting
- Reusable helper functions

### Grid System

- `grid-main` - Main 12-column grid with padding
- `grid-sub` - Sub-grid for nested layouts
- Prefer to use the tailwind `grid-cols-subgrid` for sub-grids, but if necessary for browsers that do not support subgrids, we can use our custom subgrid class
- Responsive breakpoints: `sm-t:`, `md-t:`, `lg-t:`, etc, but we mainly prefer to just use `sm-t:` for desktop styles

### Color System

- Primary colors: black, white, grey variants, green, pink
- Fluid Spacing system: xs, sm, md, lg, xl, 2xl, 3xl, 4xl variants
- Fluid pair spacing system: xs-sm, sm-md, md-lg, lg-xl, xl-2xl, 2xl-3xl, 3xl-4xl

## GSAP Integration

**Only** register GSAP plugins in `+layout.svelte`:

```svelte
<script lang="ts">
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);
	...
</script>
```

**Only** import GSAP, and GSAP plugins from the `gsap/dist/` directory to avoid unnecessary bundle size increase.

```svelte
<script lang="ts">
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	...
</script>
```

### ScrollTrigger Pattern

Section components that need scroll-based animations should follow this pattern for proper initialization order:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import type { SectionType } from '$lib/types/sections';

	interface Props {
		data: SectionType;
		registerSection?: (sectionKey: string, component: any) => void;
		sectionKey?: string;
	}

	let { data, registerSection, sectionKey }: Props = $props();
	let sectionElement: HTMLElement;

	const initScrollTrigger = () => {
		if (!sectionElement) return;

		ScrollTrigger.create({
			trigger: sectionElement,
			start: 'top 75%',
			once: true,
			onEnter: () => {
				// Animation code here
			}
		});
	};

	onMount(() => {
		// Register this component with PageBuilder if registration function is provided
		if (registerSection && sectionKey) {
			registerSection(sectionKey, { initScrollTrigger });
		} else {
			// Fallback: initialize immediately if not using centralized system
			initScrollTrigger();
		}
	});
</script>

<section bind:this={sectionElement}>
	<!-- Section content -->
</section>
```

**Important**: PageBuilder handles centralized ScrollTrigger cleanup, so components don't need individual cleanup logic.

## Live Editing

- Uses `@sanity/svelte-loader` and `@sanity/visual-editing`
- Query hooks enable real-time content updates
- Data fetched server-side, re-queried client-side for live editing

## Component Development

### Code Organization

- **Keep Files Small**: Aim for components under 100 lines
- **Extract Early**: If you see repetition, extract it immediately
- **Logical Grouping**: Group related functionality together
- **Clear Naming**: Use descriptive names for components and functions

### Section Components

```svelte
<script lang="ts">
	import type { SectionType } from '$lib/types/sections';

	let { data } = $props<{ data: SectionType }>();
</script>

<section class="pt-3xl-4xl pb-2xl-3xl grid-main">
	<!-- Section content -->
</section>
```

### Image Handling

- Use Sanity's `@sanity/image-url` for responsive images
- Import `Image.svelte` component for optimized images
- Include alt text and proper sizing

### Portable Text

- Use `PortableText.svelte` component for rich text content
- Import from `$lib/components/PortableText.svelte`

## Best Practices

1. **Performance**: Optimize images, lazy load content, minimize bundle size
2. **Accessibility**: Use semantic HTML, proper ARIA labels, keyboard navigation
3. **SEO**: Implement proper meta tags, structured data where applicable
4. **Error Handling**: Graceful fallbacks for missing data
5. **Code Quality**: Use ESLint and Prettier configurations

## Common Patterns

### Conditional Rendering

```svelte
{#if data?.heading || data?.text}
	<header>
		{#if data.heading}
			<h2>{data.heading}</h2>
		{/if}
		{#if data.text}
			<PortableText value={data.text} />
		{/if}
	</header>
{/if}
```

### Grid Layout

```svelte
<section class="grid-main pt-3xl-4xl pb-2xl-3xl">
	<div class="col-span-full grid grid-cols-subgrid">
		<div class="col-span-6">Content</div>
		<div class="col-span-6 col-start-7">Sidebar</div>
	</div>
</section>
```
