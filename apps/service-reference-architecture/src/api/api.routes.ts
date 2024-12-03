import express from 'express';
import { makeEventRouter } from './event/event.router';
import { getDataSourceConnection, getEventDao } from '../database';
import { makeProbeRouter } from './probe/probe.router';

const apiRouter = express.Router();

// Indicates when the service has started and is running / alive
apiRouter.use('/probe', makeProbeRouter(getDataSourceConnection));

// Events are things that have happened that represent important transactions within this service
apiRouter.use('/event', makeEventRouter(getEventDao));

export { apiRouter };
