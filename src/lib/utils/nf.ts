export type NF = (num: number | string) => string;

/**
 * Formats a number with thousands separators.
 * @param num - The number to format.
 * @returns - The formatted number.
 */
const nf: NF = function(num) {
	let temp = num;
	if (typeof temp !== 'number') {
		temp = parseInt(temp, 10);
		if (isNaN(temp)) {
			return `${num}`;
		}
	}
	return new Intl.NumberFormat().format(temp);
}

export default nf;
