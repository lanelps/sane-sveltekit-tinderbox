<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import type { CartItem, ProductVariant } from '$lib/types';

	const { title, variants = null } = $props<{
		title: string;
		variants: ProductVariant[];
	}>();

	let selectedVariant = $state<ProductVariant | null>(variants?.[0] || null);
	let quantity = $state(1);
	let error = $state<string | null>(null);
	let isLoading = $state(false);

	// Helper function to create cart item data
	const createCartItemData = (variant: ProductVariant): CartItem => ({
		id: '', // Will be set by cart store if using Shopify
		variantId: variant.store.gid,
		quantity,
		title: title,
		variantTitle: variant.store.title,
		price: variant.store.price,
		image: variant.store.previewImageUrl || ''
	});

	const addToCart = async () => {
		if (!selectedVariant) return;

		isLoading = true;
		error = null;

		try {
			await cart.addItem(createCartItemData(selectedVariant));
			// Reset quantity after adding
			quantity = 1;
		} catch (err) {
			console.error('Failed to add item to cart:', err);
			error = 'Failed to add item to cart. Please try again.';
		} finally {
			isLoading = false;
		}
	};

	const decrementQuantity = () => (quantity = Math.max(1, quantity - 1));
	const incrementQuantity = () => (quantity += 1);
</script>

<div>
	<select bind:value={selectedVariant} disabled={cart.isLoading}>
		{#each variants as variant}
			<option value={variant}>
				{variant.store.title} - ${variant.store.price}
				{variant.store.inventory.isAvailable ? '' : ' (Sold Out)'}
			</option>
		{/each}
	</select>

	<div>
		<button onclick={decrementQuantity} disabled={cart.isLoading}>-</button>
		<input type="number" bind:value={quantity} min="1" disabled={cart.isLoading} />
		<button onclick={incrementQuantity} disabled={cart.isLoading}>+</button>
	</div>

	<button
		onclick={addToCart}
		disabled={!selectedVariant?.store.inventory.isAvailable || cart.isLoading || isLoading}
	>
		{isLoading ? 'Adding...' : 'Add to Cart'}
	</button>

	{#if error}
		<p class="mt-2 text-red-500">{error}</p>
	{/if}
</div>
