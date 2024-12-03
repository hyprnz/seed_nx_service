import { mergeWithHeadersFromRequestContext } from './axios.requestContext';
import { HttpClientRequestHeaders, RequestContextProvider } from '../clients.types';
import { describe, expect, it, vitest } from 'vitest';

const CORRELATION_ID_HEADER: HttpClientRequestHeaders = {
    'X-Correlation-Id': 'someCorrelationId'
};
const REQUEST_HEADERS_TO_FORWARD: string[] = ['X-Correlation-Id'];
const DEFAULT_HEADERS: HttpClientRequestHeaders = {
    header1Key: 'header1Value',
    header2Key: 'header2Value'
};
const makeMockRequestContextProviderWithHeaders = (headers: HttpClientRequestHeaders): RequestContextProvider => ({
    setAndContinueMiddlewareChain: vitest.fn(),
    get: (): any => ({
        headers
    })
});

describe('Axios Request Context Test Suite', () => {
    it('should return requestHeaders when no request context', () => {
        // Assemble & Act
        const mergedHeaders = mergeWithHeadersFromRequestContext(REQUEST_HEADERS_TO_FORWARD, DEFAULT_HEADERS);

        // Assert
        expect(mergedHeaders).toEqual(DEFAULT_HEADERS);
    });

    it('should return merged requestHeaders and requestContext headers when no conflicts', () => {
        // Assemble & Act
        const mergedHeaders = mergeWithHeadersFromRequestContext(
            REQUEST_HEADERS_TO_FORWARD,
            DEFAULT_HEADERS,
            makeMockRequestContextProviderWithHeaders(CORRELATION_ID_HEADER)
        );

        // Assert
        expect(mergedHeaders).toEqual({
            ...DEFAULT_HEADERS,
            ...CORRELATION_ID_HEADER
        });
    });

    it('should return merged requestHeaders and requestContext headers whereby requestContext headers take priority if there is a clash', () => {
        // Assemble & Act
        const mergedHeaders = mergeWithHeadersFromRequestContext(
            REQUEST_HEADERS_TO_FORWARD,
            DEFAULT_HEADERS,
            makeMockRequestContextProviderWithHeaders({
                header1Key: 'header1ValueButShouldGetOverwritten',
                header2Key: 'header2ValueButShouldGetOverwritten'
            })
        );

        // Assert
        expect(mergedHeaders).toEqual({ ...DEFAULT_HEADERS });
    });
});
