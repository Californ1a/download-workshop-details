export type FormatDuration = (end: [number, number]) => string;

/**
 * Formats the duration in seconds into a string representation of minutes and seconds.
 * @param end - An array representing the duration in seconds and nanoseconds.
 * @returns - The formatted duration in the format "mm:ss.sss".
 */
const formatDuration: FormatDuration = function(end) {
	const totalSeconds = end[0] + end[1] / 1e9;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
}

export default formatDuration;
