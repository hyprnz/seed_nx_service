import { BaseError, ErrorPayloadOptions } from './base.error';
class UnknownError extends BaseError {
    constructor(error: Error) {
        super({
            statusCode: 520,
            name: 'UnknownError',
            payload: {
                message: error.name,
                details: error.message
            }
        });
        this.stack = error.stack;
    }
}

class NotFoundError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 404,
            name: 'NotFoundError',
            payload
        });
    }
}

class UnauthorizedError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 401,
            name: 'UnauthorizedError',
            payload
        });
    }
}

class InternalServerError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 500,
            name: 'InternalServerError',
            payload
        });
    }
}

class ForbiddenError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 403,
            name: 'ForbiddenError',
            payload
        });
    }
}

class BadRequestError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 400,
            name: 'BadRequestError',
            payload
        });
    }
}

class ValidationError extends BaseError {
    constructor(payload: ErrorPayloadOptions) {
        super({
            statusCode: 400,
            name: 'ValidationError',
            payload
        });
    }
}

export { BaseError, NotFoundError, UnauthorizedError, InternalServerError, ForbiddenError, BadRequestError, UnknownError, ValidationError };
