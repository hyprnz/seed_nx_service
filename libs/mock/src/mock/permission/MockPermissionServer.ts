import express, { Application, Request, Response } from 'express';
import { Logger, makeLogger } from '@hyprnz/logger';
import { join } from 'node:path';

interface ServerOptions {
    port: number;
    path: string;
    permissions: string[];
}

export class MockPermissionServer {
    /** Main express application. */
    private readonly app: Application;
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

        // Configure API routes
        this.configureRoutes();
    }

    private configureRoutes() {
        const apiRouter = express.Router();

        // Health check
        apiRouter.get('/readiness', (request: Request, response: Response) => {
            response.send({ status: 'pass' });
        });

        // Permissions list
        apiRouter.get('/organisations/v1/employee/permissions', (request: Request, response: Response) => {
            this.logger.info(`User permissions are: ${this.options.permissions}`);
            response.json({
                results: [
                    ...this.options.permissions.map((permission: string, index: number) => ({
                        pk: index + 1,
                        name: permission,
                        organisation: null,
                        designation: null,
                        employee_id: null,
                        role: null,
                        user: null,
                        is_active: null,
                        is_owner: null,
                        address: null,
                        is_deleted: null,
                        extra_data: null,
                        created_at: null,
                        modified_at: null
                    }))
                ]
            });
        });

        this.app.use(apiRouter);
    }

    public start() {
        this.server = this.app.listen(this.options.port);
        const address: any = this.server.address();
        const port = address.port;
        const host = address.address === '::' ? 'localhost' : address.address;
        this.logger.info(`🚀 MockPermissionServer ready at ${host}:${port}${this.options.path}`);
        this.logger.info(`   MockPermissionServer Health check ready at: ${host}:${port}${join(this.options.path, '/readinessProbe')}`);
        this.logger.info(
            "   You're running in MOCK mode so using the built in OAuth server then you can access this server with the following header configured:"
        );
    }

    public stop() {
        if (this.server) {
            this.server.close();
        }
    }
}
