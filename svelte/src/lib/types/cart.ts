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
	toggle(e: Event): void;
	open(): void;
	close(): void;
	addItem(item: CartItem): void;
	removeItem(variantId: string): void;
	setItems(items: CartItem[]): void;
	clearItems(): void;
	setCartId(cartId: string): void;
	updateQuantity(variantId: string, newQuantity: number): void;
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
	userErrors: {
		field: string;
		message: string;
	}[];
}
