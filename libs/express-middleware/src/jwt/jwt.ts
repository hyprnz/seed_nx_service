import { is, omit, trim } from 'ramda';
import { decode as decodeJWT } from 'jsonwebtoken';
import { makeLogger } from '@hyprnz/logger';
import { verifyJWT } from '@hyprnz/jwt';
import { JWTOptions } from './jwt.types';
import { UnauthorizedError } from '@hyprnz/error';
import { NextFunction, Request, RequestHandler, Response } from 'express';

const logger = makeLogger('middleware:jwt');

const getBearerTokenFromHeader = (req: any): string => {
    if (!req.headers) {
        return '';
    }

    const bearerToken: string | Array<string> = req.headers['Authorization'] ? req.headers['Authorization']! : req.headers['authorization']!;

    if (is(String, bearerToken) && bearerToken.indexOf('Bearer') >= 0) {
        return (bearerToken as string).replace('Bearer', '').trim();
    }

    return '';
};

const throwUnauthenticated = (next: NextFunction): any => {
    next(
        new UnauthorizedError({
            message: 'Unauthorized: failed to verify JWT token',
            details: 'Failed to verify JWT'
        })
    );
};

const makeGetSymmetricKey =
    (symmetricKey: string) =>
    (header: { kid: string }, callback: any): void => {
        if (symmetricKey && symmetricKey.length > 0) {
            return callback(null, symmetricKey);
        }
        const message = 'Symmetric Key is undefined or empty';
        logger.warn(message);
        callback(new Error(message), null);
    };

const makeJWTMiddleware =
    (options: JWTOptions): RequestHandler =>
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        const rawToken: string = getBearerTokenFromHeader(request);

        if (rawToken === '') {
            logger.warn(`Token authentication failed: ${request.method} ${request.baseUrl}${request.path} ${request.hostname} ${request.ip}`);
            throwUnauthenticated(next);
        }

        if (options.allowImpersonation && request.headers.impersonate) {
            const sub: string = trim((request as any).headers.impersonate);
            (request as any).headers.jwt = {
                sub,
                rawToken
            };
            return next();
        }
        try {
            if (options.disableAuthentication) {
                const jwt: any = decodeJWT(rawToken);
                (request as any).headers.jwt = {
                    sub: jwt.user_id,
                    rawToken
                };
                return next();
            }
            const decodedJWT = await verifyJWT(
                rawToken,
                omit<any, string>(['audience', 'symmetricKey'], options.verify),
                makeGetSymmetricKey(options.verify.symmetricKey)
            );
            (request as any).headers.jwt = {
                ...decodedJWT,
                sub: decodedJWT.user_id,
                rawToken
            };
            next();
        } catch (err: any) {
            logger.warn(err.message);
            logger.warn(
                `Token verification failed: ${rawToken} ${request.method} ${request.baseUrl}${request.path} ${request.hostname} ${request.ip}`
            );
            throwUnauthenticated(next);
        }
    };

export { makeJWTMiddleware };
