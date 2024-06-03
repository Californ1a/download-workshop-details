import _fs from 'node:fs/promises';
import _getAllWorkshopItems, { type GetAllWorkshopItems } from './getAllWorkshopItems';
import { nf as _nf } from './utils';

export type FetchAndSaveWorkshopItems = (
	key: string,
	appId: number,
	filename?: string,
	minified?: boolean
) => Promise<void>;

/**
 * Creates a function that fetches workshop items using the Steam Web API key and saves them to a JSON file.
 * @param getAllWorkshopItems - The function that fetches all workshop items.
 * @param fs - The file system module.
 * @param nf - The number format function.
 * @returns The fetchAndSaveWorkshopItems function.
 */
export function createFetchAndSaveWorkshopItems(
	getAllWorkshopItems: GetAllWorkshopItems,
	fs: typeof _fs,
	nf: typeof _nf
): FetchAndSaveWorkshopItems {
	return async function fetchAndSaveWorkshopItems(key, appId, filename = 'workshopItems', minified = true) {
		if (!key) throw new Error('No Steam Web API key provided');
		if (!appId) throw new Error('No App ID provided');
		if (typeof appId === 'string') {
			appId = parseInt(appId, 10);
			if (isNaN(appId)) throw new Error('App ID must be a number');
		}
		if (typeof appId !== 'number') throw new Error('App ID must be a number');
		if (typeof key !== 'string') throw new Error('Steam Web API key must be a string');
		if (typeof filename !== 'string') throw new Error('Filename must be a string');
		if (typeof minified !== 'boolean') throw new Error('Minified must be a boolean');

		const items = await getAllWorkshopItems(key, appId);
		const json = minified ? JSON.stringify(items) : JSON.stringify(items, null, 2);
		const file = filename ? (filename.endsWith('.json') ? filename : `${filename}.json`) : 'workshopItems.json';
		await fs.writeFile(file, json, 'utf-8');
		console.log(`Saved ${nf(items.length)} items to ${file}`);
	};
}

/**
 * Fetches workshop items using the Steam Web API key and saves them to a JSON file.
 * @param key - The Steam Web API key.
 * @param appId - The App ID.
 * @param filename - The name of the output JSON file.
 * @param minified - Indicates whether the JSON output should be minified.
 * @throws If no Steam Web API key is provided, no App ID is provided, App ID is not a number,
 *         Steam Web API key is not a string, filename is not a string, or minified is not a boolean.
 * @returns A Promise that resolves after the workshop items have been fetched and saved.
 */
const fetchAndSaveWorkshopItems = createFetchAndSaveWorkshopItems(_getAllWorkshopItems, _fs, _nf);
export default fetchAndSaveWorkshopItems;
