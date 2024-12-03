import { HttpClientBuilder } from './builder.client';
import { HttpClient, HttpClientRequestOptions } from '../clients/clients.types';
import axios from 'axios';
import { beforeEach, describe, expect, it, vitest } from 'vitest';

const createAndSetupMocked3rdPartyHttpClient = () => {
    const mocked3rdPartyHttpClient: any = vitest.fn().mockImplementation(async () => {});
    mocked3rdPartyHttpClient.interceptors = {
        response: {
            use: vitest.fn()
        }
    };
    vitest.spyOn(axios, 'create').mockImplementation(() => mocked3rdPartyHttpClient);
    return mocked3rdPartyHttpClient;
};

const DEFAULT_REQUEST_OPTIONS: HttpClientRequestOptions = {
    url: 'https://some.https.url',
    headers: {
        'X-Correlation-Id': '12345'
    },
    method: 'GET'
};

describe('Http Client builder test suite', () => {
    beforeEach(() => {
        vitest.resetAllMocks();
    });

    it('should pass through correct configuration to 3rd party http client for standard https call', async () => {
        // Assemble
        const mocked3rdPartyHttpClient = createAndSetupMocked3rdPartyHttpClient();

        // Action
        const httpClient: HttpClient = HttpClientBuilder.make().requestOptions(DEFAULT_REQUEST_OPTIONS).build();
        await httpClient.makeRequest();

        // Assert
        expect(mocked3rdPartyHttpClient).toHaveBeenCalledWith({
            url: DEFAULT_REQUEST_OPTIONS.url,
            method: 'get',
            responseType: 'json',
            headers: DEFAULT_REQUEST_OPTIONS.headers,
            timeout: 3000
        });
    });
});
