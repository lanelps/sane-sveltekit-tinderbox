<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart.svelte';

	let cartRef = $state<HTMLDivElement>();

	// Calculate total price
	const totalPrice = $derived(
		cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
	);

	onMount(async () => {
		await cart.initializeCart();
	});

	// Cart UI event handlers
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			cart.close();
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (cart.isOpen && cartRef && !cartRef.contains(target) && !event.defaultPrevented) {
			cart.close();
		}
	};

	const handleCheckout = async () => {
		try {
			const checkoutUrl = await cart.checkout();
			window.location.href = checkoutUrl;
		} catch (error) {
			console.error('Failed to checkout:', error);
		}
	};
</script>

<svelte:window onkeydown={handleKeyDown} onclick={handleClickOutside} />

<div
	class={[
		'pointer-events-none fixed inset-0 z-50 h-screen w-screen bg-black/50 transition-opacity',
		cart.isOpen ? 'opacity-100' : 'opacity-0'
	]}
	aria-hidden="true"
></div>

<div
	bind:this={cartRef}
	class={[
		'fixed top-0 right-0 z-50 h-full w-96 bg-gray-100 p-4 pb-22 shadow-lg transition-transform',
		cart.isOpen ? 'translate-x-0' : 'translate-x-full'
	]}
>
	{#if cart.items.length === 0}
		<p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold uppercase">
			Your cart is empty
		</p>
	{:else}
		<ul class="h-full space-y-4 overflow-hidden overflow-y-scroll bg-white p-4">
			{#each cart.items as item}
				<li class="border p-2">
					{#if item.image}
						<img src={item.image} alt={item.title} class="h-16 w-16 object-cover" />
					{/if}
					<div>
						<h3>{item.title} - {item.variantTitle}</h3>
						<p>${item.price}</p>
						<div>
							<button
								onclick={() => cart.updateQuantity(item.variantId, item.quantity - 1)}
								disabled={cart.isLoading}>-</button
							>
							<span>{item.quantity}</span>
							<button
								onclick={() => cart.updateQuantity(item.variantId, item.quantity + 1)}
								disabled={cart.isLoading}>+</button
							>
						</div>
						<button onclick={() => cart.removeItem(item.variantId)} disabled={cart.isLoading}>
							Remove
						</button>
					</div>
				</li>
			{/each}
		</ul>
		<div class="absolute right-0 bottom-0 left-0 h-22 p-4">
			<div class="flex w-full justify-between">
				<p>Total: ${totalPrice.toFixed(2)}</p>
				<button onclick={() => cart.clearItems()} disabled={cart.isLoading}>Clear Cart</button>
			</div>
			<button
				onclick={handleCheckout}
				disabled={cart.isLoading || !cart.cartId}
				class="mt-2 w-full bg-black p-2 text-white"
			>
				{cart.isLoading ? 'Processing...' : 'Proceed to Checkout'}
			</button>
		</div>
	{/if}
</div>
