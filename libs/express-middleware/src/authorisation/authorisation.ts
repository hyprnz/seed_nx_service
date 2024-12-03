import { NextFunction, Request, Response, RequestHandler } from 'express';
import { Cache } from '@hyprnz/cache';
import { AuthorisationOptions } from './authorisation.types';
import { RequestWithJWT } from '@hyprnz/express-middleware';
import { HttpClient, HttpClientBuilder, RequestContextProvider } from '@hyprnz/http-client';
import { Logger, makeLogger } from '@hyprnz/logger';

const logger: Logger = makeLogger('middleware:authorisation');
const makeGetPermissionsForSubject = (
    options: AuthorisationOptions,
    cache: Cache
): ((originalRequestHeaders: any, subject: string) => Promise<string[]>) => {
    const getPermissionsForSubject: HttpClient = HttpClientBuilder.make()
        .requestOptions({
            method: 'GET',
            url: options.permissionService.url,
            responseType: 'JSON',
            timeoutInMilliseconds: options.permissionService.timeoutMilliSeconds
        })
        .forwardHeadersFromRequestContext([options.correlationIdHeaderName, 'Authorization', 'authorization'])
        .build();
    return async (originalRequestHeaders: any, subject: string): Promise<string[]> => {
        const contextProvider: RequestContextProvider = {
            get: () => ({
                headers: originalRequestHeaders
            })
        };
        return await cache.get(`getPermissionsForSubject:${subject}`, async () => {
            logger.info(`Getting permissions from ${options.permissionService.url} for user with subject: ${subject}`);
            return await getPermissionsForSubject.makeRequest(contextProvider).then((result) => {
                if (result.data.results) {
                    return result.data.results.map((permission: { name: string }) => permission.name);
                }
                throw Error(`Failed to get data from permission service. Data was ${result}`);
            });
        });
    };
};
const makeAuthorisationMiddleware = (options: AuthorisationOptions): RequestHandler => {
    const cache: Cache = new Cache(options.permissionService.cacheInvalidationTimeoutMilliSeconds);
    const getPermissionsForSubject = makeGetPermissionsForSubject(options, cache);
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        const requestWithJWT: RequestWithJWT = request as unknown as RequestWithJWT;

        if (requestWithJWT.headers.jwt && requestWithJWT.headers.jwt.sub && requestWithJWT.headers.jwt.rawToken) {
            // Set Subject & Activities
            const subject = requestWithJWT.headers.jwt.sub;
            const activities: string[] = await getPermissionsForSubject(request.headers, subject);

            // Update request
            (request as any).headers.user = {
                subject,
                activities
            };
        }
        next();
    };
};

export { makeAuthorisationMiddleware };
