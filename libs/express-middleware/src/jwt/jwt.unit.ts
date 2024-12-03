import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeJWTMiddleware } from './jwt';
import { UnauthorizedError } from '@hyprnz/error';

const mockVerifyJWT = vi.fn();

vi.mock('@hyprnz/jwt', () => ({
    verifyJWT: () => mockVerifyJWT(),
    makeGetPublicSignKeyFromJWKSURL: () => ''
}));

const jwtMiddleware = makeJWTMiddleware({
    verify: {
        ignoreExpiration: false,
        algorithms: ['HS256'],
        issuer: ['hyprnz'],
        symmetricKey: '',
        audience: ['hyprnz']
    },
    allowImpersonation: false,
    disableAuthentication: false
});
describe('with missing bearer token', () => {
    const mockNext: any = vi.fn();
    const mockStatus: any = vi.fn();
    const mockSet: any = vi.fn();
    const mockSend: any = vi.fn();

    beforeEach(() => {
        mockVerifyJWT.mockReset();
        mockNext.mockReset();
        mockStatus.mockReset();
        mockSet.mockReset();
        mockSend.mockReset();
    });

    it('should return 401 when token missing', async () => {
        // Assemble
        const req: any = { headers: {} };
        const res: any = { statusCode: 200, headers: {}, set: mockSet, status: mockStatus };

        // Expectations
        mockStatus.mockReturnValue({ send: mockSend });

        // Act
        await jwtMiddleware(req, res, mockNext);

        // Verify
        expect(mockNext).toBeCalledWith(
            new UnauthorizedError({
                message: 'Unauthorized: failed to verify JWT token',
                details: 'Failed to verify JWT'
            })
        );
    });

    it('should return 401 when token invalid', async () => {
        // Assemble
        const req: any = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImphcmRlbi5jby5ueiJ9.eyJzdWIiOiJDSjVIaEZ1MkgzMDNhS011a2tXOVNEaEpTMW1RVnpWREBjbGllbnRzIiwibmFtZSI6IlRlYW0gc2VydmljZSB1c2VyIiwiaWF0IjoxNTgxMzY5NDg2MDk3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDIvIn0.YO_Q_sU_vTiDRQZBMXqgd2j6v3Wnj4ie66BuSRIx-uF2ti8CXEoAhhtHgXDiEzbu_2NBF908my1kBb_pHimSqqnKrsZTmw8mpxV7E4w-xzqzO8G_tlQY_VeHrh4Vldxf6dBagD8OjAmYi4FFjXQnHra9zKR4Q_ZigDz2C3oJ9f1DZNdw9VmiZR8J950-qrSxRpNNWPvCe_9rrXza8BGI0Mwfr6gzmXmvx-dfxF6051LtD33AvCRN0w8fWZy2Cu_K8l_EYqxIggoNgJSbo4StjddJcXucQ6iaEkqfU7Ax44TS-GKG-cC48aOVXza6gWGc1GNeMv5zO4zYSm4bGD96Sw'
            }
        };
        const res: any = { statusCode: 200, headers: {}, set: mockSet, status: mockStatus };

        // Expectations
        mockStatus.mockReturnValue({ send: mockSend });
        mockVerifyJWT.mockImplementation(() => {
            throw new Error('some verification error');
        });

        // Act
        await jwtMiddleware(req, res, mockNext);
        // Verify
        expect(mockNext).toBeCalledWith(
            new UnauthorizedError({
                message: 'Unauthorized: failed to verify JWT token',
                details: 'Failed to verify JWT'
            })
        );
    });
});
