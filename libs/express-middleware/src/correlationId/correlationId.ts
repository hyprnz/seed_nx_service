import { createNamespace, getNamespace, Namespace } from 'continuation-local-storage';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const makeCorrelationIdMiddleware = (namespace: string, correlationIdKey: string, correlationIdheaderName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // A namespaceSession has to be created for each request hence it is done here
        const session = createNamespace(namespace);

        // Set correlationId
        const correlationId = req.header(correlationIdheaderName) ?? randomUUID();
        session.run(() => {
            session.set(correlationIdKey, correlationId);
            res.setHeader(correlationIdheaderName, correlationId);
            next();
        });
    };
};

const getCorrelationId = (namespace: string, correlationIdKey: string) => {
    const session: Namespace | undefined = getNamespace(namespace);
    if (session) {
        return session.get(correlationIdKey);
    }
};

export { getCorrelationId, makeCorrelationIdMiddleware };
