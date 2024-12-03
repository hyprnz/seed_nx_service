import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError, UnknownError } from './errors';
import { describe, expect, it } from 'vitest';

describe('Errors package test suite', () => {
    describe('Error Classes', () => {
        it('should provide BadRequestError', () => {
            // Assemble
            const payload = { message: 'some message', details: 'some details' };
            const error = new BadRequestError(payload);

            // Assert
            expect(error.toHttpResponse()).toEqual({
                error: {
                    statusCode: 400,
                    name: 'BadRequestError',
                    message: 'some message',
                    details: 'some details'
                }
            });
        });

        it('should provide NotFoundError', () => {
            // Assemble
            const payload = { message: 'some message', details: 'some details' };
            const error = new NotFoundError(payload);

            // Assert
            expect(error.toHttpResponse()).toEqual({
                error: {
                    statusCode: 404,
                    name: 'NotFoundError',
                    message: 'some message',
                    details: 'some details'
                }
            });
        });

        it('should provide UnauthorizedError', () => {
            // Assemble
            const payload = { message: 'some message', details: 'some details' };
            const error = new UnauthorizedError(payload);

            // Assert
            expect(error.toHttpResponse()).toEqual({
                error: {
                    statusCode: 401,
                    name: 'UnauthorizedError',
                    message: 'some message',
                    details: 'some details'
                }
            });
        });

        it('should provide InternalServerError', () => {
            // Assemble
            const payload = { message: 'some message', details: 'some details' };
            const error = new InternalServerError(payload);

            // Assert
            expect(error.toHttpResponse()).toEqual({
                error: {
                    statusCode: 500,
                    name: 'InternalServerError',
                    message: 'some message',
                    details: 'some details'
                }
            });
        });

        it('should provide ForbiddenError', () => {
            // Assemble
            const payload = { message: 'some message', details: 'some details' };
            const error = new ForbiddenError(payload);

            // Assert
            expect(error.toHttpResponse()).toEqual({
                error: {
                    statusCode: 403,
                    name: 'ForbiddenError',
                    message: 'some message',
                    details: 'some details'
                }
            });
        });

        it('should provide UnknownError', () => {
            // Assemble
            const error = new UnknownError(new Error('some message'));

            // Assert
            expect(error.toHttpResponse()).toEqual({
                error: {
                    statusCode: 520,
                    name: 'UnknownError',
                    message: 'Error',
                    details: 'some message'
                }
            });
        });
    });
});
