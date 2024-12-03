import { describe, expect, it, vi } from 'vitest';
vi.mock('../../database', () => ({
    getDataSourceConnection: () => ({ isInitialized: true })
}));
const COMMIT_SHA = 'v123';
vi.mock('../../main.env', () => ({
    environment: {
        version: 'v123'
    }
}));

import { ProbeController } from './ProbeController';

describe('Probes controller test suite', () => {
    const mockRequest: any = vi.fn();
    const mockResponse: any = {
        json: vi.fn()
    };
    const mockDataSource: any = {
        isInitialized: true
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should return status live', async () => {
        const probeController = new ProbeController(vi.fn());
        probeController.livenessProbeController(mockRequest, mockResponse);
        expect(mockResponse.json).toBeCalledWith({ status: true, version: COMMIT_SHA });
    });

    it('should return status ready', async () => {
        const probeController = new ProbeController(() => mockDataSource);
        await probeController.readinessProbeController(mockRequest, mockResponse);
        expect(mockResponse.json).toBeCalledWith({
            status: true,
            dependencyStates: {
                database: true
            },
            version: COMMIT_SHA
        });
    });
});
