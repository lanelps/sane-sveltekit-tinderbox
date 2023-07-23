import { writable } from 'svelte/store';

const naveActive = () => {
	// state with default value
	const { subscribe, set, update } = writable(false);

	return {
		subscribe,
		toggle: () => {
			update((state) => !state);
		},
		open: () => set(true),
		close: () => set(false)
	};
};

export default naveActive();
