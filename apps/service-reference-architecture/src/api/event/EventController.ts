import { Request, Response } from 'express';
import { EventDao } from '../../database';
import { NotFoundError } from '@hyprnz/error';
import { valid, ValidateWithSchema } from '@hyprnz/validation';
// For some reason some decorators are assumed to unused when they clearly are used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { request, AuthorisableByResource, AuthoriseByPolicy, user } from '@hyprnz/authorisation';
import { getEventSchema, postEventSchema } from './event.validation';
import { userHasActionsPolicy } from '../api.authorisation';
import { Logger, makeLogger } from '@hyprnz/logger';

const logger: Logger = makeLogger('EventController');

@AuthorisableByResource('event')
export class EventController {
    constructor(private getEventDao: () => EventDao) {}

    @ValidateWithSchema(getEventSchema)
    public async get(@valid request: Request, response: Response) {
        // 1. Get Id
        const eventId = request.params.id;

        // 2. Get from database
        logger.info('This is a test message');
        const event = await this.getEventDao().get(eventId);

        // 3. Return event
        if (event) {
            return response.json(event);
        }
        // 4. Handle situation where no event found
        throw new NotFoundError({
            message: `Not Found`,
            details: `No event found with id: ${eventId}`
        });
    }

    @AuthoriseByPolicy({ policy: userHasActionsPolicy, actions: ['event:resource:event:create'] })
    @ValidateWithSchema(postEventSchema)
    public async post(@request @valid request: Request, response: Response) {
        // 1. Get Event
        const event = request.body;

        // 2. Get from database
        await this.getEventDao().save(event);

        // 3. Return saved event
        if (event) {
            response.json(event);
        }
    }
}
