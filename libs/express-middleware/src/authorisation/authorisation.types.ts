interface AuthorisationOptions {
    permissionService: {
        url: string;
        timeoutMilliSeconds: number;
        cacheInvalidationTimeoutMilliSeconds: number;
    };
    correlationIdHeaderName: string;
}

interface RequestWithUser {
    headers: {
        user: {
            subject: string;
            activities: string;
        };
    };
}

export type { RequestWithUser, AuthorisationOptions };
