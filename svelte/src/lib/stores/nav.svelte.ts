import type { NavStore } from '$lib/types';

const createNav = (): NavStore => {
	let isActive: boolean = $state(false);

	const toggle = (): void => {
		isActive = !isActive;
	};
	const open = (): void => {
		isActive = true;
	};
	const close = (): void => {
		isActive = false;
	};

	return {
		get isActive(): boolean {
			return isActive;
		},
		toggle,
		open,
		close
	};
};

export const nav: NavStore = createNav();
