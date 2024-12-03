import { NextFunction, Request, Response } from 'express';

type HttpClientRequestHeaders = Record<string, string>;
type HttpClientResponseHeaders = Record<string, string>;

type HttpClientResponse = {
    originalUrl: string;
    headers: HttpClientResponseHeaders;
    data: any;
    status: number;
    statusText: string;
    config: any;
};

type HttpClientRequestOptions = {
    /* indicates the type of data that the server will respond with
     * options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
     * browser only: 'blob'
     */
    responseType?: 'JSON' | 'TEXT';
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
    headers?: HttpClientRequestHeaders;
    data?: any;
    /* Default is 3000 milliseconds) */
    timeoutInMilliseconds?: number;
};

type HttpFailureOptions = {
    callback: (error: Error) => Promise<any>;
};

interface HttpClient {
    makeRequest(contextProvider?: RequestContextProvider): Promise<HttpClientResponse>;
}

interface HttpClientConfig {
    requestOptions: HttpClientRequestOptions;
    failureOptions?: HttpFailureOptions;
    headersToForwardFromRequestContext?: string[];
}

type RequestContext = {
    originalUrl?: string;
    headers?: { [key: string]: any };
    query?: { [key: string]: any };
    params?: { [key: string]: any };
};

interface RequestContextProvider {
    setAndContinueMiddlewareChain?: (req: Request, res: Response, nextFunction: NextFunction, context: RequestContext) => void;
    get: () => RequestContext;
}

export type {
    HttpClient,
    HttpClientRequestOptions,
    HttpClientRequestHeaders,
    HttpClientResponse,
    HttpClientResponseHeaders,
    HttpClientConfig,
    RequestContextProvider,
    RequestContext
};
