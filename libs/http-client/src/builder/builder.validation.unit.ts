import { HttpClientBuilder } from './builder.client';
import { HttpClientBuilderError } from './builder.error';
import { describe, expect, it } from 'vitest';

describe('HttpClientBuilder validation test suite', () => {
    it('should throw a builder exception when options are not available', async () => {
        // Action
        try {
            HttpClientBuilder.make().build();
            // fail("Should have thrown an HttpClientBuilderError");
        } catch (error: any) {
            // Assert
            expect(error).toBeInstanceOf(HttpClientBuilderError);
            expect(error.message).toEqual(
                'You have not provided any request options when building ' +
                    'this request. Please ensure specify options using builder.options({...})'
            );
            expect(error.name).toEqual('HttpClientBuilderError');
        }
    });
});
