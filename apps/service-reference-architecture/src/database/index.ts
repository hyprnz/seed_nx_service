import { AppDataSource } from './database.datasource';
import { DataSource } from 'typeorm';
import { EventEntity, EventDao } from './dao/event';
import { makeLogger, Logger } from '@hyprnz/logger';
import { makeEventDao } from './dao/event/event.dao';

const logger: Logger = makeLogger();
let initialisedDataSource: any;

const getDataSourceConnection = async (): Promise<DataSource> => {
    if (!initialisedDataSource) {
        initialisedDataSource = await AppDataSource.initialize();

        logger.info('Starting DB Migration...');
        await AppDataSource.runMigrations({
            transaction: 'each'
        });
        logger.info('DB Migration Successful');
    }
    return initialisedDataSource;
};

const getEventDao = () => makeEventDao(getDataSourceConnection);

export type { EventDao };

export { getDataSourceConnection, getEventDao, EventEntity };
