export const normalizeString = (str: string) => {
	return str
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ');
};
