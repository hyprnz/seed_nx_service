import { EventEntity } from './event.dao.entity';

type SaveEventDao = (event: EventEntity) => Promise<EventEntity>;
type GetEventDAO = (eventId: string) => Promise<EventEntity | undefined>;
type GetEventsByIdsDAO = (eventIds: string[]) => Promise<(EventEntity | undefined)[]>;

interface EventDao {
    save: SaveEventDao;
    get: GetEventDAO;
    getByIds: GetEventsByIdsDAO;
}

export type { SaveEventDao, GetEventDAO, GetEventsByIdsDAO, EventDao };
