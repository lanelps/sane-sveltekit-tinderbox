/** @type {import('tailwindcss').Config} */
const defaultTheme = require(`tailwindcss/defaultTheme`);

const createTailWindGrid = (size = 12) => {
	const gridSpan = { 'span-full': `1 / -1` };
	const gridColumns = { full: `-1` };

	Array(size)
		.fill(null)
		.forEach((_, index) => {
			const itemIndex = index + 1;
			gridSpan[`span-${itemIndex}`] = `span ${itemIndex} / span ${itemIndex}`;
			gridColumns[itemIndex] = `${itemIndex}`;
		});

	return { gridSpan, gridColumns };
};

const { gridSpan, gridColumns } = createTailWindGrid();

module.exports = {
	darkMode: `class`,
	content: [`./src/**/*.{html,js,svelte,ts}`],
	theme: {
		colors: {
			transparent: `transparent`,
			current: `currentColor`,
			black: `#000`,
			white: `#fff`,
			'true-black': `#000000`,
			'off-grey': `#C4C4C4`,
			'off-white': `#F9F9F9`,
			purple: {
				50: `#34154B`,
				100: `#9F5ED2`
			},
			blue: {
				50: `#005B82`,
				100: `#00A8E8`
			},
			orange: {
				50: `#843F02`,
				100: `#FC9B45`
			},
			green: {
				100: `#00FF00`
			}
		},
		fontFamily: {
			main: [`IBM Plex Sans`, ...defaultTheme.fontFamily.sans]
		},
		screens: {
			'xxl-d': `1920px`,
			'xl-d': `1728px`,
			'lg-d': `1512px`,
			'md-d': `1440px`,
			'sm-d': `1280px`,
			//
			'lg-t': `1024px`,
			'md-t': `834px`,
			'sm-t': `744px`,
			//
			'lg-m': `428px`,
			'md-m': `414px`,
			'sm-m': `360px`,
			'xs-m': `320px`
		},
		transitionTimingFunction: {
			DEFAULT: `cubic-bezier(0.215, 0.61, 0.355, 1)`
		},
		transitionDuration: {
			DEFAULT: `300ms`,
			300: `300ms`,
			1000: `1000ms`
		},
		keyframes: {
			appear: {
				'0%': { opacity: `0` },
				'100%': { opacity: `1` }
			},
			'appear-up': {
				'0%': { opacity: `0`, transform: `translateY(100%)` },
				'100%': { opacity: `1`, transform: `translateY(0%)` }
			},
			'appear-down': {
				'0%': { opacity: `0`, transform: `translateY(-100%)` },
				'100%': { opacity: `1`, transform: `translateY(0%)` }
			}
		},
		animation: {
			appear: `appear 1000ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards`,
			'appear-up': `appear-up 600ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards`,
			'appear-down': `appear-down 600ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards`
		},
		animationDelay: {
			300: `300ms`,
			1000: `1000ms`
		},
		animationDuration: {
			DEFAULT: `600ms`,
			300: `300ms`,
			1000: `1000ms`,
			1500: `1500ms`,
			2000: `2000ms`
		},
		// animationIteration: {
		//   // 2: `2`
		// },
		// animationTiming: {
		//   // cubic: `cubic-bezier(0.215, 0.61, 0.355, 1)`
		// },
		gridColumn: gridSpan,
		gridColumnStart: gridColumns,
		gridColumnEnd: gridColumns,
		extend: {
			height: {
				min: `min-content`
			},
			transitionProperty: {
				filter: 'filter',
				'backdrop-filter': 'backdrop-filter'
			}
		}
	},
	variants: {}
};
