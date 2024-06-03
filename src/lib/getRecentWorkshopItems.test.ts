import { createGetRecentWorkshopItems } from './getRecentWorkshopItems';
import _axios from 'axios';
jest.mock('axios');

const axios = _axios as jest.Mocked<typeof _axios>;
let errorSpy: jest.SpyInstance;

describe('getRecentWorkshopItems', () => {
	const baseUrl = 'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/';
	const delay = jest.fn();

	beforeEach(() => {
		axios.get.mockReset();
		delay.mockReset();
		errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		errorSpy.mockRestore();
	});

	it('should resolve with the workshop items', async () => {
		const getRecentWorkshopItems = createGetRecentWorkshopItems(axios, baseUrl, delay);
		const key = 'key';
		const appId = 0;
		const cursor = 'cursor';
		const response = { data: { response: 'workshop items' } };
		axios.get.mockResolvedValue(response);

		const result = await getRecentWorkshopItems(key, appId, cursor);

		expect(result).toBe('workshop items');
		const encodedCursor = encodeURIComponent(cursor);
		expect(axios.get).toHaveBeenCalledWith(
			`${baseUrl}?key=${key}&query_type=1&cursor=${encodedCursor}&numperpage=100&appid=${appId}&return_details=true`
		);
	});

	it('should retry on error', async () => {
		const getRecentWorkshopItems = createGetRecentWorkshopItems(axios, baseUrl, delay);
		const key = 'key';
		const appId = 0;
		const cursor = 'cursor';
		const response = { data: { response: 'workshop items' } };
		axios.get.mockRejectedValueOnce(new Error('error')).mockResolvedValue(response);

		const result = await getRecentWorkshopItems(key, appId, cursor);

		expect(result).toBe('workshop items');
		expect(axios.get).toHaveBeenCalledTimes(2);
		const encodedCursor = encodeURIComponent(cursor);
		expect(axios.get).toHaveBeenNthCalledWith(
			1,
			`${baseUrl}?key=${key}&query_type=1&cursor=${encodedCursor}&numperpage=100&appid=${appId}&return_details=true`
		);
		expect(axios.get).toHaveBeenNthCalledWith(
			2,
			`${baseUrl}?key=${key}&query_type=1&cursor=${encodedCursor}&numperpage=100&appid=${appId}&return_details=true`
		);
		expect(delay).toHaveBeenCalledTimes(1);
	});

	// Exceeds maxRetries and throws an error
	it('should throw an error when maxRetries is exceeded', async () => {
		const getRecentWorkshopItems = createGetRecentWorkshopItems(axios, baseUrl, delay);
		const key = 'validKey';
		const appId = 0;

		await expect(getRecentWorkshopItems(key, appId)).rejects.toThrow('Max retries exceeded');
		expect(axios.get).toHaveBeenCalledTimes(6);
	});
});
