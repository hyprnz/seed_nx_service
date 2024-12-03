import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '@hyprnz/error';
const makeValidateRequestHeadersMiddleware = (requiredRequestHeaders: string[]) => (req: Request, res: Response, next: NextFunction) => {
    requiredRequestHeaders.forEach((requestHeader: string) => {
        if (!req.header(requestHeader)) {
            next(
                new BadRequestError({
                    message: 'Header Validation Error',
                    details: `Missing header ${requestHeader}`
                })
            );
        }
    });
    next();
};
export { makeValidateRequestHeadersMiddleware };
