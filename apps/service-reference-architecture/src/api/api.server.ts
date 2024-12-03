import express from 'express';
import { Logger, makeLogger } from '@hyprnz/logger';
import { ServerOptions } from './api.types';
import { join } from 'node:path';
import { configureExpressRequestMiddleware, configureExpressResponseMiddleware } from './api.middleware';
import { apiRouter } from './api.routes';
import { generateSymmetricIdTokenForMockedMode } from '@hyprnz/jwt';
import { environment } from '../main.env';

class Server {
    /** Main express application. */
    private readonly app: express.Application;
    private server?: any;
    private readonly options: ServerOptions;
    private readonly logger: Logger = makeLogger('server');

    /**
     * Default Constructor
     */
    constructor(options: ServerOptions) {
        this.options = options;

        // Create an express application
        this.app = express();
    }

    public async start() {
        // Configure request middleware
        await configureExpressRequestMiddleware(this.app);

        // Configure API routes
        this.app.use(apiRouter);

        // Configure Response middleware
        configureExpressResponseMiddleware(this.app);
        this.server = this.app.listen(this.options.port);
        const address: any = this.server.address();
        const port = address.port;
        const host = address.address === '::' ? 'localhost' : address.address;
        this.logger.info(`🚀 Server ready at ${host}:${port}${this.options.path}`);
        this.logger.info(`   Server Health check ready at: ${host}:${port}${join(this.options.path, '/readinessProbe')}`);

        if (environment.api.localMode) {
            this.logger.info(
                "   You're running in MOCK mode so using the built in OAuth server then you can access this server with the following header configured:"
            );
            this.logger.info(`  "Authorization": "${generateSymmetricIdTokenForMockedMode()}"`);
        }
    }

    public stop() {
        if (this.server) {
            this.server.close();
        }
    }
}

export { Server };
