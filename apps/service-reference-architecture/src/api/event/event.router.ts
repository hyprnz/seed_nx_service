import express from 'express';
import { EventDao } from '../../database';
import { EventController } from './EventController';
import { withErrorHandlerSupport } from '@hyprnz/express-middleware';

const makeEventRouter = (getEventDao: () => EventDao) => {
    const eventController = new EventController(getEventDao);
    const eventRouter = express.Router();
    eventRouter.get('/:id', withErrorHandlerSupport(eventController.get.bind(eventController)));
    eventRouter.post('/', withErrorHandlerSupport(eventController.post.bind(eventController)));
    return eventRouter;
};

export { makeEventRouter };
