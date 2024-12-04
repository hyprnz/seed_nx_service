import { EnvironmentConfig } from './environmentConfig';

export class LocalConfig implements EnvironmentConfig {
    public baseUrl = 'http://localhost:3000';
}
