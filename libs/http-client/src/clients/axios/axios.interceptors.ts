import { AxiosError, AxiosResponse } from 'axios';
import { HttpClientConfig, HttpClientResponse } from '../clients.types';
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '@hyprnz/error';

const wrapAxiosErrorsInterceptor = {
    onFulfilled: (response: AxiosResponse<any, any>): HttpClientResponse => ({
        originalUrl: response.config.url ?? 'unknown',
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as any,
        config: response.config
    }),
    makeOnRejected: (config: HttpClientConfig) => async (error: AxiosError) => {
        const failureCallback = config.failureOptions?.callback;
        if (failureCallback) {
            await failureCallback(error);
        }

        if (error.status === 400) {
            throw new BadRequestError({ message: error.message, details: '' });
        } else if (error.status === 404) {
            throw new NotFoundError({ message: error.message, details: '' });
        } else if (error.status === 401) {
            throw new UnauthorizedError({ message: error.message, details: '' });
        } else if (error.status === 403) {
            throw new ForbiddenError({ message: error.message, details: '' });
        } else {
            // This will become the new UnknownError
            throw new InternalServerError({ message: error.message, details: '' });
        }
    }
};

export { wrapAxiosErrorsInterceptor };
