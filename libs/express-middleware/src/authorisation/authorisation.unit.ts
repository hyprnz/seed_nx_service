import { describe, expect, it, vi } from 'vitest';
import { RequestWithJWT } from '@hyprnz/express-middleware';
import { makeAuthorisationMiddleware } from './authorisation';
import { RequestWithUser } from './authorisation.types';

type AuthorisationRequest = RequestWithJWT & RequestWithUser;
const userActivities = ['event:resource:event:read', 'event:resource:event:create'];
const mockPermissionResponse = {
    originalUrl: 'http://mockhost',
    status: 200,
    config: {},
    statusText: 'Successful',
    headers: {},
    data: { results: userActivities.map((activity: string) => ({ name: activity })) }
};
vi.mock('@hyprnz/http-client', () => ({
    HttpClientBuilder: class MockHttpBuilder {
        static make = (): MockHttpBuilder => new MockHttpBuilder();
        requestOptions(): MockHttpBuilder {
            return this;
        }
        forwardHeadersFromRequestContext() {
            return this;
        }
        build() {
            return {
                makeRequest: (): Promise<any> => Promise.resolve(mockPermissionResponse)
            };
        }
    }
}));

describe('Authorisation test suite', () => {
    const mockNext = vi.fn();
    const mockResponse: any = {};
    const subject = 'subject';
    const authZMiddleware = makeAuthorisationMiddleware({
        permissionService: {
            timeoutMilliSeconds: 0,
            cacheInvalidationTimeoutMilliSeconds: 0, // 0 = unlimited (no caching)
            url: 'http://localhost:3000'
        },
        correlationIdHeaderName: 'x-correlation-id'
    });

    it('should do nothing if no JWT context on request', async () => {
        // Assemble
        const mockRequest: any = {
            headers: {}
        };

        // Act
        await authZMiddleware(mockRequest as any, mockResponse, mockNext);

        // Assert
        expect((mockRequest as AuthorisationRequest).headers.user).toBeUndefined();
    });

    it('should map the following ' + 'request.jwt.sub => request.user.subject and' + 'request.jwt.token => request.user.permissions', async () => {
        // Assemble
        const mockRequest: RequestWithJWT = {
            headers: {
                jwt: {
                    sub: subject,
                    rawToken: 'dGhpcyBpcyBhIHRlc3QgdG9rZW4='
                }
            }
        };

        // Act
        await authZMiddleware(mockRequest as any, mockResponse, mockNext);

        // Assert
        expect((mockRequest as AuthorisationRequest).headers.user.subject).toEqual(subject);
        expect((mockRequest as AuthorisationRequest).headers.user.activities).toEqual(userActivities);
    });
});
