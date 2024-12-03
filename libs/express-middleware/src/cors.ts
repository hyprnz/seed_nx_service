import * as cors from 'cors';

const makeCorsMiddleware = (allowedOrigins: string[]) =>
    cors.default({
        origin: allowedOrigins,
        exposedHeaders: 'Content-Type,Authorization,Location,User-Agent,X-Correlation-Id',
        allowedHeaders: 'Content-Type,Authorization,Location,User-Agent,X-Correlation-Id',
        maxAge: 600
    });

export { makeCorsMiddleware };
