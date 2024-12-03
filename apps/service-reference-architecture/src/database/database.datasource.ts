import { DataSource } from 'typeorm';
import { environment } from '../main.env.ts';
import { EventEntity } from './dao/event/event.dao.entity.ts';
import { CreateEventTable1731633388497 } from './migrations/1731633388497-createEventTable.ts';

const AppDataSource = new DataSource({
    type: 'postgres',
    url: environment.database.url,
    logging: false,
    ssl: environment.database.ssl ? { rejectUnauthorized: false } : undefined,
    entities: [EventEntity],
    migrations: [CreateEventTable1731633388497]
});

export { AppDataSource };
