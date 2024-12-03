import { configureLogger } from '@hyprnz/logger';
import { Server } from './api';
import { environment } from './main.env';
import { MockPermissionServer } from '@hyprnz/mock';

configureLogger({
    name: 'hyprnz',
    correlationId: {
        key: environment.correlationId.key,
        namespace: environment.correlationId.namespace
    }
});

if (environment.api.localMode) {
    new MockPermissionServer({
        port: 3001,
        path: '/',
        permissions: environment.api.localPermissions
    }).start();
}

new Server({
    port: 3000,
    path: '/'
}).start();
