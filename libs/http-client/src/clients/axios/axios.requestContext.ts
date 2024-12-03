import { HttpClientRequestHeaders, RequestContext, RequestContextProvider } from '../clients.types';

const mergeWithHeadersFromRequestContext = (
    headerNamesToForwardFromRequestContext: string[] | undefined,
    requestHeaders: HttpClientRequestHeaders | undefined,
    requestContextProvider?: RequestContextProvider
) => {
    if (requestContextProvider && headerNamesToForwardFromRequestContext && headerNamesToForwardFromRequestContext.length > 0) {
        const requestContext: RequestContext = requestContextProvider.get();
        if (requestContext) {
            const headersFromContext = requestContext.headers;
            if (headersFromContext) {
                const headerFromRequestContext: HttpClientRequestHeaders = headerNamesToForwardFromRequestContext.reduce(
                    (currentHeaders: HttpClientRequestHeaders, headerName: string) => {
                        // This is important as express's request.headers converts all headers to lowercase
                        const headerValue = headersFromContext[headerName.toLowerCase()] ?? headersFromContext[headerName];
                        if (headerValue) {
                            const mergedHeaders: HttpClientRequestHeaders = {
                                ...currentHeaders
                            };
                            mergedHeaders[headerName] = headerValue;
                            return mergedHeaders;
                        }
                        return currentHeaders;
                    },
                    {} as HttpClientRequestHeaders
                );
                return { ...headerFromRequestContext, ...requestHeaders };
            }
        }
    }
    return { ...requestHeaders };
};

export { mergeWithHeadersFromRequestContext };
