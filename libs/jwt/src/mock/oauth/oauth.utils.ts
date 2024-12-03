import * as jwt from 'jsonwebtoken';
import { Algorithm, Secret, SignOptions, PrivateKey } from 'jsonwebtoken';
import { privateSymmetricKey as privateSymmetricKey } from './keys/symmetric/symmetric.private';

const userId = 'CJ5HhFu2H303aKMukkW9SDhJS1mQVzVD@clients';

const createAndSign = (payload: any, algorithm: Algorithm, issuer: string, signKey: Secret | PrivateKey, expiresInDays?: number): string => {
    const options = {
        keyid: 'local.com.au',
        algorithm,
        issuer
    } as SignOptions;
    if (expiresInDays !== undefined) {
        options.expiresIn = `${expiresInDays}d`;
    }
    return (jwt as any).default.sign(payload, signKey, options);
};

const generateIdTokenForMockedMode = (
    sub: string = userId!,
    algorithm: Algorithm,
    issuer: string,
    signKey: Secret | PrivateKey,
    expiresInDays?: number
) => {
    const payload = {
        sub,
        user_id: sub, // Django support
        name: 'Test user',
        /**
         * We need to make sure that 'iat' is in seconds as opposed to milliseconds, because otherwise
         * 'exp' in created tokens will also be in milliseconds, which leads to problems because the
         * verify function of jsonwebtoken expects 'exp' to be in seconds.
         */
        iat: Math.floor(Date.now() / 1000)
    };
    return createAndSign(payload, algorithm, issuer, signKey, expiresInDays);
};

const generateSymmetricIdTokenForMockedMode = () => generateIdTokenForMockedMode('Test User', 'HS256', '@hyprnz/jwt', privateSymmetricKey, 100);

export { generateSymmetricIdTokenForMockedMode, createAndSign, generateIdTokenForMockedMode };
