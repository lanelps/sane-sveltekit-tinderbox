import type { NavStore } from '$lib/types';

const createNav = (): NavStore => {
	let isOpen: boolean = $state(false);

	const toggle = (): void => {
		isOpen = !isOpen;
	};
	const open = (): void => {
		isOpen = true;
	};
	const close = (): void => {
		isOpen = false;
	};

	return {
		get isOpen(): boolean {
			return isOpen;
		},
		toggle,
		open,
		close
	};
};

export const nav: NavStore = createNav();
