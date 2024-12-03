import { createAndSign } from './oauth.utils';
import { describe, it } from 'vitest';
import { privateSymmetricKey } from './keys/symmetric/symmetric.private';

describe('JwtUtils Test Suite', () => {
    it('Generate signed HS256 JWT with payload', async () => {
        // setup
        const payload = {
            sub: '8a22c746-79e0-11e9-aa2e-7fb8ab54f427',
            name: 'Profile service user',
            iat: new Date().getTime()
        };

        // Test
        const result = createAndSign(payload, 'HS256', 'libs/jwt/src/mock/oauth', privateSymmetricKey, 100);
        console.log(result);
    });
});
