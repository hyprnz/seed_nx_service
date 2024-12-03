# `@packages/http-client`

This package is designed to help you handle communication between your microservice and any other server/service that uses
the HTTP-CLIENT protocol. This package comes with the following useful out-of-the-box features that are all configurable:

-   **CorrelationID auto-injected as header** (providing you are using @packages/request-context)
-   **Caching**
-   **Global error management** (providing you are using @packages/errors) - if the callee service returns a status code then
    this will get automatically thrown as an error for global error management to consume
-   **Retry logic**
-   **Support for http/https**

## Requirements

You must have an up-to-date version of the following to use this package

-   express 4.x

## Installation

```sh
npm install @hyprnz/http-client
```

## Usage: http/https - basic usage

```typescript
const httpClient: HttpClient = HttpClientBuilder.make()
    .requestOptions({
        url: 'https://some.https.url',
        responseType: 'JSON',
        headers: {
            'X-header1': '12345'
        },
        data: {
            some: 'json data'
        },
        method: 'POST'
    })
    .build();

// Make your http request
const response = await httpClient.request();
console.log(response.data);
```

## Usage: CorrelationId

You can send the correlation Id in one of two ways

-   If you are using @packages/requestContext then you can configure this package to look up the current correlation
    id from the request context e.g.
    ```typescript
    const httpClient: HttpClient = HttpClientBuilder.make()
          .requestOptions({...})
          .forwardHeadersFromRequestContext(["X-Organisation-Correlation-Id"])
          .build();
    ```
-   You can specify your own correlation id by configuring httpClient with headers
    ```typescript
    const httpClient: HttpClient = HttpClientBuilder.make()
          .requestOptions({
           ...
           headers: {
             "X-Organisation-Correlation-Id": "your correlationId"
           }
           ...
         })
          .build();
    ```

## Failure management

-   You can specify your own tasks to run upon failure by specifying this callback
    ```typescript
    const httpClient: HttpClient = HttpClientBuilder.make()
          ...
          .onFailure(() => Promise.resolve(console.log('log an error or send error to APM')))
          .build();
    ```

## Usage: Caching (TODO)

## Usage: Error management

Any errors are thrown as standard @packages/errors where possible

## Usage: Retry logic (TODO)
