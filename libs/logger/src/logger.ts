import pino, { Logger as PinoLogger } from 'pino';
import { Logger, LoggerOptions, StructuredErrorLog, StructuredLog } from './logger.types';
import { inspect } from 'node:util';
import { getNamespace } from 'continuation-local-storage';
import { curry, pipe } from 'ramda';

const isString = (v: any): v is string => typeof v === 'string';
const isNil = (v: any): v is null | undefined => v === null || v === undefined;

const createPinoInstance = (name: string, level: string) =>
    pino({
        name,
        level,
        formatters: {
            level(label: string, level: number) {
                switch (level) {
                    case 10:
                        return { level: 'TRACE' };
                    case 20:
                        return { level: 'DEBUG' };
                    case 30:
                        return { level: 'INFO' };
                    case 40:
                        return { level: 'WARN' };
                    case 50:
                        return { level: 'ERROR' };
                    case 60:
                        return { level: 'FATAL' };
                    default:
                        return { level };
                }
            }
        }
    });

let pinoInstance: PinoLogger = createPinoInstance('hyprnz', process.env.LOG_LEVEL || 'info');
let correlationIdNamespace: string;
let correlationIdKey: string;

const configureLogger = (options: LoggerOptions) => {
    correlationIdNamespace = options.correlationId?.namespace || '';
    correlationIdKey = options.correlationId?.key || '';
    pinoInstance = createPinoInstance('hyprnz', process.env.LOG_LEVEL || 'info');
};

const addCorrelationId = (data: any) => {
    const session = getNamespace(correlationIdNamespace);
    if (session) {
        const correlationId = session.get(correlationIdKey);
        return {
            [`${correlationIdKey}`]: correlationId,
            ...data
        };
    }
    return data;
};

const addNameSpace = curry<any>((namespace: string | undefined, data: any) => {
    if (namespace) {
        return {
            ['namespace']: namespace,
            ...data
        };
    }
    return data;
});

const makeAddMetaData = (namespace: string | undefined) => pipe(addNameSpace(namespace), addCorrelationId);

// Exported for testing only
export const makeStructuredLog = (namespace: string | undefined, data: any): object => {
    if (data instanceof Error) {
        return makeAddMetaData(namespace)({
            errorType: data.name,
            message: data.message,
            stack: data.stack
        });
    }
    if (isNil(data)) {
        return makeAddMetaData(namespace)({ message: 'No data or message provided.' });
    }
    if (isString(data)) {
        return makeAddMetaData(namespace)({ message: data });
    }
    if (isLogObject(data)) {
        return makeAddMetaData(namespace)(data);
    }
    return makeAddMetaData(namespace)({ message: toStringFromLog(data) });
};

const toStringFromLog = (data: any): string => {
    try {
        return JSON.stringify(data);
    } catch {
        return 'Unable to stringify.';
    }
};

const isLogObject = (data: any): boolean => {
    return typeof data === 'object';
};

const makeLogger = (namespace?: string): Logger => {
    const getPinoInstance = () => pinoInstance;
    return {
        error: (message: string | StructuredErrorLog | Error) => getPinoInstance().error(makeStructuredLog(namespace, message)),
        errorOrUndefined: (message: string | StructuredLog) => (getPinoInstance as any).errorOrUndefined(makeStructuredLog(namespace, message)),
        debug: (message: string | StructuredLog) => getPinoInstance().debug(makeStructuredLog(namespace, message)),
        trace: (message: string | StructuredLog) => getPinoInstance().trace(makeStructuredLog(namespace, message)),
        info: (message: string | StructuredLog) => getPinoInstance().info(makeStructuredLog(namespace, message)),
        warn: (message: string | StructuredLog) => getPinoInstance().warn(makeStructuredLog(namespace, message)),
        print: (message: any) =>
            console.log(
                inspect(message, {
                    showHidden: false,
                    depth: null,
                    maxArrayLength: Infinity
                })
            ),
        makeChildLogger: (namespace: string | undefined) => makeLogger(namespace)
    };
};

export { configureLogger, makeLogger };
