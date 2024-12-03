import { NextFunction, Request, Response } from 'express';
import { Logger } from '@hyprnz/logger';
import { BaseError, UnknownError } from '@hyprnz/error';

const withStackTraceWhenDevEnv = (error: BaseError) =>
    process.env.NODE_ENV === 'development'
        ? {
              stack: error.stack ? error.stack.split('\n') : undefined
          }
        : null;

const sendExpressResponseError = (options: { response: Response; error: BaseError; correlationId: string | undefined }) => {
    const { error, response, correlationId } = options;
    const httpErrorResponse = error.toHttpResponse();
    response.status(httpErrorResponse.error.statusCode).json({
        ...httpErrorResponse,
        ...withStackTraceWhenDevEnv(error),
        correlationId: correlationId ?? null
    });
};

const isInstanceOfBaseError = (options: { error: Error; maxDepth: number }): boolean => {
    const { error, maxDepth } = options;

    let found = false;
    let counter = 0;
    let currentObjPrototype = Object.getPrototypeOf(error);

    while (currentObjPrototype.constructor.name !== 'Object' && counter <= maxDepth) {
        if (currentObjPrototype.constructor.name === BaseError.name) {
            found = true;
            break;
        }
        currentObjPrototype = Object.getPrototypeOf(currentObjPrototype);
        counter++;
    }

    return found;
};

/**
 *
 * @param handler
 */
const withErrorHandlerSupport = (handler: any) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const result = handler(request, response, next);
        if (result && result.then) {
            await result;
        }
    } catch (error) {
        next(error);
    }
    next();
};

/**
 * Error Handle Middleware
 * @returns
 */
const makeErrorHandlerMiddleware =
    (correlationIDHeaderName: string, logger: Logger) =>
    (
        error: Error,
        req: Request,
        response: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
    ) => {
        const correlationId = req.header(correlationIDHeaderName) ?? req.header(correlationIDHeaderName.toLowerCase());
        if (isInstanceOfBaseError({ error, maxDepth: 3 })) {
            logger.error(error);
            sendExpressResponseError({
                response,
                error: error as BaseError,
                correlationId: correlationId ? correlationId : 'unknown'
            });
        }
        // In all other cases
        else {
            const unknownError = new UnknownError(error);
            logger.error(unknownError);
            sendExpressResponseError({
                response,
                error: unknownError,
                correlationId: correlationId ? correlationId : 'unknown'
            });
        }
    };

export { makeErrorHandlerMiddleware, withErrorHandlerSupport };
