import express from 'express';
import { ProbeController } from './ProbeController';
import { DataSource } from 'typeorm';
import { withErrorHandlerSupport } from '@hyprnz/express-middleware';

const makeProbeRouter = (getDataSourceConnection: () => Promise<DataSource>) => {
    const probeRouter = express.Router();
    const probeController = new ProbeController(getDataSourceConnection);
    probeRouter.get('/liveness', withErrorHandlerSupport(probeController.livenessProbeController.bind(probeController)));
    probeRouter.get('/readiness', withErrorHandlerSupport(probeController.readinessProbeController.bind(probeController)));
    return probeRouter;
};
export { makeProbeRouter };
