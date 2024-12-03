import { Algorithm } from 'jsonwebtoken';
import { map, pipe, split, trim } from 'ramda';

interface Environment {
    version: string;
    correlationId: {
        namespace: string;
        key: string;
        headerName: string;
    };
    database: {
        ssl: boolean;
        url: string;
    };
    services: {
        permission: {
            url: string;
            timeoutMilliSeconds: number;
            cacheInvalidationTimeoutMilliSeconds: number;
        };
    };
    api: {
        localMode: boolean;
        localPermissions: string[];
        cors: {
            allowedOrigins: string[];
        };
        oauth: {
            allowImpersonation: boolean;
            disableAuthentication: boolean;
            verify: {
                audience: string[];
                ignoreExpiration: boolean;
                algorithms: Algorithm[];
                issuer: string[];
                symmetricKey: string;
            };
        };
    };
    launchDarkly: {
        sdkKey: string;
    };
}

const splitToListThenTrim = pipe(split(','), map(trim));

export const environment: Environment = {
    version: process.env.COMMIT_SHA ?? 'latest',
    correlationId: {
        namespace: 'correlationId',
        key: 'correlationId',
        headerName: 'x-correlation-id'
    },
    database: {
        ssl: process.env.DATABASE_SSL === 'true',
        url: process.env.DATABASE_URL ?? 'postgres://hyprnz-user:password12345@hyprnz-db:5432/hyprnz'
    },
    services: {
        permission: {
            url: process.env.SERVICE_PERMISSION_URL ?? 'http://localhost:3001/organisations/v1/employee/permissions',
            timeoutMilliSeconds: parseInt('' + process.env.SERVICE_PERMISSION_TIMEOUT) ?? 5 * 1000,
            cacheInvalidationTimeoutMilliSeconds: parseInt('' + process.env.SERVICE_PERMISSION_CACHE_TIMOUT) ?? 30 * 1000
        }
    },
    api: {
        localMode: process.env.API_LOCAL_MODE === 'true',
        localPermissions: splitToListThenTrim(process.env.API_LOCAL_PERMISSIONS ?? '') ?? [],
        cors: {
            allowedOrigins: splitToListThenTrim(process.env.API_ALLOWED_ORIGINS ?? '*')
        },
        oauth: {
            allowImpersonation: process.env.API_OAUTH_ALLOW_IMPERSONATION === 'true',
            disableAuthentication: process.env.API_OAUTH_DISABLED_AUTHENTICATION === 'true',
            verify: {
                audience: splitToListThenTrim(process.env.API_OAUTH_VERIFY_AUDIENCE ?? ''),
                ignoreExpiration: process.env.API_OAUTH_VERIFY_IGNORE_EXPIRATION === 'true',
                algorithms: splitToListThenTrim(process.env.API_OAUTH_VERIFY_ALGORITHMS ?? 'HS256') as any,
                issuer: splitToListThenTrim(process.env.API_OAUTH_VERIFY_ISSUER ?? ''),
                symmetricKey: process.env.API_OAUTH_VERIFY_SYMMETRIC_KEY_SECRET ?? ''
            }
        }
    },
    launchDarkly: {
        sdkKey: process.env.LAUNCH_DARKLY_SDK_KEY ?? 'test-sdk-key'
    }
};
