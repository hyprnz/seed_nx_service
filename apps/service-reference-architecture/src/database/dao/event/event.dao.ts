import { DataSource, In, Repository } from 'typeorm';
import { EventEntity } from './event.dao.entity';
import { GetEventDAO, GetEventsByIdsDAO, SaveEventDao, EventDao } from './event.dao.types';
import { isEmpty, isNil } from 'ramda';
import { makeLogger, Logger } from '@hyprnz/logger';
import { returnUndefinedForSearchIdsWithNoResult } from '../../util/util.getByIds';

const logger: Logger = makeLogger();

const makeSaveEventDao =
    (getDataSource: () => Promise<DataSource>): SaveEventDao =>
    async (event: EventEntity): Promise<EventEntity> => {
        try {
            const eventRepo: Repository<EventEntity> = (await getDataSource()).getRepository(EventEntity);
            return await eventRepo.save(event);
        } catch (error: any) {
            logger.error(`Failed to save event: ${JSON.stringify(event)}. Please check that the database is up and running`);
            throw error;
        }
    };

const makeGetEventsByIdsDao =
    (getDataSource: () => Promise<DataSource>): GetEventsByIdsDAO =>
    async (eventIds: string[]): Promise<(EventEntity | undefined)[]> => {
        const entityRepo = (await getDataSource()).getRepository(EventEntity);
        if (eventIds.length > 0) {
            const cleanEventIds: (string | undefined)[] = eventIds.map((eventId: any) =>
                isNil(eventId) || isEmpty(eventId) || typeof eventId != 'string' ? undefined : eventId
            );

            const results: EventEntity[] = await entityRepo.find({
                where: { id: In(cleanEventIds) }
            });

            return returnUndefinedForSearchIdsWithNoResult(eventIds, results);
        }
        return [];
    };

const makeGetEventDao =
    (getEventsByIds: GetEventsByIdsDAO): GetEventDAO =>
    async (eventId: string): Promise<EventEntity | undefined> => {
        const events: (EventEntity | undefined)[] = await getEventsByIds([eventId]);
        if (events && events.length > 0 && events[0]) {
            const event: EventEntity = events[0];
            if (event) {
                return event;
            }
            logger.info(`Couldn't find event with event id: ${eventId}`);
        }
    };

const makeEventDao = (getDataSource: () => Promise<DataSource>): EventDao => {
    const getByIds: GetEventsByIdsDAO = makeGetEventsByIdsDao(getDataSource);
    const get: GetEventDAO = makeGetEventDao(getByIds);
    const save: SaveEventDao = makeSaveEventDao(getDataSource);

    return {
        save,
        get,
        getByIds
    };
};

export { makeEventDao };
