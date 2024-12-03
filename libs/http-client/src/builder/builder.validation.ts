import { HttpClientBuilder } from './builder.client';
import { HttpClientBuilderError } from './builder.error';

const validateOptions = (builder: HttpClientBuilder) => {
    const options = builder.config.requestOptions;
    if (!options || !options.url || options.url.trim() === '') {
        throw new HttpClientBuilderError(
            'You have not provided any request options when building this request. Please ensure specify options using builder.options({...})'
        );
    }
};

const validateBuilder = (builder: HttpClientBuilder) => {
    validateOptions(builder);
};

export { validateOptions, validateBuilder };
