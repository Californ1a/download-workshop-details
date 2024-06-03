// import _rl from 'node:readline';
import { nf as _nf } from './utils';

export type LogProgress = (current: number, total: number) => void;

/**
 * Creates a function that logs the progress of a task.
 * @param nf - The number formatting function.
 * @returns The logProgress function.
 */
export function createLogProgress(nf: typeof _nf): LogProgress {
	return function logProgress(current, total) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`Progress (${(Math.round((current / total) * 100))}%): ${nf(current)}/${nf(total)}`);
	}
}

/**
 * Logs the progress of a task.
 * @param current - The current progress value.
 * @param total - The total progress value.
 */
const logProgress = createLogProgress(_nf);
export default logProgress;
