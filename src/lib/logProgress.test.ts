import { createLogProgress } from './logProgress';

const mocknf = (n: number | string) => n.toString();

let clearLineSpy: jest.SpyInstance;
let cursorToSpy: jest.SpyInstance;
let writeSpy: jest.SpyInstance;

describe('logProgress', () => {
	beforeEach(() => {
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
		clearLineSpy.mockRestore();
		cursorToSpy.mockRestore();
		writeSpy.mockRestore();
	});

	it('the factory should return a function', () => {
		const logProgress = createLogProgress(mocknf);

		expect(typeof logProgress).toBe('function');
	});

	it('should log the progress of a task', () => {
		const logProgress = createLogProgress(mocknf);
		logProgress(1, 10);

		expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('Progress (10%): 1/10'));
	});

	// Logs progress correctly for typical current and total values
	it('should log correct progress when given typical current and total values', () => {
		const logProgress = createLogProgress(mocknf);
		logProgress(50, 100);

		expect(clearLineSpy).toHaveBeenCalledWith(0);
		expect(cursorToSpy).toHaveBeenCalledWith(0);
		expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('Progress (50%): 50/100'));
	});
});
