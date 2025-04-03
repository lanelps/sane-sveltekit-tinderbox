import type { CartStore, CartItem } from '$lib/types';
import { removeLineItems, createNewCart } from '$lib/utils/shopify';

const createCart = (): CartStore => {
	let isOpen = $state(false);
	let items = $state<CartItem[]>([]);
	let cartId = $state<string | null>(null);

	const toggle = (e: Event): void => {
		e.stopPropagation();
		isOpen = !isOpen;
	};

	const open = (): void => {
		isOpen = true;
	};

	const close = (): void => {
		isOpen = false;
	};

	const addItem = (item: CartItem): void => {
		const existingItem = items.find((i) => i.variantId === item.variantId);

		if (existingItem) {
			items = items.map((cartItem) =>
				cartItem.variantId === item.variantId
					? {
							...cartItem,
							quantity: cartItem.quantity + item.quantity,
							// If the item has a Shopify ID and the existing one doesn't, use the new ID
							id: item.id || cartItem.id
						}
					: cartItem
			);
		} else {
			items = [...items, item];
		}

		// Open the cart when an item is added
		open();
	};

	const removeItem = (variantId: string): void => {
		items = items.filter((item) => item.variantId !== variantId);
	};

	const setItems = (newItems: CartItem[]): void => {
		items = newItems;
	};

	const clearItems = async (): Promise<void> => {
		const currentItems = items; // Explicitly preserve items

		// If we have a Shopify cart ID, we need to remove all items from the Shopify cart
		if (cartId && items.length > 0) {
			try {
				// Get all item IDs that exist in the Shopify cart
				const itemsToRemove = items.filter((item) => item.id).map((item) => item.id as string);

				// Remove all items from Shopify cart in a single call if there are any
				if (itemsToRemove.length > 0) {
					await removeLineItems({
						cartId: cartId,
						itemIds: itemsToRemove
					});
				}

				// Create a new cart in Shopify for a fresh start
				const newCartResponse = await createNewCart();

				// Update the cart store with the new cart ID and empty items
				items = [];
				cartId = newCartResponse.cartId;
			} catch (error) {
				console.error('Failed to clear Shopify cart:', error);
				// Restore the local cart items in case of an error
				items = currentItems;
			}
		} else {
			// No Shopify cart ID or no items, reset the local cart
			items = currentItems;
		}
	};

	const setCartId = (id: string): void => {
		cartId = id;
	};

	const updateQuantity = (variantId: string, newQuantity: number): void => {
		if (newQuantity < 1) return;

		items = items.map((item) =>
			item.variantId === variantId ? { ...item, quantity: newQuantity } : item
		);
	};

	// Function to update Shopify line item IDs when we get them from API responses
	const updateLineItemIds = (cartData: any): void => {
		if (!cartData || !cartData.lines || !cartData.lines.edges) return;

		const updatedItems = [...items];

		cartData.lines.edges.forEach(({ node }: any) => {
			const lineItem = node;
			const matchingItemIndex = updatedItems.findIndex(
				(item) => item.variantId === lineItem.merchandise.id
			);

			if (matchingItemIndex >= 0) {
				updatedItems[matchingItemIndex] = {
					...updatedItems[matchingItemIndex],
					id: lineItem.id
				};
			}
		});

		items = updatedItems;
	};

	return {
		get isOpen(): boolean {
			return isOpen;
		},
		get items(): CartItem[] {
			return items;
		},
		get cartId(): string | null {
			return cartId;
		},
		toggle,
		open,
		close,
		addItem,
		removeItem,
		setItems,
		setCartId,
		clearItems,
		updateQuantity,
		updateLineItemIds
	};
};

export const cart: CartStore = createCart();
