import { Cache } from './Cache';
import { describe, expect, it, vi } from 'vitest';

describe('Cache test Suite', () => {
    it('should not cache when timeout is set to -1', async () => {
        // Setup
        const cache = new Cache(-1); // Create a new cache service instance
        const mockFunction = vi.fn().mockImplementation(() => Math.random());
        const cachedFunctionThatGetsData = (key: string) => cache.get(key, () => Promise.resolve(mockFunction()));
        const requestKey = 'requestKey';

        // Test
        const actualData1 = await cachedFunctionThatGetsData(requestKey);
        const actualData2 = await cachedFunctionThatGetsData(requestKey);

        // Verify
        expect(actualData1).not.toEqual(actualData2);
        expect(mockFunction.mock.calls.length).toEqual(2);
    });

    it('should cache when timeout is set to 0 or greater', async () => {
        // Setup
        const cache = new Cache(3600); // Create a new cache service instance
        const mockFunction = vi.fn().mockImplementation(() => Math.random());
        const cachedFunctionThatGetsData = (key: string) => cache.get(key, () => Promise.resolve(mockFunction()));
        const requestKey = 'requestKey';

        // Test
        const actualData1 = await cachedFunctionThatGetsData(requestKey);
        const actualData2 = await cachedFunctionThatGetsData(requestKey);

        // Verify
        expect(actualData1).toEqual(actualData2);
        expect(mockFunction.mock.calls.length).toEqual(1);
    });

    it('should never cache an error', async () => {
        // Setup
        const cache = new Cache(3600); // Create a new cache service instance
        const functionThatGetsData = vi.fn();
        const requestKey = 'requestKey';

        // Expectations
        functionThatGetsData.mockImplementation(async () => {
            throw new Error('Booom...');
        });

        // Test
        try {
            // First time this will throw an exception eventually
            await cache.get(requestKey, functionThatGetsData);
            expect('Should have failed with exception').toBeFalsy();
        } catch (error: any) {
            // Verify
            expect(error).toBeInstanceOf(Error);
            expect(cache.keys().length).toEqual(0);
        }
    });
});
