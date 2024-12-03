import axios, { AxiosInstance } from 'axios';
import { HttpClient, HttpClientConfig, HttpClientResponse, RequestContextProvider } from '../clients.types';
import { wrapAxiosErrorsInterceptor } from './axios.interceptors';
import { mergeWithHeadersFromRequestContext } from './axios.requestContext';

class AxiosHttpClient implements HttpClient {
    private clientConfig: HttpClientConfig;
    private axiosInstance: AxiosInstance;

    constructor(clientConfig: HttpClientConfig) {
        this.axiosInstance = axios.create();
        this.clientConfig = {
            ...clientConfig
        };
        this.configureInterceptors(this.clientConfig);
    }

    private configureInterceptors(config: HttpClientConfig) {
        this.axiosInstance.interceptors.response.use(wrapAxiosErrorsInterceptor.onFulfilled, wrapAxiosErrorsInterceptor.makeOnRejected(config));
    }

    async makeRequest(contextProvider?: RequestContextProvider): Promise<HttpClientResponse> {
        const { url, method, responseType, headers, timeoutInMilliseconds, data } = this.clientConfig.requestOptions;
        return this.axiosInstance({
            url,
            method: method?.toLowerCase(),
            responseType: responseType?.toLowerCase() as any,
            headers: mergeWithHeadersFromRequestContext(this.clientConfig.headersToForwardFromRequestContext, headers, contextProvider),
            data,
            timeout: timeoutInMilliseconds ?? 3000
        });
    }
}

export { AxiosHttpClient };
