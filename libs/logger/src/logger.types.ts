interface LoggerOptions {
    name: string;
    correlationId?: {
        namespace: string;
        key: string;
    };
}

interface StructuredErrorLog {
    errorType: string;
    message: string;
    data?: object | string;
    stack?: object | string;
}

interface StructuredLog {
    aim?: string;
    request?: string | object;
    response?: string | object;
    message?: string;
    method?: string;
    url?: string;
    data?: string | object;

    [x: string]: any; // Allow any additional properties, as needed
}

interface LogFunction {
    (data: string | StructuredLog): void;
}

export type LoggerError = string | StructuredErrorLog | Error;

interface Logger {
    error: (error: LoggerError) => void;
    errorOrUndefined: (error: any) => void;
    trace: LogFunction;
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    print: LogFunction;
    makeChildLogger: (namespace: string | undefined) => Logger;
}

export type { LogFunction, Logger, StructuredErrorLog, StructuredLog, LoggerOptions };
