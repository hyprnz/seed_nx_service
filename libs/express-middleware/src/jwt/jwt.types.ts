import { Algorithm } from 'jsonwebtoken';

interface JWTOptions {
    allowImpersonation: boolean;
    disableAuthentication: boolean;
    verify: {
        audience: string[];
        ignoreExpiration: boolean;
        algorithms: Algorithm[];
        issuer: string[];
        symmetricKey: string;
    };
}

interface RequestWithJWT {
    headers: {
        jwt: {
            sub: string;
            rawToken: string;
        };
    };
}

export type { JWTOptions, RequestWithJWT };
