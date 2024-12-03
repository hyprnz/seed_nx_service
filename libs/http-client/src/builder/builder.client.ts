import { validateBuilder } from './builder.validation';
import { AxiosHttpClient } from '../clients/axios/axios.client';
import { HttpClient, HttpClientConfig, HttpClientRequestOptions } from '../clients/clients.types';

class HttpClientBuilder {
    config: HttpClientConfig;

    static make = (): HttpClientBuilder => new HttpClientBuilder();

    constructor() {
        // Set default options
        this.config = {
            requestOptions: {
                url: '',
                method: 'GET',
                responseType: 'JSON'
            }
        };
    }

    requestOptions(options: HttpClientRequestOptions): HttpClientBuilder {
        this.config.requestOptions = {
            ...this.config.requestOptions,
            ...options
        };
        return this;
    }

    onFailure(callback: (error: Error) => Promise<any>) {
        this.config.failureOptions = {
            callback
        };
        return this;
    }

    forwardHeadersFromRequestContext(headersToForward: string[]) {
        this.config.headersToForwardFromRequestContext = [...headersToForward];
        return this;
    }

    build(): HttpClient {
        validateBuilder(this);
        return new AxiosHttpClient(this.config);
    }
}

export { HttpClientBuilder };
