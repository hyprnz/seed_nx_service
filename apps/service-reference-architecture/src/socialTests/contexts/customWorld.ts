import { IWorldOptions, World } from '@cucumber/cucumber';
import { EnvironmentConfig } from '../config/environmentConfig.ts';
import { LocalConfig } from '../config/config.local.ts';
import { EventAPIRequest } from './EventAPIRequest.ts';
import { AxiosError } from 'axios';

/** World.
 *  @class
 *  Test World is instantiated on each scenario and shares state between step definitions
 */
export class CustomWorld extends World {
    // Config
    public config: EnvironmentConfig;

    // Context
    public apiResponseStatus?: number;
    public apiError!: AxiosError;

    // Request Objects
    public eventAPIRequest: EventAPIRequest;

    constructor(options: IWorldOptions) {
        super(options);
        switch (process.env.E2E_ENVIRONMENT) {
            default:
                this.config = new LocalConfig();
                break;
        }
        this.eventAPIRequest = new EventAPIRequest(this);
    }
}
