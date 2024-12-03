/**
 * This file is to provide a basic sanity check of the http module's features. It is not an automated test suite but
 * used for manual testing of individual features as they are getting built only.
 */
import { HttpClientBuilder } from './builder/builder.client';

const testPost = async () => {
    const client = HttpClientBuilder.make()
        .requestOptions({
            url: 'https://c514927f-9a8b-4578-a5b1-ffc99df02098.mock.pstmn.io/testPost',
            headers: {
                'X-Correlation-Id': '12345'
            },
            method: 'POST',
            timeoutInMilliseconds: 3000,
            responseType: 'JSON',
            data: {
                some: 'data',
                for: 'you'
            }
        })
        .build();

    const response = await client.makeRequest();
    console.log(`Response.status ${response.status}`);
    console.log(`Response.statusText ${response.statusText}`);
    console.log(`Response.originalUrl ${response.originalUrl}`);
    console.log(`Response.headers ${JSON.stringify(response.headers, null, 2)}`);
    console.log(`Response.data ${JSON.stringify(response.data, null, 2)}`);
};

const testGet = async () => {
    const client = HttpClientBuilder.make()
        .requestOptions({
            url: 'https://c514927f-9a8b-4578-a5b1-ffc99df02098.mock.pstmn.io/testGet',
            headers: {
                'X-Correlation-Id': '12345'
            },
            method: 'GET',
            timeoutInMilliseconds: 3000,
            responseType: 'JSON'
        })
        .forwardHeadersFromRequestContext(['X-Correlation-Id'])
        .build();

    const response = await client.makeRequest();
    console.log(`Response.status ${response.status}`);
    console.log(`Response.statusText ${response.statusText}`);
    console.log(`Response.originalUrl ${response.originalUrl}`);
    console.log(`Response.headers ${JSON.stringify(response.headers, null, 2)}`);
    console.log(`Response.data ${JSON.stringify(response.data, null, 2)}`);
};

testPost().catch((error) => {
    console.log(error);
});

testGet().catch((error) => {
    console.log(error);
});
