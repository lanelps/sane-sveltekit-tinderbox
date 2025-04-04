// ==============================
// Cart
// ==============================

export interface CartItem {
	id: string;
	variantId: string;
	quantity: number;
	title: string;
	variantTitle: string;
	price: number;
	image: string;
}

export interface CartStore {
	readonly isOpen: boolean;
	readonly items: CartItem[];
	readonly cartId: string | null;
	readonly isLoading: boolean;

	// UI Methods
	toggle(e: Event): void;
	open(): void;
	close(): void;

	// Cart Operation Methods (async)
	addItem(item: CartItem): Promise<void>;
	removeItem(variantId: string): Promise<void>;
	clearItems(): Promise<void>;
	updateQuantity(variantId: string, newQuantity: number): Promise<void>;
	checkout(): Promise<string>;
	initializeCart(): Promise<void>;
	syncCartFromShopify(): Promise<void>;

	// State Management Methods
	setItems(items: CartItem[]): void;
	setCartId(cartId: string): void;
	updateLineItemIds(cartData: any): void;
}

// Shopify specific cart types
export interface ShopifyCartLineItem {
	id: string;
	quantity: number;
	merchandise: {
		id: string;
		title: string;
		priceV2: {
			amount: string;
			currencyCode: string;
		};
		image?: {
			originalSrc: string;
		};
		product: {
			title: string;
			handle?: string;
		};
	};
}

export interface ShopifyCart {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	lines: {
		edges: {
			node: ShopifyCartLineItem;
		}[];
	};
}

export interface ShopifyCartResponse<T = ShopifyCart> {
	cart: T;
	userErrors?: {
		field: string;
		message: string;
	}[];
}

// Additional Shopify API response types
export interface ShopifyCreateCartResponse {
	cartId: string;
	cart?: ShopifyCart;
}

export interface ShopifyCheckoutResponse {
	checkoutUrl: string;
}

export interface ShopifyCartOperationInput {
	cartId: string;
}

export interface ShopifyAddToCartInput extends ShopifyCartOperationInput {
	variantId: string;
	quantity: number;
}

export interface ShopifyUpdateCartInput extends ShopifyCartOperationInput {
	itemId: string;
	variantId: string;
	quantity: number;
}

export interface ShopifyRemoveLineItemInput extends ShopifyCartOperationInput {
	itemId: string;
}

export interface ShopifyRemoveLineItemsInput extends ShopifyCartOperationInput {
	itemIds: string[];
}

// Create a proper type for ShopifyProduct to avoid 'any' types
export interface ShopifyMetafield {
	value: string;
}

export interface ShopifyProductImage {
	originalSrc: string;
}

export interface ShopifyProductOption {
	id: string;
	name: string;
	values: string[];
}

export interface ShopifyProductVariant {
	id: string;
	sku: string;
	title: string;
	priceV2: {
		amount: string;
		currencyCode: string;
	};
	image?: {
		originalSrc: string;
	};
	availableForSale: boolean;
	currentlyNotInStock: boolean;
	quantityAvailable: number;
}

export interface ShopifyProduct {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	availableForSale: boolean;
	material?: ShopifyMetafield;
	shipping?: ShopifyMetafield;
	images: ShopifyProductImage[];
	options: ShopifyProductOption[];
	variants: ShopifyProductVariant[];
}
