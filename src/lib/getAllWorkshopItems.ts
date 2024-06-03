import _getRecentWorkshopItems, { type GetRecentWorkshopItems } from './getRecentWorkshopItems';
import _logProgress, { type LogProgress } from './logProgress';
import { formatDuration as _formatDuration, type FormatDuration, nf as _nf, type NF } from './utils';
import { type PublishedFileDetail } from './types/WorkshopResponse';

export type GetAllWorkshopItems = (key: string, appId: number) => Promise<PublishedFileDetail[]>;

/**
 * Creates a function to retrieve all workshop items for a given key and app ID.
 * @param getRecentWorkshopItems - The function to get recent workshop items.
 * @param logProgress - The function to log progress.
 * @param nf - The function to format numbers.
 * @returns A function that retrieves all workshop items.
 */
export function createGetAllWorkshopItems(
	getRecentWorkshopItems: GetRecentWorkshopItems,
	logProgress: LogProgress,
	nf: NF,
	formatDuration: FormatDuration): GetAllWorkshopItems {
	return async function getAllWorkshopItems(key, appId) {
		const start = process.hrtime();
		const items: PublishedFileDetail[] = [];
		let cursor = '*';
		let response = await getRecentWorkshopItems(key, appId, cursor);
		const total = response.total ?? 0;
		if (!response.publishedfiledetails || !Array.isArray(response.publishedfiledetails)
			|| typeof response.total !== 'number') {
			throw new Error('Invalid response');
		}
		items.push(...response.publishedfiledetails);
		logProgress(items.length, response.total);
		while (response.next_cursor
			&& items.length < total
			&& typeof response.publishedfiledetails === 'object'
			&& Array.isArray(response.publishedfiledetails)
			&& response.publishedfiledetails.length > 0) {
			cursor = response.next_cursor;
			try {
				response = await getRecentWorkshopItems(key, appId, cursor);
				if ((!response.publishedfiledetails || !response.publishedfiledetails.length) && total !== response.total) {
					process.stdout.write('\n');
					throw new Error('Total count mismatch');
				}
				items.push(...response.publishedfiledetails);
				logProgress(items.length, response.total);
			} catch (e) {
				process.stdout.write('\n');
				throw e;
			}
		}
		const end = process.hrtime(start);
		const duration = formatDuration(end);

		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`Collected ${nf(items.length)}/${nf(total)} items in ${duration} (${items.length === total ? 'Complete' : 'Incomplete'})`);
		process.stdout.write('\n');

		return items;
	}
}

/**
 * Retrieves all workshop items for a given key and app ID.
 * @param key - The API key.
 * @param appId - The ID of the app.
 * @returns A promise that resolves to an array of workshop items.
 * @throws If the total count of items does not match the number of items collected.
 */
const getAllWorkshopItems = createGetAllWorkshopItems(_getRecentWorkshopItems, _logProgress, _nf, _formatDuration);
export default getAllWorkshopItems;
