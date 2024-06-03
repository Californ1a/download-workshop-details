import _fs from 'node:fs/promises';
import { createFetchAndSaveWorkshopItems } from './fetchAndSaveWorkshopItems';
jest.mock('node:fs/promises');

const fs = _fs as jest.Mocked<typeof _fs>;
const mocknf = (n: number | string) => n.toString();
let errorSpy: jest.SpyInstance;
let logSpy: jest.SpyInstance;

describe('fetchAndSaveWorkshopItems', () => {
	const getAllWorkshopItems = jest.fn();
	const fetchAndSaveWorkshopItems = createFetchAndSaveWorkshopItems(getAllWorkshopItems, fs, mocknf);

	beforeEach(() => {
		fs.writeFile.mockReset();
		getAllWorkshopItems.mockReset();
		errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		errorSpy.mockRestore();
		logSpy.mockRestore();
	});

	it('should throw an error if no Steam Web API key is provided', async () => {
		// @ts-ignore
		await expect(fetchAndSaveWorkshopItems()).rejects.toThrow('No Steam Web API key provided');
	});

	it('should throw an error if no App ID is provided', async () => {
		// @ts-ignore
		await expect(fetchAndSaveWorkshopItems('key')).rejects.toThrow('No App ID provided');
	});

	it('should throw an error if App ID cannot be parsed as a number', async () => {
		// @ts-ignore
		await expect(fetchAndSaveWorkshopItems('key', 'appId')).rejects.toThrow('App ID must be a number');
	});

	it('should throw an error if Steam Web API key is not a string', async () => {
		// @ts-ignore
		await expect(fetchAndSaveWorkshopItems(123, 456)).rejects.toThrow('Steam Web API key must be a string');
	});

	it('should throw an error if filename is not a string', async () => {
		// @ts-ignore
		await expect(fetchAndSaveWorkshopItems('key', 789, 123)).rejects.toThrow('Filename must be a string');
	});

	it('should throw an error if minified is not a boolean', async () => {
		// @ts-ignore
		await expect(fetchAndSaveWorkshopItems('key', 123, 'filename', 'minified')).rejects.toThrow(
			'Minified must be a boolean'
		);
	});

	it('should fetch all workshop items and save them to a JSON file', async () => {
		getAllWorkshopItems.mockResolvedValue([{ id: 123 }]);
		await fetchAndSaveWorkshopItems('key', 456, 'filename', false);
		expect(getAllWorkshopItems).toHaveBeenCalledWith('key', 456);
		expect(fs.writeFile).toHaveBeenCalledWith('filename.json', '[\n  {\n    "id": 123\n  }\n]', 'utf-8');
	});

	it('should use the default filename if none is provided', async () => {
		getAllWorkshopItems.mockResolvedValue([{ id: 123 }]);
		await fetchAndSaveWorkshopItems('key', 456);
		expect(getAllWorkshopItems).toHaveBeenCalledWith('key', 456);
		expect(fs.writeFile).toHaveBeenCalledWith('workshopItems.json', '[{"id":123}]', 'utf-8');
	});

	it('should use the default minified value if none is provided', async () => {
		getAllWorkshopItems.mockResolvedValue([{ id: 123 }]);
		await fetchAndSaveWorkshopItems('key', 456, 'filename');
		expect(getAllWorkshopItems).toHaveBeenCalledWith('key', 456);
		expect(fs.writeFile).toHaveBeenCalledWith('filename.json', '[{"id":123}]', 'utf-8');
	});

	it('should log the number of items saved', async () => {
		getAllWorkshopItems.mockResolvedValue([{ id: 123 }]);
		await fetchAndSaveWorkshopItems('key', 456);
		expect(console.log).toHaveBeenCalledWith('Saved 1 items to workshopItems.json');
	});

	it('should log the number of items saved with the custom filename', async () => {
		getAllWorkshopItems.mockResolvedValue([{ id: 123 }]);
		await fetchAndSaveWorkshopItems('key', 456, 'filename');
		expect(console.log).toHaveBeenCalledWith('Saved 1 items to filename.json');
	});

	it('should log the number of items saved with the custom filename and minified value', async () => {
		getAllWorkshopItems.mockResolvedValue([{ id: 123 }]);
		await fetchAndSaveWorkshopItems('key', 456, 'filename', false);
		expect(console.log).toHaveBeenCalledWith('Saved 1 items to filename.json');
	});

	// Successfully fetches and saves workshop items with valid key and appId
	it('should fetch and save workshop items when valid key and appId are provided', async () => {
		const arr = [{ id: 1, name: 'Item 1' }];
		getAllWorkshopItems.mockResolvedValue(arr);
		const fetchAndSaveWorkshopItems = createFetchAndSaveWorkshopItems(getAllWorkshopItems, fs, mocknf);

		await fetchAndSaveWorkshopItems('validKey', 123);

		expect(getAllWorkshopItems).toHaveBeenCalledWith('validKey', 123);
		expect(fs.writeFile).toHaveBeenCalledWith('workshopItems.json', JSON.stringify(arr), 'utf-8');
	});

	// Handles large number of workshop items efficiently
	it('should fetch and save workshop items efficiently for a large number of items', async () => {
		const arr = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
		getAllWorkshopItems.mockResolvedValue(arr);
		const fetchAndSaveWorkshopItems = createFetchAndSaveWorkshopItems(getAllWorkshopItems, fs, mocknf);

		await fetchAndSaveWorkshopItems('validKey', 123);

		expect(getAllWorkshopItems).toHaveBeenCalledWith('validKey', 123);
		expect(fs.writeFile).toHaveBeenCalledWith('workshopItems.json', JSON.stringify(arr), 'utf-8');
	});
});
