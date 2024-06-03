export const breakpoints = {
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
};

export const createTailWindGrid = (size = 12) => {
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

export const spacing = (length = 200, base = 0.25, increment = 0.5) => {
	const spacing = {
		0: `0`,
		'1/2': `${100 / 2}%`,
		'1/3': `${100 / 3}%`,
		'2/3': `${(100 / 3) * 2}%`,
		'1/4': `${100 / 4}%`,
		'3/4': `${(100 / 4) * 3}%`,
		'1/6': `${100 / 6}%`,
		'5/6': `${(100 / 6) * 5}%`,
		'1/8': `${100 / 8}%`,
		'1/10': `${100 / 10}%`,
		full: '100%',
		body: 'var(--body-height)',
		'scroll-body': 'var(--body-scroll-height)'
	};

	Array(length)
		.fill(null)
		.forEach((_, index) => {
			const newIndex = index * increment;
			const value = base * newIndex;
			spacing[newIndex] = `${value}rem`;
		});

	return spacing;
};
