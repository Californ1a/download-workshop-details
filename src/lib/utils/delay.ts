export type Delay = (ms: number) => Promise<void>;

/**
 * Delays the execution of code for the specified amount of time.
 * @param ms - The number of milliseconds to delay the execution.
 * @returns - A promise that resolves after the specified delay.
 */
const delay: Delay = function (ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export default delay;
