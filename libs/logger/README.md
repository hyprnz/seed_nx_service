# logger

This library was generated with [Nx](https://nx.dev).

## Getting started

E.g. Setup for service and create a logger for middleware

1. Configure logger (do once in the application)
    ```typescript
    import {configureLogger} from '@hyprnz/logger'
    
    configureLogger({name: 'hyprnz', correlationId: { namespace: 'correlationId', headerName: 'x-correlation-id'}})
    ```
2. Use Logger
    ```typescript
    import {makeLogger, Logger} from './logger';
   
    const logger: Logger = makeLogger('middleware')
   
    // ... Handle a request where correlation header id = 123 and then log in middlware
   
    logger.info('Hello')
    // => {level: "INFO", message: "hello", correlationId: "123"}
    ```

## Running unit tests

Run `nx test logger` to execute the unit tests via [Jest](https://jestjs.io)
