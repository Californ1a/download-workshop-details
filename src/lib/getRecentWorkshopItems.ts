import type { AxiosStatic } from 'axios';
import _axios from 'axios';
import { delay as _delay, type Delay } from './utils';
import type { WorkshopResponse, Response } from './types/WorkshopResponse';

const _baseUrl = 'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/';

export type GetRecentWorkshopItems = (
	key: string,
	appId: number,
	cursor?: string,
	maxRetries?: number
) => Promise<WorkshopResponse>;

/**
 * Factory function to create a getRecentWorkshopItems function with injected dependencies.
 * @param axios - The axios instance to use for HTTP requests.
 * @param baseUrl - The base URL for the API.
 * @param delay - The delay function to use for exponential backoff.
 * @returns The getRecentWorkshopItems function with the injected dependencies.
 */
export function createGetRecentWorkshopItems(
	axios: AxiosStatic,
	baseUrl: string,
	delay: Delay
): GetRecentWorkshopItems {
	return async function getRecentWorkshopItems(key, appId, cursor = '*', maxRetries = 6) {
		let retries = 0;
		while (retries < maxRetries) {
			try {
				const urlEncodedCursor = encodeURIComponent(cursor);
				const response = await axios.get<Response>(
					`${baseUrl}?key=${key}&query_type=1&cursor=${urlEncodedCursor}&numperpage=100&appid=${appId}&return_details=true`
				);
				return response.data.response;
			} catch (error) {
				console.error(`Attempt ${retries + 1} failed - Retrying`);
				retries += 1;
				// apply an exponential backoff strategy
				await delay(2 ** retries * 100);
			}
		}
		throw new Error('Max retries exceeded');
	};
}

/**
 * Retrieves recent workshop items.
 * @param key - The API key.
 * @param appId - The application ID.
 * @param cursor - The cursor for pagination.
 * @param maxRetries - The maximum number of retries.
 * @returns A promise that resolves to the workshop items.
 * @throws If the maximum number of retries is exceeded.
 */
const getRecentWorkshopItems = createGetRecentWorkshopItems(_axios, _baseUrl, _delay);
export default getRecentWorkshopItems;
