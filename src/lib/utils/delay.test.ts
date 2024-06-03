import delay from './delay';

describe('delay', () => {
	// resolves after the specified delay
	it('should resolve after the specified delay', async () => {
		const start = Date.now();
		const delayTime = 1000; // 1 second
		await delay(delayTime);
		const end = Date.now();
		expect(end - start).toBeGreaterThanOrEqual(delayTime);
	});

	// handles zero milliseconds delay correctly
	it('should resolve immediately when delay is zero milliseconds', async () => {
		const start = Date.now();
		await delay(0);
		const end = Date.now();
		expect(end - start).toBeLessThan(20); // Allowing a small margin for execution time
	});
});
