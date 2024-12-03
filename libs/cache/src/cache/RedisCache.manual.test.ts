import { RedisCache } from './RedisCache';
import { beforeEach, describe, it, vi } from 'vitest';

const logger = (message: string | object) => console.log(message);

/* These tests are only to be run manually with a real redis server */
describe.skip('Cache test Suite', () => {
    const cache = new RedisCache(logger, {});

    beforeEach(async () => {
        await cache.flush();
    });

    it('should caching of integer', async () => {
        // Setup

        const mockFunction = vi.fn().mockImplementation(() => Math.random());
        const cachedFunctionThatGetsData = (key: string) => cache.get(key, () => Promise.resolve(mockFunction()));
        const requestKey = 'requestKey';

        // Test
        const actualData1 = await cachedFunctionThatGetsData(requestKey);
        const actualData2 = await cachedFunctionThatGetsData(requestKey);
        const actualData3 = await cachedFunctionThatGetsData(requestKey);

        // Verify
        expect(actualData1).toEqual(actualData2);
        expect(actualData2).toEqual(actualData3);
        expect(mockFunction.mock.calls.length).toEqual(1);
    });

    it('test caching of object', async () => {
        // Setup

        const mockFunction = vi.fn().mockImplementation(() => ({ field1: 'field1Value', field2: 'field2Value' }));
        const cachedFunctionThatGetsData = (key: string) => cache.get(key, () => Promise.resolve(mockFunction()));
        const requestKey = 'requestKey';

        // Test
        const actualData1 = await cachedFunctionThatGetsData(requestKey);
        const actualData2 = await cachedFunctionThatGetsData(requestKey);
        const actualData3 = await cachedFunctionThatGetsData(requestKey);

        // Verify
        expect(actualData1).toEqual(actualData2);
        expect(actualData2).toEqual(actualData3);
        expect(mockFunction.mock.calls.length).toEqual(1);
    });

    afterAll(async () => {
        await cache.quit();
    });
});
