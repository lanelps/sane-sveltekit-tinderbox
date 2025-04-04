import type {
	CartStore,
	CartItem,
	ShopifyCartResponse,
	ShopifyCart,
	ShopifyCartLineItem
} from '$lib/types';
import * as shopify from '$lib/utils/shopify';

const createCart = (): CartStore => {
	let isOpen = $state(false);
	let items = $state<CartItem[]>([]);
	let cartId = $state<string | null>(null);
	let isLoading = $state(false);

	// UI control methods
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

	// Helper function to convert Shopify cart items to local format
	const convertShopifyCartItems = (response: ShopifyCartResponse): CartItem[] => {
		if (!response?.cart?.lines?.edges) return [];

		return response.cart.lines.edges.map(({ node }: { node: ShopifyCartLineItem }) => ({
			id: node.id,
			variantId: node.merchandise.id,
			quantity: node.quantity,
			title: node.merchandise.product.title,
			variantTitle: node.merchandise.title,
			price: parseFloat(node.merchandise.priceV2.amount),
			image: node.merchandise.image?.originalSrc || ''
		}));
	};

	// Sync cart from Shopify
	const syncCartFromShopify = async (): Promise<void> => {
		if (!cartId) return;

		try {
			isLoading = true;
			const response: ShopifyCartResponse = await shopify.getCart({ cartId });
			if (response?.cart) {
				items = convertShopifyCartItems(response);
				updateLineItemIds(response.cart);
			}
		} catch (error) {
			console.error('Failed to sync cart from Shopify:', error);
		} finally {
			isLoading = false;
		}
	};

	// Initialize Shopify cart
	const initializeCart = async (): Promise<void> => {
		try {
			isLoading = true;
			const { cartId: newCartId } = await shopify.initializeCart();
			cartId = newCartId;

			if (cartId) {
				await syncCartFromShopify();
			}
		} catch (error) {
			console.error('Failed to initialize cart:', error);
		} finally {
			isLoading = false;
		}
	};

	// Add item to cart (both local and Shopify)
	const addItem = async (item: CartItem): Promise<void> => {
		try {
			isLoading = true;

			// If we have a Shopify cartId, add to Shopify first
			if (cartId) {
				const response: ShopifyCartResponse = await shopify.addToCart({
					cartId,
					variantId: item.variantId,
					quantity: item.quantity
				});

				// Extract the line item ID from the response
				const lineItem = response.cart.lines.edges.find(
					({ node }: { node: ShopifyCartLineItem }) => node.merchandise.id === item.variantId
				);

				// Update the item with the line item ID
				if (lineItem) {
					item = { ...item, id: lineItem.node.id };
				}
			}

			// Update local cart state
			const existingItem = items.find((i) => i.variantId === item.variantId);

			if (existingItem) {
				items = items.map((cartItem) =>
					cartItem.variantId === item.variantId
						? {
								...cartItem,
								quantity: cartItem.quantity + item.quantity,
								id: item.id || cartItem.id
							}
						: cartItem
				);
			} else {
				items = [...items, item];
			}

			// Open the cart when an item is added
			open();
		} catch (error) {
			console.error('Failed to add item to cart:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	// Remove item from cart (both local and Shopify)
	const removeItem = async (variantId: string): Promise<void> => {
		try {
			isLoading = true;

			// Find item to get the Shopify line item ID
			const itemToRemove = items.find((item) => item.variantId === variantId);

			// Optimistic UI update
			items = items.filter((item) => item.variantId !== variantId);

			// If we have a cartId and the item has a Shopify ID
			if (cartId && itemToRemove?.id?.trim()) {
				await shopify.removeLineItem({
					cartId,
					itemId: itemToRemove.id
				});
			}
		} catch (error) {
			console.error('Failed to remove item:', error);
			// Restore correct state on failure
			await syncCartFromShopify();
		} finally {
			isLoading = false;
		}
	};

	// Update quantity of an item (both local and Shopify)
	const updateQuantity = async (variantId: string, newQuantity: number): Promise<void> => {
		if (newQuantity < 1) return;

		try {
			isLoading = true;

			const itemToUpdate = items.find((item) => item.variantId === variantId);

			// If we have a cartId and the item has a Shopify ID
			if (cartId && itemToUpdate?.id) {
				const response: ShopifyCartResponse = await shopify.updateCart({
					cartId,
					itemId: itemToUpdate.id,
					variantId,
					quantity: newQuantity
				});

				// Update local cart state
				items = items.map((item) =>
					item.variantId === variantId ? { ...item, quantity: newQuantity } : item
				);
			} else {
				// Just update the local state if no Shopify connection
				items = items.map((item) =>
					item.variantId === variantId ? { ...item, quantity: newQuantity } : item
				);
			}
		} catch (error) {
			console.error('Failed to update quantity:', error);
			await syncCartFromShopify();
		} finally {
			isLoading = false;
		}
	};

	// Clear all items from cart (both local and Shopify)
	const clearItems = async (): Promise<void> => {
		if (items.length === 0) return;

		const currentItems = items; // Explicitly preserve items for rollback

		try {
			isLoading = true;

			// If we have a Shopify cart ID, remove all items from the Shopify cart
			if (cartId && items.length > 0) {
				// Get all item IDs that exist in the Shopify cart
				const itemsToRemove = items.filter((item) => item.id).map((item) => item.id as string);

				// Remove all items from Shopify cart in a single call if there are any
				if (itemsToRemove.length > 0) {
					await shopify.removeLineItems({
						cartId: cartId,
						itemIds: itemsToRemove
					});
				}

				// Create a new cart in Shopify for a fresh start
				const newCartResponse: { cartId: string } = await shopify.createNewCart();

				// Update the cart store with the new cart ID and empty items
				items = [];
				cartId = newCartResponse.cartId;
			} else {
				// No Shopify cart ID, reset the local cart
				items = [];
			}
		} catch (error) {
			console.error('Failed to clear cart:', error);
			// Restore the local cart items in case of an error
			items = currentItems;
			throw error;
		} finally {
			isLoading = false;
		}
	};

	// Redirect to Shopify checkout
	const checkout = async (): Promise<string> => {
		if (!cartId) throw new Error('No cart ID available for checkout');

		try {
			isLoading = true;
			const checkoutData: { checkoutUrl: string } = await shopify.getCheckoutURL({ cartId });
			return checkoutData.checkoutUrl;
		} catch (error) {
			console.error('Failed to get checkout URL:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	// Local state update methods
	const setItems = (newItems: CartItem[]): void => {
		items = newItems;
	};

	const setCartId = (id: string): void => {
		cartId = id;
	};

	// Function to update Shopify line item IDs when we get them from API responses
	const updateLineItemIds = (cartData: ShopifyCart): void => {
		if (!cartData || !cartData.lines || !cartData.lines.edges) return;

		const updatedItems = [...items];

		cartData.lines.edges.forEach(({ node }: { node: ShopifyCartLineItem }) => {
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
		get isLoading(): boolean {
			return isLoading;
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
		updateLineItemIds,
		initializeCart,
		syncCartFromShopify,
		checkout
	};
};

export const cart: CartStore = createCart();
