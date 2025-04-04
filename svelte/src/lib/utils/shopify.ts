import type {
	ShopifyCart,
	ShopifyCartResponse,
	ShopifyCartOperationInput,
	ShopifyAddToCartInput,
	ShopifyUpdateCartInput,
	ShopifyRemoveLineItemInput,
	ShopifyRemoveLineItemsInput,
	ShopifyCreateCartResponse,
	ShopifyCheckoutResponse,
	ShopifyCartLineItem,
	ShopifyMetafield,
	ShopifyProductImage,
	ShopifyProductOption,
	ShopifyProductVariant,
	ShopifyProduct
} from '$lib/types/cart';
import {
	PUBLIC_ENABLE_SHOPIFY,
	PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
	PUBLIC_SHOPIFY_STORE
} from '$env/static/public';

// Custom error classes for better error handling
export class ShopifyError extends Error {
	public code?: string;
	public statusCode?: number;
	public originalError?: Error | unknown;

	constructor(
		message: string,
		options: { code?: string; statusCode?: number; originalError?: unknown } = {}
	) {
		super(message);
		this.name = 'ShopifyError';
		this.code = options.code;
		this.statusCode = options.statusCode;
		this.originalError = options.originalError;
	}
}

export class ShopifyCartError extends ShopifyError {
	constructor(
		message: string,
		options: { code?: string; statusCode?: number; originalError?: unknown } = {}
	) {
		super(message, options);
		this.name = 'ShopifyCartError';
	}
}

export class ShopifyProductError extends ShopifyError {
	constructor(
		message: string,
		options: { code?: string; statusCode?: number; originalError?: unknown } = {}
	) {
		super(message, options);
		this.name = 'ShopifyProductError';
	}
}

// Standard error handler
const handleShopifyError = <T>(error: unknown, operation: string): T => {
	console.error(`Shopify Error in ${operation}:`, error);

	if (error instanceof ShopifyError) {
		throw error;
	}

	if (error instanceof Error) {
		if (error.message.includes('cart')) {
			throw new ShopifyCartError(`Failed during ${operation}: ${error.message}`, {
				originalError: error
			});
		} else if (error.message.includes('product')) {
			throw new ShopifyProductError(`Failed during ${operation}: ${error.message}`, {
				originalError: error
			});
		} else {
			throw new ShopifyError(`Failed during ${operation}: ${error.message}`, {
				originalError: error
			});
		}
	}

	// For unknown errors
	throw new ShopifyError(`Unknown error occurred during ${operation}`, { originalError: error });
};

export const shopifyConfig = {
	isEnabled: PUBLIC_ENABLE_SHOPIFY === 'true',
	storefrontToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
	store: PUBLIC_SHOPIFY_STORE,
	apiVersion: '2025-01' // Make sure this matches your desired API version
};

// Constants
const CART_ID_KEY = 'shopify_cart_id';
const SHOPIFY_CART_PREFIX = 'gid://shopify/Cart/';

// Helper function to handle cart ID formatting
const ensureFullCartId = (cartId: string): string => {
	if (!cartId.startsWith(SHOPIFY_CART_PREFIX)) {
		return `${SHOPIFY_CART_PREFIX}${cartId}`;
	}
	return cartId;
};

const extractCartId = (fullCartId: string): string => {
	return fullCartId.replace(SHOPIFY_CART_PREFIX, '');
};

// Initialize cart, checking storage and creating new cart if needed
export const initializeCart = async (): Promise<ShopifyCreateCartResponse> => {
	try {
		if (typeof window === 'undefined') {
			throw new ShopifyCartError('Cannot initialize cart on server-side', {
				code: 'SERVER_SIDE_CART_INIT'
			});
		}

		// Check local storage for existing cart ID
		const storedCartId = localStorage.getItem(CART_ID_KEY);

		if (storedCartId) {
			// Verify the cart still exists
			try {
				const fullCartId = ensureFullCartId(storedCartId);
				await getCart({ cartId: fullCartId });
				return { cartId: fullCartId };
			} catch (error) {
				console.error(error, 'Stored cart no longer valid, creating new cart');
				// Cart not found or invalid, create new one
				return await createNewCart();
			}
		}

		// No cart ID in storage, create new cart
		return await createNewCart();
	} catch (error) {
		return handleShopifyError<ShopifyCreateCartResponse>(error, 'initializeCart');
	}
};

// Helper function to create a new cart and store its ID
export const createNewCart = async (): Promise<ShopifyCreateCartResponse> => {
	try {
		const newCart = await createCart();
		const fullCartId = ensureFullCartId(newCart.id);

		// Store the cart ID in local storage
		if (typeof window !== 'undefined') {
			localStorage.setItem(CART_ID_KEY, extractCartId(fullCartId));
		}

		return { cartId: fullCartId, cart: newCart };
	} catch (error) {
		return handleShopifyError<ShopifyCreateCartResponse>(error, 'createNewCart');
	}
};

// Update the storefrontClient.fetch method to properly handle JSON responses
export const storefrontClient = {
	endpoint: `https://${shopifyConfig.store}.myshopify.com/api/${shopifyConfig.apiVersion}/graphql.json`,
	fetch: async <T>(query: string, variables = {}, caller = 'Unknown'): Promise<T> => {
		try {
			const response = await fetch(storefrontClient.endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontToken
				},
				body: JSON.stringify({ query, variables })
			});

			if (!response.ok) {
				throw new ShopifyError(`HTTP Error: ${response.status} ${response.statusText}`, {
					statusCode: response.status,
					code: 'HTTP_ERROR'
				});
			}

			const responseData: { data?: T; errors?: { message: string }[] } = await response.json();

			if (responseData.errors && responseData.errors.length > 0) {
				const errorMessages = responseData.errors.map((e) => e.message).join(', ');
				throw new ShopifyError(errorMessages, { code: 'GRAPHQL_ERROR' });
			}

			if (!responseData.data) {
				throw new ShopifyError('Empty response from Shopify API', { code: 'EMPTY_API_RESPONSE' });
			}

			return responseData.data;
		} catch (error) {
			if (error instanceof ShopifyError) {
				throw error;
			}
			return handleShopifyError<T>(error, caller);
		}
	}
};

// Create a new cart
export const createCart = async (): Promise<ShopifyCart> => {
	const query = `
    mutation {
        cartCreate {
            cart {
                id
                checkoutUrl
                totalQuantity
                lines(first: 100) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        originalSrc
                                    }
                                    product {
                                        title
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`;

	try {
		// The response structure needs to be properly typed
		type CreateCartResponse = {
			cartCreate: {
				cart: ShopifyCart & {
					lines: {
						edges: {
							node: ShopifyCartLineItem;
						}[];
					};
				};
				userErrors: { field: string; message: string }[];
			};
		};

		const response = await storefrontClient.fetch<CreateCartResponse>(query, {}, 'createCart');

		if (response.cartCreate.userErrors?.length > 0) {
			const errorMessages = response.cartCreate.userErrors.map((err) => err.message).join(', ');
			throw new ShopifyCartError(`Cart creation failed: ${errorMessages}`, {
				code: 'CART_CREATE_ERROR'
			});
		}

		if (!response.cartCreate?.cart) {
			throw new ShopifyCartError('Invalid cart creation response from Shopify', {
				code: 'INVALID_CART_RESPONSE'
			});
		}

		const cart = response.cartCreate.cart;
		const cleanCart = {
			...cart,
			id: cart.id.replace('gid://shopify/Cart/', '')
		};
		return cleanCart;
	} catch (error) {
		return handleShopifyError<ShopifyCart>(error, 'createCart');
	}
};

// Get an existing cart
export const getCart = async ({
	cartId
}: ShopifyCartOperationInput): Promise<{ cart: ShopifyCart }> => {
	if (!cartId) {
		throw new ShopifyCartError('Cart ID is required', { code: 'MISSING_CART_ID' });
	}

	const formattedCartId = ensureFullCartId(cartId);

	const query = `
    query getCart($cartId: ID!) {
        cart(id: $cartId) {
            id
            checkoutUrl
            totalQuantity
            lines(first: 100) {
                edges {
                    node {
                        id
                        quantity
                        merchandise {
                            ... on ProductVariant {
                                id
                                title
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                image {
                                    originalSrc
                                }
                                product {
                                    title
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    `;

	try {
		type GetCartResponse = { cart: ShopifyCart | null };
		const data = await storefrontClient.fetch<GetCartResponse>(
			query,
			{ cartId: formattedCartId },
			'getCart'
		);
		if (!data.cart) {
			throw new ShopifyCartError(`Cart not found with ID: ${cartId}`, { code: 'CART_NOT_FOUND' });
		}

		return { cart: data.cart };
	} catch (error) {
		return handleShopifyError<{ cart: ShopifyCart }>(error, 'getCart');
	}
};

// Add item to cart
export const addToCart = async ({
	cartId,
	variantId,
	quantity
}: ShopifyAddToCartInput): Promise<ShopifyCartResponse<ShopifyCart>> => {
	try {
		if (!cartId) {
			throw new ShopifyCartError('Cart ID is required', { code: 'MISSING_CART_ID' });
		}

		if (!variantId) {
			throw new ShopifyCartError('Variant ID is required', { code: 'MISSING_VARIANT_ID' });
		}

		const formattedCartId = ensureFullCartId(cartId);
		const query = `
		mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
			cartLinesAdd(cartId: $cartId, lines: $lines) {
				cart {
					id
					checkoutUrl
					totalQuantity
					lines(first: 100) {
						edges {
							node {
								id
								quantity
								merchandise {
									... on ProductVariant {
										id
										title
										priceV2 {
											amount
											currencyCode
										}
										image {
											originalSrc
										}
										product {
											title
											handle
										}
									}
								}
							}
						}
					}
				}
				userErrors {
					field
					message
				}
			}
		}`;

		const data = await storefrontClient.fetch<{
			cartLinesAdd: ShopifyCartResponse<ShopifyCart>;
		}>(
			query,
			{
				cartId: formattedCartId,
				lines: [
					{
						merchandiseId: variantId,
						quantity: parseInt(String(quantity), 10)
					}
				]
			},
			'addToCart'
		);

		if (data?.cartLinesAdd?.userErrors && data.cartLinesAdd.userErrors.length > 0) {
			const errorMessages = data.cartLinesAdd.userErrors.map((err) => err.message).join(', ');
			throw new ShopifyCartError(`Add to cart failed: ${errorMessages}`, {
				code: 'ADD_TO_CART_ERROR'
			});
		}

		if (!data.cartLinesAdd?.cart) {
			throw new ShopifyCartError('Failed to add item to cart - empty response', {
				code: 'EMPTY_CART_RESPONSE'
			});
		}

		return data.cartLinesAdd;
	} catch (error) {
		return handleShopifyError<ShopifyCartResponse<ShopifyCart>>(error, 'addToCart');
	}
};

// Update cart item
export const updateCart = async ({
	cartId,
	itemId,
	variantId,
	quantity
}: ShopifyUpdateCartInput): Promise<ShopifyCartResponse<ShopifyCart>> => {
	try {
		if (!cartId) {
			throw new ShopifyCartError('Cart ID is required', { code: 'MISSING_CART_ID' });
		}

		if (!itemId) {
			throw new ShopifyCartError('Item ID is required', { code: 'MISSING_ITEM_ID' });
		}

		const formattedCartId = ensureFullCartId(cartId);

		const query = `
		mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
			cartLinesUpdate(cartId: $cartId, lines: $lines) {
				cart {
					id
					checkoutUrl
					totalQuantity
					lines(first: 100) {
						edges {
							node {
								id
								quantity
								merchandise {
									... on ProductVariant {
										id
										title
										priceV2 {
											amount
											currencyCode
										}
										image {
											originalSrc
										}
										product {
											title
											handle
										}
									}
								}
							}
						}
					}
				}
				userErrors {
					field
					message
				}
			}
		}`;

		const data = await storefrontClient.fetch<{
			cartLinesUpdate: ShopifyCartResponse<ShopifyCart>;
		}>(
			query,
			{
				cartId: formattedCartId,
				lines: [
					{
						id: itemId,
						merchandiseId: variantId,
						quantity: parseInt(String(quantity), 10)
					}
				]
			},
			'updateCart'
		);

		if (data?.cartLinesUpdate?.userErrors && data.cartLinesUpdate.userErrors.length > 0) {
			const errorMessages = data.cartLinesUpdate.userErrors.map((err) => err.message).join(', ');
			throw new ShopifyCartError(`Update cart failed: ${errorMessages}`, {
				code: 'UPDATE_CART_ERROR'
			});
		}

		if (!data.cartLinesUpdate?.cart) {
			throw new ShopifyCartError('Failed to update cart - empty response', {
				code: 'EMPTY_CART_RESPONSE'
			});
		}

		return data.cartLinesUpdate;
	} catch (error) {
		return handleShopifyError<ShopifyCartResponse<ShopifyCart>>(error, 'updateCart');
	}
};

// Remove item from cart
export const removeLineItem = async ({
	cartId,
	itemId
}: ShopifyRemoveLineItemInput): Promise<ShopifyCartResponse<ShopifyCart>> => {
	try {
		if (!cartId) {
			throw new ShopifyCartError('Cart ID is required', { code: 'MISSING_CART_ID' });
		}

		if (!itemId) {
			throw new ShopifyCartError('Item ID is required', { code: 'MISSING_ITEM_ID' });
		}

		const formattedCartId = ensureFullCartId(cartId);
		const query = `
		mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
			cartLinesRemove(cartId: $cartId, lineIds: $lineIds ) {
				cart {
					id
					checkoutUrl
					totalQuantity
					lines(first: 100) {
						edges {
							node {
								id
								quantity
								merchandise {
									... on ProductVariant {
										id
										title
										priceV2 {
											amount
											currencyCode
										}
										image {
											originalSrc
										}
										product {
											title
											handle
										}
									}
								}
							}
						}
					}
				}
				userErrors {
					field
					message
				}
			}
		}`;

		const data = await storefrontClient.fetch<{
			cartLinesRemove: ShopifyCartResponse<ShopifyCart>;
		}>(
			query,
			{
				cartId: formattedCartId,
				lineIds: [itemId]
			},
			'removeLineItem'
		);

		if (data?.cartLinesRemove?.userErrors && data.cartLinesRemove.userErrors.length > 0) {
			const errorMessages = data.cartLinesRemove.userErrors.map((err) => err.message).join(', ');
			throw new ShopifyCartError(`Remove line item failed: ${errorMessages}`, {
				code: 'REMOVE_ITEM_ERROR'
			});
		}

		if (!data.cartLinesRemove?.cart) {
			throw new ShopifyCartError('Failed to remove item from cart - empty response', {
				code: 'EMPTY_CART_RESPONSE'
			});
		}

		return data.cartLinesRemove;
	} catch (error) {
		return handleShopifyError<ShopifyCartResponse<ShopifyCart>>(error, 'removeLineItem');
	}
};

// Remove multiple items from cart
export const removeLineItems = async ({
	cartId,
	itemIds
}: ShopifyRemoveLineItemsInput): Promise<ShopifyCartResponse<ShopifyCart>> => {
	try {
		if (!cartId) {
			throw new ShopifyCartError('Cart ID is required', { code: 'MISSING_CART_ID' });
		}

		if (!itemIds || !Array.isArray(itemIds)) {
			throw new ShopifyCartError('Item IDs array is required', { code: 'MISSING_ITEM_IDS' });
		}

		// Define a default empty response with the correct type
		if (!itemIds.length) {
			// Get existing cart to return it unchanged since we're not removing any items
			const existingCartResponse = await getCart({ cartId });
			return {
				cart: existingCartResponse.cart,
				userErrors: []
			};
		}

		const formattedCartId = ensureFullCartId(cartId);
		const query = `
		mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
			cartLinesRemove(cartId: $cartId, lineIds: $lineIds ) {
				cart {
					id
					checkoutUrl
					totalQuantity
					lines(first: 100) {
						edges {
							node {
								id
								quantity
								merchandise {
									... on ProductVariant {
										id
										title
										priceV2 {
											amount
											currencyCode
										}
										image {
											originalSrc
										}
										product {
											title
											handle
										}
									}
								}
							}
						}
					}
				}
				userErrors {
					field
					message
				}
			}
		}`;

		const data = await storefrontClient.fetch<{
			cartLinesRemove: ShopifyCartResponse<ShopifyCart>;
		}>(
			query,
			{
				cartId: formattedCartId,
				lineIds: itemIds
			},
			'removeLineItems'
		);

		if (data?.cartLinesRemove?.userErrors && data.cartLinesRemove.userErrors.length > 0) {
			const errorMessages = data.cartLinesRemove.userErrors.map((err) => err.message).join(', ');
			throw new ShopifyCartError(`Remove line items failed: ${errorMessages}`, {
				code: 'REMOVE_ITEMS_ERROR'
			});
		}

		if (!data.cartLinesRemove?.cart) {
			throw new ShopifyCartError('Failed to remove items from cart - empty response', {
				code: 'EMPTY_CART_RESPONSE'
			});
		}

		return data.cartLinesRemove;
	} catch (error) {
		return handleShopifyError<ShopifyCartResponse<ShopifyCart>>(error, 'removeLineItems');
	}
};

// Fetch product by handle
export const fetchProduct = async (handle: string): Promise<ShopifyProduct> => {
	const query = `
	query getProductByHandle($handle: String!) {
		productByHandle(handle: $handle) {
			id
			handle
			title
			description
			descriptionHtml
			availableForSale
			material: metafield(namespace: "custom", key: "material") {
				value
			}
			shipping: metafield(namespace: "custom", key: "shipping") {
				value
			}
			images(first: 100) {
				edges {
					node {
						originalSrc
					}
				}
			}
			options {
				id
				name
				values
			}
			variants(first: 100) {
				edges {
					node {
						id
						sku
						title
						priceV2 {
							amount
							currencyCode
						}
						image {
							originalSrc
						}
						availableForSale
						currentlyNotInStock
						quantityAvailable
					}
				}
			}
		}
	}`;

	interface ProductByHandleResponse {
		productByHandle: {
			id: string;
			handle: string;
			title: string;
			description: string;
			descriptionHtml: string;
			availableForSale: boolean;
			material: ShopifyMetafield | null;
			shipping: ShopifyMetafield | null;
			images: {
				edges: {
					node: ShopifyProductImage;
				}[];
			};
			options: ShopifyProductOption[];
			variants: {
				edges: {
					node: ShopifyProductVariant;
				}[];
			};
		} | null;
	}

	try {
		const result = await storefrontClient.fetch<ProductByHandleResponse>(
			query,
			{ handle },
			`fetchProduct(${handle})`
		);

		if (!result.productByHandle) {
			throw new ShopifyProductError(`Product with handle '${handle}' not found`, {
				code: 'PRODUCT_NOT_FOUND'
			});
		}

		// Transform the response structure to match our ShopifyProduct type
		const product: ShopifyProduct = {
			...result.productByHandle,
			images: result.productByHandle.images.edges.map(({ node }) => node),
			variants: result.productByHandle.variants.edges.map(({ node }) => node),
			material: result.productByHandle.material || undefined,
			shipping: result.productByHandle.shipping || undefined
		};

		return product;
	} catch (error) {
		return handleShopifyError<ShopifyProduct>(error, `fetchProduct(${handle})`);
	}
};

// Get checkout URL for a cart
export const getCheckoutURL = async ({
	cartId
}: ShopifyCartOperationInput): Promise<ShopifyCheckoutResponse> => {
	if (!cartId) {
		throw new ShopifyCartError('Cart ID is required for checkout', { code: 'MISSING_CART_ID' });
	}

	const formattedCartId = ensureFullCartId(cartId);
	const query = `
    query checkoutURL($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }`;

	try {
		const data = await storefrontClient.fetch<{
			cart: ShopifyCheckoutResponse | null;
		}>(query, { cartId: formattedCartId }, 'getCheckoutURL');

		if (!data.cart) {
			throw new ShopifyCartError('Failed to get checkout URL - cart not found', {
				code: 'CHECKOUT_URL_ERROR'
			});
		}

		return data.cart;
	} catch (error) {
		return handleShopifyError<ShopifyCheckoutResponse>(error, 'getCheckoutURL');
	}
};
