import { createGetAllWorkshopItems } from './getAllWorkshopItems';

let errorSpy: jest.SpyInstance;
let logSpy: jest.SpyInstance;

let clearLineSpy: jest.SpyInstance;
let cursorToSpy: jest.SpyInstance;
let writeSpy: jest.SpyInstance;

describe('getAllWorkshopItems', () => {
	beforeEach(() => {
		errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

		if (!process.stdout.clearLine) {
			process.stdout.clearLine = jest.fn();
		}
		clearLineSpy = jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => true);

		if (!process.stdout.cursorTo) {
			process.stdout.cursorTo = jest.fn();
		}
		cursorToSpy = jest.spyOn(process.stdout, 'cursorTo').mockImplementation(() => true);

		if (!process.stdout.write) {
			process.stdout.write = jest.fn();
		}
		writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
	});

	afterEach(() => {
		errorSpy.mockRestore();
		logSpy.mockRestore();

		clearLineSpy.mockRestore();
		cursorToSpy.mockRestore();
		writeSpy.mockRestore();
	});

	it('should return a function', () => {
		const getAllWorkshopItems = createGetAllWorkshopItems(jest.fn(), jest.fn(), jest.fn(), jest.fn());
		expect(typeof getAllWorkshopItems).toBe('function');
	});

	it('should throw an error if the total is not a number', async () => {
		const getRecentWorkshopItems = jest.fn().mockResolvedValue({
			total: '1',
			publishedfiledetails: [{ title: 'Test' }],
		});
		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, jest.fn(), jest.fn(), jest.fn());
		await expect(getAllWorkshopItems('key', 1)).rejects.toThrow('Invalid response');
	});

	it('should thow an error if total is different on a future call', async () => {
		const getRecentWorkshopItems = jest
			.fn()
			.mockResolvedValueOnce({
				total: 2,
				publishedfiledetails: [{ title: 'Test' }],
				next_cursor: 'cursor',
			})
			.mockResolvedValueOnce({
				total: 3,
				publishedfiledetails: [],
			});
		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, jest.fn(), jest.fn(), jest.fn());
		await expect(getAllWorkshopItems('key', 1)).rejects.toThrow('Total count mismatch');
	});

	it('should throw an error if the publishedfiledetails is not an array', async () => {
		const getRecentWorkshopItems = jest.fn().mockResolvedValue({
			total: 1,
			publishedfiledetails: { title: 'Test' },
		});
		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, jest.fn(), jest.fn(), jest.fn());
		await expect(getAllWorkshopItems('key', 1)).rejects.toThrow('Invalid response');
	});

	it('should call getRecentWorkshopItems', async () => {
		const getRecentWorkshopItems = jest.fn().mockResolvedValue({
			total: 1,
			publishedfiledetails: [{ title: 'Test' }],
		});
		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, jest.fn(), jest.fn(), jest.fn());
		await getAllWorkshopItems('key', 1);
		expect(getRecentWorkshopItems).toHaveBeenCalled();
	});

	// Retrieves all workshop items successfully when API key and app ID are valid
	it('should retrieve all workshop items successfully when API key and app ID are valid', async () => {
		const getRecentWorkshopItems = jest.fn();
		const logProgress = jest.fn();
		const nf = jest.fn((num) => num.toString());
		const formatDuration = jest.fn(() => '1s');

		const key = 'valid-api-key';
		const appId = 123;
		const mockResponse = {
			total: 2,
			publishedfiledetails: [{ id: 1 }, { id: 2 }],
			next_cursor: null,
		};

		getRecentWorkshopItems.mockResolvedValueOnce(mockResponse);

		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, logProgress, nf, formatDuration);

		const result = await getAllWorkshopItems(key, appId);

		expect(result).toEqual(mockResponse.publishedfiledetails);
		expect(getRecentWorkshopItems).toHaveBeenCalledWith(key, appId, '*');
		expect(logProgress).toHaveBeenCalledWith(2, 2);
	});

	// Handles scenario where there are no workshop items to retrieve
	it('should handle scenario where there are no workshop items to retrieve', async () => {
		const getRecentWorkshopItems = jest.fn();
		const logProgress = jest.fn();
		const nf = jest.fn((num) => num.toString());
		const formatDuration = jest.fn(() => '1s');

		const key = 'valid-api-key';
		const appId = 123;
		const mockResponse = {
			total: 0,
			publishedfiledetails: [],
			next_cursor: null,
		};

		getRecentWorkshopItems.mockResolvedValueOnce(mockResponse);

		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, logProgress, nf, formatDuration);

		const result = await getAllWorkshopItems(key, appId);

		expect(result).toEqual([]);
		expect(getRecentWorkshopItems).toHaveBeenCalledWith(key, appId, '*');
		expect(logProgress).toHaveBeenCalledWith(0, 0);
	});

	// Handles multiple pages of workshop items correctly using cursor
	it('should handle multiple pages of workshop items correctly using cursor', async () => {
		const getRecentWorkshopItems = jest.fn();
		const logProgress = jest.fn();
		const nf = jest.fn((num) => num.toString());
		const formatDuration = jest.fn(() => '1s');

		const key = 'valid-api-key';
		const appId = 123;
		const mockResponse1 = {
			total: 3,
			publishedfiledetails: [{ id: 1 }, { id: 2 }],
			next_cursor: 'page2',
		};
		const mockResponse2 = {
			total: 3,
			publishedfiledetails: [{ id: 3 }],
			next_cursor: null,
		};

		getRecentWorkshopItems.mockResolvedValueOnce(mockResponse1);
		getRecentWorkshopItems.mockResolvedValueOnce(mockResponse2);

		const getAllWorkshopItems = createGetAllWorkshopItems(getRecentWorkshopItems, logProgress, nf, formatDuration);

		const result = await getAllWorkshopItems(key, appId);

		expect(result).toEqual([...mockResponse1.publishedfiledetails, ...mockResponse2.publishedfiledetails]);
		expect(getRecentWorkshopItems).toHaveBeenCalledWith(key, appId, '*');
		expect(getRecentWorkshopItems).toHaveBeenCalledWith(key, appId, 'page2');
		expect(logProgress).toHaveBeenCalledWith(2, 3);
		expect(logProgress).toHaveBeenCalledWith(3, 3);
	});
});
