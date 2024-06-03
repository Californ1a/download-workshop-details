import formatDuration from './formatDuration';

describe('formatDuration', () => {
	// correctly formats duration with whole seconds and nanoseconds
	it('should format duration with whole seconds and nanoseconds correctly', () => {
		const result = formatDuration([123, 456000000]);
		expect(result).toBe('02:03.456');
	});

	it('should handle duration with exactly 60 seconds correctly', () => {
		const result = formatDuration([60, 0]);
		expect(result).toBe('01:00.000');
	});

	it('should handle duration with exactly 60 minutes correctly', () => {
		const result = formatDuration([3600, 0]);
		expect(result).toBe('60:00.000');
	});

	it('should handle duration with exactly 60 minutes and 60 seconds correctly', () => {
		const result = formatDuration([3660, 0]);
		expect(result).toBe('61:00.000');
	});

	// ensures output is always in "mm:ss.sss" format
	it('should format duration with minutes and seconds correctly', () => {
		const result = formatDuration([65, 500000000]);
		expect(result).toBe('01:05.500');
	});
});
