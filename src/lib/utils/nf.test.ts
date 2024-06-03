import nf from './nf';

describe('nf', () => {
	// formats integer numbers with thousands separators
	it('should format integer numbers with thousands separators', () => {
		const result = nf(1234567);
		expect(result).toBe('1,234,567');
	});

	// handles non-numeric strings gracefully
	it('should return the original string when input is non-numeric', () => {
		const result = nf('abc');
		expect(result).toBe('abc');
	});

	it('should format string representations of integers with thousands separators', () => {
		const result = nf('1234567');
		expect(result).toBe('1,234,567');
	});

	// handles large numbers correctly
	it('should handle large numbers correctly', () => {
		const result = nf(1234567890);
		expect(result).toBe('1,234,567,890');
	});

	// handles small numbers correctly
	it('should handle small numbers correctly', () => {
		const result = nf(123);
		expect(result).toBe('123');
	});
});
