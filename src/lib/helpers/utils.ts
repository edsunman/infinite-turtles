export const createAscendingDescendingArray = (length: number) => {
	const result = [];
	for (let i = 1; i <= Math.ceil(length / 2); i++) {
		result.push(i);
	}
	for (let i = Math.floor(length / 2); i >= 1; i--) {
		result.push(i);
	}
	return result;
};

export const randomNumber = (min: number, max: number) => {
	max = max + 1;
	return Math.floor(Math.random() * (max - min) + min);
};
