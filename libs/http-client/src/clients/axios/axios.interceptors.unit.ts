import { wrapAxiosErrorsInterceptor } from './axios.interceptors';
import { AxiosError, AxiosResponse } from 'axios';
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '@hyprnz/error';
import { describe, expect, it } from 'vitest';

describe('Axios Interceptors Test Suite', () => {
    const mockSuccessResponse: AxiosResponse = {
        request: {
            url: 'https://some.domain/path'
        },
        headers: {
            nothing: 'to see here'
        },
        config: {
            url: 'https://some.domain/path'
        } as any,
        status: 200,
        statusText: 'Success',
        data: {
            some: 'data for you'
        }
    };
    const mockBadRequestError: AxiosError = {
        ...new AxiosError('BadRequest', AxiosError.ERR_BAD_REQUEST, {} as any, {} as any),
        status: 400
    };

    const mockNotFoundError: AxiosError = {
        ...new AxiosError('NotFoundError', AxiosError.ERR_NETWORK, {} as any, {} as any),
        status: 404
    };

    const mockUnauthorisedError: AxiosError = {
        ...new AxiosError('UnAuthorisedError', AxiosError.ECONNABORTED, {} as any, {} as any),
        status: 401
    };

    const mockInternalServerError: AxiosError = {
        ...new AxiosError('InternalError', AxiosError.ECONNABORTED, {} as any, {} as any),
        status: 500
    };

    const mockForbiddenError: AxiosError = {
        ...new AxiosError('Forbidden', AxiosError.ECONNABORTED, {} as any, {} as any),
        status: 403
    };

    it('handle happy case where by response adheres to standard response format', () => {
        // Assemble
        const onFulfilled = wrapAxiosErrorsInterceptor.onFulfilled;

        // Act
        const interceptedResponse = onFulfilled(mockSuccessResponse);

        // Assert
        expect(interceptedResponse.originalUrl).toEqual(mockSuccessResponse.request.url);
        expect(interceptedResponse.status).toEqual(mockSuccessResponse.status);
        expect(interceptedResponse.statusText).toEqual(mockSuccessResponse.statusText);
        expect(interceptedResponse.config).toEqual(mockSuccessResponse.config);
        expect(interceptedResponse.data).toEqual(mockSuccessResponse.data);
        expect(interceptedResponse.headers).toEqual(mockSuccessResponse.headers);
    });

    it('should intercept bad request error and wrap and re-throw as @packages/errors/BadRequest', async () => {
        // Assemble
        const onRejected = wrapAxiosErrorsInterceptor.makeOnRejected({} as any);

        // Act
        return new Promise((resolve) => {
            onRejected(mockBadRequestError)
                .then(() => {
                    throw Error('Should have thrown an error');
                })
                .catch((error: unknown) => {
                    // Assert
                    expect(error).toBeInstanceOf(BadRequestError);
                    const httpError = error as BadRequestError;
                    expect(httpError.message).toEqual(mockBadRequestError.message);
                    expect(httpError.status).toEqual(400);
                    resolve('success');
                });
        });
    });

    it('should intercept Not Found error and wrap and re-throw as @packages/errors/NotFoundError', async () => {
        // Assemble
        const onRejected = wrapAxiosErrorsInterceptor.makeOnRejected({} as any);

        // Act
        return new Promise((resolve) => {
            onRejected(mockNotFoundError)
                .then(() => {
                    throw Error('Should have thrown an error');
                })
                .catch((error: unknown) => {
                    // Assert
                    expect(error).toBeInstanceOf(NotFoundError);
                    const httpError = error as NotFoundError;
                    expect(httpError.message).toEqual(mockNotFoundError.message);
                    expect(httpError.status).toEqual(404);
                    resolve('success');
                });
        });
    });

    it('should intercept Unauthorised error and wrap and re-throw as @packages/errors/UnauthorisedError', async () => {
        // Assemble
        const onRejected = wrapAxiosErrorsInterceptor.makeOnRejected({} as any);

        // Act
        return new Promise((resolve) => {
            onRejected(mockUnauthorisedError)
                .then(() => {
                    throw Error('Should have thrown an error');
                })
                .catch((error: unknown) => {
                    // Assert
                    expect(error).toBeInstanceOf(UnauthorizedError);
                    const httpError = error as NotFoundError;
                    expect(httpError.message).toEqual(mockUnauthorisedError.message);
                    expect(httpError.status).toEqual(401);
                    resolve('success');
                });
        });
    });

    it('should intercept InternalServer error and wrap and re-throw as @packages/errors/InternalServerError', async () => {
        // Assemble
        const onRejected = wrapAxiosErrorsInterceptor.makeOnRejected({} as any);

        // Act
        return new Promise((resolve) => {
            onRejected(mockInternalServerError)
                .then(() => {
                    throw Error('Should have thrown an error');
                })
                .catch((error: unknown) => {
                    // Assert
                    expect(error).toBeInstanceOf(InternalServerError);
                    const httpError = error as InternalServerError;
                    expect(httpError.message).toEqual(mockInternalServerError.message);
                    expect(httpError.status).toEqual(500);
                    resolve('success');
                });
        });
    });

    it('should intercept Forbidden error and wrap and re-throw as @packages/errors/ForbiddenError', async () => {
        // Assemble
        const onRejected = wrapAxiosErrorsInterceptor.makeOnRejected({} as any);

        // Act
        return new Promise((resolve) => {
            onRejected(mockForbiddenError)
                .then(() => {
                    throw Error('Should have thrown an error');
                })
                .catch((error: unknown) => {
                    // Assert
                    expect(error).toBeInstanceOf(ForbiddenError);
                    const httpError = error as ForbiddenError;
                    expect(httpError.message).toEqual(mockForbiddenError.message);
                    expect(httpError.status).toEqual(403);
                    resolve('success');
                });
        });
    });
});
