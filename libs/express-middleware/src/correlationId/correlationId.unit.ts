import { beforeEach, describe, it, expect, vi } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import { makeCorrelationIdMiddleware } from './correlationId';
import { createNamespace } from 'continuation-local-storage';
import { createRequest, createResponse } from 'node-mocks-http';

vi.mock('continuation-local-storage');

describe('makeCLSMiddleware', () => {
    const namespaceName = 'my-cool-thing';
    let middleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    let request: Request;
    let response: Response;

    const mockedCreateNamespace = vi.mocked(createNamespace);
    const mockedSet = vi.fn();
    const mockedNext = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        middleware = makeCorrelationIdMiddleware(namespaceName, 'correlationId', 'x-correlation-id');
        request = createRequest();
        response = createResponse();

        mockedCreateNamespace.mockReturnValue({
            set: mockedSet,
            run: vi.fn().mockImplementation((fn: () => void) => fn())
        } as any);
    });

    it('should generate a CLS namespace with the specified name', async () => {
        await middleware(request, response, mockedNext);
        expect(mockedNext).toHaveBeenCalled();
    });

    it('should call next() when the middle ware is invoked', async () => {
        await middleware(request, response, mockedNext);
        expect(mockedCreateNamespace).toHaveBeenCalledWith(namespaceName);
    });

    describe('when a correlation id is absent from the request', () => {
        it('should generate a correlation id on the response', async () => {
            await middleware(request, response, mockedNext);
            const responseHeader = response.header('x-correlation-id');
            expect(responseHeader).toBeDefined();
            expect(responseHeader).toHaveLength(36);
        });

        it('should store the generated correlation id in the CLS namespace', async () => {
            await middleware(request, response, mockedNext);
            expect(mockedSet).toHaveBeenCalledWith('correlationId', response.header('x-correlation-id'));
        });
    });

    describe('when a correlation id is present on the request', () => {
        const correlationId = '1234-5678-9012-3456';
        beforeEach(() => {
            request = createRequest({
                headers: {
                    'x-correlation-id': correlationId
                }
            });
        });

        it('should set the specified correlation id on the response', async () => {
            await middleware(request, response, mockedNext);
            const responseHeader = response.header('x-correlation-id');
            expect(responseHeader).toBeDefined();
            expect(responseHeader).toBe(correlationId);
        });

        it('should store the generated correlation id in the CLS namespace', async () => {
            await middleware(request, response, mockedNext);
            expect(mockedSet).toHaveBeenCalledWith('correlationId', correlationId);
        });
    });
});
