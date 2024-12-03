import express, { Application } from 'express';
import {
    makeValidateRequestHeadersMiddleware,
    makeCorrelationIdMiddleware,
    makeCorsMiddleware,
    makeJWTMiddleware,
    securityMiddleware,
    makeErrorHandlerMiddleware,
    unless,
    makeAuthorisationMiddleware
} from '@hyprnz/express-middleware';
import { environment } from '../main.env';
import { makeLogger, Logger } from '@hyprnz/logger';

const logger: Logger = makeLogger();
const unAuthenticatedPaths: string[] = ['/probe/liveness', '/probe/readiness', '/favicon.ico'];

const configureExpressRequestMiddleware = async (app: Application) => {
    const { key, headerName, namespace } = environment.correlationId;

    // Configure express to parse JSON request bodies
    app.use(express.json());

    // Configure Authentication/JWT middleware
    app.use(unless(unAuthenticatedPaths, makeJWTMiddleware(environment.api.oauth)));

    // Add request header validation
    app.use(unless(unAuthenticatedPaths, makeValidateRequestHeadersMiddleware([environment.correlationId.headerName])));

    // Configure CORs support
    app.use(makeCorsMiddleware(environment.api.cors.allowedOrigins));

    // Configure security vulnerability enhancements
    app.use(securityMiddleware);

    // Configure authorisation middleware
    app.use(makeAuthorisationMiddleware({ correlationIdHeaderName: headerName, permissionService: environment.services.permission }));

    // Configure CorrelationId management
    // NOTE: this must be last in the express request handler chain calls to express.next() by other handler's destroy the previous context
    // which includes the async-hook context which this handler relies on
    app.use(unless(unAuthenticatedPaths, makeCorrelationIdMiddleware(namespace, key, headerName)));
};

const configureExpressResponseMiddleware = (app: Application) => {
    app.use(makeErrorHandlerMiddleware(environment.correlationId.headerName, logger));
};

export { configureExpressRequestMiddleware, configureExpressResponseMiddleware };
