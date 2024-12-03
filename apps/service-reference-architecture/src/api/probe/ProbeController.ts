import { Request, Response } from 'express';
import { environment } from '../../main.env';
import { DataSource } from 'typeorm';

export class ProbeController {
    constructor(private getDataSourceConnection: () => Promise<DataSource>) {}

    /**
     * Indicates when the service has started and is running / alive
     */
    public livenessProbeController(request: Request, response: Response) {
        response.json({ status: true, version: environment.version });
    }

    /**
     * Indicates when the service is ready to accept requests
     */
    public async readinessProbeController(request: Request, response: Response) {
        const datasource = await this.getDataSourceConnection();
        const status = datasource.isInitialized;
        response.json({
            status,
            dependencyStates: {
                database: datasource.isInitialized
            },
            version: environment.version
        });
    }
}
